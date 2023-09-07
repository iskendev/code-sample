import type { App } from "vue";

export const registerInputFocusDirective = (app: App<Element>): void => {
    app.directive("focus", {
        mounted(el) {
            el.focus()
        }
    })
}
