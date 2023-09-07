<template>
    <base-modal
        :title="$t('Devices.Title')"
        content-padding="0"
        :footer-margin="false"
        @closeCatModal="closeCatModal"
        @onClickClose="$emit('closeManageDeviceModal')"
    >
        <ul v-if="authStore.devices && authStore.devices.length"
            class="font-exo-medium text-[17px] mt-2 min-h-[300px] max-h-[600px] overflow-auto"
        >
            <li
                v-for="(device, i) in authStore.devices"
                :key="i"
                class="flex items-center group hover:bg-[#FDF6DD]"
            >
                <div :class="[
                    'flex items-center justify-between px-[30px] w-full border-b border-b-[#CBCBCB] py-[10px]',
                    { 'border-t border-t-[#CBCBCB]': i === 0 }
                ]">
                    <div class="flex items-center">
                        <div class="flex flex-col leading-[19px]">
                            <span v-if="device.isCurrent"
                                  class="text-[#619937] py-[2px] font-exo-regular text-[15px] tracking-wide"
                            >
                                {{ $t("Devices.CurrentDevice") }}
                            </span>
                            <span class="text-[#3a3a3a] py-[2px] font-exo-regular text-[15px] tracking-wide">
                                {{ $t("deviceName") }}: {{ device.name }}
                            </span>
                            <span class="text-[#3a3a3a] py-[2px] text-[15px] tracking-wide font-exo-regular">
                                {{ $t("loginDate") }}: {{ device.loginDate }}
                            </span>
                            <span class="text-[#3a3a3a] py-[2px] text-[15px] tracking-wide font-exo-regular">
                                {{ $t("deviceType") }}: {{ setDeviceType(device.type) }}
                            </span>
                        </div>
                    </div>
                    <button
                        v-if="!device.isCurrent"
                        @click="deleteDevice(device.id)"
                        class="group-2 btn-delete hidden group-hover:block"
                    >
                        <base-icon name="trash" class="[.group-2:hover_&]:[&>path]:fill-[#EDCC1C]"/>
                    </button>
                </div>
            </li>
        </ul>
    </base-modal>
</template>

<script setup lang="ts">
import {useCatStatus} from "@/composable/catModal";
import {useAuthStore} from "@/stores/auth";

// emits
const emit = defineEmits(["closeManageDeviceModal"]);

// composable
const catModal = useCatStatus();
const authStore = useAuthStore();

// methods
async function deleteDevice(id: string): Promise<void> {
    catModal.show();
    const response = await authStore.deleteDevice(id);
    if (response) catModal.hide();
}

function closeCatModal(): void {
    catModal.hide();
    emit("closeManageDeviceModal");
}

function setDeviceType(type: number): string | undefined {
    switch (type) {
        case 0:
            return "Other"
        case 1:
            return "Android"
        case 2:
            return "iOS"
        case 3:
            return "Web"
    }
}
</script>