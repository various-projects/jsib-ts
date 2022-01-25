type Binding = {
    target: string,
    value: any,
}

export const applyBindings = <T = any>(element: HTMLElement, data: T, shouldClone = true, shouldKeepBindingAttributes = false): HTMLElement => {
    element = shouldClone
        ? element.cloneNode(true) as HTMLElement
        : element;

    const boundNodes: NodeListOf<HTMLElement> = element.querySelectorAll("[data-bind]");

    boundNodes.forEach(node => {
        if (!node.dataset.bind) throw new Error("Binding error! " + node.outerHTML);

        const bindings: Binding[] = node.dataset.bind
            .split(",")
            .map(x => {
                const [value, target] = x.split(" > ");
                return { target, value };
            });
        bindings.forEach(binding => {
            const targetProperty = binding.target
                ? binding.target
                : "innerHTML";

            (node as any)[targetProperty] = data[binding.value as keyof T];
        });

        // So that we could apply bindings for the inner content filled during this binding:
        if (!shouldKeepBindingAttributes) {
            node.removeAttribute("data-bind");
        }
    });

    return element;
}