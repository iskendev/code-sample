import { actions } from './actions';
import { mutations } from './mutations'
import { getters } from './getters'
import { cloneDeep } from 'lodash';

const defaultState = {
    // C# Original
    Version: "",
    currentActiveProfile: 1,
    displayMode: 1,
    enableShortcuts: true,
    freeMemes: [],
    freeSlots: 4,
    maxMemesForFreeUsers: 4,
    muteForMe: false,
    nAudioRequirementsMet: false,
    nextMemeId: 0,
    nextProfileId: 0,
    profiles: {},
    shareRewardsUnlocked: false,
    showShortcuts: false,

    // Non C#
    memeSelected: 0,
    memesPlaying: [],
    isCompactMode: false,
    reproductionModes: {},
    memeToggleStates: {
        loop: {
            checked: null,
            disabled: false
        },
        muteOtherSounds: {
            checked: null,
            disabled: false
        },
        muteVoice: {
            checked: null,
            disabled: false
        },
        stopOtherSounds: {
            checked: null,
            disabled: false
        }
    },
    memeShortcutActive: false,
    multiSelectActive: false,
    multiSelectedIds: [],
    loadingProfiles: false,
    dropdownOpen: false,
    mySoundboardPublicId: null,
    showListView: false,
    sortBy: '',
    sortDesc: false,
    educationalVideoState: false,
    contextMenuInMeme: 0,
}

export const memes_store = {
    namespaced: true,
    state: cloneDeep(defaultState),
    getters,
    mutations,
    actions
}
