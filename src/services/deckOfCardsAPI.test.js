import { beforeEach, describe, expect, it, vi } from 'vitest'
// allows mockHttpGet to be used in vi.mock
const mockHttpGet = vi.hoisted(() => vi.fn())
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: mockHttpGet
      }))
    }
  }
});
import axios from 'axios'
import deckOfCardsAPI from './deckOfCardsAPI'

describe("deckOfCardsAPI tests", () => {
  beforeEach(() => {
    axios.create.mockClear();
    mockHttpGet.mockClear();
  })

  describe('createDeck function', () => {
    it('createDeck function should exist', () => {
      const functions = Object.entries(deckOfCardsAPI);
      const func = functions.find((value) => value[0].match(/(createDeck)/i))
      expect(func).not.toBeUndefined();
    })
    it('createDeck function should call the correct endpoint and return deck data', async () => {
      const mockDeckResponse = {
        data: {
          success: true,
          deck_id: 'mockdeck123',
          shuffled: true,
          remaining: 24,
          cards: []
        }
      };
      mockHttpGet.mockResolvedValue(mockDeckResponse)
      const response = await deckOfCardsAPI.createDeck();

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockDeckResponse);
      expect(response.data.deck_id).toBe('mockdeck123');
      expect(response.data.shuffled).toBe(true);
    })
    it('should handle API errors for createMatchingDeck', async () => {

      const mockError = new Error('Network Error');
      mockHttpGet.mockRejectedValue(mockError);


      await expect(deckOfCardsAPI.createDeck()).rejects.toThrow('Network Error');
      expect(mockHttpGet).toHaveBeenCalledTimes(1);
    });
  })
  describe('drawCard function', () => {
    const testDeckId = 'testdeck456';

    it('should call the correct endpoint with deckId and return card data', async () => {
      const mockDrawResponse = {
        data: {
          success: true,
          deck_id: testDeckId,
          cards: [
            {
              code: 'AC',
              image: 'https://deckofcardsapi.com/static/img/AC.png',
              images: {
                svg: 'https://deckofcardsapi.com/static/img/AC.svg',
                png: 'https://deckofcardsapi.com/static/img/AC.png'
              },
              value: 'ACE',
              suit: 'CLUBS'
            }
          ],
          remaining: 23 // Assuming 24 initially, 1 drawn
        }
      };

      mockHttpGet.mockResolvedValue(mockDrawResponse);

      const response = await deckOfCardsAPI.drawCard(testDeckId);

      expect(mockHttpGet).toHaveBeenCalledTimes(1);

      expect(mockHttpGet).toHaveBeenCalledWith(`/${testDeckId}/draw/?count=1`);

      expect(response).toEqual(mockDrawResponse);
      expect(response.data.cards.length).toBe(1);
      expect(response.data.cards[0].code).toBe('AC');
    });

    it('should handle API errors for drawCard', async () => {
      const mockError = new Error('Failed to draw cards');
      mockHttpGet.mockRejectedValue(mockError);


      await expect(deckOfCardsAPI.drawCard(testDeckId)).rejects.toThrow(expect.any(Error));
      expect(mockHttpGet).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deckId is not provided to drawCard', async () => {
      const expectedUrlPart = '/undefined/draw/?count=1';
      const mockError = new Error(`Request failed with status code 404 for ${expectedUrlPart}`);

      mockHttpGet.mockRejectedValue(mockError);

      await expect(deckOfCardsAPI.drawCard(undefined)).rejects.toThrow(expect.any(Error));
      expect(mockHttpGet).toHaveBeenCalledWith(expectedUrlPart);
    });
  });
  describe('createDeck function new args', () => {
    it('should create a standard 52-card deck when no type is specified', async () => {
      const mockStandardDeckResponse = {
        data: {
          success: true,
          deck_id: 'standarddeck789',
          shuffled: true,
          remaining: 52,
          cards: []
        }
      };
      mockHttpGet.mockResolvedValue(mockStandardDeckResponse);

      const response = await deckOfCardsAPI.createDeck();

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      const calls = mockHttpGet.mock.calls[0]
      expect(calls[0]).toBeOneOf(['/new/shuffle/', '/new/shuffle/?deck_count=1'])
      expect(response.data.deck_id).toBe('standarddeck789');
      expect(response.data.remaining).toBe(52);
    });

    it('should create a specified number of decks', async () => {
      const mockMultiDeckResponse = {
        data: {
          success: true,
          deck_id: 'multideck101',
          shuffled: true,
          remaining: 104,
          cards: []
        }
      };
      mockHttpGet.mockResolvedValue(mockMultiDeckResponse);

      const response = await deckOfCardsAPI.createDeck(2);

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(mockHttpGet).toHaveBeenCalledWith('/new/shuffle/?deck_count=2');
      expect(response.data.deck_id).toBe('multideck101');
      expect(response.data.remaining).toBe(104);
    });

    it('should create a deck with a specific set of cards', async () => {
      const customCards = ['AD', '2D', '3D'];
      const mockCustomDeckResponse = {
        data: {
          success: true,
          deck_id: 'customdeckABC',
          shuffled: false,
          remaining: 3,
          cards: []
        }
      };
      mockHttpGet.mockResolvedValue(mockCustomDeckResponse);

      const response = await deckOfCardsAPI.createDeck(1, customCards.join(','));

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(mockHttpGet).toHaveBeenCalledWith(`/new/shuffle/?cards=${customCards.join(',')}`);
      expect(response.data.deck_id).toBe('customdeckABC');
      expect(response.data.remaining).toBe(3);
    });

    it('should handle errors when creating a deck', async () => {
      const mockError = new Error('Failed to create deck');
      mockHttpGet.mockRejectedValue(mockError);

      await expect(deckOfCardsAPI.createDeck()).rejects.toThrow('Failed to create deck');
      expect(mockHttpGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('drawCard with custom count', () => {
    const testDeckId = 'deckXYZ';

    it('should draw a specified number of cards', async () => {
      const countToDraw = 3;
      const mockDrawMultipleResponse = {
        data: {
          success: true,
          deck_id: testDeckId,
          cards: [
            { code: 'AC' }, { code: 'KD' }, { code: '7H' }
          ],
          remaining: 49 // 52 - 3
        }
      };
      mockHttpGet.mockResolvedValue(mockDrawMultipleResponse);

      const response = await deckOfCardsAPI.drawCard(testDeckId, countToDraw);

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(mockHttpGet).toHaveBeenCalledWith(`/${testDeckId}/draw/?count=${countToDraw}`);
      expect(response.data.cards.length).toBe(countToDraw);
      expect(response.data.remaining).toBe(49);
    });

    it('should draw the default number of cards if count is not specified', async () => {
      const mockDrawSingleResponse = {
        data: {
          success: true,
          deck_id: testDeckId,
          cards: [{ code: 'AC' }],
          remaining: 51
        }
      };
      mockHttpGet.mockResolvedValue(mockDrawSingleResponse);

      // Test the existing behavior where count defaults to 1
      const response = await deckOfCardsAPI.drawCard(testDeckId);

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(mockHttpGet).toHaveBeenCalledWith(`/${testDeckId}/draw/?count=1`); // Still expects count=1
      expect(response.data.cards.length).toBe(1);
      expect(response.data.remaining).toBe(51);
    });
  });

  describe('shuffle function', () => {
    const existingDeckId = 'existingDeckId123';

    it('should shuffle an existing deck', async () => {
      const mockShuffleResponse = {
        data: {
          success: true,
          deck_id: existingDeckId,
          shuffled: true,
          remaining: 52
        }
      };
      mockHttpGet.mockResolvedValue(mockShuffleResponse);

      const response = await deckOfCardsAPI.shuffle(existingDeckId);

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(mockHttpGet).toHaveBeenCalledWith(`/${existingDeckId}/shuffle/`);
      expect(response.data.shuffled).toBe(true);
      expect(response.data.deck_id).toBe(existingDeckId);
    });
    it('should add the remaining=true query when called for', async () => {
      const mockShuffleResponse = {
        data: {
          success: true,
          deck_id: existingDeckId,
          shuffled: true,
          remaining: 52
        }
      };
      mockHttpGet.mockResolvedValue(mockShuffleResponse);

      const response = await deckOfCardsAPI.shuffle(existingDeckId, true);

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(mockHttpGet).toHaveBeenCalledWith(`/${existingDeckId}/shuffle/?remaining=true`);
      expect(response.data.shuffled).toBe(true);
      expect(response.data.deck_id).toBe(existingDeckId);
    })

    it('should handle errors when shuffling a deck', async () => {
      const mockError = new Error('Failed to shuffle deck');
      mockHttpGet.mockRejectedValue(mockError);

      await expect(deckOfCardsAPI.shuffle(existingDeckId)).rejects.toThrow(expect.any(Error));
      expect(mockHttpGet).toHaveBeenCalledTimes(1);
    });

  })
  describe('returnCard function', () => {
    const existingDeckId = 'existingDeckId123';
    it('should call the correct endpoint and return with correct deck data', async () => {
      const mockDeckResponse = {
        data: {
          "success": true,
          "deck_id": existingDeckId,
          "shuffled": true,
          "remaining": 52
        }
      }
      mockHttpGet.mockResolvedValue(mockDeckResponse);

      const response = await deckOfCardsAPI.returnCard(existingDeckId);

      expect(mockHttpGet).toHaveBeenCalledTimes(1);
      expect(mockHttpGet).toHaveBeenCalledWith(`/${existingDeckId}/return`)
      expect(response.data.remaining).toBe(52);
    })
    it('should return specific cards if specified', async () => {
      const cardsToReturn = ['AS', 'KH', 'JD']
      const mockDeckResponse = {
        data: {
          "success": true,
          "deck_id": existingDeckId,
          "shuffled": true,
          "remaining": 15 // arbitrary number
        }
      }
      mockHttpGet.mockResolvedValue(mockDeckResponse)

      const response = await deckOfCardsAPI.returnCard(existingDeckId, cardsToReturn.join(','));
      expect(mockHttpGet).toHaveBeenCalledTimes(1)
      expect(mockHttpGet).toHaveBeenCalledWith(`/${existingDeckId}/return/?cards=${cardsToReturn.join(',')}`)
      expect(response.data.remaining).toBe(15)
    })

    it('should handle errors when returning', async () => {
      const mockError = new Error('Failed to return cards');
      mockHttpGet.mockRejectedValue(mockError);
      await expect(deckOfCardsAPI.shuffle(existingDeckId)).rejects.toThrow(expect.any(Error));
      expect(mockHttpGet).toHaveBeenCalledTimes(1);
    })
  })
})
