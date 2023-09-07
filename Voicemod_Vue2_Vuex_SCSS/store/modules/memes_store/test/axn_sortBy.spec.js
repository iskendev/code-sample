import { actions } from '../actions.js';

const commitMock = jest.fn();
describe('axn_sortBy', () => {

    beforeEach(() => {
        commitMock.mockClear();
    })

    it('should launch a commit with expected value', async () => {
        await actions.axn_sortBy({ commit: commitMock }, 'name');

        expect(commitMock).toBeCalledTimes(1);
        expect(commitMock.mock.calls[0][0]).toEqual('set_sortBy', 'name');
    })
});
