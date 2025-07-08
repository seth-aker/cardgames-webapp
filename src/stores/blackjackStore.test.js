import { useBlackjackStore } from "./blackjackStore";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('Blackjack store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    })

    it('should be initialized with correct default values', () => {
        const store = useBlackjackStore();

        expect(store.chips).toBe(1000);
        expect(store.currentBet).toBe(0);
        expect(store.wins).toBe(0);
        expect(store.losses).toBe(0);
        expect(store.playerHands).toEqual([[]]);
        expect(store.currentHandIndex).toBe(0);
        expect(store.dealerHand).toEqual([]);
        expect(store.dealerCardsRevealed).toEqual([]);
        expect(store.gamePhase).toBe('betting');
        expect(store.playerBusted).toEqual([false]);
        expect(store.dealerBusted).toBe(false);
        expect(store.playerBlackjack).toEqual([false]);
        expect(store.dealerBlackjack).toBe(false);
        expect(store.handBets).toEqual([0]);
        expect(store.isSplit).toBe(false);
        expect(store.gameMessage).toBe('');
    })

    describe('Getters', () => {
        it('canPlaceBet returns true when chips > 0 and phase is betting', () => {
            const store = useBlackjackStore();
            expect(store.canPlaceBet).toBe(true);
        });

        it('canPlaceBet returns false when chips = 0', () => {
            const store = useBlackjackStore();
            store.chips = 0;
            expect(store.canPlaceBet).toBe(false);
        });

        it('canPlaceBet returns false when phase is not betting', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            expect(store.canPlaceBet).toBe(false);
        });

        it('canHit returns true when phase is playing and not busted', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            expect(store.canHit).toBe(true);
        });

        it('canHit returns false when phase is not playing', () => {
            const store = useBlackjackStore();
            expect(store.canHit).toBe(false);
        });

        it('canHit returns false when current hand is busted', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            store.playerBusted[0] = true;
            expect(store.canHit).toBe(false);
        });

        it('canStand returns true when phase is playing', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            expect(store.canStand).toBe(true);
        });

        it('canStand returns false when phase is not playing', () => {
            const store = useBlackjackStore();
            expect(store.canStand).toBe(false);
        });

        it('canDoubleDown returns true when conditions met', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            store.playerHands[0] = [{}, {}]; // 2 cards
            store.handBets[0] = 100;
            store.chips = 100;
            expect(store.canDoubleDown).toBe(true);
        });

        it('canDoubleDown returns false when not enough chips', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            store.playerHands[0] = [{}, {}];
            store.handBets[0] = 100;
            store.chips = 50;
            expect(store.canDoubleDown).toBe(false);
        });

        it('canSplit returns true when conditions met', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            store.playerHands[0] = [{value: '10'}, {value: '10'}];
            store.handBets[0] = 100;
            store.chips = 100;
            store.playerHands.length = 1; // Less than 4
            expect(store.canSplit).toBe(true);
        });

        it('canSplit returns false when values do not match', () => {
            const store = useBlackjackStore();
            store.gamePhase = 'playing';
            store.playerHands[0] = [{value: '10'}, {value: 'JACK'}];
            expect(store.canSplit).toBe(false);
        });

        it('currentHand returns the current player hand', () => {
            const store = useBlackjackStore();
            store.playerHands[0] = [{code: 'AS'}];
            expect(store.currentHand).toEqual([{code: 'AS'}]);
        });

        it('allHandsComplete returns true when at last hand', () => {
            const store = useBlackjackStore();
            store.playerHands = [[], []];
            store.currentHandIndex = 1;
            expect(store.allHandsComplete).toBe(true);
        });

        it('allHandsComplete returns false when not at last hand', () => {
            const store = useBlackjackStore();
            store.playerHands = [[], []];
            store.currentHandIndex = 0;
            expect(store.allHandsComplete).toBe(false);
        });
    });

    describe('Actions', () => {
        it('placeBet adds to currentBet and subtracts from chips when valid', () => {
            const store = useBlackjackStore();
            store.placeBet(100);
            expect(store.currentBet).toBe(100);
            expect(store.chips).toBe(900);
        });

        it('placeBet does nothing when not enough chips', () => {
            const store = useBlackjackStore();
            store.chips = 50;
            store.placeBet(100);
            expect(store.currentBet).toBe(0);
            expect(store.chips).toBe(50);
        });

        it('startDealing sets up the game for dealing', () => {
            const store = useBlackjackStore();
            store.currentBet = 100;
            store.startDealing();
            expect(store.gamePhase).toBe('dealing');
            expect(store.playerHands).toEqual([[]]);
            expect(store.dealerHand).toEqual([]);
            expect(store.handBets).toEqual([100]);
            expect(store.gameMessage).toBe('Dealing cards...');
        });

    it('dealCardToPlayer adds card to first hand', () => {
        const store = useBlackjackStore();
        const card = {code: 'AS'};
        store.dealCardToPlayer(card);
        expect(store.playerHands[0]).toContainEqual(card);
    });

    it('dealCardToDealer adds card to dealer hand', () => {
        const store = useBlackjackStore();
        const card = {code: 'KS'};
        store.dealCardToDealer(card, false);
        expect(store.dealerHand).toContainEqual(card);
        expect(store.dealerCardsRevealed).toEqual([false]);
    });

        it('finishDealing sets phase to playing', () => {
            const store = useBlackjackStore();
            store.finishDealing();
            expect(store.gamePhase).toBe('playing');
            expect(store.gameMessage).toBe('');
        });

    it('playerHit adds card to current hand', () => {
        const store = useBlackjackStore();
        const card = {code: 'QS'};
        store.playerHit(card);
        expect(store.playerHands[0]).toContainEqual(card);
    });

        it('splitHand splits the hand when valid', () => {
            const store = useBlackjackStore();
            store.playerHands[0] = [{value: '10'}, {value: '10'}];
            store.handBets[0] = 100;
            store.chips = 100;
            store.splitHand();
            expect(store.playerHands).toEqual([[{value: '10'}], [{value: '10'}]]);
            expect(store.handBets).toEqual([100, 100]);
            expect(store.chips).toBe(0);
            expect(store.isSplit).toBe(true);
        });

        it('nextHand increments currentHandIndex if possible', () => {
            const store = useBlackjackStore();
            store.playerHands = [[], []];
            expect(store.nextHand()).toBe(true);
            expect(store.currentHandIndex).toBe(1);
        });

    it('dealerHit adds card to dealer hand', () => {
        const store = useBlackjackStore();
        const card = {code: 'JS'};
        store.dealerHit(card);
        expect(store.dealerHand).toContainEqual(card);
        expect(store.dealerCardsRevealed[store.dealerCardsRevealed.length - 1]).toBe(false);
    });

        it('revealDealerCard reveals specific card', () => {
            const store = useBlackjackStore();
            store.dealerCardsRevealed = [true, false];
            store.revealDealerCard(1);
            expect(store.dealerCardsRevealed).toEqual([true, true]);
        });

        it('revealAllDealerCards reveals all', () => {
            const store = useBlackjackStore();
            store.dealerCardsRevealed = [true, false, false];
            store.revealAllDealerCards();
            expect(store.dealerCardsRevealed).toEqual([true, true, true]);
        });

        it('playerBust sets busted status and message', () => {
            const store = useBlackjackStore();
            store.playerBust();
            expect(store.playerBusted[0]).toBe(true);
            expect(store.gameMessage).toBe('You bust!');
        });

        it('doubleDown doubles the bet if possible', () => {
            const store = useBlackjackStore();
            store.handBets[0] = 100;
            store.chips = 100;
            store.doubleDown();
            expect(store.handBets[0]).toBe(200);
            expect(store.chips).toBe(0);
        });

        it('calculateHandValue computes correct value', () => {
            const store = useBlackjackStore();
            const hand = [{value: 'ACE'}, {value: 'KING'}];
            expect(store.calculateHandValue(hand)).toBe(21);
        });

        it('calculateHandValue handles aces busting', () => {
            const store = useBlackjackStore();
            const hand = [{value: 'ACE'}, {value: '10'}, {value: 'ACE'}];
            expect(store.calculateHandValue(hand)).toBe(12);
        });

    it('endGame handles single hand win', () => {
        const store = useBlackjackStore();
        store.playerHands = [[{value: 'ACE'}, {value: 'KING'}]]; // 21
        store.dealerHand = [{value: '10'}, {value: '9'}]; // 19
        store.handBets = [100];
        store.chips -= 100;
        store.endGame(false, false);
        expect(store.gamePhase).toBe('gameOver');
        expect(store.chips).toBe(1000 + 150); // 3:2 for blackjack
        expect(store.wins).toBe(1);
        expect(store.gameMessage).toBe('Blackjack! You win!');
    });

        it('resetGame resets to betting phase', () => {
            const store = useBlackjackStore();
            store.chips = 0;
            store.resetGame();
            expect(store.gamePhase).toBe('betting');
            expect(store.chips).toBe(1000);
            expect(store.wins).toBe(0);
            expect(store.losses).toBe(0);
        });
    });
})
