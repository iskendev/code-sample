<template>
    <div class="flex flex-col relative">
        <label
            class="text-[#4a4a4a] font-exo-medium mb-[11px] ml-[10px] leading-[14px] tracking-tight"
        >{{ labelText }}</label
        >
        <template v-if="inputCounterVisible">
            <input
                v-focus
                @input="$emit('setOtpValue', $event)"
                type="text"
                pattern="\d*"
                maxlength="6"
                @keypress="isNumber($event)"
                :placeholder="placeholderText"
                class="w-full border-[2px] border-[#f5c52e] text-[18px] pl-[18px] rounded-[8px] font-exo-regular text-left h-[46px] box-border outline-none"
            />
            <counter @requestNewOtp="inputCounterVisible = false"/>
        </template>
        <button
            v-if="!inputCounterVisible"
            class="w-full border-[1px] bg-[#f5c52e] border-[#f5c52e] text-[18px] px-[18px] rounded-[8px] font-exo-medium h-[46px] outline-none hover:bg-[#ffd85e] hover:border-[#daa90f]"
            @click="requestNewOtp"
        >
            {{ btnText }}
        </button>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Counter from "@/components/common/Counter.vue";
import i18n from "@/plugins/i18n";

// emits
const emit = defineEmits(["resetValue", "setOtpValue"]);

// state
const inputCounterVisible = ref(true);

// props
const props = defineProps({
    labelText: {
        type: String,
        default: () => i18n.global.t("enterConfirmationCode")
    },
    placeholderText: {
        type: String,
        default: () => i18n.global.t("BankCards.SmsCodeBankCardPlaceholder")
    },
    btnText: {
        type: String,
        default: () => i18n.global.t("ApproveCode.SendAgain")
    },
    otpAction: {
        type: Function,
        required: true
    }
});

// methods
async function requestNewOtp(): Promise<void> {
    const response = await props.otpAction();

    if (response) {
        emit("resetValue");
        inputCounterVisible.value = true;
    }
}

function isNumber(event: KeyboardEvent): void {
    const keysAllowed: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const keyPressed: string = event.key;

    if (!keysAllowed.includes(keyPressed)) {
        event.preventDefault()
    }
}
</script>