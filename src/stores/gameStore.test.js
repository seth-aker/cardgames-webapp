import { useGameStore } from "./gameStore";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('Game store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    })

    it('should be initialized with correct default values', () => {
        const store = useGameStore();
        expect(store.pageTitle).toBe("Let's Play Some Card Games!");
        expect(store.cards).toEqual([]);
        expect(store.cardsMatched).toEqual([]);
        expect(store.matchingAttempts).toBe(0);
        expect(store.gameTime).toEqual("00:00");
        expect(store.difficulty).not.toBeUndefined()
    })
    describe('Getters', () => {
        it('isGameOver returns false when cards array is empty', () => {
            const store = useGameStore();
            expect(store.cards).toEqual([]);
            expect(store.isGameOver).toBe(false)
        }),
            it('isGameOver returns false when cards array length is NOT 0 and cards matched length are not equal', () => {
                const store = useGameStore();
                store.cards = [{ code: 'AS' }]
                expect(store.cards.length).toBe(1)
                expect(store.cardsMatched.length).toBe(0)
                expect(store.isGameOver).toBe(false)
            })
        it('isGameOver returns true when cards array length is NOT 0 and cardsMatched array length are equal', () => {
            const store = useGameStore();
            store.cards = [{ code: 'AS' }];
            store.cardsMatched = [{ code: 'AS' }]
            expect(store.cards.length).toBe(1)
            expect(store.cardsMatched.length).toBe(1)
            expect(store.isGameOver).toBe(true)
        })
    })
    describe('Actions', () => {
        it('addCard should add card object when card code is not in cards array', () => {
            const store = useGameStore();
            const card = { code: 'AS', image: 'test' }
            store.addCard([card]);
            expect(store.cards.length).toBe(1)
            expect(store.cards).toContainEqual(card)
        })
        it('addCard should NOT add card object when card already exists in cards array', () => {
            const store = useGameStore();
            const card = { code: 'AS', image: 'test' }
            store.cards = [card]
            store.addCard([card]);
            expect(store.cards.length).toBe(1)
            expect(store.cards).toContainEqual(card)
        })
        it('clearShowing should reset cardsShowing array', () => {
            const store = useGameStore();
            store.cardsShowing = ['AS', 'KS']
            expect(store.cardsShowing.length).toBe(2)

            store.clearShowing()
            expect(store.cardsShowing).toEqual([])
            expect(store.cardsShowing.length).toBe(0)
        })
        it('clearShowing should increase the number of matching attempts', () => {
            const store = useGameStore();
            expect(store.matchingAttempts).toBe(0)
            store.clearShowing();
            expect(store.matchingAttempts).toBe(1)
        })
        it('addMatchingCards should add all cardIds provided', () => {
            const store = useGameStore();
            const cardIds = ['AS', 'AC', 'KD', 'KH']
            store.addMatchingCards(cardIds);
            expect(store.cardsMatched.length).toBe(4);
            expect(store.cardsMatched).toEqual(cardIds)
        })
        it('addMatchingCards should not do anything if given empty array', () => {
            const store = useGameStore();
            store.addMatchingCards([]);
            expect(store.cardsMatched.length).toBe(0);
            expect(store.cardsMatched).toEqual([])
        })
        it('addMatchingCards should not do anything if not passed an argument', () => {
            const store = useGameStore();
            store.addMatchingCards();
            expect(store.cardsMatched.length).toBe(0);
            expect(store.cardsMatched).toEqual([])
        })
    })
})
