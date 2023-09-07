import Vue from 'vue';
import { tooltipService } from '@/services/tooltips';

export default function() {
    Vue.directive('ttip', {
        bind(el, binding) {
            const instance = tooltipService.generateTooltip(el, binding.arg);
            if (binding.value && binding.value.isActive === false) {
                instance.disable();
            }
        },

        update(el, binding) {
            const instance = tooltipService.getTooltipInstance(el, binding.arg);
            if (!instance || instance.length > 1) {
                return;
            }

            if (binding.value && binding.value.isActive) {
                instance.enable();
                return;
            }

            if (binding.value && binding.value.isActive === false) {
                instance.disable();
            }
        },

        unbind(el, binding) {
            const instance = tooltipService.getTooltipInstance(el, binding.arg || null);

            if (!instance) {
                return;
            }

            if (instance.length > 1) {
                instance.forEach(tooltip => {
                    tooltip.destroy();
                });

                tooltipService.cleanTooltips(binding.arg);
                return;
            }

            instance.destroy();
            tooltipService.cleanTooltips(binding.arg);
        }
    })
}
