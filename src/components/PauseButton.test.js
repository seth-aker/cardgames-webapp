
import { beforeEach, describe, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event'
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '../stores/gameStore';

vi.mock('@/services/deckOfCardsAPI.js', () => ({
    default: {
        createMatchingDeck: vi.fn(),
        drawCards: vi.fn()
    }
}))
import deckOfCardsAPI from '../services/deckOfCardsAPI';
import MatchingGame from '../views/MatchingGame.vue';

describe("PauseButton component tests", () => {
    // Setup and mocks
    const mockDeckId = '1234'
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
            vi.useFakeTimers()
        })
    
    it("pause button gets rendered inside of the MatchingGame component", async () => {
        render(MatchingGame, {
            global: {
              plugins: [createPinia()], 
            },
        });
        const button = await screen.findByRole('button', {name: '/pause/i'});
        expect(button).toBeInTheDocument();
    })

    it('pause button stops game timer when pressed', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })

        const gameStore = useGameStore();
        vi.advanceTimersByTime(1000);
        expect(gameStore.gameTime).toBe("00:01");

        const button = await screen.findByRole('button', {name: '/pause/i'})
        await user.click(button)
        vi.advanceTimersByTime(5000);
        expect(gameStore.gameTime).toBe("00:01");
    })
    it('pause menu is rendered when pause button is pressed', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })
        await user.click(screen.findByRole('button', {name: '/pause/i'}));
        const pausedMenu = await screen.findByText('/paused/i')
        expect(pausedMenu).toBeInTheDocument();
    });

    it('pause menu component has a "Resume" button', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })
        await user.click(screen.findByRole('button', {name: '/pause/i'}));

        const resumeButton = await screen.findByRole('button', {name: '/resume/i'});
        expect(resumeButton).toBeInTheDocument();
    } )
    it('resumeButton closes the pause menu', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })
        await user.click(screen.findByRole('button', {name: '/pause/i'}));
        await user.click(screen.findByRole('button', {name: '/resume/i'}))
        const pauseMenu = screen.queryByText('/paused/i');
        expect(pauseMenu).not.toBeInTheDocument()
    })
    it('resumeButton resumes the game timer', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })

        const gameStore = useGameStore();
        expect(gameStore.gameTime).toBe("00:00");
        
        await user.click(screen.findByRole('button', {name: '/pause/i'}));
        await user.click(screen.findByRole('button', {name: '/resume/i'}));
        vi.advanceTimersByTime(2000);
        const timeText = await screen.findByText('Timer: 00:02')
        expect(timeText).toBeInTheDocument();
        expect(gameStore.gameTime).toBe("00:02")
    })

    it('pause menu component has a new game button', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })
        await user.click(screen.findByRole('button', {name: '/pause/i'}));
        const resumeButton = await screen.findByRole('button', {name: '/new game/i'});
        expect(resumeButton).toBeInTheDocument();
    })
    it('new game button clears the gameStore and resets the game.', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })
        const gameStore = useGameStore();
        gameStore.cards = [{code: 'AC'}, {code: 'AH'}, {code: 'KC'}, {code: 'KD'}];
        gameStore.gameTime = '01:30';
        gameStore.matchingAttempts = 20;
        gameStore.cardsShowing = [{code: 'AC'}],
        gameStore.cardsMatched = [{code:'2H'}, {code: '2D'}]
        await user.click(screen.findByRole('button', {name: '/pause/i'}));
        await user.click(screen.findByRole('button', {name: '/new game/i'}));
        
        expect(gameStore.clearMatching).toHaveBeenCalledTimes(1)
        expect(gameStore.cards).toEqual([])
        expect(gameStore.cardsShowing).toEqual([]);
        expect(gameStore.cardsMatched).toEqual([]);
        expect(gameStore.matchingAttempts).toBe(0);
        expect(gameStore.gameTime).toBe("00:00");

        expect(deckOfCardsAPI.createMatchingDeck).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(deckOfCardsAPI.drawCards).toHaveBeenCalledWith(mockDeckId);
        });
    })
    it('new game button closes the pause menu', async () => {
        const user = userEvent.setup();
        render(MatchingGame, {
            global: {
                plugins: [createPinia()]
            }
        })
        await user.click(screen.findByRole('button', {name: '/pause/i'}));
        await user.click(screen.findByRole('button', {name: '/new game/i'}))
        const pauseMenu = screen.queryByText('/paused/i');
        expect(pauseMenu).not.toBeInTheDocument()
    })
})