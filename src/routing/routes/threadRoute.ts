import { ThreadRoute } from "../route.js";
import * as Service from "../../services/threadService.js";
import { renderThread } from "../../rendering/thread/threadComponent.js";
import { defaultTitle } from "../routing.js";

export const showThread = async (route: ThreadRoute) => {
    const threadData = await Service.getThread(route, true);
    if(!threadData) {
        alert('No such thread!');
        return;
    }
    const messages = renderThread(threadData, route);

    const mainWrapper = document.getElementById("content")!;

    mainWrapper.innerHTML = "";

    mainWrapper.append(...messages);
    
    let opMessage = threadData.messages[0];
    document.title = defaultTitle + (opMessage.title ? opMessage.title : opMessage.text.substring(0, 50));
}