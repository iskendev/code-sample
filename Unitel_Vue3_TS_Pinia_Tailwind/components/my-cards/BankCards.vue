<template>
    <div
        v-for="(card, index) in cardStore.bankCards"
        @click="openOtpModal(card.id, card.statusId)"
        :key="index"
        :style="{ backgroundImage: 'url(' + getDesignId(card.designId) + ')' }"
        class="min-w-[330px] h-[225px] mr-[80px] mb-[65px] px-[15px] text-white pt-2 rounded-[24px] pb-[14px] bg-center bg-cover shadow-virtual-card flex flex-col justify-between box-border"
        :class="{ 'cursor-pointer' : card.statusId === 1 }"
    >
        <div class="flex justify-between">
            <div class="flex flex-col font-exo-medium">
                <span class="text-lg">{{ card?.name }}</span>
            </div>
            <button
                v-if="(card.statusId !== 1)"
                @click="openSettingsPanel(card.id)"
                class="relative cursor-default"
            >
                <base-icon name="settingsMyHome" class="[&>path]:fill-white w-[25px] h-[25px] cursor-pointer"/>
                <div
                    v-if="blockVisible && cardIdSettings === card.id"
                    class="absolute top-[43px] right-[-7px] shadow-v-card v-card-after bg-white whitespace-nowrap rounded-[10px] py-[10px] px-[12px] share-socials-transition"
                >
                    <div class="flex justify-between items-center">
                        <button @click="toCardHistory(card.id)"
                                class="text-[#4a4a4a] mr-[23px] text-[14px] font-exo-regular flex flex-col items-center group">
                            <base-icon name="historyBig" class="group-hover:[&>path]:fill-[#f5c52e]"></base-icon>
                            <span class="group-hover:text-[#f5c52e]">{{ $t("BankCards.History") }}</span>
                        </button>
                        <button
                            @click="openEditModal(card)"
                            class="text-[#4a4a4a] mr-[23px] text-[14px] font-exo-regular flex flex-col items-center group"
                        >
                            <base-icon name="edit"
                                       class="group-hover:[&>path]:fill-[#f5c52e] w-[30px] h-[40px]"></base-icon>
                            <span class="group-hover:text-[#f5c52e]">{{ $t("BankCards.Edit") }}</span>
                        </button>
                        <button
                            v-if="!card.mainCard"
                            @click="openSetAsMainModal(card.id)"
                            class="text-[#4a4a4a] mr-[23px] text-[14px] font-exo-regular flex flex-col items-center group"
                        >
                            <base-icon name="checked"
                                       class="group-hover:[&>path]:fill-[#f5c52e] w-[30px] h-[40px]"></base-icon>
                            <span class="group-hover:text-[#f5c52e]">{{ $t("BankCards.Main") }}</span>
                        </button>
                        <button
                            @click="openDeleteModal(card.id)"
                            class="text-[#4a4a4a] text-[14px] font-exo-regular flex flex-col items-center group"
                        >
                            <base-icon name="trash" class="group-hover:[&>path]:fill-[#f5c52e]"></base-icon>
                            <span class="group-hover:text-[#f5c52e]">{{ $t("BankCards.Delete") }}</span>
                        </button>
                    </div>
                </div>
            </button>
        </div>
        <div
            v-if="(card.statusId !== 1)"
            class="flex justify-between items-center"
        >
            <span class="text-[30px]">
                {{
                    !card?.hideBalance ? `${ vueNumberFormat(card?.balance, numberFormat) }` : "---.---"
                }} {{ $t("Balance.Sum") }}
            </span>
            <div @click="cardStore.toggleCardBalanceVisibility(card.id)">
                <base-icon
                    :name="card?.hideBalance ? 'eyeOff' : 'eyeOn'"
                    class="cursor-pointer [&>path]:fill-white"
                />
            </div>
        </div>
        <p
            v-if="card.statusId === 1"
            class="text-lg flex items-center"
        >
            {{ $t("BankCards.CardIsNotActive") }}
        </p>
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
    <base-overlay :visible="showOverlay">
        <base-modal
            v-if="deleteCard"
            :class="{ 'min-h-[300px]': visible }"
            :title="$t('BankCards.DeleteConfirmTitle')"
            :close="false"
            :btn-text="$t('Buttons.Yes')"
            :underlined-text="$t('Buttons.No')"
            :footer-margin="false"
            :btn-disabled="true"
            @onClickBtn="deleteBankCard"
            @onClickText="closeDeleteModal"
        />
        <base-modal
            v-if="editCard"
            :title="$t('BankCards.CardEditing')"
            :btn-text="$t('Buttons.Save')"
            :underlined-text="$t('Buttons.Cancel')"
            :btn-disabled="true"
            @onClickBtn="editBankCard"
            @onClickText="closeEditModal"
            @onClickClose="closeEditModal"

        >
            <div class="flex flex-col mb-5">
                <label
                    class="text-[#4a4a4a] font-exo-medium mb-[11px] ml-[10px] leading-[14px] tracking-tight dark:text-[#b3b3b3]"
                >{{ $t("BankCards.CardName") }}</label
                >
                <input
                    v-model="cardName"
                    type="text"
                    :placeholder="$t('BankCards.NameBankCardPlaceholder')"
                    class="border border-[#979797] text-[18px] pl-[18px] rounded-[8px] font-exo-regular text-left h-[46px] box-border outline-none focus:border-[#f5c52e] dark:bg-[#1b1b1b] dark:text-[#b3b3b3]"
                />
            </div>
            <base-checkbox
                class="mb-5"
                v-if="isCheckboxVisible"
                @toggleCheckbox="isMainCard = !isMainCard"
                :checked="isMainCard"
            >
                <span> {{ $t("BankCards.MainCard") }} </span>
            </base-checkbox>
            <cards-swiper
                @setDesignId="setDesignId"
                :design-id="cardDesignId"
                :card="selectedCard"
            />
        </base-modal>
        <base-modal
            v-if="setAsMain"
            :class="{ 'min-h-[300px]': visible }"
            :title="$t('BankCards.MakeThisCardTheMainOne')"
            :btn-text="$t('Buttons.Yes')"
            :underlined-text="$t('Buttons.No')"
            :footer-margin="false"
            :btn-disabled="true"
            @onClickBtn="setAsMainCard"
            @onClickClose="closeSetMainModal"
            @onClickText="closeSetMainModal"
        />
        <confirm-otp-bank-card
            v-if="activateCard"
            @closeModal="closeOtpModal"
        />
    </base-overlay>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useCardsStore} from "@/stores/cards";
import {useOtpStore} from "@/stores/otp";
import {useCatStatus} from "@/composable/catModal";
import {useRouter, useRoute} from "vue-router";
import type {CardEditPayload, Card} from "@/core/cards/cardInterfaces";
import CardsSwiper from "@/components/my-cards/CardsSwiper.vue";
import ConfirmOtpBankCard from "../modals/my-cards/ConfirmOtpBankCard.vue";

// composable
const cardStore = useCardsStore();
const {mainCard} = storeToRefs(cardStore);

const otpStore = useOtpStore();

const router = useRouter();
const route = useRoute();

const catModal = useCatStatus();
const {visible} = catModal;

//state
const blockVisible = ref(false);
const showOverlay = ref(false);
const cardId = ref("");
const cardIdSettings = ref("");
const deleteCard = ref(false);
const editCard = ref(false);
const cardName = ref("");
const isMainCard = ref(false);
const isCheckboxVisible = ref(false);
const cardDesignId = ref(0);
const selectedCard = ref<Record<string, any>>({});
const setAsMain = ref(false);
const activateCard = ref(false);

const numberFormat = {
    prefix: "",
    decimal: ",",
    thousand: " "
}

// methods
async function deleteBankCard(): Promise<void> {
    catModal.show();

    const response = await cardStore.deleteBankCard(cardId.value);
    if (response) {
        showOverlay.value = false;
        catModal.hide();
    }
}

function openDeleteModal(id: string): void {
    showOverlay.value = true;
    deleteCard.value = true;
    cardId.value = id;
}

function openEditModal(card: Card): void {
    cardName.value = card.name;
    cardDesignId.value = card.designId;

    cardId.value = card.id;
    if (!card.mainCard) {
        isCheckboxVisible.value = true;
    }
    selectedCard.value = card;

    showOverlay.value = true;
    editCard.value = true;
}

function closeDeleteModal(): void {
    showOverlay.value = false;
    deleteCard.value = false;
}

function closeEditModal(): void {
    showOverlay.value = false;
    editCard.value = false;
    cardName.value = "";
    cardDesignId.value = 0;
    isCheckboxVisible.value = false;
}

function setDesignId(id: number): void {
    cardDesignId.value = id;
}

function getDesignId(id: number): any {
    if (id === 0) {
        return new URL("../../assets/new-ones/icons/cards-bg/des_card_1.webp", import.meta.url)
    }
    return new URL(`../../assets/new-ones/icons/cards-bg/des_card_${id}.webp`, import.meta.url)
}

async function editBankCard(): Promise<void> {

    catModal.show();

    const payload: CardEditPayload = {
        name: cardName.value,
        designId: cardDesignId.value,
        mainCard: isMainCard.value,
        hideBalance: mainCard.value?.hideBalance
    }

    await cardStore.editBankCard(payload, cardId.value);

    catModal.hide();
    closeEditModal();
}

function openSetAsMainModal(id: string): void {
    showOverlay.value = true;
    setAsMain.value = true;
    cardId.value = id;
}

async function setAsMainCard(): Promise<void> {
    catModal.show();

    const payload: CardEditPayload = {
        mainCard: true
    }

    await cardStore.editBankCard(payload, cardId.value);

    catModal.hide();
    closeSetMainModal();
}

async function openOtpModal(id: string, statusId: number) {
    if (statusId === 1) {

        showOverlay.value = true;
        catModal.show();
        activateCard.value = true;
        cardStore.cardId = id;

        const response = await otpStore.sendOtpForCard();

        if (response) {
            catModal.hide();
        }
    }
}

function closeOtpModal() {
    activateCard.value = false;
    showOverlay.value = false;
}

function closeSetMainModal(): void {
    showOverlay.value = false;
    setAsMain.value = false;
    cardId.value = "";
}

function toCardHistory(id: string): void {
    route.params.id = id;
    router.push(`/card-history/${id}`);
}

function openSettingsPanel(id: string): void {
    if (blockVisible.value) {
        blockVisible.value = false;
        cardIdSettings.value = "";
    } else {
        cardIdSettings.value = id;
        blockVisible.value = true;
    }
}
</script>