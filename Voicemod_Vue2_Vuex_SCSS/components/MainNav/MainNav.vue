<template>
	<nav
        class="main-nav"
        :class="[
            isCollapsed ? 'main-nav--is-collapsed' : null,
        ]"
    >
        <ul
            v-if="items.length > 0"
            class="main-nav__main-menu"
        >
            <li
                class="main-nav__item"
                v-for="(item, index) in items"
                :name="item.name"
                :key="index"
                :class="[{ '-hide': item.hide },
                    { 'main-nav__item--preventDefault': (item.name === 'soundboard' && isSoundboardLocked)}]"
                @click="handleItemClick(item.name)"
                @mouseenter="_self[`${item.name}HoverActive`] = true"
                @mouseleave="_self[`${item.name}HoverActive`] = false"
            >
                <tippy
                    :to="item.name"
                    :visible="areTooltipsVisible(item.name)"
                    :distance="11"
                    arrow="true"
                    arrowType="round"
                    trigger="manual"
                    theme="vm-light"
                    animation="fade"
                    placement="right"
                >
                    {{  tooltipService.getTooltipText(`mainNav_${item.name}Nav`) }}
                </tippy>
                <div class="main-nav__loader"
                    v-if="item.name === 'soundboard' && isSoundboardLocked"
                >
                    <img src="assets/voicemod-loader.gif" />
                </div>
                <router-link
                    :to="{
                        name: `${item.name}view`,
                        params: item.params
                    }"
                    :class="[
                        {
                            'route--is-exact-active': $route.path.includes(item.name),
                            'route--has-news': item.highlighted,
                        },
                    ]"
                    :id="'main-nav__' + item.name"
                    :data-testid="item.name"
                >
                    <slot
                        name="icon"
                        :item="item"
                    >
                    </slot>
                    <transition
                        appear
                        mode="out-in"
                        name="appear-item-menu"
                        v-on:after-enter="endEnterEvent"
                    >
                        <span
                            v-if="!isCollapsed"
                            class="main-nav__label"
                        >
                            <slot
                                name="label"
                                :item="item"
                            >
                            </slot>
                        </span>
                    </transition>
                </router-link>
            </li>
            <div
                class="main-nav__item"
                :class="{'main-nav__item--has-news': get_accountHasNews}"
                v-if="loginFeatureFlag"
                @mouseover="showAccountModal"
                @mouseleave="hideAccountModal"
            >
                <div
                    v-if="accountModal"
                    class="main-nav__account-modal"
                    @mouseover="showAccountModal"
                >
                    <span
                        class="account-modal__element"
                        @click="accountProfile"
                    >
                        {{ $t('userAccount.my-account') }}
                        <base-icon name="external-link" size="small" />
                    </span>
                    <span
                        class="account-modal__element"
                        @click="accountPartnerLink"
                        @mouseover="accountPartnerLinkHover"
                    >
                        {{ $t('accountapp.modal.partnerProgram') }}

                        <span
                            v-if="get_accountHasNews"
                            class="account-modal__element--new"
                        >NEW!</span>

                        <base-icon name="external-link" size="small" />
                    </span>
                    <span
                        class="account-modal__element"
                        @click="logoutHandle"
                    >
                        {{ $t('accountapp.log_out_button') }}
                    </span>
                </div>
                <div class="main-nav__account">
                    <base-icon name="account" size="normal" />
                    <transition
                        appear
                        mode="out-in"
                        name="appear-item-menu"
                        v-on:after-enter="endEnterEvent"
                    >
                        <span
                            v-if="!isCollapsed"
                            class="main-nav__account-text"
                            @mouseover="showAccountModal"
                        >
                            {{ $t('sidebar.account') }}
                        </span>
                    </transition>
                </div>
            </div>
            <main-nav-store-item
                v-if="isStoreItemVisible"
                :base-url="featureFlagStore.storeIntegrationFlag.storeUrl"
                :login-user-id="access.loginUserId"
            />
            <div
                v-if="updateAvailable"
                class="main-nav__update"
                @click="updateApp"
            >
                <base-icon
                    name="update"
                    size="normal"
                    color="active"
                ></base-icon>
                <transition
                    appear
                    mode="out-in"
                    name="appear-item-menu"
                    v-on:after-enter="endEnterEvent"
                >
                    <span v-if="!isCollapsed">{{ $t('main_nav.update_app') }}</span>
                </transition>
            </div>
            <li class="main-nav__item--is-last">
                <button
                    class="main-nav__collapse-action"
                    @click="handleCollapse"
                >
                </button>
            </li>
        </ul>
	</nav>
</template>

<script>
    import { ExternalBrowserViewModel } from '@/mocks/ExternalBrowserViewModelMock.js';
    import { mapState, mapActions, mapGetters } from 'vuex';
    import { Account } from '@/services/models/Account';
    import { ApplicationViewModel } from '@/mocks/ApplicationViewModelMock';
    import { MainMetricsViewModel } from '@/mocks/MainMetricsViewModelMock.js';
    import { SettingsViewModel } from '@/mocks/SettingsViewModelMock.js';
    import { tooltipService } from '@/services/tooltips';
    import MainNavStoreItem from './MainNavStoreItem/MainNavStoreItem.vue';

    export default {
        name: 'leftNavbar',

        components: {
            BaseIcon: () => import (/* webpackChunkName: "BaseIcon"*/ '@RepoComponent/BaseIcon/BaseIcon.vue'),
            MainNavStoreItem
        },

        props: {
            isCollapsed: {
                type: Boolean,
                default: false,
                required: true,
            },
            items: {
                type: Array,
                default: () => []
            },
            isCurrent: {
                type: String,
                default: '',
            },
            isHighlighted: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                link: `https://${process.env.VUE_APP_FRONTEND_URL}/#/`,
                accountModal: false,
                modalTimeout: null,
                tooltipService: tooltipService,
                voicesHoverActive: false,
                soundboardHoverActive: false,
                voicelabHoverActive: false,
                pluginsHoverActive: false,
                settingsHoverActive: false,
            }
        },

        computed: {
            ...mapState({
                settingsLicense: state => state.settings_license,
                updateAvailable: state => state.update_store.updateAvailable,
                access: state => state.account.access,
                featureFlagStore: state => state.feature_flags,
                menuCollapsedState: state => state.menuCollapsedState,
            }),

            ...mapGetters({
                get_accountHasNews: 'account/get_accountHasNews',
            }),

            loginFeatureFlag() {
                return this.featureFlagStore.loginFlag;
            },

            isSoundboardLocked() {
                return this.$store.state.tour.tourOpen &&
                    !this.$store.state.tour.showSoundboardTooltip
            },

            isStoreItemVisible() {
                return this.featureFlagStore.storeIntegrationFlag.enabled && !this.settingsLicense.isPro;
            }
        },

        methods: {
            ...mapActions('account', {
                showMessage: 'axn_showMessage',
                axn_setAccountHasNews: 'axn_setAccountHasNews',
            }),

            handleItemClick(item) {
                this.$emit('handleClick', item);
            },

            handleCollapse() {
                this.$emit('handleCollapse');
            },

            endEnterEvent(e) {
                e.style.transitionDelay = '0s'
            },

            showAccountModal() {
                clearTimeout(this.modalTimeout);
                this.accountModal = true;
            },
            hideAccountModal() {
                this.modalTimeout = setTimeout(() => {this.accountModal = false}, 200);
            },
            async accountProfile() {
                await Account.sendGetProfileMetric()
                ExternalBrowserViewModel.openExternalUrl(`${this.link}?action=account`);
            },
            logoutHandle() {
                this.showMessage({
                    status: 'Warning',
                    title: 'accountapp.modal_log_out_title',
                    message: 'accountapp.modal_log_out_description',
                    actions: [
                        {
                            method: 'closeModal',
                            label: 'accountapp.cancel_button',
                            type: 'simple'
                        },
                        {
                            method: 'logout',
                            label: 'accountapp.log_out_button',
                            type: 'warning'
                        }
                    ]
                })
            },

            accountPartnerLink() {
                MainMetricsViewModel.menuItemClicked('partnership-program');
                ExternalBrowserViewModel.openExternalUrl(process.env.VUE_APP_PARTNER_URL);
            },

            accountPartnerLinkHover() {
                SettingsViewModel.onUserClickedAccountMenuItem().then(() => {
                    this.axn_setAccountHasNews(false);
                });
            },

            updateApp() {
                ApplicationViewModel.updateApplication();
            },

            areTooltipsVisible(name) {
                return this.menuCollapsedState
                    && this[`${name}HoverActive`]
                    && (this.featureFlagStore.tippyTooltipsActive && this.featureFlagStore.tooltipsLocalState);
            }
        },
    }
</script>

<style src="./MainNav.scss" lang="scss"></style>
