import { ThreadRoute } from "../route";
import * as Service from '../../services/threadService';
import { renderThread } from "../../render/thread/thread";
import { defaultTitle } from "../routing";

export const showThread = async (route: ThreadRoute) => {
    const threadData = await Service.getThread(route);
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