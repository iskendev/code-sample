import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import type {
    Transaction,
    TransactionsPayload,
    TransactionsResponse,
    TransformedTransactionsResponse,
    GetTransactionsResponse,
    FavoriteTransaction
} from "@/core/transactions/transactionsInterface";
import type { CreatePaymentPayload } from "@/core/payment/paymentInterface";
import { useCatStatus } from "@/composable/catModal";
import { useHomesStore } from "@/stores/homes";
import { useMerchantStore } from "@/stores/merchants";
import { useCardsStore } from "@/stores/cards";
import { usePaymentStore } from "@/stores/payment";
import { useTransfersStore } from "@/stores/transfers";
import { default as dayjs } from "dayjs";
import  customParseFormat  from "dayjs/plugin/customParseFormat";
import api from "@/helpers/apiHandler";

export const useTransactionsStore = defineStore("transactions", () => {

    // composable
    const catModal = useCatStatus();

    // state
    const payments = ref<null | TransformedTransactionsResponse>(null);
    const transactionsList = ref<null | GetTransactionsResponse>(null);
    const favoriteTransactions = ref<null | FavoriteTransaction[]>(null);
    const isFavoriteService = ref(false);

    // getters
    const transactions = computed(() => payments.value?.transactions || []);

    // actions
    async function getTransactions(payload:TransactionsPayload):Promise<void> {
        try {
            const { data }: { data: GetTransactionsResponse } = await api.post("transactions-api/transactions", payload);
            transactionsList.value = data;
        } catch (error: any) {
            catModal.handleError(error)
        }
    }

    async function getTransaction(id:string):Promise<boolean> {
        try {
            const response = await api.get(`transactions-api/transactions/${id}`);
            const payment = await api.get(`payments-api/payments/${response.data.refId}/repeat`);

            const merchantStore = useMerchantStore();
            const merchant = await merchantStore.getMerchant(payment.data.merchantId);

            if (merchant) {
                merchantStore.merchant?.controls?.forEach((control) => {
                    const input = payment.data.details.find((detail: any) => {
                        if (detail.name === control.name && detail.label === control.label) {
                            return detail
                        }
                    });

                    control.inputValue = input.value;

                    if (control.type === 2) {
                        control.phoneValue = input.value;
                    }

                    if (control.useReference && control.referenceItems.length) {
                        control.preSelectedItem = control.referenceItems.findIndex((item: any) => {
                            if (input.value === item.value) return item;
                        });
                    }
                })
            }
            const cardStore = useCardsStore();
            cardStore.cardId = payment.data.cardId;

            const paymentStore = usePaymentStore();
            paymentStore.isRepeatingPayment = true;

            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw(error);
        }
    }

    async function getFavoriteTransactions():Promise<void> {
        try {
            const { data }: { data: FavoriteTransaction[] } = await api.get("transactions-api/favorite");
            favoriteTransactions.value = data;
        } catch (error: any) {
            catModal.handleError(error)
        }
    }

    async function getCardTransactions(payload:TransactionsPayload):Promise<void> {
        try {
            const { data }: { data: TransactionsResponse } = await api.post(`transactions-api/transactions`, payload);

            const transactions:Record<string, Array<Transaction>> = {};

            data.transactions.forEach(element => {
                dayjs.extend(customParseFormat);
                element.paymentTime = dayjs(element.paymentTime).format("DD.MM.YYYY").toString();

                if (!transactions[element.paymentTime]) {
                    transactions[element.paymentTime] = [element];
                    return;
                }

                if (transactions[element.paymentTime]) {
                    transactions[element.paymentTime] = [...transactions[element.paymentTime], element];
                }
            });

            payments.value = { ...data, transactions };
        } catch (error: any) {
            catModal.handleError(error)
        }
    }

    async function addServiceToFavorites(payload: CreatePaymentPayload):Promise<boolean> {
        try {
            await api.post("transactions-api/favorite", payload);
            const homesStore = useHomesStore();
            await homesStore.getHomes();
            await homesStore.getHome();
            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw(error);
        }
    }

    async function getFavoriteService(id: string):Promise<boolean> {
        try {
            const favorite = await api.get(`transactions-api/favorite/${id}`);

            const TRANSFER = 2;
            if (favorite.data.transactionType === TRANSFER) {
                const transferStore = useTransfersStore();
                transferStore.isFavoriteTransferProceeding = true;
                transferStore.form.cardNumber = favorite.data.clientId;
                transferStore.form.sum = favorite.data.amount;
                return true;
            }

            const merchantStore = useMerchantStore();
            const response = await merchantStore.getMerchant(favorite.data.merchantId);

            if (response) {
                merchantStore.merchant?.controls?.forEach((control) => {
                    const input = favorite.data.details.find((detail: any) => {
                        if (detail.name === control.name && detail.label === control.label) {
                            return detail
                        }
                    });

                    control.inputValue = input.value;

                    if (control.type === 2) {
                        control.phoneValue = input.value;
                    }

                    if (control.useReference && control.referenceItems.length) {
                        control.preSelectedItem = control.referenceItems.findIndex((item: any) => {
                            if (input.value === item.value) return item;
                        });
                    }
                })
            }
            isFavoriteService.value = true;
            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw(error);
        }
    }

    async function deleteFavoriteTransaction(id: string):Promise<boolean> {
        try {
            await api.delete(`transactions-api/favorite/${id}`);
            await getFavoriteTransactions();
            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw(error);
        }
    }

    async function deleteTransaction(id: string):Promise<boolean> {
        try {
            await api.delete(`transactions-api/favorite/${id}`);
            const homesStore = useHomesStore();
            await homesStore.getHome(homesStore.home?.id);
            return true;
        } catch (error: any) {
            catModal.handleError(error);
            throw(error);
        }
    }

    return {
        payments,
        transactions,
        isFavoriteService,
        deleteTransaction,
        getFavoriteService,
        getCardTransactions,
        addServiceToFavorites,
        getTransactions,
        getFavoriteTransactions,
        favoriteTransactions,
        transactionsList,
        deleteFavoriteTransaction,
        getTransaction
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTransactionsStore, import.meta.hot))
}