
import { beforeEach, describe, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event'
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '../stores/gameStore';
vi.mock('vue-router', async () => {
    const actual = await vi.importActual('vue-router');
    return {
        ...actual,
        useRouter: vi.fn(() => {
            return {
                go: vi.fn()
            }
        })

    }
})
vi.mock('@/services/deckOfCardsAPI.js', () => ({
    default: {
        createDeck: vi.fn(),
        drawCard: vi.fn()
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
                plugins: [createPinia()]
            }
        })

        vi.useFakeTimers()
    })

    it("pause button gets rendered inside of the MatchingGame component", async () => {
        const button = await screen.findByText(/^pause$/i);
        expect(button).toBeInTheDocument();
    })

    it('pause button stops game timer when pressed', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const gameStore = useGameStore();
        vi.advanceTimersByTime(1000);
        expect(gameStore.gameTime).toBe("00:01");
        const button = await screen.findByText(/^pause$/i)
        await user.click(button)
        vi.advanceTimersByTime(5000);
        expect(gameStore.gameTime).toBe("00:01");
    })

    it('pause menu is rendered when pause button is pressed', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        await user.click(await screen.findByText(/^pause$/i));
        const pausedMenu = await screen.findByText(/paused/i)
        expect(pausedMenu).toBeInTheDocument();
    });

    it('pause menu component has a "Resume" button', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        await user.click(await screen.findByText(/^pause$/i));

        const resumeButton = await screen.findByText(/^resume$/i);
        expect(resumeButton).toBeInTheDocument();
    })
    it('resumeButton closes the pause menu', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        await user.click(await screen.findByText(/^pause$/i));
        await user.click(await screen.findByText(/^resume$/i))
        const pauseMenu = screen.queryByText(/^paused$/i);
        expect(pauseMenu).not.toBeInTheDocument()
    })
    it('resumeButton resumes the game timer', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });


        const gameStore = useGameStore();
        expect(gameStore.gameTime).toBe("00:00");

        await user.click(await screen.findByText(/^pause$/i));
        await user.click(await screen.findByText(/^resume$/i));
        vi.advanceTimersByTime(2000);
        const timeText = await screen.findByText('Timer: 00:02')
        expect(timeText).toBeInTheDocument();
        expect(gameStore.gameTime).toBe("00:02")
    })

    it('pause menu component has a new game button', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        await user.click(await screen.findByText(/^pause$/i));
        const resumeButton = await screen.findByText(/^new game$/i);
        expect(resumeButton).toBeInTheDocument();
    })
    it('new game button clears the gameStore and resets the game.', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const gameStore = useGameStore();
        const spy = vi.spyOn(gameStore, 'clearMatching')

        gameStore.cards = [{ code: 'AC' }, { code: 'AH' }, { code: 'KC' }, { code: 'KD' }];
        gameStore.gameTime = '01:30';
        gameStore.matchingAttempts = 20;
        gameStore.cardsShowing = [{ code: 'AC' }],
            gameStore.cardsMatched = [{ code: '2H' }, { code: '2D' }]
        await user.click(await screen.findByText(/^pause$/i));
        await user.click(await screen.findByText(/^new game$/i));

        expect(spy).toHaveBeenCalledTimes(1)
        expect(gameStore.cards).toEqual([])
        expect(gameStore.cardsShowing).toEqual([]);
        expect(gameStore.cardsMatched).toEqual([]);
        expect(gameStore.matchingAttempts).toBe(0);
        expect(gameStore.gameTime).toBe("00:00");

        expect(deckOfCardsAPI.createDeck).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(deckOfCardsAPI.drawCard).toHaveBeenCalledWith(mockDeckId);
        });
    })
    it('new game button closes the pause menu', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        await user.click(await screen.findByText(/^pause$/i));
        await user.click(await screen.findByText(/^new game$/i))
        const pauseMenu = screen.queryByText(/^paused$/i);
        expect(pauseMenu).not.toBeInTheDocument()
    })
})
