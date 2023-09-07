<template>
    <Teleport to="body">
        <div class="fixed top-0 left-0 right-0 bottom-0 bg-white w-[100vw] h-full z-[999] flex items-center justify-center">
            <div class="flex flex-col items-center">
                <img
                    v-for="(cat, index) in cats"
                    :style="styles(index + 1)"
                    class="inline-block absolute top-0 bottom-0 right-0 left-0 m-[auto] p-0 max-h-[300px] object-contain object-center"
                    :key="index"
                    @load="loaded"
                    :src="cat.src"
                />
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

// state
const cats = [
    { src: new URL("../../assets/new-ones/icons/cats/1.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/2.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/3.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/4.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/5.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/6.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/7.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/8.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/9.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/10.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/11.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/12.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/13.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/14.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/15.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/16.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/17.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/18.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/19.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/20.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/21.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/22.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/23.svg", import.meta.url) },
    { src: new URL("../../assets/new-ones/icons/cats/24.svg", import.meta.url) },
];

const fps = ref(24);
const now = ref(null);
const then = ref(Date.now());
const interval = ref(null);
const delta = ref(null);
const step = ref(1);
const imgCnt = ref(0);

// computed
const styles = computed(() => {
    return (index) => {
        return {
            opacity: index === step.value ? 1 : 0
        };
    };
})

// methods
function loaded() {
    ++imgCnt.value;
    if (imgCnt.value > 23) {
        animate();
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    now.value = Date.now();
    delta.value = now.value - then.value;

    if (delta.value > interval.value) {
        then.value = now.value - (delta.value % interval.value);
        reDraw();
    }
}

function reDraw() {
    ++step.value;
    if (step.value > 24) {
        step.value = 1;
    }
}

// hooks
onMounted(() => {
    interval.value = 2000 / fps.value;
    document.body.style.height = "100vh";
    document.body.style.overflowY = "hidden";
});

onUnmounted(() => {
    document.body.style.height = "";
    document.body.style.overflowY = "auto";
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
