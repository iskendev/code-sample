export interface AutopaymentDetails {
    name: string | undefined;
    value: string;
}

export interface AutopaymentPayload {
    name?: string | undefined;
    merchantId?: number | undefined;
    gatewayMerchantId?: number | undefined;
    cardId: string | undefined;
    scheduleType: number | undefined;
    dayOfMonth?: number;
    dayOfWeek?: number;
    payTime?: string;
    startDate?: string;
    interval?: number;
    groupSign?: number;
    isPaused?: boolean;
    details?: AutopaymentDetails[];
}

export interface AutopaymentResponse {
    id: string;
    name: string;
    merchantName: string;
    logoUrl: string;
    clientId: string;
    amount: number;
    scheduleType: number;
    state: number;
    createTime: string;
    lastPayTime: string;
    lastResult: number;
    nextPayTime: string;
    isSystem: boolean;
}

export interface SingleAutopaymentResponse {
    id: string;
    name?: string | undefined;
    merchantName: string;
    merchantId: number;
    gatewayMerchantId: number | undefined;
    logoUrl: string;
    clientId: string;
    amount: number;
    scheduleType: number;
    dayOfMonth?: number;
    dayOfWeek?: number;
    payTime?: string;
    startDate?: string;
    interval?: number;
    state: number;
    createTime: string;
    lastPayTime: string;
    lastResult: number;
    nextPayTime: string;
    isSystem: boolean;
    details?: AutopaymentDetails[];
}