import { USER, DEVICE } from "@/core/auth/authEnums";
import type { IdentifyUserResponse } from "@/core/auth/authInterfaces";
import Cookies from "js-cookie";
import api from "@/helpers/apiHandler";

export function USER_ACTIVE__DEVICE_ACTIVE({ status, deviceStatus }: IdentifyUserResponse):boolean {
    const isUserActive = status === USER.ACTIVE || status === USER.ACTIVE_WITHOUT_CARD;
    const isDeviceActive = deviceStatus === DEVICE.ACTIVE || deviceStatus === DEVICE.LOGOUT

    if (isUserActive && isDeviceActive) {
        return true
    }

    return false
}

export function USER_ACTIVE__DEVICE_NEW({ status, deviceStatus }: IdentifyUserResponse):boolean {
    const isUserActive = status === USER.ACTIVE || status === USER.ACTIVE_WITHOUT_CARD;
    const isDeviceNew = deviceStatus === DEVICE.NEW

    if (isUserActive && isDeviceNew) {
        return true
    }

    return false
}

export function USER_NEW({ status }: IdentifyUserResponse):boolean {
    return status === USER.NEW;
}

export function setTokens(accessToken :string, refreshToken: string) {
    Cookies.set("BEEPUL_ACCESS_TOKEN", accessToken);
    Cookies.set("BEEPUL_REFRESH_TOKEN", refreshToken);

    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}