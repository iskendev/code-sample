import { MemesViewModel } from "@/mocks/MemesViewModelMock.js";
import { axn_memesStore } from '@/store/modules/memes_store/utils.js';
import { mapState, mapActions } from 'vuex';

export const MemeItem = {
    props: {
        meme: {
            type: Object,
            required: true
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        isAddMeme: {
            type: Boolean,
            default: false
        },
        isCustom: {
            type: Boolean,
            default: false
        },
        isShare: {
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        isCompactMode: {
            type: Boolean,
            default: false
        },
        isOn: {
            type: Boolean,
            default: false
        },
        isMemeSelected: {
            type: Boolean,
            default: false
        },
        couldBeSlot: {
            type: Boolean,
            default: false
        },
        isCover: {
            type: Boolean,
            default: false
        },
        couldBeDuplicated: {
            type: Boolean,
            default: false
        },
        isMultiSelected: {
            type: Boolean,
            default: false
        },
        isMultiSelectionActive: {
            type: Boolean,
            default: false
        },
        isMemeLastSelected: {
            type: Boolean,
            default: false
        },
        isProMeme: {
            type: Boolean,
            default: false
        },
        dropdownMemeActions: {
            type: Object,
            default: () => {}
        },
        multiSelectedItemsCount: {
            type: Number,
            default: 0,
            required: false
        },
        playingMilliseconds: {
            type: Number,
            default: 0
        },
        isSearchThumbnail: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            isHovering: false,
        }
    },
    computed: {
        ...mapState({
            settingsLicenseStore: state => state.settings_license,
            memesStore: state => state.memes_store,
            featureFlagStore: state => state.feature_flags,
        }),
        isPro() {
            return this.settingsLicenseStore.isPro;
        },
        icon() {
            return this.getMemeIcon();
        },
        shortcutText: function(){
            return this.meme.keybind.length > 0
                ? this.memeKeyBinds
                : this.$t('component-meme-item.shortcut_text');
        },
        memeKeyBinds() {
            return this.meme.keybind.map((text) => {
                return text.substring(1);
            }).join(' + ');
        },
        emitValue() {
            if (this.meme.isGetPro) {
                return {meme: this.meme, type: 'getPro'};
            }

            if (this.isShare) {
                return {meme: this.meme, type: 'share'};
            }

            if (this.isAddMeme) {
                return {meme: this.meme, type: 'add'};
            }

            return {meme: this.meme, type: 'meme'};
        },
        isMemeSlot() {
            return !this.isPro && (this.isAddMeme || this.isCustom) && this.couldBeSlot;
        },
        hasShortcutText() {
            return this.meme.isCore || this.isCustom && !this.isAddMeme && !this.isShare;
        },
        multiSelectionActive() {
            return this.memesStore.multiSelectActive;
        },
        contextMenuInMeme() {
            return this.memesStore.contextMenuInMeme;
        },
        isSoundboardMediaEnabled() {
            return this.featureFlagStore.soundboardMediaFlag;
        },
    },
    methods: {
        ...mapActions({
            ...axn_memesStore
        }),
        addShortcut() {
            MemesViewModel.addKeybindMemeMetrics(this.meme.id, false);
            this.$emit("onaddshortcut", this.meme);
        },
        getMemeIcon() {
            if (this.isAddMeme) {
                return 'assets/meme-add.svg'
            }

            if (this.isShare) {
                return this.isHovering ? 'assets/voice-share-hover.png' : '/assets/voice-share.png'
            }

            if (!this.meme.isCore && (this.meme.icon === '' || this.meme.icon == null )) {
                return 'assets/voice-no-image.png';
            }

            return `fmeme://meme/${this.meme.id}?t=${new Date().getTime()}`
        },

        openContextMenu() {
            if(!this.meme.id || this.meme.id === 'addMeme') return;
            this.axn_contextMenuInMeme(this.meme.id);
            this.$refs.contextMenu.open();
        },

        memeItemClick(e) {
            if(e.which === 3) {
                this.$emit('onTitleClick', this.emitValue);
                return;
            }
            if (this.isCover) {
                this.$emit(`onClick`, this.emitValue);
                return;
            }
            this.$emit(`on${e.type}`, this.emitValue);
        },
    }
}
