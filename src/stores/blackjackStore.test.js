import { useBlackjackStore } from "./blackjackStore";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('Blackjack Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    })

    describe('Initial State', () => {
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
        });
    });

    describe('Getters', () => {
        describe('canPlaceBet', () => {
            it('returns true when chips > 0 and gamePhase is betting', () => {
                const store = useBlackjackStore();
                store.chips = 100;
                store.gamePhase = 'betting';
                expect(store.canPlaceBet).toBe(true);
            });

            it('returns false when chips = 0', () => {
                const store = useBlackjackStore();
                store.chips = 0;
                store.gamePhase = 'betting';
                expect(store.canPlaceBet).toBe(false);
            });

            it('returns false when gamePhase is not betting', () => {
                const store = useBlackjackStore();
                store.chips = 100;
                store.gamePhase = 'playing';
                expect(store.canPlaceBet).toBe(false);
            });
        });

        describe('canHit', () => {
            it('returns true when gamePhase is playing and current hand is not busted', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerBusted = [false];
                store.currentHandIndex = 0;
                expect(store.canHit).toBe(true);
            });

            it('returns false when current hand is busted', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerBusted = [true];
                store.currentHandIndex = 0;
                expect(store.canHit).toBe(false);
            });

            it('returns false when gamePhase is not playing', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'betting';
                store.playerBusted = [false];
                expect(store.canHit).toBe(false);
            });
        });

        describe('canStand', () => {
            it('returns true when gamePhase is playing', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                expect(store.canStand).toBe(true);
            });

            it('returns false when gamePhase is not playing', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'betting';
                expect(store.canStand).toBe(false);
            });
        });

        describe('canDoubleDown', () => {
            it('returns true when conditions are met', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerHands = [[{ value: '10' }, { value: 'ACE' }]];
                store.currentHandIndex = 0;
                store.chips = 100;
                store.handBets = [50];
                expect(store.canDoubleDown).toBe(true);
            });

            it('returns false when hand has more than 2 cards', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerHands = [[{ value: '10' }, { value: 'ACE' }, { value: '5' }]];
                store.currentHandIndex = 0;
                store.chips = 100;
                store.handBets = [50];
                expect(store.canDoubleDown).toBe(false);
            });

            it('returns false when insufficient chips', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerHands = [[{ value: '10' }, { value: 'ACE' }]];
                store.currentHandIndex = 0;
                store.chips = 25;
                store.handBets = [50];
                expect(store.canDoubleDown).toBe(false);
            });
        });

        describe('canSplit', () => {
            it('returns true when conditions are met', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerHands = [[{ value: '10' }, { value: '10' }]];
                store.currentHandIndex = 0;
                store.chips = 100;
                store.handBets = [50];
                expect(store.canSplit).toBe(true);
            });

            it('returns false when cards have different values', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerHands = [[{ value: '10' }, { value: 'ACE' }]];
                store.currentHandIndex = 0;
                store.chips = 100;
                store.handBets = [50];
                expect(store.canSplit).toBe(false);
            });

            it('returns false when already at max hands (4)', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'playing';
                store.playerHands = [
                    [{ value: '10' }, { value: '10' }],
                    [{ value: '9' }],
                    [{ value: '8' }],
                    [{ value: '7' }]
                ];
                store.currentHandIndex = 0;
                store.chips = 100;
                store.handBets = [50, 50, 50, 50];
                expect(store.canSplit).toBe(false);
            });
        });

        describe('currentHand', () => {
            it('returns the current hand', () => {
                const store = useBlackjackStore();
                const hand = [{ value: '10' }, { value: 'ACE' }];
                store.playerHands = [hand];
                store.currentHandIndex = 0;
                expect(store.currentHand).toEqual(hand);
            });

            it('returns empty array when no current hand', () => {
                const store = useBlackjackStore();
                store.playerHands = [];
                store.currentHandIndex = 0;
                expect(store.currentHand).toEqual([]);
            });
        });

        describe('allHandsComplete', () => {
            it('returns true when current hand index is at last hand', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }], [{ value: 'ACE' }]];
                store.currentHandIndex = 1;
                expect(store.allHandsComplete).toBe(true);
            });

            it('returns false when there are more hands to play', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }], [{ value: 'ACE' }]];
                store.currentHandIndex = 0;
                expect(store.allHandsComplete).toBe(false);
            });
        });
    });

    describe('Actions', () => {
        describe('placeBet', () => {
            it('should place bet when conditions are met', () => {
                const store = useBlackjackStore();
                store.chips = 1000;
                store.gamePhase = 'betting';
                
                store.placeBet(100);
                
                expect(store.currentBet).toBe(100);
                expect(store.chips).toBe(900);
            });

            it('should not place bet when insufficient chips', () => {
                const store = useBlackjackStore();
                store.chips = 50;
                store.gamePhase = 'betting';
                
                store.placeBet(100);
                
                expect(store.currentBet).toBe(0);
                expect(store.chips).toBe(50);
            });

            it('should not place bet when not in betting phase', () => {
                const store = useBlackjackStore();
                store.chips = 1000;
                store.gamePhase = 'playing';
                
                store.placeBet(100);
                
                expect(store.currentBet).toBe(0);
                expect(store.chips).toBe(1000);
            });

            it('should accumulate multiple bets', () => {
                const store = useBlackjackStore();
                store.chips = 1000;
                store.gamePhase = 'betting';
                
                store.placeBet(50);
                store.placeBet(25);
                
                expect(store.currentBet).toBe(75);
                expect(store.chips).toBe(925);
            });
        });

        describe('startDealing', () => {
            it('should reset game state for new round', () => {
                const store = useBlackjackStore();
                store.currentBet = 100;
                store.playerHands = [[{ value: '10' }]];
                store.dealerHand = [{ value: 'ACE' }];
                
                store.startDealing();
                
                expect(store.gamePhase).toBe('dealing');
                expect(store.playerHands).toEqual([[]]);
                expect(store.dealerHand).toEqual([]);
                expect(store.dealerCardsRevealed).toEqual([]);
                expect(store.playerBusted).toEqual([false]);
                expect(store.dealerBusted).toBe(false);
                expect(store.playerBlackjack).toEqual([false]);
                expect(store.dealerBlackjack).toBe(false);
                expect(store.handBets).toEqual([100]);
                expect(store.currentHandIndex).toBe(0);
                expect(store.isSplit).toBe(false);
                expect(store.gameMessage).toBe('Dealing cards...');
            });
        });

        describe('dealCardToPlayer', () => {
            it('should add card to first player hand', () => {
                const store = useBlackjackStore();
                const card = { value: '10', suit: 'HEARTS' };
                
                store.dealCardToPlayer(card);
                
                expect(store.playerHands[0]).toContainEqual(card);
                expect(store.playerHands[0].length).toBe(1);
            });
        });

        describe('dealCardToDealer', () => {
            it('should add card to dealer hand face up by default', () => {
                const store = useBlackjackStore();
                const card = { value: 'ACE', suit: 'SPADES' };
                
                store.dealCardToDealer(card);
                
                expect(store.dealerHand).toContainEqual(card);
                expect(store.dealerCardsRevealed).toEqual([true]);
            });

            it('should add card to dealer hand face down when specified', () => {
                const store = useBlackjackStore();
                const card = { value: 'KING', suit: 'CLUBS' };
                
                store.dealCardToDealer(card, false);
                
                expect(store.dealerHand).toContainEqual(card);
                expect(store.dealerCardsRevealed).toEqual([false]);
            });
        });

        describe('finishDealing', () => {
            it('should set game phase to playing and clear message', () => {
                const store = useBlackjackStore();
                store.gamePhase = 'dealing';
                store.gameMessage = 'Dealing cards...';
                
                store.finishDealing();
                
                expect(store.gamePhase).toBe('playing');
                expect(store.gameMessage).toBe('');
            });
        });

        describe('playerHit', () => {
            it('should add card to current hand', () => {
                const store = useBlackjackStore();
                const card = { value: '5', suit: 'DIAMONDS' };
                store.playerHands = [[{ value: '10' }]];
                store.currentHandIndex = 0;
                
                store.playerHit(card);
                
                expect(store.playerHands[0]).toContainEqual(card);
                expect(store.playerHands[0].length).toBe(2);
            });

            it('should add card to correct hand when split', () => {
                const store = useBlackjackStore();
                const card = { value: '7', suit: 'HEARTS' };
                store.playerHands = [[{ value: '10' }], [{ value: 'ACE' }]];
                store.currentHandIndex = 1;
                
                store.playerHit(card);
                
                expect(store.playerHands[1]).toContainEqual(card);
                expect(store.playerHands[0].length).toBe(1);
                expect(store.playerHands[1].length).toBe(2);
            });
        });

        describe('splitHand', () => {
            it('should split hand when conditions are met', () => {
                const store = useBlackjackStore();
                const card1 = { value: '10', suit: 'HEARTS' };
                const card2 = { value: '10', suit: 'SPADES' };
                store.playerHands = [[card1, card2]];
                store.handBets = [100];
                store.chips = 500;
                store.currentHandIndex = 0;
                
                store.splitHand();
                
                expect(store.playerHands).toEqual([[card1], [card2]]);
                expect(store.handBets).toEqual([100, 100]);
                expect(store.playerBusted).toEqual([false, false]);
                expect(store.playerBlackjack).toEqual([false, false]);
                expect(store.chips).toBe(400);
                expect(store.isSplit).toBe(true);
            });

            it('should not split when cards have different values', () => {
                const store = useBlackjackStore();
                const card1 = { value: '10', suit: 'HEARTS' };
                const card2 = { value: 'ACE', suit: 'SPADES' };
                store.playerHands = [[card1, card2]];
                store.handBets = [100];
                store.chips = 500;
                
                store.splitHand();
                
                expect(store.playerHands).toEqual([[card1, card2]]);
                expect(store.handBets).toEqual([100]);
                expect(store.isSplit).toBe(false);
            });
        });

        describe('nextHand', () => {
            it('should move to next hand and return true', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }], [{ value: 'ACE' }]];
                store.currentHandIndex = 0;
                
                const result = store.nextHand();
                
                expect(store.currentHandIndex).toBe(1);
                expect(result).toBe(true);
            });

            it('should return false when no more hands', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }]];
                store.currentHandIndex = 0;
                
                const result = store.nextHand();
                
                expect(store.currentHandIndex).toBe(0);
                expect(result).toBe(false);
            });
        });

        describe('dealerHit', () => {
            it('should add card to dealer hand face down', () => {
                const store = useBlackjackStore();
                const card = { value: '6', suit: 'CLUBS' };
                
                store.dealerHit(card);
                
                expect(store.dealerHand).toContainEqual(card);
                expect(store.dealerCardsRevealed).toEqual([false]);
            });
        });

        describe('revealDealerCard', () => {
            it('should reveal card at specified index', () => {
                const store = useBlackjackStore();
                store.dealerCardsRevealed = [true, false, false];
                
                store.revealDealerCard(1);
                
                expect(store.dealerCardsRevealed).toEqual([true, true, false]);
            });

            it('should not affect array when index is out of bounds', () => {
                const store = useBlackjackStore();
                store.dealerCardsRevealed = [true, false];
                
                store.revealDealerCard(5);
                
                expect(store.dealerCardsRevealed).toEqual([true, false]);
            });
        });

        describe('revealAllDealerCards', () => {
            it('should reveal all dealer cards', () => {
                const store = useBlackjackStore();
                store.dealerCardsRevealed = [true, false, false];
                
                store.revealAllDealerCards();
                
                expect(store.dealerCardsRevealed).toEqual([true, true, true]);
            });
        });

        describe('playerBust', () => {
            it('should mark current hand as busted', () => {
                const store = useBlackjackStore();
                store.currentHandIndex = 0;
                
                store.playerBust();
                
                expect(store.playerBusted[0]).toBe(true);
                expect(store.gameMessage).toBe('You bust!');
            });

            it('should show hand number when split', () => {
                const store = useBlackjackStore();
                store.currentHandIndex = 1;
                store.isSplit = true;
                
                store.playerBust();
                
                expect(store.playerBusted[1]).toBe(true);
                expect(store.gameMessage).toBe('Hand 2 busted!');
            });
        });

        describe('doubleDown', () => {
            it('should double the bet when sufficient chips', () => {
                const store = useBlackjackStore();
                store.handBets = [100];
                store.chips = 500;
                store.currentHandIndex = 0;
                
                store.doubleDown();
                
                expect(store.handBets[0]).toBe(200);
                expect(store.chips).toBe(400);
            });

            it('should not double bet when insufficient chips', () => {
                const store = useBlackjackStore();
                store.handBets = [100];
                store.chips = 50;
                store.currentHandIndex = 0;
                
                store.doubleDown();
                
                expect(store.handBets[0]).toBe(100);
                expect(store.chips).toBe(50);
            });
        });

        describe('calculateHandValue', () => {
            it('should calculate value for number cards', () => {
                const store = useBlackjackStore();
                const hand = [
                    { value: '5' },
                    { value: '7' },
                    { value: '3' }
                ];
                
                const value = store.calculateHandValue(hand);
                
                expect(value).toBe(15);
            });

            it('should calculate value for face cards', () => {
                const store = useBlackjackStore();
                const hand = [
                    { value: 'KING' },
                    { value: 'QUEEN' },
                    { value: 'JACK' }
                ];
                
                const value = store.calculateHandValue(hand);
                
                expect(value).toBe(30);
            });

            it('should handle aces as 11 when possible', () => {
                const store = useBlackjackStore();
                const hand = [
                    { value: 'ACE' },
                    { value: '9' }
                ];
                
                const value = store.calculateHandValue(hand);
                
                expect(value).toBe(20);
            });

            it('should handle aces as 1 when necessary', () => {
                const store = useBlackjackStore();
                const hand = [
                    { value: 'ACE' },
                    { value: 'ACE' },
                    { value: '9' }
                ];
                
                const value = store.calculateHandValue(hand);
                
                expect(value).toBe(21);
            });

            it('should handle multiple aces correctly', () => {
                const store = useBlackjackStore();
                const hand = [
                    { value: 'ACE' },
                    { value: 'ACE' },
                    { value: 'ACE' },
                    { value: '8' }
                ];
                
                const value = store.calculateHandValue(hand);
                
                expect(value).toBe(21);
            });
        });

        describe('endGame', () => {
            it('should handle player win scenario', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }, { value: '9' }]];
                store.dealerHand = [{ value: '10' }, { value: '7' }];
                store.handBets = [100];
                store.chips = 400;
                
                store.endGame();
                
                expect(store.gamePhase).toBe('gameOver');
                expect(store.chips).toBe(600); // 400 + 200 (bet * 2)
                expect(store.wins).toBe(1);
                expect(store.gameMessage).toBe('You win! (19 vs 17)');
            });

            it('should handle player loss scenario', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }, { value: '7' }]];
                store.dealerHand = [{ value: '10' }, { value: '9' }];
                store.handBets = [100];
                store.chips = 400;
                
                store.endGame();
                
                expect(store.gamePhase).toBe('gameOver');
                expect(store.chips).toBe(400); // No chips returned
                expect(store.losses).toBe(1);
                expect(store.gameMessage).toBe('You lose! (17 vs 19)');
            });

            it('should handle push scenario', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }, { value: '8' }]];
                store.dealerHand = [{ value: '9' }, { value: '9' }];
                store.handBets = [100];
                store.chips = 400;
                
                store.endGame();
                
                expect(store.gamePhase).toBe('gameOver');
                expect(store.chips).toBe(500); // 400 + 100 (bet returned)
                expect(store.wins).toBe(0);
                expect(store.losses).toBe(0);
                expect(store.gameMessage).toBe('Push! (18 vs 18)');
            });

            it('should handle player blackjack win', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: 'ACE' }, { value: 'KING' }]];
                store.dealerHand = [{ value: '10' }, { value: '9' }];
                store.handBets = [100];
                store.chips = 400;
                
                store.endGame();
                
                expect(store.gamePhase).toBe('gameOver');
                expect(store.chips).toBe(650); // 400 + 250 (bet * 2.5)
                expect(store.wins).toBe(1);
                expect(store.gameMessage).toBe('Blackjack! You win!');
            });

            it('should handle dealer blackjack', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }, { value: '9' }]];
                store.dealerHand = [{ value: 'ACE' }, { value: 'KING' }];
                store.handBets = [100];
                store.chips = 400;
                
                store.endGame(true);
                
                expect(store.gamePhase).toBe('gameOver');
                expect(store.dealerBlackjack).toBe(true);
                expect(store.chips).toBe(400); // No chips returned
                expect(store.losses).toBe(1);
                expect(store.gameMessage).toBe('Dealer got blackjack!');
            });

            it('should handle dealer bust', () => {
                const store = useBlackjackStore();
                store.playerHands = [[{ value: '10' }, { value: '9' }]];
                store.dealerHand = [{ value: '10' }, { value: '7' }, { value: '8' }];
                store.handBets = [100];
                store.chips = 400;
                
                store.endGame(false, true);
                
                expect(store.gamePhase).toBe('gameOver');
                expect(store.dealerBusted).toBe(true);
                expect(store.chips).toBe(600); // 400 + 200 (bet * 2)
                expect(store.wins).toBe(1);
                expect(store.gameMessage).toBe('Dealer busted! You win!');
            });

            it('should handle split hands with mixed results', () => {
                const store = useBlackjackStore();
                store.playerHands = [
                    [{ value: '10' }, { value: '9' }], // 19 - wins
                    [{ value: '10' }, { value: '5' }]  // 15 - loses
                ];
                store.dealerHand = [{ value: '10' }, { value: '7' }]; // 17
                store.handBets = [100, 100];
                store.chips = 300;
                
                store.endGame();
                
                expect(store.gamePhase).toBe('gameOver');
                expect(store.chips).toBe(500); // 300 + 200 (one win)
                expect(store.wins).toBe(1);
                expect(store.losses).toBe(1);
                expect(store.gameMessage).toBe('Mixed results: 1 wins, 1 losses, 0 pushes');
            });
        });

        describe('resetGame', () => {
            it('should reset all game state', () => {
                const store = useBlackjackStore();
                // Set up some game state
                store.playerHands = [[{ value: '10' }], [{ value: 'ACE' }]];
                store.dealerHand = [{ value: 'KING' }];
                store.currentBet = 100;
                store.gamePhase = 'gameOver';
                store.isSplit = true;
                store.gameMessage = 'You win!';
                
                store.resetGame();
                
                expect(store.playerHands).toEqual([[]]);
                expect(store.dealerHand).toEqual([]);
                expect(store.dealerCardsRevealed).toEqual([]);
                expect(store.currentBet).toBe(0);
                expect(store.currentHandIndex).toBe(0);
                expect(store.gamePhase).toBe('betting');
                expect(store.playerBusted).toEqual([false]);
                expect(store.dealerBusted).toBe(false);
                expect(store.playerBlackjack).toEqual([false]);
                expect(store.dealerBlackjack).toBe(false);
                expect(store.handBets).toEqual([0]);
                expect(store.isSplit).toBe(false);
                expect(store.gameMessage).toBe('');
            });

            it('should reset chips and stats when player is broke', () => {
                const store = useBlackjackStore();
                store.chips = 0;
                store.wins = 5;
                store.losses = 10;
                
                store.resetGame();
                
                expect(store.chips).toBe(1000);
                expect(store.wins).toBe(0);
                expect(store.losses).toBe(0);
            });

            it('should not reset chips and stats when player has chips', () => {
                const store = useBlackjackStore();
                store.chips = 500;
                store.wins = 5;
                store.losses = 3;
                
                store.resetGame();
                
                expect(store.chips).toBe(500);
                expect(store.wins).toBe(5);
                expect(store.losses).toBe(3);
            });
        });
    });
});
