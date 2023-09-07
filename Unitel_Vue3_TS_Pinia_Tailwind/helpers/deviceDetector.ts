import DeviceDetector from "device-detector-js";
const deviceDetector = new DeviceDetector();
const userAgent = navigator?.userAgent;
const deviceInfo = deviceDetector.parse(userAgent);

const { os, client, device } = deviceInfo;

const setDeviceType = ():number | undefined => {
    let type
    if (device?.type === "smartphone") {
        if (os?.name === "Android") {
            type = 1
        }

        if (os?.name === "iOS") {
            type = 2
        }
    }

    if (device?.type === "desktop") {
        type = 3
    }

    if (device?.type !== "desktop" && device?.type !== "smartphone") {
        type = 0
    }

    return type
}

const key = `${os?.name}_${os?.version}__${client?.name}_${client?.version}`.toUpperCase();
const name = `${client?.name} ${client?.version}`;
const type = setDeviceType();
const osVersion = `${os?.name} ${os?.version}`;

export default { key, name, type, osVersion };