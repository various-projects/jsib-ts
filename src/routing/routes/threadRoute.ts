import { getUri, MessageRoute, parseUri, ThreadRoute } from "../route.js";
import * as Service from "../../services/threadService.js";
import { renderThread } from "../../rendering/thread/threadComponent.js";
import { defaultTitle, go } from "../routing.js";
import * as ApiService from "../../services/apiService.js";
import { RouteType } from "../routeType.js";
import { renderMessage } from "../../rendering/message/messageComponent.js";

const showRef = async (targetRoute: MessageRoute, target: HTMLElement): Promise<void> => {
    const threadData = await Service.getThread({ ...targetRoute, message: undefined, type: RouteType.thread }, true);

    if (!threadData) {
        console.error(`Thread not found for ${getUri(targetRoute)} ref`);
        alert(`Thread not found for ${getUri(targetRoute)} ref`);
        return;
    }

    if (target.dataset.refShown !== 'true') {
        let message = threadData.messages[targetRoute.message];
        target.appendChild(
            renderMessage({
                message,
                onRefClick: showRef,
                onReplyClick: () => go(getUri(targetRoute)),
                route: targetRoute,
                onGoOriginal: () => go(getUri(targetRoute)),
            })
        );

        target.dataset.refShown = 'true';
    } else {
        target.removeChild(target.children[0]);
        target.dataset.refShown = 'false';
    }
}

export const showThread = async (route: ThreadRoute) => {
    const threadData = await Service.getThread(route, true);
    if (!threadData) {
        alert('No such thread!');
        return;
    }
    const messages = renderThread({
        data: threadData,
        route,
        onShowRef: showRef,
    });

    const mainWrapper = document.getElementById("content")!;

    mainWrapper.innerHTML = "";

    mainWrapper.append(...messages);

    let opMessage = threadData.messages[0];
    document.title = defaultTitle + (opMessage.title ? opMessage.title : opMessage.text.substring(0, 50));

    document.querySelector<HTMLFormElement>("#post-form")?.addEventListener("submit", postMessage(route));
}

const postMessage = (route: ThreadRoute) => async (event: SubmitEvent) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;

    const submitButton = form?.querySelector<HTMLButtonElement>("#postSendSubmit")!;

    if (!form || !submitButton) {
        throw new Error("What have you done to my kingdom, script-kiddie?");
    }

    submitButton.blur();
    submitButton.disabled = true;

    const formData = new FormData(form);

    formData.append("threadId", getUri(route));

    try {
        await ApiService.postMessage(formData);
    } catch (error) {
        alert("Something went wrong during the posting");
        console.error(error);
    } finally {
        submitButton.disabled = false;
    }
}