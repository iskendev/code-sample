export enum USER {
    NOT_EXIST = 0,
    NEW = 1,
    BLOCKED = 2,
    ACTIVE = 3,
    ACTIVE_WITHOUT_CARD = 4,
    DELETED = 5,
    BLACKLISTED = 6,
    SUSPENDED = 7,
    TEMPORARILY_BLOCKED = 8,
}

export enum DEVICE {
    NOT_EXIST = 0,
    NEW = 1,
    ACTIVE = 2,
    BLOCKED = 3,
    LOGOUT = 4,
    TEMPORARILY_BLOCKED = 5,
}

export enum OTP {
    NOT_VERIFIED = 0,
    VERIFIED = 1,
    EXPIRED = 2,
    BLOCKED = 3,
}