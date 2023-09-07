<template>
    <div
        :style="{ backgroundImage: 'url(' + getDesignId() + ')' }"
        :class="[isVirtual ? 'text-black' : 'text-white']"
        class="min-w-[330px]  h-[225px] mb-[50px] px-[15px] pt-2 rounded-[24px] pb-[14px] bg-center bg-cover shadow-virtual-card flex flex-col justify-between box-border"
    >
        <label
            class="text-[#4a4a4a] font-exo-medium mb-[11px] leading-[14px] tracking-tight absolute top-[-25px] dark:text-[#b3b3b3]"
            >Дизайн карты</label
        >
        <div class="flex justify-between">
            <div class="flex flex-col font-exo-medium">
                <span class="text-lg">{{ card?.name }}</span>
            </div>
            <button
                v-if="showSettings"
                class="relative cursor-default"
            >
                <base-icon name="settingsMyHome"
                           class="[&>path]:fill-white w-[25px] h-[25px] cursor-pointer"/>
            </button>
        </div>
        <div class="flex justify-between items-center">
            <span class="text-[30px]">
                {{
                    !mainCard?.hideBalance ? `${ vueNumberFormat(card?.balance, numberFormat) }` : "---.---"
                }} {{ $t("Balance.Sum") }}
            </span>
            <div v-if="showBalanceIcon">
                <base-icon
                    :name="mainCard?.hideBalance ? 'eyeOff' : 'eyeOn'"
                    class="cursor-pointer [&>path]:fill-white"
                />
            </div>
        </div>
        <div class="flex flex-col">
            <span v-if="card.mainCard">{{ $t("BankCards.Main") }}</span>
            <div class="flex justify-between items-center">
                <img v-if="(card.productId === 1)" src="../../assets/new-ones/icons/any/uzcard-logo.svg"
                     alt="bank card">
                <img v-if="(card.productId === 2)" src="../../assets/new-ones/icons/any/humo-logo.svg" alt="bank card">
                <div>
                    {{ card?.cardNumber }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useCardsStore} from "@/stores/cards";

// props
const props = defineProps({
    card: {
        type: Object,
        required: true
    },
    showSettings: {
        type: Boolean,
        default: true
    },
    showBalanceIcon: {
        type: Boolean,
        default: true
    },
    isVirtual: {
        type: Boolean,
        default: false
    },
    designId: {
        type: Number,
        default: 1
    }
})

// composable
const cardStore = useCardsStore();
const {mainCard} = storeToRefs(cardStore);

// state
const numberFormat = {
    prefix: "",
    decimal: ",",
    thousand: " "
}

// methods
function getDesignId(): any {
    if (props.designId === 0 && !props.isVirtual) {
        return new URL("../../assets/new-ones/icons/cards-bg/des_card_1.webp", import.meta.url)
    }

    if (props.designId === 0 && props.isVirtual) {
        return new URL("../../assets/new-ones/icons/cards-bg/des_card_beeline.webp", import.meta.url)
    }

    return new URL(`../../assets/new-ones/icons/cards-bg/des_card_${props.designId}.webp`, import.meta.url)
}
</script>