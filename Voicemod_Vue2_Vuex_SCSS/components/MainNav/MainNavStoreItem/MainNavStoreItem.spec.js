import { render, fireEvent } from '@testing-library/vue'
import MainNavStoreItem from './MainNavStoreItem.vue'

import { ExternalBrowserViewModel } from '@/mocks/ExternalBrowserViewModelMock.js';

jest.mock('@/mocks/ExternalBrowserViewModelMock.js', () => {
    return {
        ExternalBrowserViewModel: {
            openExternalUrl: jest.fn()
        }
    }
});

describe('MainNavStoreItem', () => {
    it('should call openExternalUrl with passed url and user id if the link is clicked', async () => {
        const { getByRole } = render(MainNavStoreItem, {
            mocks: {
                $t: key => key,
            },
            props: {
                baseUrl: 'https://example.com/?some-param=some-param',
                loginUserId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
            }
        })
        const link = getByRole('link');

        await fireEvent.click(link);

        expect(ExternalBrowserViewModel.openExternalUrl)
            .toHaveBeenCalledWith('https://example.com/?some-param=some-param&userId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    })
    it('should call openExternalUrl with empty string if url has wrong format', async () => {
        const { getByRole } = render(MainNavStoreItem, {
            mocks: {
                $t: key => key,
            },
            props: {
                baseUrl: 'wrong-url-format',
                loginUserId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
            }
        })
        const link = getByRole('link');

        await fireEvent.click(link);

        expect(ExternalBrowserViewModel.openExternalUrl)
            .toHaveBeenCalledWith('');
    })
});
