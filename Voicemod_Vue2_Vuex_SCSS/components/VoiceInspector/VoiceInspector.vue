<template>
  <div class="property-inspector voice col">
    <div
      :class="['property-inspector-content',{'custom': !this.voiceSelectedIsCore },{'voicelab': this.voiceSelectedIsVoicelab }, {'voicelab-inspector': this.voiceSelectedIsVoicelab }]"
    >
      <div class="d-flex align-items-center flex-column">
        <div class="item">
          <div class="favourite"></div>
          <div :class="['title', {'editing': editingTitle}]">
            <a class="edit" @click="onedit_title" data-testid="voice_inspector_edit_title"></a>
            <h6 :title="voiceTitle" data-testid="voices_inspector_title">{{voiceTitle}}</h6>
            <a class="check" @click="onedit_title_finished" data-testid="voices_inspector_save_title"></a>
            <input
              type="text"
              v-model="voiceTitle"
              @blur="onedit_title_cancel()"
              @keyup.enter="onedit_title_finished"
              @keyup.escape="onedit_title_cancel(0)"
              maxlength="30"
              spellcheck="false"
              data-testid="voice_inspector_title_input"
            />
          </div>
          <div class="icon">
            <img ref="imgIcon" v-show="currentIcon != ''" :src="currentIcon" />
            <img
              class="icon-image"
              v-show="currentIcon == ''"
              @click="currentIcon_onclick"
              src="assets/voice-no-image-white.png"
            />
          </div>
          <!-- <div class="description">{{voiceSelected.description}}</div> -->
        </div>
        <div class="properties vertical-center">
          <div class="parameters-container" v-if="internalDynamicParameters">
            <div
                v-for="parameter in internalDynamicParameters"
                :key="parameter.Id"
            >
                <component
                    :ref="`${parameter.name}_properties`"
                    is-small
                    :is="handleComponentType(parameter.typeController)"
                    v-bind="handleProps(parameter, handleComponentType(parameter.typeController))"
                    v-on="handleEmits(parameter, handleComponentType(parameter.typeController))"
                >
                    {{ handleSlot(parameter, handleComponentType(parameter.typeController)) }}
                </component>

                <div
                    v-if="explainedParameters.includes(parameter.name)"
                    class="parameter__info"
                    data-testid="voice_inspector_parameter_info--ambient_effects"
                    @click="showInfoPanel"
                >
                    <img
                        class="info__info-image"
                        src="assets/inspector/icons/info.png"
                        alt="info"
                    >
                    <span class="info__text">
                        {{ $t('parameters.parameterInfo') }}
                    </span>
                    <img
                        class="info__gt-image"
                        src="assets/inspector/icons/greaterThan.svg"
                        alt="Greater than"
                    >
                </div>
            </div>
          </div>
          <a
            class="button-icon button-voicelab"
            @click="load_custom_voice"
            v-if="this.voiceSelectedIsVoicelab && this.showVoicelabIcon"
          >
          </a>
          <div class="shortcut">
            <div class="shortcut-container">
              <a class="button button-reset" href="javascript:void(0);"></a>
              <a class="button button-ok" href="javascript:void(0);">Ok!</a>
                <key-binding
                    v-if="!hideVoicelabControls"
                    ref="keybind"
                    :keybind-id="keybindIDSelected"
                    :metrics="{ id: voiceSelectedId, source: 'voice'}"
                    @keybindingSaved="keybindingSaved"
                ></key-binding>
            </div>
          </div>
          <star-list ref="rating" @onchange="rating_change" v-show="isPro && voiceSelected != null && voiceSelected.type == 0 && voiceSelected.id != 'nofx'"></star-list>
          <!-- <base-rating
            v-if="voiceSelected && voiceSelected.rating"
            @onRating='setVoiceRating'
            :rating-value="voiceSelected.rating"
            :max-rating-stars="5"
          >
          </base-rating> -->
        </div>
        <div class="actions">
            <a
                v-tooltip="toolTipShareVoice"
                class="button-icon button-share"
                @click="shareVoiceClick"
                v-if="shareLinkFeatureFlag && !this.hideVoicelabControls && this.voiceSelectedIsVoicelab"
            >
                <img class="svg" src="assets/icon-share.svg" />
            </a>
          <a
            v-if="!this.hideVoicelabControls  && $route.name !== 'voicelabview'"
            class="button-icon button-copy"
            data-testid="voice_inspector--button-copy"
            :class="[{'disabled': !isPro}]"
            @click="$emit('onduplicate_voice')"
          >
            <img class="svg" src="assets/button-copy.svg" />
          </a>
          <a
            class="button-icon button-trash"
            data-testid="voice_inspector--button-trash"
            :class="[{'disabled': !isPro}]"
            @click="confirm_delete_voice"
            v-if="!this.hideVoicelabControls && !this.voiceSelectedIsCore"
          >
            <img class="svg" src="assets/button-trash.svg" />
          </a>
          <a
            class="button-icon button-reset"
            data-testid="voice_inspector--button-reset"
            :class="[{'disabled': !isPro}]"
            @click="$emit('onreset_voice')"
            v-if="!this.hideVoicelabControls && this.voiceSelectedIsCore"
          >
            <img class="svg" src="assets/button-reset.svg" />
          </a>
        </div>
      </div>
    </div>
    <modal
      :okText="$t('component-voice-inspector.model_delete_voice_btnok')"
      :cancelText="$t('component-voice-inspector.model_delete_voice_btncancel')"
      isDangerAction
      @ok="delete_voice"
      ref="modal">
      <span slot="header">
        <img src="assets/button-stop-warning.svg" />
      </span>
      <span slot="body" v-html="$t('component-voice-inspector.model_delete_voice_body')"></span>
    </modal>
    <div
        v-if="isInfoPanelVisible"
        class="inspector__info-panel"
        data-testid="voice_inspector_info_panel"
    >
        <div class="info-panel__close">
            <img
                src="assets/inspector/icons/close.svg"
                alt="close"
                data-testid="voice_inspector_info_panel--close"
                @click="hideInfoPanel"
            >
        </div>
        <h3 class="info-panel__title" data-testid="voice_inspector_info_panel--title">
            {{ $t('voiceInspector.infopanelBackgroundEffectH3') }}
        </h3>
        <p
            class="info-panel__text"
            data-testid="voice_inspector_info_panel--text"
            v-html="$t('voiceInspector.infopanelBackgroundEffectP')"
        >
        </p>
    </div>
  </div>
</template>

<script>
    import { VoiceInspector } from '@/mixins/VoiceInspector/VoiceInspector.js';

    export default {
        mixins: [
            VoiceInspector
        ]
    }
</script>

<style  src="@/mixins/VoiceInspector/VoiceInspector.scss" lang="scss"></style>
