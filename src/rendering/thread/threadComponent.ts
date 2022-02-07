import { ThreadDto } from "../../common/models/threadDto.js";
import { getUri, makeComplete, ThreadRoute } from "../../routing/route.js";
import { go } from "../../routing/routing.js";
import { renderMessage } from "../message/messageComponent.js";

export const renderThread = (threadData: ThreadDto, threadRoute: ThreadRoute): HTMLElement[] =>
    threadData.messages.map((message, index) => {
        const messageRoute = makeComplete({ message: index + 1 }, threadRoute);
        const messageUri = getUri(messageRoute);
        return renderMessage({
            message,
            route: messageRoute,
            onMessageClick: () => go(messageUri),
            onGoOriginal: () => go(messageUri),
            onNumberClick: () => go(messageUri),
            onRefClick: () => { },
            onReplyClick: () => { },
        });
    });