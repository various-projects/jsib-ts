import { getUri, ThreadRoute } from "../route.js";
import * as Service from "../../services/threadService.js";
import { renderThread } from "../../rendering/thread/threadComponent.js";
import { defaultTitle } from "../routing.js";
import * as ApiService from "../../services/apiService.js";

export const showThread = async (route: ThreadRoute) => {
    const threadData = await Service.getThread(route, true);
    if (!threadData) {
        alert('No such thread!');
        return;
    }
    const messages = renderThread(threadData, route);

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