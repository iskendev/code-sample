import { defineStore, acceptHMRUpdate } from "pinia";
import { storeToRefs } from "pinia";
import type {
    OtpResponse,
    ConfirmOtpResponse,
    ConfirmOtpPayload,
    getOtpPayload,
    getOtpResponse,
} from "@/core/otp/otpInterfaces";
import type { PaymentResponse } from "@/core/payment/paymentInterface";
import { useAuthStore } from "@/stores/auth";
import { useCatStatus } from "@/composable/catModal";
import { useCardsStore } from "@/stores/cards";
import { usePaymentStore } from "./payment";
import { useTransactionsStore } from "./transactions";
import api from "@/helpers/apiHandler";

export const useOtpStore = defineStore("otp", () => {

    // composable
    const catModal = useCatStatus();

    // actions
    async function verifyCard(otp:string) {
        try {
            const cardsStore = useCardsStore();
            const { cardId } = cardsStore;

            const { data }: { data: OtpResponse } = await api.put(`cards-api/cards/${cardId}/verify`, { otp });

            cardsStore.getCardsWithBalanceUpdates();

            return data.isSuccess;

        } catch (error: any) {
            catModal.handleError(error)
        }
    }

    async function sendOtpForCard():Promise<boolean | undefined> {
        try {
            const cardsStore = useCardsStore();
            const { cardId } = cardsStore;

            if (cardId) {
                const { data }: { data: OtpResponse } = await api.get(`cards-api/cards/${cardId}/sendotp`);
                return data.isSuccess;
            }
        } catch (error: any) {
            catModal.handleError(error)
        }
    }

    async function sendOtpForPayment():Promise<boolean | undefined> {
        try {
            const paymentStore = usePaymentStore();
            const { receiptId } = storeToRefs(paymentStore);

            if (receiptId.value) {
                const { data }: { data: OtpResponse } = await api.get(`payments-api/payments/${receiptId.value}/sendotp`);
                return data.isSuccess;
            }
        } catch (error: any) {
            catModal.handleError(error)
        }
    }

    async function verifyOtpForPayment(otp: string):Promise<boolean | undefined> {
        try {
            const paymentStore = usePaymentStore();
            const { receiptId } = storeToRefs(paymentStore);

            const transactionsStore = useTransactionsStore();

            if (receiptId.value) {
                const { data }: { data: PaymentResponse } = await api.put(`payments-api/payments/${receiptId.value}/verify`, { otp });
                paymentStore.paidReceipt = data;
                if (transactionsStore.isFavoriteService) transactionsStore.isFavoriteService = false;
                return true;
            }
        } catch (error: any) {
            catModal.handleError(error);
            throw(error);
        }
    }

    async function confirmOtpCode(otpCode:string):Promise<ConfirmOtpResponse | undefined> {
        try {
            const auth  = useAuthStore();

            if (auth.userIdentificationInfo) {
                const { userId, deviceId } = auth.userIdentificationInfo;
                const payload: ConfirmOtpPayload  = { userId, deviceId, otpCode };

                const { data }: { data: ConfirmOtpResponse } = await api.put("users-api/otp/confirm", payload);

                return data;
            }
        } catch (error: any) {
            catModal.handleError(error);
        }
    }

    async function requestNewOtp():Promise<boolean | undefined> {
        try {
            const auth  = useAuthStore();

            if (auth.userIdentificationInfo) {
                const { userId, deviceId } = auth.userIdentificationInfo;
                const payload: getOtpPayload = { userId, deviceId, login: auth.userPhoneNumberFull };

                const { data }: { data: getOtpResponse } = await api.post("users-api/otp/get", payload);
                return data.isSuccess;
            }
        } catch (error: any) {
            catModal.handleError(error);
        }
    }

    return {
        sendOtpForCard,
        verifyCard,
        confirmOtpCode,
        requestNewOtp,
        sendOtpForPayment,
        verifyOtpForPayment
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOtpStore, import.meta.hot))
}