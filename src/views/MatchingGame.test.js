// P2P Tests for the matching game screen.
import MatchingGame from './MatchingGame.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { findByTestId, render, screen, waitFor } from '@testing-library/vue';
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '../stores/gameStore';
vi.mock('@/services/deckOfCardsAPI.js', () => ({
  default: {
    createDeck: vi.fn(),
    drawCard: vi.fn()
  }
}))
import deckOfCardsAPI from '../services/deckOfCardsAPI';
import userEvent from '@testing-library/user-event';

describe("MatchingGame component tests", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    deckOfCardsAPI.createDeck.mockResolvedValue({ data: { deck_id: mockDeckId } });
    deckOfCardsAPI.drawCard.mockResolvedValue({
      data: {
        data: {
          cards: [{ code: 'AS', image: 'url1' }],
          remaining: 0, // Set remaining to 0 to stop the recursion
        },
      }
    });
    render(MatchingGame, {
      global: {
        plugins: [createPinia()],
      },
    });
    vi.useFakeTimers();
  })
  const mockDeckId = "1234"
  it("fetches a new deck and draws cards when created", async () => {
    const gameStore = useGameStore();
    gameStore.cards = [{ code: 'AC' }]
    // ASSERT
    expect(deckOfCardsAPI.createDeck).toHaveBeenCalledTimes(1);


    await waitFor(() => {
      expect(deckOfCardsAPI.drawCard).toHaveBeenCalledWith(mockDeckId);
    });

    const cards = await screen.findAllByTestId('playing-card'); // Example query
    expect(cards).toHaveLength(1);
  })
  //  isGameOver should be FALSE (win screen is hidden)
  it('does NOT render the win screen when not all cards are matched', async () => {
    // ARRANGE
    // Mock APIs to prevent errors during component creation

    // Get the store instance that the component is using
    const gameStore = useGameStore();

    // To make isGameOver FALSE, set the underlying state so the lengths are NOT equal
    gameStore.cards = [{ code: 'AS' }, { code: 'QC' }]; // 3 cards total
    gameStore.cardsMatched = ['AS']; // Only 1 card matched

    // ASSERT
    // Check that the getter correctly returns false
    await waitFor(() => {
      expect(gameStore.isGameOver).toBe(false);
    })
    const winMessage = screen.queryByText(/You Win!/i);
    expect(winMessage).not.toBeInTheDocument();

  });


  // Test Case 2: isGameOver should be TRUE (win screen is visible)
  it('renders the win screen when all cards are matched', async () => {
    // ARRANGE
    const gameStore = useGameStore();


    gameStore.cards = [{ code: "AS" }, { code: "KD" }];
    gameStore.cardsMatched = ['AS', 'KD'];

    // ASSERT
    await waitFor(() => {
      expect(gameStore.isGameOver).toBe(true);
    })

    const winMessage = await screen.findByText(/You Win!/i);
    expect(winMessage).toBeInTheDocument();
  })

  it('should render the correct number of moves attempted', async () => {

    const gameStore = useGameStore();

    // ASSERT initial values
    expect(gameStore.matchingAttempts).toBe(0);

    const moves = await screen.findByText('Moves: 0');
    expect(moves).toBeInTheDocument()

    gameStore.clearShowing();

    const moves1 = await screen.findByText('Moves: 1')
    await waitFor(() => {
      expect(moves1).toBeInTheDocument();
    })
  })
  it('should render the proper number of matched cards', async () => {

    const gameStore = useGameStore();
    // ASSERT INITIAL STATE
    expect(gameStore.cardsMatched.length).toBe(0)
    const cardsMatched = await screen.findByText(/Cards Matched:/i);
    expect(cardsMatched).toBeInTheDocument()

    gameStore.addMatchingCards(['KD', 'KS'])
    const cardsMatched2 = await screen.findByText(/Cards Matched: 2\//i)
    expect(cardsMatched2).toBeInTheDocument()

  })

  // Refactored Playing Card tests
  it('The number of cards in the cards array should be the same as the number rendered on the screen.', async () => {
    const gameStore = useGameStore();
    gameStore.cards = generateCards(24);
    const cardsComponents = await screen.findAllByTestId('playing-card');
    expect(cardsComponents).toHaveLength(24)
    cardsComponents.forEach((card) => {
      expect(card.classList).not.toContain('show')
    })
  })
  it('playing cards that have been clicked should have the .show class', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const gameStore = useGameStore();
    gameStore.cards = [{ code: '2h', image: 'img' }]
    const card = await screen.findByTestId('playing-card');
    await user.click(card);
    expect(card.classList).toContain('show')
  })
  it('playing cards that have been matched should not be visible (should have class opacity-0)', async () => {
    const gameStore = useGameStore();
    gameStore.cards = generateCards(24);
    gameStore.addMatchingCards([gameStore.cards[0].code, gameStore.cards[1].code]);
    const cards = await screen.findAllByTestId('playing-card');
    const matchedCards = cards.filter((card) => card.parentElement.classList.contains('opacity-0'));
    expect(matchedCards).toHaveLength(2)
    matchedCards.forEach((card) => {
      expect(card.parentElement).toHaveClass('opacity-0')
    })
  })
});

const generateCards = (number) => {
  const cardCodes = []
  while(cardCodes.length < number) {
    const pair = generateCardCodePair();
    if(!cardCodes.includes(pair[0]) && !cardCodes.includes(pair[1])) {
      cardCodes.push(...pair)
    }
  }
  const cards = cardCodes.map((code) => ({
    code: code,
    image: `https://deckofcardsapi.com/static/img/${code}.png`
  }))
  return cards
}

const generateCardCodePair = () => {
  const random = Math.random()

  return [`${value}${randomSuit()}`, `${value}${randomSuit()}`]
}

const randomSuit = () => {
  const random = Math.random();
  if(random < 0.25) {
    return 'D'
  } else if (random < 0.5) {
    return 'C'
  } else if (random < 0.75) {
    return 'S'
  } else {
    return 'H'
  }
}