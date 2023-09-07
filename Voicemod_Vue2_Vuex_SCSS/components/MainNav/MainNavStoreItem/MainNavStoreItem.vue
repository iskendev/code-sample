<template>
    <li class="main-nav__item">
        <a href="#" @click.prevent="openStoreSite">
            <base-icon name="store" size="normal" />
            <span class="main-nav__label main-nav__store-text">
                {{ $t('sidebar.store') }}
            </span>
            <base-icon name="external-link" size="small" />
        </a>
    </li>
</template>

<script>
    import * as Sentry from '@sentry/browser';
    import { ExternalBrowserViewModel } from '@/mocks/ExternalBrowserViewModelMock.js';
    import { SettingsViewModel } from '@/mocks/SettingsViewModelMock.js';

    export default {
        name: 'MainNavStoreItem',
        props: {
            baseUrl: {
                type: String,
                required: true,
            },
            loginUserId: {
                type: String,
                required: true,
            }
        },
        components: {
            BaseIcon: () => import (/* webpackChunkName: "BaseIcon"*/ '@RepoComponent/BaseIcon/BaseIcon.vue'),
        },
        computed: {
            fullUrl() {
                try {
                    const urlObj = new URL(this.baseUrl);
                    urlObj.searchParams.set('userId', this.loginUserId)
                    return urlObj.href;
                } catch(err) {
                    Sentry.captureException(err);
                    return '';
                }
            },
        },
        methods: {
            openStoreSite() {
                ExternalBrowserViewModel.openExternalUrl(this.fullUrl);
                SettingsViewModel.sendExternalStoreLinkClicked('MenuSection');
            }
        }
    }
</script>
