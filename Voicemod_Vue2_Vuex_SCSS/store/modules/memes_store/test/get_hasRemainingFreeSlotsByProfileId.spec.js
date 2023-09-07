import { getters } from '../getters';
import { memes_store } from '../index';
import { cloneDeep } from 'lodash'

describe('get_hasRemainingFreeSlotsByProfileId', () => {
    let state;

    beforeEach(() => {
        state = cloneDeep(memes_store.state);
    })

    it('should return true if there is free slots', () => {
        const coreMeme = { "isCore": true }
        const customMeme = { "isCore": false }

        state.profiles = { 1: { "updating": false }}

        const mockGetters = {
            get_activeProfileMemes: () => [coreMeme, customMeme],
            get_activeProfile: () => state.profiles[1],
            get_memeFreeSlots: 2,
        }

        expect(getters.get_hasRemainingFreeSlotsByProfileId(state, mockGetters)(1)).toBe(true);
    })

    it('should return false if profile is updating', () => {
        const coreMeme = { "isCore": false }
        const customMeme = { "isCore": false }

        state.profiles = { 1: { "updating": true }}

        const mockGetters = {
            get_activeProfileMemes: () => [coreMeme, customMeme],
            get_activeProfile: () => state.profiles[1],
            get_memeFreeSlots: 2,
        }

        expect(getters.get_hasRemainingFreeSlotsByProfileId(state, mockGetters)(1)).toBe(false);
    })

    it('should return false if all free slots are occupied', () => {
        const coreMeme = { "isCore": false }
        const customMeme = { "isCore": false }

        state.profiles = { 1: { "updating": false }}

        const mockGetters = {
            get_activeProfileMemes: () => [coreMeme, customMeme, customMeme],
            get_activeProfile: () => state.profiles[1],
            get_memeFreeSlots: 2,
        }

        expect(getters.get_hasRemainingFreeSlotsByProfileId(state, mockGetters)(1)).toBe(false);
    })
});
