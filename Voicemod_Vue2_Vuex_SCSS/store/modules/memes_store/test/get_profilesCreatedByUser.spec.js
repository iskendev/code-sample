import { getters } from '../getters';
import { memes_store } from '../index';
import { cloneDeep } from 'lodash'

describe('get_profilesCreatedByUser', () => {
    let state;

    beforeEach(() => {
        state = cloneDeep(memes_store.state);
    })

    it('should return all profiles created by user', () => {
        state.profiles = {
            1: { createdByUser: false },
            2: { createdByUser: true },
            3: { createdByUser: true },
        }

        expect(getters.get_profilesCreatedByUser(state)).toHaveLength(2);
        expect(getters.get_profilesCreatedByUser(state)).toEqual([
            {"createdByUser": true},
            {"createdByUser": true}
        ]);
    })
});
