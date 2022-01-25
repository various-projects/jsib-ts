import { ThreadDto } from "../../common/models/threadDto";
import { makeComplete, ThreadRoute } from "../../routing/route";
import { go } from "../../routing/routing";
import { renderMessage } from "../message/message";

/** Render thread data into view
 * @param threadData Thread's data
 * @param id thread's id
 */
export const renderThread = (threadData: ThreadDto, threadRoute: ThreadRoute): HTMLElement[] =>
    threadData.messages.map((message, index) => {
        const messageRoute = makeComplete({ message: index }, threadRoute);
        return renderMessage({
            message,
            route: messageRoute,
            onMessageClick: () => go(messageRoute.uri),
            onGoOriginal: () => go(messageRoute.uri),
            onNumberClick: () => go(messageRoute.uri),
            onRefClick: () => { },
            onReplyClick: () => { },
        });
    });