<template>
    <div
        class="min-w-[330px] h-[225px] mr-[80px] mb-[65px] px-[15px] pt-2 rounded-[24px] pb-[14px] bg-virtual-card bg-center bg-cover shadow-virtual-card flex flex-col justify-between box-border"
    >
        <div class="flex justify-between">
            <div class="flex flex-col font-exo-medium">
                <span class=" leading-5 text-lg">{{ virtualCard?.bankName }} ({{ $t("service") }}
                    {{ virtualCard?.fee }}%)</span>
                <span class="leading-4 text-[15px]">{{ $t("remainingLimit") }}: {{ virtualCard?.debitLimit }} сум</span>
            </div>
            <button
                @click="blockVisible = !blockVisible"
                class="relative cursor-default"
            >
                <base-icon name="settingsMyHome"
                           class="[&>path]:fill-black w-[25px] h-[25px] cursor-pointer"/>
                <div
                    v-if="blockVisible"
                    class="absolute top-[43px] right-[-7px] shadow-v-card v-card-after bg-white whitespace-nowrap rounded-[10px] py-[10px] px-[12px] share-socials-transition"
                >
                    <div class="flex justify-between">
                        <button
                            @click="showOverlay = true"
                            class="text-[#4a4a4a] mr-[23px] text-[14px] font-exo-regular flex flex-col items-center group"
                        >
                            <base-icon name="trash" class="group-hover:[&>path]:fill-[#f5c52e]"/>
                            <span class="group-hover:text-[#f5c52e]">{{ $t("BankCards.Delete") }}</span>
                        </button>
                        <button @click="toCardHistory"
                                class="text-[#4a4a4a] text-[14px] font-exo-regular flex flex-col items-center group">
                            <base-icon name="historyBig" class="group-hover:[&>path]:fill-[#f5c52e]"/>
                            <span class="group-hover:text-[#f5c52e]">{{ $t("BankCards.History") }}</span>
                        </button>
                    </div>
                </div>
            </button>
        </div>
        <div class="flex justify-between items-center">
            <span class="text-[30px]">
                {{ balanceVisible ? `${ vueNumberFormat(virtualCard?.balance, numberFormat) }` : "---.---" }}
                {{ $t("Balance.Sum") }}
            </span>
            <div @click="balanceVisible = !balanceVisible">
                <base-icon
                    :name="balanceVisible ? 'eyeOff' : 'eyeOn'"
                    class="cursor-pointer"
                />
            </div>
        </div>
        <div class="flex justify-between items-center">
            <base-icon name="beelineLogo"/>
            <div>
                {{ virtualCard?.cardNumber }}
            </div>
        </div>
    </div>
    <base-overlay :visible="showOverlay">
        <base-modal
            :class="{ 'min-h-[300px]': visible }"
            :title="$t('BankCards.DeleteConfirmTitle')"
            :close="false"
            :btn-text="$t('Buttons.Yes')"
            :underlined-text="$t('Buttons.No')"
            :footer-margin="false"
            :btn-disabled="true"
            @onClickBtn="deleteVirtualCard"
            @onClickText="showOverlay = false"
        >
        </base-modal>
    </base-overlay>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useRouter, useRoute} from "vue-router";
import {useCardsStore} from "@/stores/cards";
import {useCatStatus} from "@/composable/catModal";

// composable
const cardStore = useCardsStore();
const {virtualCard} = storeToRefs(cardStore);

const catModal = useCatStatus();
const {visible} = catModal;

//state
const balanceVisible = ref(false);
const blockVisible = ref(false);
const showOverlay = ref(false);

const router = useRouter();
const route = useRoute();

const numberFormat = {
    prefix: "",
    decimal: ",",
    thousand: " "
}

// methods
async function deleteVirtualCard(): Promise<void> {
    catModal.show();

    const response = await cardStore.deleteVirtualCard();
    if (response) {
        showOverlay.value = false;
        catModal.hide();
    }
}

function toCardHistory() {
    route.params.id = virtualCard.value!.id;
    router.push(`/card-history/${virtualCard.value?.id}`);
}
</script>