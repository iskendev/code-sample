<template>
    <div class="mb-10">
        <template v-if="noError">
            <div class="flex justify-between mb-5 ml-[15px]">
                <span class="font-exo-semi-italic text-[#818081] uppercase dark:text-[#b3b3b3]">{{ merchantTitle }}</span>
                <div
                    v-if="!few"
                    class="flex items-center cursor-pointer group"
                    @click="showAll = !showAll"
                >
                    <span class="group-hover:text-[#EDBB1E] text-lg dark:text-[#b3b3b3]">
                        {{ showAll ? $t("Buttons.HideAll") : $t("Buttons.ShowAll") }}
                    </span>
                    <base-icon :name="showAll ? 'arrowUp' : 'arrowDown'"
                               class="translate-y-[1px] ml-[11px] group-hover:[&>path]:fill-[#EDBB1E] dark:text-[#b3b3b3] dark:[&>path]:fill-[#b3b3b3]"/>
                </div>
            </div>
            <div :class="[
                    'overflow-hidden border-l border-l-[#CBCBCB] dark:border-l-[#323232] grid grid-cols-4 transition-max-h',
                    showAll ? 'max-h-[20000px]' : 'max-h-[162px]',
                    { 'border-t border-t-[#CBCBCB]' : !few }
                ]"
            >
                <div
                    v-for="(merchant, i) in merchantStore.filteredMerchants"
                    :key="i"
                    @click="getMerchantInfo(merchant.id, merchant.isParent)"
                    class="border-r border-b border-r-[#CBCBCB] border-b-[#CBCBCB] dark:border-r-[#323232] dark:border-b-[#323232] cursor-pointer dark:bg-white"
                    :class="{ 'border-t border-t-[#CBCBCB] dark:border-t-[#323232]' : few }"
                >
                    <div class="h-[125px] w-full flex justify-center items-center">
                        <img
                            v-if="merchant.logoUrl"
                            :src="merchant.logoUrl"
                            class="w-full h-full object-center object-contain"
                        >
                        <img
                            v-else
                            src="../../assets/new-ones/images/merchant-placeholder.png"
                            class="w-full h-full object-center object-contain"
                        >
                    </div>
                    <div
                        class="flex items-center justify-center font-exo-medium text-lg text-[#090909] text-center h-[35px] max-h-[35px] min-h-[35px] bg-[#f5f4f4] dark:bg-[#323232] dark:text-[#b3b3b3]">
                        <span>{{ merchant.name }}</span>
                    </div>
                </div>
            </div>
        </template>
        <p v-if="(errorStatus === MerchantsError.NoMerchantsForCategory)" class="text-red-600">{{ text }}</p>
        <p v-if="(errorStatus === MerchantsError.MerchantNotFound)" class="text-red-600">{{ text }}</p>
    </div>
    <base-overlay :visible="showModal">
        <component
            :is="components[paymentModal]"
            @closePayModal="closeModal"
            @setStep="(value:string) => paymentModal = value"
        ></component>
    </base-overlay>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {storeToRefs} from "pinia";
import {useMerchantStore} from "@/stores/merchants";
import {useCatStatus} from "@/composable/catModal";
import {useCardsStore} from "@/stores/cards";
import {usePaymentStore} from "@/stores/payment";
import {MerchantsError} from "@/core/error/errorEnum";
import type {Component} from "vue";
import PaymentInputs from "@/components/payment/PaymentInputs.vue";
import PrePaymentInfo from "@/components/payment/PrePaymentInfo.vue";
import PaymentOtp from "@/components/payment/PaymentOtp.vue";
import PaymentReceipt from "@/components/payment/PaymentReceipt.vue";
import AddPaymentToFavorites from "@/components/payment/AddPaymentToFavorites.vue";
import SetAutopaymentPeriod from "@/components/autopayments/SetAutopaymentPeriod.vue";

// composable
const paymentStore = usePaymentStore();
const cardStore = useCardsStore();

const merchantStore = useMerchantStore();
const {merchantTitle} = storeToRefs(merchantStore);

const catModal = useCatStatus();
const {errorStatus, text} = catModal;

// created
merchantStore.getMerchants(1);
merchantStore.setMerchantTitle("Моб. связь");

// state
const showAll = ref(false);
const showModal = ref(false);
const paymentModal = ref("PaymentInputs");
const components: Component = {
    PaymentInputs,
    PrePaymentInfo,
    PaymentOtp,
    PaymentReceipt,
    AddPaymentToFavorites,
    SetAutopaymentPeriod
};

// computed
const few = computed(() => {
    return merchantStore.filteredMerchants.length <= 4;
})

const noError = computed(() => {
    return errorStatus.value !== MerchantsError.NoMerchantsForCategory &&
        errorStatus.value !== MerchantsError.MerchantNotFound
})

// methods
async function getMerchantInfo(id: number, isParent: boolean) {
    showModal.value = true;
    catModal.show();

    if (!isParent) {
        if (merchantStore.superMerchant) merchantStore.superMerchant = null;
        const response = await merchantStore.getMerchant(id);
        if (response) {
            catModal.hide();
        }
    } else {
        const response = await merchantStore.getSuperMerchant(id);
        if (response) {
            catModal.hide();
        }
    }
}

function closeModal() {
    if (cardStore.cardId) cardStore.cardId = null;
    if (paymentStore.isRepeatingPayment) paymentStore.isRepeatingPayment = false;
    if (merchantStore.merchant) merchantStore.merchant = null;
    if (merchantStore.superMerchant) merchantStore.superMerchant = null;
    paymentModal.value = "PaymentInputs";
    showModal.value = false;
}
</script>

<style>
.transition-max-h {
    transition: max-height .5s;
}
</style>