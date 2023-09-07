import stringHelper from '@/helpers/string-helper';
import { MemesViewModel } from "@/mocks/MemesViewModelMock.js";
import { mapActions, mapGetters, mapState } from 'vuex';
import { axn_memesStore, get_memeStore } from '@/store/modules/memes_store/utils.js';
import { memeToggles, memeReproductionModeStates, enumReproductionModes } from './MemePropertiesData';
import MemeViewUtils from '@/helpers/MemeViewUtils.js';
import { tooltipService } from '@/services/tooltips';

export default {
    name: 'SidebarRightSoundboard',

    components: {
        PropertyInspector: () => import(/* webpackChunkName: "PropertyInspector"*/ '@/views/PropertyInspector/PropertyInspector'),
        BaseElementName: () => import(/* webpackChunkName: "BaseElementName"*/ '@/components/BaseElementName/BaseElementName'),
        BaseToggle: () => import(/* webpackChunkName: "BaseToggle"*/ '@RepoComponent/BaseToggle/BaseToggle'),
        SliderBox: () => import(/* webpackChunkName: "SliderBox"*/ '@RepoComponent/SliderBox/SliderBox'),
        MemeControls: () => import(/* webpackChunkName: "MemeControls"*/ '@/views/MemeControls/MemeControls'),
        KeyBinding: () => import(/* webpackChunkName: "KeyBinding"*/ '@/views/KeyBinding/KeyBinding'),
        BaseIcon: () => import(/* webpackChunkName: "BaseIcon"*/ '@/components/BaseIcon/BaseIcon'),
        MemeItem: () => import(/* webpackChunkName: "MemeItem"*/ '@/components/MemeItem/MemeItem'),
    },

    props: {
        memeSelected: {
            type: Object,
            required: true
        },

        needFocus: {
            type: Boolean,
            default: false
        },

        isDragImages: {
            type: Boolean,
            required: true
        }
    },

    data() {
        return {
            title: 'Placeholder',
            nameEditable: true,
            memeToggles: [],
            memeToggleMethods: {
                loop: MemesViewModel.updateLoop,
                muteOtherSounds: MemesViewModel.updateMuteOtherSounds,
                muteVoice: MemesViewModel.updateMuteVoice,
                stopOtherSounds:MemesViewModel.updateStopOtherSounds
            },
            memeReproductionModeStates: {},
            enumReproductionModes: {},
            searchingIcon: false,
            tooltipService: tooltipService,
        }
    },

    computed: {
        ...mapState({
            settingsLicenseStore: state => state.settings_license,
            memesStore: state => state.memes_store
        }),

        ...mapGetters({
            ...get_memeStore
        }),

        activeProfile() {
            return this.get_activeProfile(this.selectSelectedOption) || {};
        },

        old_memeIDSelected: function() {
            return `Input_WhilePress_PlayMeme_${this.memeSelected.id}`;
        },

        isMemePlaying() {
            return this.memesStore.memesPlaying.find(meme => meme.id === this.memeSelected.id);
        },

        memeReproductionModes() {
            return this.memesStore.reproductionModes;
        },

        memeToggleStates() {
            return this.memesStore.memeToggleStates;
        },

        activeReproductionMode() {
            return this.enumReproductionModes[this.memeSelected.reproductionMode];
        },

        isPro() {
            return this.settingsLicenseStore.isPro;
        },
        hasBeenShared() {
            return this.memesStore.shareRewardsUnlocked
        },
        memeFreeSlots() {
            const isShared = this.hasBeenShared;

            return isShared ? this.memesStore.freeSlots : this.memesStore.maxMemesForFreeUsers || 0;
        },
        customMemes() {
            return this.get_activeProfileCustomMemes;
        },
        hasFreeSlots() {
            return (this.memeFreeSlots - this.customMemes.length) > 0;
        },
        shortcutActive() {
            return this.memesStore.memeShortcutActive;
        },
        multiSelectionActive() {
            return this.memesStore.multiSelectActive;
        },
        multiSelectedIds() {
            return this.memesStore.multiSelectedIds;
        },
        haveCoreInMulti() {
            const multiSelectedMemes = this.get_multiSelectedMemes;
            return multiSelectedMemes.some(_ => _.isCore);
        },
    },

    watch: {
        memeSelected(memeSelected) {
            this.reproductionModeChange({ mode: this.activeReproductionMode, index: memeSelected.reproductionMode }, false);
        },

        needFocus(newValue) {
            if(newValue) {
                this.$refs.keybind.$el.focus();
            }
        }
    },

    mounted() {
        const isMemeSelected = Object.keys(this.memeSelected).length > 0;

        if (isMemeSelected) {
            this.initMemeProperties();
        }
    },

    methods: {
        ...mapActions({
            ...axn_memesStore
        }),

        initMemeProperties() {
            this.memeToggles = memeToggles;
            this.memeReproductionModeStates = memeReproductionModeStates;
            this.enumReproductionModes = enumReproductionModes;
            this.reproductionModeChange({ mode: this.activeReproductionMode, index: this.memeSelected.reproductionMode }, false);
        },

        camelToSnake(text) {
            return stringHelper.CamelToSnakeCase(text);
        },

        editMemeTitle(title) {
            MemesViewModel.updateMemeName(this.memeSelected.id, title);
            this.axn_memeName(title);
        },

        memeToggleTrigger(value, toggle) {
            this.memeToggleMethods[toggle](parseInt(this.memeSelected.id), value).then(() => {
                this.axn_memeToggleProperty({ toggle, value });
            })
        },

        memeVolumeChange(value) {
            this.axn_memeVolumeChange(value);
            if (this.isMemePlaying) {
                MemesViewModel.updateMemeVolumeInPlayback(
                    parseInt(this.memeSelected.id),
                    value
                );
            }
        },

        saveMemeVolume(value) {
            MemesViewModel.updateMemeVolume(
                parseInt(this.memeSelected.id),
                parseFloat(value)
            );
        },

        reproductionModeChange({ mode, index }, fromControls = true) {
            if (!this.memeToggles) {
                return;
            }


            this.memeToggles.forEach(toggle => {
                this.axn_disabledToggle({ toggle, value: false});
                this.axn_memeToggleState({ toggle, value: null });
            });

            if (this.memeReproductionModeStates[mode] !== undefined) {
                const modeValues = Object.values(this.memeReproductionModeStates[mode]);
                const modeKeys = Object.keys(this.memeReproductionModeStates[mode]);

                modeValues.forEach((value, index) => {
                    this.axn_memeToggleState({ toggle: modeKeys[index], value: value.check });
                    this.axn_disabledToggle({ toggle: modeKeys[index], value: value.disabled });
                })
            }

            if (fromControls) {
                MemesViewModel.updateMemeReproductionMode(
                    parseInt(this.memeSelected.id),
                    index.toString()
                ).then(() => {
                    this.axn_reproductionMode(index);
                });
                return;
            }

            this.axn_reproductionMode(index);
        },

        editMemeBackground() {
            if (this.memeSelected.isCore) {
                return;
            }

            if (!this.searchingIcon) {
                this.searchingIcon = true;

                MemesViewModel.updateMemeIcon(this.memeSelected.id)
                    .then((jsonResponse) => {
                        this.searchingIcon = false;

                        try {
                            const response = JSON.parse(jsonResponse);
                            if (response === null) {
                                return;
                            }

                            if (response.error) {
                                this.$plugins.sendNotification({
                                    toast:
                                    {
                                        type: 'error',
                                        title: 'memes.invalid_image_description'
                                    }
                                });
                            }
                        } catch {
                            this.$plugins.sendNotification({
                                toast:
                                {
                                    type: 'error',
                                    title: 'claimProcess.error'
                                }
                            });
                        }
                    });
            }
        },

        changeMemeKeybind(keybind) {
            this.axn_memeKeybind(keybind)
        },

        duplicateMeme() {
            if (this.get_freeProfileNames.length <= 1) {
                this.multiSelectionActive ? this.axn_duplicateMemes(true) : this.axn_duplicateMeme(true);
                return;
            }
            const modalText = this.$t('component.meme-inspector.modal_meme_duplicate_body');
            MemeViewUtils.duplicateMeme(this.multiSelectionActive, this.get_freeProfileNames, modalText);
        },

        deleteMeme() {
            const modalText = this.$t('component.meme-inspector.modal_meme_delete_body');
            MemeViewUtils.deleteMeme(this.multiSelectionActive, modalText);
        },
    },
};
