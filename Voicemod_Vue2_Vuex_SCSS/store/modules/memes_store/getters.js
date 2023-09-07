import { by } from './utils.js';

export const getters = {

    get_memeProfiles(state) {
        const profiles = Object.values(state.profiles);

        by.mySoundBoardProfile = (profile) => profile.publicId === state.mySoundBoardPublicId;
        by.notMySoundBoardProfile = (profile) => profile.publicId !== state.mySoundBoardPublicId;

        return [
            ...profiles.filter(by.mySoundBoardProfile),
            ...profiles.filter(by.customProfiles).filter(by.notMySoundBoardProfile),
            ...profiles.filter(by.freeProfiles),
            ...profiles.filter(by.proProfile).sort(by.alphabeticProfileName)
        ];
    },

    get_memeProfilesNew(state) {
        return Object.values(state.profiles).some(_ => _.new === true) && !state.dropdownOpen;
    },

    get_memeProfilesHasChanges(state) {
        return Object.values(state.profiles).some(_ => _.hasChanges === true);
    },

    // eslint-disable-next-line no-unused-vars
    get_activeProfileMemes: (state, getters) => (id) => {
        const profile = getters.get_activeProfile(id) || {};
        const profileMemes = profile.memes || {};
        return Object.values(profileMemes);
    },

    // eslint-disable-next-line no-unused-vars
    get_activeProfile: (state, getters) => (id) => {
        const profiles = getters.get_memeProfiles || [];

        return profiles ? profiles.find(_ => _.id === id) : {};
    },

    get_memeSelected: (state, getters) => {
        const profiles = getters.get_memeProfiles || [];
        let meme = {}

        profiles.forEach(profile => {
            const selectedMeme = Object.values(profile.memes).find(_ => _.id === state.memeSelected);
            if (selectedMeme) {
                meme = selectedMeme;
            }
        });
        return meme;
    },

    // eslint-disable-next-line no-unused-vars
    get_activeProfileCoreMemes: (state, getters) => (id) => {
        let memes = getters.get_activeProfileMemes(id);

        const currentProfile = getters.get_activeProfile(state.currentActiveProfile);

        if (currentProfile?.updating) {
            return [];
        }

        return memes.filter(_ => _.isCore === true);
    },

    // eslint-disable-next-line no-unused-vars
    get_activeProfileCustomMemes: (state, getters) => {
        let memes = getters.get_activeProfileMemes(state.currentActiveProfile);
        const currentProfile = getters.get_activeProfile(state.currentActiveProfile);

        if (currentProfile?.updating) {
            return [];
        }

        return memes.filter(_ => _.isCore === false);
    },

    // eslint-disable-next-line no-unused-vars
    get_activeProfileLockedMemes: (state, getters) => (id, isFreeProfile) => {
        let memes = getters.get_activeProfileMemes(id);

        const currentProfile = getters.get_activeProfile(state.currentActiveProfile);

        if (currentProfile.updating) {
            return currentProfile.memes;
        }

        return isFreeProfile && !state.currentActiveProfile.createdByUser
            ? memes.filter(_ => _.isFree === false && _.isCore === false)
            : memes.filter(_ => _.isFree === false);
    },

    get_profileNames: (state) => {
        return Object.values(state.profiles).map(profile => profile.name) || [];
    },

    get_profilesCreatedByUser(state) {
        return Object.values(state.profiles).filter(_ => _.createdByUser === true);
    },

    get_freeProfileNames: (state, getters) => {
        return getters.get_profilesCreatedByUser.map(({ name, id })=> {
            return {
                name,
                id,
            }
        }) || [];
    },

    get_allMemes:(state) => {
        const profiles = Object.values(state.profiles);
        let memes = [];

        profiles.forEach(profile => {
            memes = [...memes, ...Object.values(profile.memes)]
        });

        return memes.reduce((obj, cur) => {
            obj[cur.id] = cur;
            return obj;
        }, {});
    },

    get_multiSelectedMemes: (state, getters) => {
        return state.multiSelectedIds.map(multiSelectedId => getters.get_allMemes[multiSelectedId]);
    },

    get_searchMemes: (state, getters) => (input) => {
        const profiles = getters.get_memeProfiles || [];
        let results = [];
            profiles.forEach(profile => {
                const foundProfiles = Object.values(profile.memes)
                    .filter(meme => meme.name.toLowerCase()
                        .includes(input.toLowerCase())
                    )
                if(foundProfiles.length) {
                    results.push({'profile': profile, 'memes': foundProfiles});
                }
            });
        return results;
    },

    get_memeFreeSlots(state, getters, rootState) {
        const isShared = state.shareRewardsUnlocked;
        const isUserPro = rootState.settings_license.isPro;

        return isShared || isUserPro
            ? state.freeSlots
            : state.maxMemesForFreeUsers || 0;
    },

    get_hasRemainingFreeSlotsByProfileId: (state, getters) => (profileId) => {
        if (getters.get_activeProfile(profileId).updating) {
            return false;
        }

        const profileMemes = getters.get_activeProfileMemes(profileId);

        return getters.get_memeFreeSlots > profileMemes.filter(meme => !meme.isCore).length;
    }
}
