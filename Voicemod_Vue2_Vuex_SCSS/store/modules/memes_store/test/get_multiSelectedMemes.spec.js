import { getters } from '../getters.js';

describe('get_multiSelectedMemes', () => {
    it('should return multi selected memes', async () => {
        const mockState = { multiSelectedIds: [2, 3] }
        const mockGetters = {
            get_allMemes: {
                1: { id: 1 },
                2: { id: 2 },
                3: { id: 3 },
            }
        }

        expect(getters.get_multiSelectedMemes(mockState, mockGetters)).toEqual([{ id: 2 }, { id: 3 }])
    })
});
