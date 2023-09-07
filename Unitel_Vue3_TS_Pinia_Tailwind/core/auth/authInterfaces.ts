import type { ConfirmDeviceResponse } from "@/core/device/deviceInterface";

// Sign In
export interface SignInPayload {
    password: string;
    login: string;
    deviceInfo: DeviceInfo;
}

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
}

// Identify User
export interface identifyUserPayload {
    login: string;
    deviceInfo: DeviceInfo
}

export interface IdentifyUserResponse {
    userPhoneNumber?: string;
    codeSent: boolean;
    deviceId: string;
    deviceStatus: number;
    language: string;
    reaction: number;
    status: number;
    userId: string;
    userType: number;
}

// Register
export interface RegisterPasswords {
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterPayload extends RegisterPasswords {
    userId: string;
    deviceInfo: DeviceInfo,
    login: string;
    email?: string;
}

// Reset Password
export interface ResetPasswords extends RegisterPasswords {}
export interface ResetPasswordPayload extends ResetPasswords, identifyUserPayload {}
export interface ResetPasswordResponse extends ConfirmDeviceResponse {}

//Confirm Device
export interface DeviceInfo {
    key: string;
    name: string;
    type: number | undefined;
    osVersion: string;
    appVersion: string;
}

export interface Device {
    id: string;
    name?: string;
    osVersion?: string;
    appVersion?: string;
    type: number;
    isCurrent: boolean;
    loginDate?: string;
    language?: string;
}