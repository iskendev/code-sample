import BaseView from "@/views/BaseView.vue";
import localVariables from './MemeView.json';
import { MemesViewModel } from "@/mocks/MemesViewModelMock.js";
import { EventBus } from "@/helpers/EventBus.js";
import { axn_memesStore, get_memeStore } from '@/store/modules/memes_store/utils.js';
import { mapState, mapActions, mapGetters } from 'vuex';
import { buildBaseModal } from '@/helpers/utils';

export const MemeView = {
    name: "soundBoard",
    extends: BaseView,
    components: {
        BaseToggle: () => import(/* webpackChunkName: "BaseToggle"*/ '@RepoComponent/BaseToggle/BaseToggle'),
        BaseButton: () => import(/* webpackChunkName: "BaseButton"*/ '@RepoComponent/BaseButton/BaseButton'),
        BaseVideo: () => import(/* webpackChunkName: "BaseVideo"*/ '@RepoComponent/BaseVideo/BaseVideo'),
        BaseSelect: () => import(/* webpackChankName: "BaseSelect"*/ '@/components/UI/BaseSelect/BaseSelect'),
        BaseMemeItem: () => import(/* webpackChunkName: "MemeItem"*/ '@/components/MemeItem/MemeItem'),
        BaseLink: () => import(/* webpackChenkName: "BaseLink"*/ '@/components/BaseLink/BaseLink'),
        MemeProfileProperties: () => import(/* webpackChenkName: "MemeProfileProperties"*/ '@/views/SidebarRight/MemeProfileProperties/MemeProfileProperties'),
        MemeProperties: () => import(/* webpackChenkName: "MemeProperties"*/ '@/views/SidebarRight/MemeProperties/MemeProperties'),
        BaseAccordion: () => import(/* webpackChunkName: "BaseAccordion"*/ '@/components/BaseAccordion/BaseAccordion'),
    },
    data() {
        return {
            localVariables: localVariables,
            memeButtons: {
                meme: this.playMeme,
                add: this.openAddMemeDialog,
                share: this.openShareModal,
                getPro: this.showGetPro
            },
            sectionExpanded: true,
        }
    },
    computed: {
        ...mapState({
            store: state => state,
            memesStore: state => state.memes_store,
            settingsLicenseStore: state => state.settings_license,
            flagStore: state => state.feature_flags,
        }),
        ...mapGetters({
            ...get_memeStore
        }),
        isCompactMode() {
            return this.memesStore.isCompactMode;
        },
        isPro() {
            console.log(this.memesStore)
            return this.settingsLicenseStore.isPro;
        },
        areShortcutsEnabled() {
            return this.memesStore.enableShortcuts;
        },
        isMuteForMeenabled() {
            return this.memesStore.muteForMe;
        },
        selectOptions() {
            return this.get_memeProfiles;
        },
        getNewProfile() {
            return this.get_memeProfilesNew;
        },
        selectSelectedOption() {
            return this.memesStore.currentActiveProfile;
        },
        activeProfile() {
            return this.get_activeProfile(this.selectSelectedOption) || {};
        },
        hasBeenShared() {
            return this.memesStore.shareRewardsUnlocked
        },
        memeFreeSlots() {
            const isShared = this.hasBeenShared;

            return isShared || this.isPro ? this.memesStore.freeSlots : this.memesStore.maxMemesForFreeUsers || 0;
        },
        activeProfileMemes() {
            let memesCore = this.get_activeProfileCoreMemes(this.selectSelectedOption, this.isPro, this.isFreeProfile());
            let memesCustom = this.get_activeProfileCustomMemes;

            memesCore = (this.isFreeProfile() && !this.isPro) || !this.activeProfile.createdByUser ? memesCore : [];
            memesCustom = this.isFreeProfile() ? memesCustom.filter(_ => _.isFree === true) : memesCustom;

            const activeMemes = this.activeProfile.createdByUser
                ? [...memesCore, ...memesCustom, ...this.getFreeMemeSlots]
                : [...memesCore, ...memesCustom]

            return this.isPro || this.isFreeProfile() ? activeMemes : [];
        },
        activeProfileLockedMemes() {
            return this.get_activeProfileLockedMemes(this.selectSelectedOption, this.isFreeProfile());
        },
        memesPlaying() {
            return this.memesStore.memesPlaying;
        },
        memeSelected() {
            return this.get_memeSelected;
        },
        customMemes() {
            return this.get_activeProfileCustomMemes;
        },
        hasFreeSlots() {
            return (this.memeFreeSlots - this.customMemes.length) > 0;
        },
        inspectorMemeSelected() {
            if (!this.memeSelected) {
                return null;
            }
            return Object.keys(this.memeSelected).length > 0 ? this.memeSelected : null;
        },
        multiSelectedIds() {
            return this.memesStore.multiSelectedIds;
        },
        multiSelectionActive() {
            return this.memesStore.multiSelectActive;
        },
        urlSoundboardVideoShowcase: function() {
            return this.flagStore.soundboardVideoShowcaseFlag.urlSoundboardVideoShowcase;
        },
        enableSoundboardVideoShowcase: function() {
            return this.flagStore.soundboardVideoShowcaseFlag.showSoundboardVideoShowcase
                && this.flagStore.soundboardVideoShowcaseFlag.urlSoundboardVideoShowcase
                && this.flagStore.soundboardVideoShowcaseFlag.urlSoundboardVideoShowcase !== ""
                && !this.settingsLicenseStore.isPro;
        },
        isNewProfile() {
            return this.memesStore.isNewProfile;
        },
        getFreeMemeSlots() {
            const freeMemes = [];
            const loopLength = this.memeFreeSlots - this.customMemes.length;

            if (!this.isPro && this.isFreeProfile()) {
                for (let i = 0; i < loopLength; i++) {
                    freeMemes.push(this.localVariables.addMeme);
                }
                if (!this.hasBeenShared) {
                    const shareMeme = this.localVariables.shareMeme;
                    shareMeme.name = this.$t(shareMeme.name);
                    freeMemes.push(shareMeme);
                } else {
                    const getProMeme = this.localVariables.getProMeme;
                    getProMeme.name = this.$t(getProMeme.name);
                    freeMemes.push(this.localVariables.getProMeme)
                }
            }

            return this.isPro ? [this.localVariables.addMeme] : freeMemes;
        },
    },
    beforeDestroy() {
        this.axn_memeSelected('');
    },
    methods: {
        ...mapActions({
            ...axn_memesStore
        }),
        changeCompactViewMode(value) {
            this.axn_compactViewMode(value);
        },
        shortcutsClick(value) {
            this.axn_keyBindsToggle(!value);
        },
        muteForMeClick(value) {
            MemesViewModel.setMuteForMeSettings(!value);
        },
        selectOptionChange(id) {
            MemesViewModel.stopAllMemeSounds(false);
            MemesViewModel.setActiveMemeProfile(id);
            this.axn_changeMemeProfile(id);
            this.axn_resetNewTagMemeProfile(id);
            this.axn_profileDropdownOpen();
        },
        playMeme(meme, isKeyDown = true) {
            MemesViewModel.hitMeme(meme.id, isKeyDown);
        },
        stopAllMemes() {
            MemesViewModel.stopAllMemeSounds();
        },
        openAddMemeDialog() {
            MemesViewModel.sendCreateNewSoundClickedEvent(localVariables.newSoundValues.freeSlot);
            MemesViewModel.createMemeFromWindowsDialog(this.activeProfile.id);
        },
        openShareModal() {
            EventBus.$emit("sharetowin:show", {translations: this.$i18n, source: 'memes'});
        },
        showGetPro() {
            this.$store.dispatch('openModal', { experiment: this.store.modalExperiment, source: 'Memes' });
        },
        memeButtonClick({ meme, type }) {
            this.memeButtons[type](meme);
        },
        memeTitleClick({ meme }) {
            this.axn_memeSelected(meme.id);
        },
        memeShortcutClick({ meme }) {
            this.axn_memeSelected(meme.id);
            this.axn_memeShortcutActive(true);
        },
        createSoundboardClick() {
            var data = { checkoutLaunched: !this.isPro };
            MemesViewModel.createNewSoundBoardSelectedMetricsEvent(JSON.stringify(data));

            if (!this.isPro) {
                this.showGetPro();
                return;
            }

            buildBaseModal({
                icon: null,
                text: this.$t('memes.enter_the_name_new_soundboard'),
                body: true,
                bodyType: 'BaseModalInput',
                bodyItems: [
                    {
                        inputValue: ''
                    }
                ],
                buttons: [
                    {
                        action: 'closeModal',
                        type: 'simple',
                        text: 'memes.create_soundboard_cancel'
                    },
                    {
                        action: 'memes_store/axn_createMemeProfile',
                        type: 'vanish',
                        text: 'memes.create_soundboard_ok'
                    },
                ]
            });
        },
        isFreeProfile() {
            const obj = this.activeProfile && this.activeProfile.memes ? Object.values(this.activeProfile.memes).find(_ => _.isCore) : {};
            return !!obj && !this.activeProfile.locked && !this.isPro;
        },
        // TODO: This should be refactored from c# level as memes logic is to complex
        isMemeDisabled(meme) {
            if (this.isPro) {
                return false;
            }

            if (!this.isPro && (meme.isCore || !meme.isFree) && !this.isFreeProfile()) {
                return true;
            }

            if (this.isFreeProfile() && !meme.isFree && !meme.isCore) {
                return true;
            }

            return false;
        },
        isMemeSelected(meme) {
            return meme.id ? meme.id === this.memeSelected.id : false
        },
        meme_deleted: async function() {
            this.axn_memeSelected('')
        },
        unSelectMeme() {
            this.axn_memeSelected('');
        },
        stopByReproductionMode() {
            this.playMeme(this.memeSelected, false);
        },
        openFindSound() {
            MemesViewModel.openSearchSoundsFromInternet();
        },
        expandAccordion() {
            this.sectionExpanded = !this.sectionExpanded;
        },
        getVoicemodPro() {
            this.$store.dispatch('openModal', { experiment: this.store.modalExperiment, source: 'GetPro' });
        },
        toggleMultiSelect() {
            this.axn_multiSelectActive(!this.multiSelectionActive);
        },
        isInterfaceButton(meme) {
            return meme.isCompactMode || meme.isShare || meme.isAdd
        }
    },
};
