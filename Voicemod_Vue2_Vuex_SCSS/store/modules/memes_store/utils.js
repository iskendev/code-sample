const axn_memesStore = {
    axn_changeMemeProfile: 'memes_store/axn_changeMemeProfile',
    axn_muteForMeToggle: 'memes_store/axn_muteForMeToggle',
    axn_keyBindsToggle: 'memes_store/axn_keyBindsToggle',
    axn_compactViewMode: 'memes_store/axn_compactViewMode',
    axn_playMeme: 'memes_store/axn_playMeme',
    axn_stopMeme: 'memes_store/axn_stopMeme',
    axn_memeSelected: 'memes_store/axn_memeSelected',
    axn_newMemeProfile: 'memes_store/axn_newMemeProfile',
    axn_memeKeybind: 'memes_store/axn_memeKeybind',
    axn_profileKeybind: 'memes_store/axn_profileKeybind',
    axn_memeToggleProperty: 'memes_store/axn_memeToggleProperty',
    axn_memeVolumeChange: 'memes_store/axn_memeVolumeChange',
    axn_disabledToggle: 'memes_store/axn_disabledToggle',
    axn_memeToggleState: 'memes_store/axn_memeToggleState',
    axn_reproductionMode: 'memes_store/axn_reproductionMode',
    axn_memeName: 'memes_store/axn_memeName',
    axn_profileName: 'memes_store/axn_profileName',
    axn_memeShortcutActive: 'memes_store/axn_memeShortcutActive',
    axn_multiSelectId: 'memes_store/axn_multiSelectId',
    axn_multiSelectActive: 'memes_store/axn_multiSelectActive',
    axn_createMemeProfile: 'memes_store/axn_createMemeProfile',
    axn_duplicateMeme: 'memes_store/axn_duplicateMeme',
    axn_duplicateMemes: 'memes_store/axn_duplicateMemes',
    axn_resetNewTagMemeProfile: 'memes_store/axn_resetNewTagMemeProfile',
    axn_profileDropdownOpen: 'memes_store/axn_profileDropdownOpen',
    axn_setListView: 'memes_store/axn_setListView',
    axn_sortBy: 'memes_store/axn_sortBy',
    axn_sortDesc: 'memes_store/axn_sortDesc',
    axn_contextMenuInMeme: 'memes_store/axn_contextMenuInMeme'
}

const get_memeStore = {
    get_activeProfile: 'memes_store/get_activeProfile',
    get_memeProfiles: 'memes_store/get_memeProfiles',
    get_memeSelected: 'memes_store/get_memeSelected',
    get_activeProfileMemes: 'memes_store/get_activeProfileMemes',
    get_activeProfileCoreMemes: 'memes_store/get_activeProfileCoreMemes',
    get_activeProfileCustomMemes: 'memes_store/get_activeProfileCustomMemes',
    get_activeProfileLockedMemes: 'memes_store/get_activeProfileLockedMemes',
    get_profilesCreatedByUser: 'memes_store/get_profilesCreatedByUser',
    get_profileNames: 'memes_store/get_profileNames',
    get_freeProfileNames: 'memes_store/get_freeProfileNames',
    get_multiSelectedMemes: 'memes_store/get_multiSelectedMemes',
    get_memeProfilesNew: 'memes_store/get_memeProfilesNew',
    get_allMemes: 'memes_store/get_allMemes',
    get_searchMemes: 'memes_store/get_searchMemes',
    get_memeFreeSlots: 'memes_store/get_memeFreeSlots',
    get_hasRemainingFreeSlotsByProfileId: 'memes_store/get_hasRemainingFreeSlotsByProfileId',
}

const by = {
    customProfiles: (profile) => profile.createdByUser,
    freeProfiles: (profile) => !profile.locked && !profile.createdByUser,
    proProfile: (profile) => profile.locked,
    alphabeticProfileName: (a, b) => { if (a.name < b.name) return -1; if (a.name > b.name) return 1; return 0},
    profileMemes: (profile => profile.memes)
}

function timeToMs(time) {
    if (!time) {
        return;
    }

    const timeString = time.split(':');
    const hours = parseInt(timeString[0]);
    const minutes = parseInt(timeString[1]);
    const seconds = parseFloat(timeString[2]);
    const hourToMs = 3600000;
    const minuteToMs = 60000;
    const secondToMs = 1000;

    return this.memeTime = (hours * hourToMs) + (minutes * minuteToMs) + (seconds * secondToMs);
}

module.exports = {
    by,
    timeToMs,
    get_memeStore,
    axn_memesStore
}
