import { MemesViewModel } from "@/mocks/MemesViewModelMock.js";
import { timeToMs } from './utils';
import * as iterable from '@/services/Iterable/iterable.js';

export const actions = {
    async axn_initMemeStore({ commit, dispatch }) {
        dispatch('axn_load');
        const modes = await MemesViewModel.MemeReproductionMode;
        commit('set_memeReproductionModes', modes);
        const playingMemes = JSON.parse(await MemesViewModel.getActiveMemes());
        const mySoundboardPublicId = await MemesViewModel.getMySoundboardPublicId()
        commit('set_mySoundBoardPublicId', mySoundboardPublicId);

        if (playingMemes.length === 0) {
            return;
        }

        Object.values(playingMemes).forEach(meme => {
            commit('set_playMeme', meme.id);
        })
    },
    async axn_load({ commit }) {
        const memeSettings = JSON.parse(await MemesViewModel.getMemeSettings());
        commit('set_load', memeSettings);
    },
    axn_changeMemeProfile({commit}, id) {
        commit('set_changeMemeProfile', id);
        commit('set_memeSelected', '');
    },
    axn_changeMemeProfileByUUID({commit}, uuid) {
        commit('set_changeMemeProfileByUUID', uuid);
        commit('set_memeSelected', '');
        iterable.openInternalURL('soundboardview');
    },
    axn_muteForMeToggle({ commit }, value) {
        commit('set_muteForMeToggle', value);
    },
    axn_keyBindsToggle({ commit }, value) {
        MemesViewModel.updateEnableShortcutsSetting(value).then(() => {
            commit('set_keyBindsToggle', value);
        });
    },
    axn_compactViewMode({ commit }, value) {
        commit('set_compactViewMode', value);
    },
    axn_playMeme({ commit, getters }, id) {
        const meme = getters.get_allMemes[id];
        commit('set_playMeme', {
            id,
            time: timeToMs(meme.totalTime)
        });
        commit('set_memeSelected', id);
    },
    axn_stopMeme({ commit }, id) {
        commit('set_stopMeme', id);
    },
    axn_newMeme({ commit }, meme) {
        commit('set_newMeme', meme);
    },
    axn_memeSelected({ commit }, id) {
        commit('set_memeSelected', id);
    },
    axn_unlockMeme({ commit }) {
        commit('set_unlockMeme');
    },
    axn_createMemeProfile({ rootState, dispatch }) {
        MemesViewModel.createMemeProfile(rootState.base_modal_store.storedModalData.bodyItems[0].inputValue);
        dispatch('closeModal', '', { root: true });
        dispatch('base_modal_store/axn_modalData', {}, { root: true });
    },
    axn_newMemeProfile({ commit }, profile) {
        commit('set_newMemeProfile', profile);
        commit('set_changeMemeProfile', profile.id);
    },
    axn_memeKeybind({commit}, keybind) {
        commit('set_memeKeybind', keybind);
    },
    axn_profileKeybind({commit}, keybind) {
        commit('set_profileKeybind', keybind);
    },
    axn_memeName({commit}, value) {
        commit('set_memeName', value);
    },
    axn_profileName({commit}, value) {
        commit('set_profileName', value);
    },
    axn_memeIcon({commit}, { value }) {
        commit('set_memeIcon', value);
    },
    /*Change Meme Toggle state, on toggle clicked*/
    axn_memeToggleProperty({ commit }, data) {
        commit('set_memeToggleProperty', data)
    },
    axn_memeVolumeChange({ commit }, value) {
        commit('set_memeVolumeChange', value);
    },
    axn_disabledToggle({ commit }, data) {
        commit('set_disabledToggle', data);
    },
    /*Change Meme Toggle state, on reproduction mode changed*/
    axn_memeToggleState({ commit }, data) {
        commit('set_memeToggleState', data);
    },
    axn_reproductionMode({ commit }, value) {
        commit('set_reproductionMode', value);
    },
    axn_deleteMeme({ commit, dispatch, state }) {
        MemesViewModel.deleteMeme(state.currentActiveProfile, state.memeSelected || state.contextMenuInMeme).then(() => {
            dispatch('closeModal', '', { root: true });
            commit('set_deleteMeme');
        })
    },
    axn_deleteMemes({ commit, dispatch, state }) {
        const ids = [...state.multiSelectedIds];

        ids.forEach(id => {
            for(let index in state.profiles) {
                let profile = state.profiles[index];
                let locatedMeme = Object.keys(profile.memes).includes(id.toString())
                if(locatedMeme) {
                    MemesViewModel.deleteMeme(profile.id, id).then(() => {
                        commit('set_deleteMemeByProfile', {profile: profile.id, meme: id});
                    })
                }
            }
        })

        dispatch('closeModal', '', { root: true });
        dispatch('axn_multiSelectActive', false);

    },
    axn_duplicateMeme({ state, rootState }, singleProfile = false) {
        let profiles;

        if (!singleProfile) {
            profiles = rootState.base_modal_store.storedModalData.bodyItems.filter(_ => _.checked).map(_ => _.id);
            MemesViewModel.duplicateMeme(profiles, state.memeSelected || state.contextMenuInMeme);
            return;
        }

        profiles = Object.values(rootState.memes_store.profiles);

        MemesViewModel.duplicateMeme([profiles.find(_ => _.createdByUser === true).id], state.memeSelected || state.contextMenuInMeme);
    },
    axn_duplicateMemes({ state, rootState }) {
        const ids = Array.from(state.multiSelectedIds);
        let profiles = Object.values(rootState.memes_store.profiles);

        if (rootState.base_modal_store.storedModalData.bodyItems) {
            const profiles = rootState.base_modal_store.storedModalData.bodyItems.filter(_ => _.checked).map(_ => _.id);
            MemesViewModel.duplicateMemes(profiles, ids);
            return;
        }

        MemesViewModel.duplicateMemes([profiles.find(_ => _.createdByUser === true).id], ids);

    },
    axn_duplicatedMeme({ commit, dispatch }, { profiles, duplicated }) {
        profiles.forEach((profile) => {
            commit('set_duplicatedMeme', {
                profile,
                memes: duplicated
            });
        });
        dispatch('closeModal', '', { root: true });
        dispatch('axn_multiSelectActive', false);
    },
    axn_deleteProfile({commit, dispatch, state}) {
        commit('set_deleteProfile', state.currentActiveProfile);
        MemesViewModel.deleteMemeProfile(state.currentActiveProfile).then(() => {
            dispatch('closeModal', '', { root: true });
        })
    },
    // eslint-disable-next-line no-unused-vars
    axn_duplicateMemeProfile({ state, rootState, dispatch }) {
        MemesViewModel.duplicateMemeProfile(state.currentActiveProfile, rootState.base_modal_store.storedModalData.bodyItems[0].inputValue);
        dispatch('closeModal', '', { root: true });
    },
    axn_unlockedMemes({ commit, rootState, state }, { updateMemes }) {
        const { profiles, currentActiveProfile} = state;
        const lockedMemes = Object.values(profiles[currentActiveProfile].memes).filter(_ => _.isFree === false && _.isCore === false);
        const isPro = rootState.settings_license.isPro;

        if (isPro || !isPro && lockedMemes.length === 0) {
            return;
        }

        updateMemes.forEach(meme => {
            commit('set_unlockedMemes', meme.id);
        })
    },
    axn_memeShortcutActive({ commit }, value) {
        commit('set_memeShortcutActive', value);
    },
    axn_memesExceededErrorModal({ dispatch }) {
        dispatch('base_modal_store/axn_modalData', {
            icon: null,
            text: window.vm.$t('memes.create_meme_error_title'),
            bodyText: 'memes.max_memes_exceeded_error_description',
            buttons: [
                {
                    action: 'memes_store/axn_closeMemesExceededErrorModal',
                    type: 'danger',
                    text: 'settings.general.modal_ok'
                },
            ]
        }, { root: true });
        window.vm.$store.dispatch('openModal', 'BaseModal', { root: true });
    },
    axn_closeMemesExceededErrorModal({ dispatch, rootState }) {
        dispatch('closeModal', '', { root: true });

        // TODO (JMSF-AdriG): ShareToUnlock is not required any more, but for it changes in the future, we keep it:
        // if (state.shareRewardsUnlocked) {
             dispatch('openModal', { experiment: rootState.modalExperiment, source: 'Memes' }, { root: true });
        //     return;
        // }

        // EventBus.$emit("sharetowin:show", {translations: this.$i18n, source: 'memes'});
    },
    axn_multiSelectActive({ commit }, value) {
        commit('set_multiSelectActive', value);
        MemesViewModel.startBulkMode();

        if (!value) {
            commit('set_multiSelectIdClean');
            MemesViewModel.endBulkMode();
        }
    },
    axn_multiSelectId({ commit }, id) {
        commit('set_multiSelectId', id);
    },
    axn_updatedProfile({ commit }, newProfile) {
        commit('set_updatedProfile', newProfile);
    },
    axn_loadingProfiles({ commit }, loading) {
        commit('set_loadingProfiles', loading)
    },
    axn_resetNewTagMemesProfiles() {
        MemesViewModel.resetNewTagMemesProfiles();
    },

    axn_resetNewTagMemeProfile({ commit, state }, id) {
        MemesViewModel.resetNewTagMemeProfile(state.profiles[id].publicId).then(() => {
            commit('set_resetNewTagMemeProfile', id);
        })
    },

    axn_profileDropdownOpen({ commit }) {
        commit('set_profileDropdownOpen')
    },

    axn_setListView({ commit }, status) {
        commit('set_listViewStatus', status);
    },

    axn_sortBy({ commit }, sortBy) {
        commit('set_sortBy', sortBy);
    },

    axn_sortDesc({ commit }, bool) {
        commit('set_sortDesc', bool);
    },

    axn_contextMenuInMeme({ commit }, memeId) {
        commit('set_contextMenuInMeme', memeId);
    },
}
