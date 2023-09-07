<template>
    <base-modal
        :class="catModal.visible.value ? 'overflow-hidden': 'overflow-visible !max-w-[70vw]'"
        :title="$t('Autopayments.CreateViewTitleScene2')"
        :is-footer-visible="false"
        :back="true"
        @onClickBack="$emit('setStep', 'PaymentInputs')"
        @onClickClose="$emit('closePayModal')"
    >
        <div class="flex mb-[30px] min-w-[780px] min-h-[330px]">
            <ul class="mr-[30px] dark:text-[#b3b3b3]">
                <li class="h-[48px] w-[320px] flex items-center justify-between border-b border-b-[#CBCBCB] border-t border-t-[#CBCBCB] font-exo-medium">
                    <span>{{ $t("Autopayments.MonthlyTypeFullName") }}</span>
                    <base-radio-button @click="selectedPeriod = 'monthly'" :selected="selectedPeriod === 'monthly'"/>
                </li>
                <li class="h-[48px] w-[320px] relative flex items-center justify-between font-exo-medium">
                    <span>{{ $t("Autopayments.WeeklyTypeFullName") }}</span>
                    <base-radio-button @click="selectedPeriod = 'weekly'" :selected="selectedPeriod === 'weekly'"/>
                </li>
                <li class="h-[48px] w-[320px] relative flex items-center justify-between border-b border-b-[#CBCBCB] border-t border-t-[#CBCBCB] font-exo-medium">
                    <span>{{ $t("Autopayments.CustomPeriodType") }}</span>
                    <base-radio-button @click="selectedPeriod = 'custom'" :selected="selectedPeriod === 'custom'"/>
                </li>
            </ul>
            <div>
                <monthly-payment v-if="selectedPeriod === 'monthly'" @setStep="$emit('setStep', 'PaymentInputs')"/>
                <weekly-payment v-if="selectedPeriod === 'weekly'" @setStep="$emit('setStep', 'PaymentInputs')"/>
                <custom-period-payment v-if="selectedPeriod === 'custom'" @setStep="$emit('setStep', 'PaymentInputs')"/>
            </div>
        </div>
    </base-modal>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useCatStatus} from "@/composable/catModal";
import {useAutoPaymentsStore} from "@/stores/autopayments";
import WeeklyPayment from "./WeeklyPayment.vue";
import MonthlyPayment from "./MonthlyPayment.vue";
import CustomPeriodPayment from "./CustomPeriodPayment.vue";

// composable
const catModal = useCatStatus();
const autoPaymentsStore = useAutoPaymentsStore();

// emits
defineEmits(["setStep", "closePayModal"]);

// state
const selectedPeriod = ref("");

// hooks
onMounted(() => {
    if (autoPaymentsStore.periodText.period) {
        selectedPeriod.value = autoPaymentsStore.periodText.period;
    }
})
</script>