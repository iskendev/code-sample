export enum AutopaymentState {
    Busy = 0,
    Active = 1,
    Paused = 2,
    Deleted = 3
}

export enum AutopaymentPeriod {
    Monthly = 1,
    Weekly = 2,
    Custom = 3
}

export enum AutopaymentResult {
    Success = 1,
    Error = 2
}

export enum PaymentState {
    Default = 0,
    InProcess = 1,
    Success = 3,
    Error = 4,
    Cancelled = 5,
    Pending = 6
}