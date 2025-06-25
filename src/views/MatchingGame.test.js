// P2P Tests for the matching game screen.
import MatchingGame from './MatchingGame.vue'
import { beforeEach, describe, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue';
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '../stores/gameStore';
vi.mock('@/services/deckOfCardsAPI.js', () => ({
    default: {
        createMatchingDeck: vi.fn(),
        drawCards: vi.fn()
    }
}))
import deckOfCardsAPI from '../services/deckOfCardsAPI';

describe("MatchingGame component tests", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        deckOfCardsAPI.createMatchingDeck.mockResolvedValue({data: {deck_id: mockDeckId}});
        deckOfCardsAPI.drawCards.mockResolvedValue({
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
    })
    const mockDeckId = "1234"
    it("fetches a new deck and draws cards when created", async () => {
        
       
          
          const gameStore = useGameStore();
          gameStore.cards = [{code: 'AC'}]
          // ASSERT
          expect(deckOfCardsAPI.createMatchingDeck).toHaveBeenCalledTimes(1);
      
         
          await waitFor(() => {
            expect(deckOfCardsAPI.drawCards).toHaveBeenCalledWith(mockDeckId);
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


    gameStore.cards = [{code: "AS"},{code: "KD"}];
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
        const cardsMatched = await screen.findByText('Cards Matched : 0/24');
        expect(cardsMatched).toBeInTheDocument()

        gameStore.addMatchingCards(['KD', 'KS'])
        const cardsMatched2 = await screen.findByText('Cards Matched : 2/24')
        expect(cardsMatched2).toBeInTheDocument()



  })
});