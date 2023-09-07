import type { App } from "vue";

export const registerBaseComponents = (app: App<Element>): void => {

    const components = import.meta.glob("../components/base/Base*.vue", { eager: true });

    for (const component in components) {

        const pathSplit = component.split("/");
        const fileName = pathSplit[pathSplit.length - 1].split(".vue")[0];

        app.component(fileName, (components[component] as any).default);
    }
}