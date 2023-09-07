import { actions } from '../actions.js';

const commitMock = jest.fn();
describe('axn_setListView', () => {

    beforeEach(() => {
        commitMock.mockClear();
    })

    it('should launch a commit with expected value', async () => {
        await actions.axn_setListView({ commit: commitMock }, true);

        expect(commitMock).toBeCalledTimes(1);
        expect(commitMock.mock.calls[0][0]).toEqual('set_listViewStatus', true);
    })
});
