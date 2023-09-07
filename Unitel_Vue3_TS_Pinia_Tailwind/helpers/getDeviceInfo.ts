import deviceDetector from "@/helpers/deviceDetector";
import type { DeviceInfo } from "@/core/auth/authInterfaces";

export default function getDeviceInfo(number:string | undefined): DeviceInfo {
    const { key, name, type, osVersion } = deviceDetector;
    return {
        key: `${number}__${key}`,
        name,
        type,
        osVersion,
        appVersion: import.meta.env.VITE_APP_VERSION,
    }
}