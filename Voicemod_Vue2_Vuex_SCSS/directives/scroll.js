import Vue from 'vue';

export default () => {
    Vue.directive('scroll', {
        inserted: function (el, binding) {
            let f = function (evt) {
            if (binding.value(evt, el)) {
                el.removeEventListener('scroll', f)
            }
        }
            el.addEventListener('scroll', f)
        }
    })
}
