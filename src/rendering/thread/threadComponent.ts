import { ThreadDto } from "../../common/models/threadDto.js";
import { getUri, makeComplete, MessageRoute, ThreadRoute } from "../../routing/route.js";
import { go } from "../../routing/routing.js";
import { renderMessage } from "../message/messageComponent.js";

type Props = {
    data: ThreadDto,
    route: ThreadRoute,
    onShowRef: (targetRoute: MessageRoute, target: HTMLElement) => Promise<void>,
}

export const renderThread = (props: Props): HTMLElement[] =>
    props.data.messages.map((message, index) => {
        const messageRoute = makeComplete<MessageRoute>({ message: index + 1 }, props.route);
        const messageUri = getUri(messageRoute);
        return renderMessage({
            message,
            route: messageRoute,
            onMessageClick: () => { },
            onNumberClick: () => go(messageUri),
            onRefClick: props.onShowRef,
            onReplyClick: () => { },
        });
    });