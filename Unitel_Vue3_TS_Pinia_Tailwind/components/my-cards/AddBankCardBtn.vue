<template>
    <div v-if="!cardStore.bankCards.length" class="flex flex-col justify-center items-center ">
        <div class="flex flex-col items-center justify-center">
            <div class="text-center relative flex flex-col justify-center">
                <img src="../../assets/new-ones/icons/any/message-bg.svg" class="min-w-[380px]">
                <span class="absolute top-10 w-full max-w-[260px] text-lg">{{ $t("BankCards.NoOne") }}</span>
            </div>
            <img src="../../assets/new-ones/icons/cat/cat-asking.svg" class="mt-[-70px]">
        </div>
        <base-button
            @click="openModal"
            :text="$t('BankCards.AddBankCard')"
            class="px-[30px] py-3 h-[46px] rounded-[24px]"
        />
    </div>
    <base-overlay :visible="showModal">
        <component :is="components[cardsModal]"
                   @closeModal="closeModal"
                   @setStep="setStep"
        ></component>
    </base-overlay>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {Component} from "vue";
import {useCardsStore} from "@/stores/cards";
import {useCatStatus} from "@/composable/catModal";
import AddNewBankCard from "@/components/modals/my-cards/AddNewBankCard.vue";
import ConfirmOtpBankCard from "@/components/modals/my-cards/ConfirmOtpBankCard.vue";

// composable
const cardStore = useCardsStore();
const catModal = useCatStatus();

// state
const showModal = ref(false);
const cardsModal = ref("AddNewBankCard");
const components: Component = {
    AddNewBankCard,
    ConfirmOtpBankCard
};

// methods
function setStep(value: string): void {
    cardsModal.value = value;
}

function openModal(): void {
    catModal.hide();
    showModal.value = true;
}

function closeModal(): void {
    showModal.value = false;
    cardsModal.value = "AddNewBankCard";
    catModal.hide();
}

// expose
defineExpose({openModal})
</script>