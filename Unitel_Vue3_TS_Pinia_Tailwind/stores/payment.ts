import { ref } from "vue";
import type { Ref } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useCatStatus } from "@/composable/catModal";
import { useCardsStore } from "@/stores/cards";
import { useTransactionsStore } from "./transactions";
import type {
    PrePaymentData,
    CreatePaymentPayload,
    PaymentResponse
} from "@/core/payment/paymentInterface";
import api from "@/helpers/apiHandler";

export const usePaymentStore = defineStore("payment", () => {
    // composable
    const catModal = useCatStatus();
    const cardStore = useCardsStore();
    const mode = ref<string | null>("light");

    // state
    const prePaymentData: Ref<null | PrePaymentData> = ref(null);
    const paidReceipt: Ref<null | PaymentResponse> = ref(null);
    const receiptId: Ref<null | string> = ref(null);
    const isRepeatingPayment = ref(false);
    const transactionType = ref(1); // 1 - payment, 2 - p2p
    const refId: Ref<string> = ref("");

    // actions
    async function createPayment(payload: CreatePaymentPayload): Promise<boolean> {
        try {
            const { data }: { data: PrePaymentData } = await api.post(
                "payments-api/payments/create",
                payload
            );
            prePaymentData.value = data;
            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw error;
        }
    }

    async function proceedPayment(): Promise<string | undefined> {
        try {
            if (prePaymentData.value) {
                const id = prePaymentData.value.id;
                const card = cardStore.cards?.find((card) => card.is_selected);

                const { data }: { data: PaymentResponse } = await api.put(
                    `payments-api/payments/${id}/process`,
                    { cardId: card?.id }
                );

                if (data.needVerify && data.state === 0) {
                    receiptId.value = data.id;
                    return "otp";
                }

                paidReceipt.value = data;
                cardStore.getCardsWithBalanceUpdates();

                const transactionsStore = useTransactionsStore();
                if (transactionsStore.isFavoriteService)
                    transactionsStore.isFavoriteService = false;

                return "receipt";
            }
        } catch (error: any) {
            catModal.handleError(error);
        }
    }

    async function getReceipt(): Promise<void> {
        try {
            const PAYMENT_TYPE = 1;
            const { data } = await api.get(
                `transactions-api/transactions/receipt/${PAYMENT_TYPE}/${paidReceipt.value?.id}`
            );
            window.open(data.pdfLink, "_blank");
        } catch (error: any) {
            catModal.handleError(error);
        }
    }

    async function addPaymentToFavs(name: string): Promise<boolean> {
        try {
            await api.post("transactions-api/transactions/favorite/refid", {
                refid: paidReceipt.value?.id || refId.value,
                transactionType: transactionType.value,
                name
            });
            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw error;
        }
    }

    async function repeatPayment(): Promise<boolean> {
        try {
            const { data } = await api.get(`payments-api/payments/${paidReceipt.value?.id}/repeat`);
            const cardStore = useCardsStore();
            if (cardStore.cards) {
                const selected = cardStore.cards.find((card) => card.id === data.cardId);
                cardStore.cardId = selected!.id;
            }
            isRepeatingPayment.value = true;
            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw error;
        }
    }

    return {
        prePaymentData,
        createPayment,
        getReceipt,
        proceedPayment,
        receiptId,
        paidReceipt,
        addPaymentToFavs,
        repeatPayment,
        isRepeatingPayment,
        transactionType,
        refId,
        mode
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot));
}
