export const memeToggles = ['loop', 'muteOtherSounds', 'muteVoice', 'stopOtherSounds'];

export const memeReproductionModeStates = {
    PlayLoopOnPress: {
        loop: {
            check: true,
            disabled: true
        }
    },
    PlayOverlap: {
        loop: {
            check: false,
            disabled: true
        },
        muteOtherSounds: {
            check: false,
            disabled: true
        },
        stopOtherSounds: {
            check: false,
            disabled: true
        }
    },
    PlayRestart: {
        loop: {
            check: false,
            disabled: true
        },
    },
    PlayPause: {
        stopOtherSounds: {
            check: false,
            disabled: true
        },
    },
};

export const enumReproductionModes = {
    0: 'PlayRestart',
    1: 'PlayPause',
    2: 'PlayStop',
    3: 'PlayOverlap',
    4: 'PlayLoopOnPress'
};
