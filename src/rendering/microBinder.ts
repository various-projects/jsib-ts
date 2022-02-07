type Binding = {
    target: string,
    value: any,
}

// Yeah, I wanted to do this all with ReactJS,
// but it kinda sucks at mixing components into dynamic HTML.
// I mean, replacing the message refs with a component was not as easy of a task
// as I prefered it to be. One more gravestone on my pet projects cemetery
// has "JSib-react" inscribed on it.
// So anyway, I've put in this pretty basic binder that I've… invented(?) for some
// other side project. Should be more than enough for those basic needs we've got here.
// And the syntax is pretty straightforward:
// you just add a "data-bind" attribute (yes-yes-yes, just like KnockoutJS)
// to the nodes of your template element and then define
// which data field of the data object goes to what property, like this:
// <div data-bind="text > innerHTML,onClickHandler > onclick"></div>
// See the pattern? "what > goesWHere,whatElse > goesWhereverElse".
// Then you fill this bad boy with your hot juicy data like this:
// applyBindings(myDiv, {text: "HELL-O WORLD-O!", onClickHandler: ()=>alert('PWNED!')});
// Oh! And as the innerHTML binding is oh so common, that is the default value
// for target property.

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

            if (targetProperty.startsWith("data")) {
                node.setAttribute(targetProperty, (data[binding.value as keyof T]) + "");
            } else {
                (node as any)[targetProperty] = data[binding.value as keyof T];
            }
        });

        // So that we could apply bindings for the inner content filled during this binding:
        if (!shouldKeepBindingAttributes) {
            node.removeAttribute("data-bind");
        }
    });

    return element;
}