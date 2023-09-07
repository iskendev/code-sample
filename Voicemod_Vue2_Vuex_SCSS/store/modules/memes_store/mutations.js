import Vue from 'vue';

export const mutations = {
    set_load(state, value) {
        for(let key in value) {
            Vue.set(state, key, value[key])
        }
    },
    set_changeMemeProfile(state, id) {
        state.currentActiveProfile = id;
        Vue.set(state.profiles[state.currentActiveProfile], 'new', false);
    },
    set_keyBindsToggle(state, value) {
        state.enableShortcuts = value;
    },
    set_muteForMeToggle(state, value) {
        state.muteForMe = value;
    },
    set_compactViewMode(state, value) {
        state.isCompactMode = value;
    },
    set_playMeme(state, meme) {
        state.memesPlaying.push(meme)
    },
    set_memeSelected(state, id) {
        Vue.set(state, 'memeSelected', id)
    },
    set_stopMeme(state, id) {
        state.memesPlaying = state.memesPlaying.filter(_ => _.id !== id);
    },
    set_newMeme(state, meme) {
        Vue.set(state.profiles[state.currentActiveProfile].memes, meme.id, meme);
    },
    set_unlockMeme(state) {
        Vue.set(state, 'shareRewardsUnlocked', true);
        Vue.set(state, 'freeSlots', state.freeSlots + 1);
    },
    set_newMemeProfile(state, profile) {
        Vue.set(state.profiles, profile.id, profile);
    },
    set_memeKeybind(state, value) {
        const activeProfile = state.currentActiveProfile;
        const memeId = state.memeSelected;

        Vue.set(state.profiles[activeProfile].memes[memeId], 'keybind', value);
    },
    set_profileKeybind(state, value) {
        Vue.set(state.profiles[state.currentActiveProfile], 'keybind', value);
    },
    set_memeName(state, value) {
        const activeProfile = state.currentActiveProfile;
        const memeId = state.memeSelected;

        Vue.set(state.profiles[activeProfile].memes[memeId], 'name', value);
    },
    set_profileName(state, value) {
        const activeProfile = state.currentActiveProfile;

        Vue.set(state.profiles[activeProfile], 'name', value);
    },
    set_memeIcon(state, value) {
        const activeProfile = state.currentActiveProfile;
        const memeId = state.memeSelected;

        Vue.set(state.profiles[activeProfile].memes[memeId], 'icon', value);
    },
    set_memeToggleProperty(state, { toggle, value }) {
        const activeProfile = state.currentActiveProfile;
        const memeId = state.memeSelected;

        Vue.set(state.profiles[activeProfile].memes[memeId], toggle, value);
    },
    set_memeVolumeChange(state, value) {
        const activeProfile = state.currentActiveProfile;
        const memeId = state.memeSelected;

        Vue.set(state.profiles[activeProfile].memes[memeId], 'volume', value);
    },
    set_memeReproductionModes(state, modes) {
        Vue.set(state, 'reproductionModes', modes);
    },
    set_disabledToggle(state, { toggle, value }) {
        Vue.set(state.memeToggleStates[toggle], 'disabled', value);
    },
    set_memeToggleState(state, { toggle, value }) {
        Vue.set(state.memeToggleStates[toggle], 'checked', value);
    },
    set_reproductionMode(state, value) {
        const activeProfile = state.currentActiveProfile;
        const memeId = state.memeSelected;

        if (!memeId) {
            return;
        }

        Vue.set(state.profiles[activeProfile].memes[memeId], 'reproductionMode', value);
    },
    set_deleteMeme(state) {
        const activeProfile = state.currentActiveProfile;
        const memeId = state.memeSelected;

        Vue.delete(state.profiles[activeProfile].memes, memeId);
    },

    set_deleteMemeByProfile(state, data) {
        Vue.delete(state.profiles[data.profile].memes, data.meme);
    },
    set_duplicatedMeme(state, { profile, memes }) {
        try {
            if(!memes[profile]) return;
            memes[profile].forEach(meme => {
                Vue.set(state.profiles[profile].memes, meme.id, meme);
            });
        }
        catch (e) {
            new Error(`Error in Memes store: set_duplicatedMeme: ${e}`)
        }
    },
    set_deleteProfile(state, profile) {
        Vue.delete(state.profiles, profile);
    },
    set_unlockedMemes(state, memeId) {
        const activeProfile = state.currentActiveProfile;

        Vue.set(state.profiles[activeProfile].memes[memeId], 'isFree', true);
    },
    set_memeShortcutActive(state, value) {
        state.memeShortcutActive = value;
    },
    set_multiSelectActive(state, value) {
        state.multiSelectActive = value;
    },
    set_multiSelectId(state, id) {
        if (state.multiSelectedIds.includes(id)) {
            Vue.set(state, 'multiSelectedIds', state.multiSelectedIds.filter(_ => _ !== id));
            return;
        }

        state.multiSelectedIds.push(parseInt(id));
    },
    set_multiSelectIdClean(state) {
        Vue.set(state, 'multiSelectedIds', []);
        state.multiSelectActive = false;
    },
    set_updatedProfile(state, profile) {
        Vue.set(state.profiles, profile.id, profile);
    },
    set_loadingProfiles(state, value) {
        state.loadingProfiles = value
    },
    set_resetNewTagMemeProfile(state, id) {
        Vue.set(state.profiles[id], 'new', false);
    },
    set_profileDropdownOpen(state) {
        state.dropdownOpen = true;
    },
    set_mySoundBoardPublicId(state, id) {
        Vue.set(state, 'mySoundboardPublicId', id)
    },
    set_changeMemeProfileByUUID(state, uuid) {
        const profile = Object.values(state.profiles).find(profile => profile.publicId === uuid);
        state.currentActiveProfile = profile ? profile.id : state.currentActiveProfile;
    },
    set_listViewStatus(state, value) {
        state.showListView = value;
    },
    set_sortBy(state, sortBy) {
        state.sortBy = sortBy;
    },
    set_sortDesc(state, bool) {
        state.sortDesc = bool;
    },

    set_contextMenuInMeme(state, value) {
        state.contextMenuInMeme = value;
    }
}
