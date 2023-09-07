<template>
    <base-modal
        :btn-text="$t('Buttons.Yes')"
        :underlined-text="$t('Buttons.No')"
        class="!max-w-[420px]"
        :close="false"
        :footer-margin="false"
        :btn-disabled="true"
        :title="$t('Autopayments.DeleteTheSelectedAutoPayment')"
        @onClickBtn="deleteAutopayment"
        @closeCatModal="closeCatModal"
        @onClickText="$emit('closeDeleteModal')"
    >
    </base-modal>
</template>

<script setup lang="ts">
import {useAutoPaymentsStore} from "@/stores/autopayments";
import {useCatStatus} from "@/composable/catModal";

// props
const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

// emits
const emit = defineEmits(["closeDeleteModal"]);

// composable
const autoPaymentsStore = useAutoPaymentsStore();
const catModal = useCatStatus();

// methods
async function deleteAutopayment(): Promise<void> {
    catModal.show();
    const response = await autoPaymentsStore.deleteAutopayment(props.id);
    if (response) {
        catModal.hide();
        emit("closeDeleteModal");
    }
}

function closeCatModal() {
    catModal.hide();
    emit("closeDeleteModal");
}
</script>