<template>
    <div
        :class="[
            {'base-meme-item--slot': isMemeSlot},
            {'base-meme-item--disabled': isDisabled},
            {'base-meme-item--custom': isCustom},
            {'base-meme-item--cover': isCover && multiSelectionActive}
        ]"
        class="base-meme-item"
        @contextmenu.prevent.stop="openContextMenu($event)"
    >
        <context-menu
            ref="contextMenu"
            boundariesElement="meme-section__active-memes"
            :isVisible="contextMenuInMeme === meme.id"
            :menu-actions="dropdownMemeActions"
        >
            <template #header
                v-if="multiSelectedItemsCount"
            >
                <div class="base-meme-item__context__itemsSelected">
                    {{ multiSelectedItemsCount }} {{$t(`multiselection.itemsNumber`)}}
                </div>
            </template>
        </context-menu>

        <div class="base-meme-item__button--multi-selector-wrapper"
            :class="{'base-meme-item__button--multi-selector-active': isMultiSelected && isMemeItem}"
        >
            <div
                :class="{'base-meme-item__button--multi-selector-active': isMultiSelected && isMemeItem,
                    'base-meme-item__button--multi-selector-clicked': isMultiSelected && isMemeItem}"
                class="base-meme-item__button--multi-selector"
                v-if="!isCover && isMemeItem"
                @click.stop="multiSelectClick"
            ></div>
            <div
                v-if="multiSelectionActive && isCover && isMemeItem"
                class="base-meme-item__button__unselect"
                @click="multiSelectClick"
            >
                <div class="base-meme-item__button__unselect__background">
                    <base-icon
                        name="close"
                        size="small"
                        color="white"
                    >
                    </base-icon>
                </div>
            </div>
        </div>
        <div
            class="base-meme-item__button"
            @contextmenu.prevent
            @click.stop="memeItemClick"
            @pointerdown="checkMemeClick"
            @pointerup="checkMemeClick"
        >
            <div
                v-if="!isCover || isSearchThumbnail"
                ref="memeBackgrounds"
                :class="{'base-meme-item__button__backgrounds--active': isMemeSelected && isMemeItem,
                'base-meme-item__button__pulse--on': isOn}"
                class="base-meme-item__button__backgrounds"
            >
                <div class="base-meme-item__button__backgrounds__background"></div>
                <div class="base-meme-item__button__backgrounds__background-shadow"></div>
            </div>

            <div
                :class="[
                    {'base-meme-item__button__icon-layer--pro': isProMeme },
                    {'base-meme-item__button__icon-layer--add': isAddMeme || isShare},
                    {'button__icon-layer--black': isSoundboardMediaEnabled },
                ]"
                class="button__icon-layer"
            >
                <base-progress-bar
                    v-if="playingMilliseconds"
                    :progressTime="playingMilliseconds"
                    autoProgress
                >
                </base-progress-bar>
                <img
                    class="button__icon-layer--rounded"
                    :src="icon"
                >
                <img
                    v-if="isCover && isHovering && isCustom"
                    class="button__icon-layer--cover"
                    src="assets/voice-no-image-white.png"
                >
                <div
                    v-if="isSearchThumbnail"
                    class="base-meme-item__search-bar-icon__container"
                    :class="{'base-meme-item__search-bar-icon--visible': isOn}"
                >
                    <base-icon
                        class="base-meme-item__search-bar-icon__play"
                        data-testid="meme-item__search-bar-play"
                        :name="isOn ? 'pause' : 'play'"
                        size="small"
                    ></base-icon>
                </div>
            </div>
        </div>
        <div
            v-if="!isCompactMode && !isCover"
            :class="{'-no-ellipsis': isShare}"
            class="base-meme-item__title"
            @click.stop="$emit('onTitleClick', emitValue)"
        >
            <span v-if="meme.isCore || isShare || isCustom">
                {{ meme.name }}
            </span>
        </div>
        <div
            v-if="!isCompactMode && !isCover"
            class="base-meme-item__shortcut"
            @click.stop="$emit('onShortcutClick', emitValue)"
        >
            <span
                v-if="hasShortcutText"
            >
                {{ shortcutText }}
            </span>
        </div>
    </div>
</template>

<script>
    import { MemeItem } from '@/mixins/MemeItem/MemeItem';
    import { tooltipService } from '@/services/tooltips';

    export default {
        mixins: [
            MemeItem
        ],

        components: {
            BaseIcon: () => import(/* webpackChunkName: "BaseIcon"*/ '@/components/BaseIcon/BaseIcon'),
            ContextMenu: () => import(/* webpackChunkName: "ContextMenu"*/ '@/components/ContextMenu/ContextMenu'),
            BaseProgressBar: () => import(/* webpackChunkName: "BaseProgressBar"*/ '@RepoComponent/BaseProgressBar/BaseProgressBar'),
        },

        computed: {
            isMemeItem() {
                return (!this.isAddMeme && !this.isShare)
            },
            isAuxItem() {
                return this.isAddMeme || this.isShare
            }
        },

        props: {
            isSearchThumbnail: {
                default: false,
                type: Boolean
            }
        },

        data() {
            return {
                memeCoverHoverActive: false,
                tooltipService: tooltipService
            }
        },

        mounted() {
            if (this.meme.id === 'addMeme') {
                this.$emit('addMemeCreated');
            }
        },

        methods: {
            multiSelectClick() {
                this.$emit("multiSelectClick", this.meme.id);
            },

            getMemeIcon() {
                if (this.isAddMeme) {
                    return 'assets/meme-add.svg'
                }

                if (this.isShare) {
                    return this.isHovering ? 'assets/voice-share-hover.png' : '/assets/voice-share.png'
                }

                if (!this.meme.isCore && (this.meme.icon === '' || this.meme.icon == null )) {
                    return 'assets/voice-no-image-white.png';
                }

                return `fmeme://meme/${this.meme.id}?t=${new Date().getTime()}`
            },

            checkMemeClick(e) {

                if(this.isSearchThumbnail) {
                    return;
                }
                this.memeItemClick(e);
            }
        }
    }
</script>

<style lang="scss">
    @import "@/mixins/MemeItem/MemeItem.scss";

    .base-meme-item {
        $parent: &;
        @mixin memeBackground($bg-color, $width, $height) {
            position: absolute;
            border-radius: 5px;
            background-color: $bg-color;
            width: $width;
            height: $height;
        }

        &:hover > * {
            opacity: 1;
        }

        &__button {
            display: flex;
            align-items: center;

            &:hover > * {
                opacity: 1;
            }

            &__pulse--on {
                animation: pulse 1s ease-in-out infinite;
            }

            &__backgrounds {
                $backgrounds: &;
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: all ease-in-out .2s;

                &--active {
                    opacity: 1;
                }

                &--hovered {
                    opacity: 1;
                }

                &__background {
                    @include memeBackground($c-primary, 86px, 80px)
                }

                &__background-shadow {
                    @include memeBackground($c-black, 84px, 78px)
                }
            }

            &__unselect {
                position: absolute;
                z-index: 30;
                width: 80%;
                height: 80%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity ease-in-out .2s;
                opacity:0;

                &__background {
                    padding: 0.5em;
                    border-radius: 50px;
                    background-color: rgba(0,0,0,0.6);
                }

                #{$parent}--cover & {
                    width: 100%;
                }
            }
        }

        &__context {
            &__itemsSelected {
                @include text--size-xsmall;
                color: $c-primary;
                padding: 1em 1.5em;
                text-transform: uppercase;
            }
        }

        .button {
            &__icon-layer {
                background-color: $c-grey-300;
                &:hover{
                    background-color: $c-grey-300;
                }

                &:active {
                    top: inherit;
                }

                &--rounded {
                    border-radius: 5px;
                }

                #{$parent}--cover & {
                    &:active {
                        top: inherit;
                    }

                    &:hover {
                        background-color: $c-grey-300;
                        cursor: initial;
                    }
                }

                &--black {
                    background-color: black;

                    &:hover {
                        background-color: black;
                    }
                }
            }
        }

        .base-progress-bar {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 80px;
            height: 74px;
            border-radius: 5px;
            background: transparent;
            // important to overwrite :hover from memeItem
            opacity: 0.4 !important;

            &__progress {
                height: 100%;
                background: $c-primary;
            }
        }
    }
</style>
