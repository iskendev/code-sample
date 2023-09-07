<template>
    <div class="flex flex-col">
        <label
            class="text-[#4a4a4a] font-exo-medium mb-[11px] ml-[10px] leading-[14px] tracking-tight dark:text-[#b3b3b3]"
            >{{ title }}</label
        >
        <div v-if="listTop && canSelect" class="relative">
            <ul
                v-if="up"
                class="absolute bottom-[-1px] right-0 left-0 z-[200] bg-white border border-[#979797] shadow-list max-h-[215px] overflow-y-auto"
                :class="[
                    listTop ? 'rounded-tr-[8px] rounded-tl-[8px] border-b-0' : 'rounded-br-[8px] rounded-bl-[8px] border-t-0',
                    up ? 'border border-[#f5c52e]' : 'border border-[#979797]'
                ]"
            >
                <li
                    v-for="(item, i) in items"
                    :key="i"
                    class="min-h-[50px] px-[17px] py-[14px] border-t border-r-0 border-l-0 cursor-pointer hover:bg-[#F5F5F5] dark:bg-[#1b1b1b] dark:text-[#b3b3b3] dark:hover:bg-[#333333] dark:border-t-0"
                    @click="select(item)"
                >
                    {{ item[props.itemKey] }}
                </li>
            </ul>
        </div>
        <div
            class="relative group"
        >
            <span
                ref="modalRef"
                :class="[
                    'relative z-[150]', up ?
                        (paymentStore.mode === 'dark' ? 'select-up-light' : 'select-up') :
                            (paymentStore.mode === 'dark' ? 'select-down-light' : 'select-down')
                ]"
                @click="toggleList"
            >
                <input
                    type="text"
                    readonly
                    v-model="itemKeyValue"
                    :placeholder="placeholder"
                    :class="[
                        'card-input w-full cursor-pointer  text-[18px] pl-[18px] rounded-[8px] font-exo-regular text-left h-[46px] box-border outline-none dark:bg-[#1b1b1b] dark:text-[#b3b3b3]',
                        { 'border-t-[transparent] rounded-t-none': up && canSelect && listTop },
                        { 'border-b-[transparent] rounded-b-none': up && canSelect && !listTop },
                        up && canSelect ? 'border border-[#f5c52e]' : 'border border-[#979797]',
                    ]"
                />
            </span>
            <div v-if="!listTop && canSelect" class="relative">
                <ul
                    v-if="up"
                    class="absolute right-0 left-0 z-[200] bg-white shadow-list max-h-[215px] overflow-y-auto"
                    :class="[
                        listTop ? 'rounded-tr-[8px] rounded-tl-[8px] border-b-0' : 'rounded-br-[8px] rounded-bl-[8px] border-t-0',
                        up ? 'border border-[#f5c52e]' : 'border border-[#979797]'
                    ]"
                >
                    <li
                        v-for="(item, i) in items"
                        :key="i"
                        class="min-h-[50px] px-[17px] py-[14px] border-t border-r-0 border-l-0 cursor-pointer hover:bg-[#F5F5F5] dark:bg-[#1b1b1b] dark:text-[#b3b3b3] dark:hover:bg-[#333333] dark:border-[#b3b3b3]"
                        @click="select(item)"
                    >
                        {{ item[props.itemKey] }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useCardsStore } from "@/stores/cards";
import { usePaymentStore } from "@/stores/payment";

// emits
const emit = defineEmits(["selectItem"]);

// composable
const cardStore = useCardsStore();
const paymentStore = usePaymentStore();

// props
interface Props {
    items: Array<Record<string, any>> | [],
    title?: string,
    placeholder?: string,
    itemKey: string,
    listTop?: boolean,
    setItem?: boolean,
    card?: boolean,
    chosenIndex?: number,
    canSelect?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    title: () => "Способ оплаты",
    placeholder: () => "",
    listTop: () => false,
    card: () => false,
    canSelect: () => true
})

// state
const up = ref(false);
const modalRef = ref(null);
const selected = ref<Record<string, any>>({});

// computed
const itemKeyValue = computed(() => {
    if (props.card) {
        return selected.value[props.itemKey] + " / " +  selected.value.balance
    }

    if (props.setItem && props.chosenIndex !== undefined) {
        return props.items[props.chosenIndex][props.itemKey]
    }

    return selected.value[props.itemKey]
})

// methods
function select(item: Record<string, any>):void {
    selected.value = item;
    emit("selectItem", item);
    up.value = false;
}

function toggleList():void {
    up.value = !up.value
}

onClickOutside(modalRef, () => up.value = false);

// watch
watch(
    () => props.items,
    (newVal) => {
    if (newVal.length) {
        selected.value = {};
        if (props.setItem && props.chosenIndex !== undefined) {
            selected.value = props.items[props.chosenIndex];
        }
    }
})

// hooks
onMounted(() => {
    if (props.items.length) {

        if (props.setItem && props.chosenIndex !== undefined) {
            selected.value = props.items[props.chosenIndex];
        }

        if (props.card) {
            const card = cardStore.cards?.find((card: any) => card.id === props.items[0].id);

            if (card) {
                card.isSelected = true
            }
        }
    }
})
</script>

<style>
.select-down-light::after {
    content: " ";
    cursor: pointer;
    width: 24px;
    height: 24px;
    background-position: 0 0;
    background-image: url("../../assets/new-ones/icons/directions/arrow-down-light.svg");
    position: absolute;
    top: 0;
    bottom: 0;
    right: 13px;
    margin: auto 0;
    z-index: 5;
}

.select-up-light::after {
    content: " ";
    cursor: pointer;
    width: 24px;
    height: 24px;
    background-position: 0 0;
    background-image: url("../../assets/new-ones/icons/directions/arrow-up-light.svg");
    position: absolute;
    top: 0;
    bottom: 0;
    right: 13px;
    margin: auto 0;
    z-index: 5;
}

.select-down::after {
    content: " ";
    cursor: pointer;
    width: 24px;
    height: 24px;
    background-position: 0 0;
    background-image: url("../../assets/new-ones/icons/directions/arrow-down.svg");
    position: absolute;
    top: 0;
    bottom: 0;
    right: 13px;
    margin: auto 0;
    z-index: 5;
}

.select-up::after {
    content: " ";
    cursor: pointer;
    width: 24px;
    height: 24px;
    background-position: 0 0;
    background-image: url("../../assets/new-ones/icons/directions/arrow-up.svg");
    position: absolute;
    top: 0;
    bottom: 0;
    right: 13px;
    margin: auto 0;
    z-index: 5;
}
</style>