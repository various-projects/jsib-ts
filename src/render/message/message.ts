import { MessageDto } from "../../common/models/messageDto";
import { Route } from "../../routing/route";
import * as MicroBinder from "../microBinder";
import { template, TemplateProps } from "./messageTemplate";

type Props = {
    onMessageClick?: (route: Route) => void,
    onNumberClick?: (route: Route) => void,
    onReplyClick: () => void,
    onRefClick: (ref: string, target: HTMLElement) => void,
    onGoOriginal?: (route: Route) => void,
    message: MessageDto,
    /** Message route */
    route: Route,
}

const wrapOnClick = <T extends any[]>(handler: (...params: T) => void, ...params: T) => (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    handler(...params);
}

export const renderMessage = (props: Props): HTMLElement => {
    const onMessageClick = props.onMessageClick && wrapOnClick(props.onMessageClick, props.route);
    const onPicClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const anchor = event.target as HTMLAnchorElement;
        const img = anchor.querySelector("img");

        if (!img) return;

        const link1 = img.src;
        const link2 = img.dataset.altSrc || "";

        img.src = link2;
        img.dataset.altSrc = link1;
    }

    const onReplyClick = wrapOnClick(props.onReplyClick);

    const onGoOriginalThreadClick = props.onGoOriginal && wrapOnClick(props.onGoOriginal, props.route);

    const onNumberClick = props.onNumberClick && wrapOnClick(props.onNumberClick, props.route);

    const element = MicroBinder.applyBindings<TemplateProps>(
        template,
        {
            onMessageClick,
            onPicClick,
            onReplyClick,
            onGoOriginalThreadClick,
            onNumberClick,
            date: props.message.date,
            email: props.message.email,
            text: props.message.text,
            title: props.message.title,
            pic: props.message.pic ? `${props.route.thread}/thumb/${props.message.pic}` : "",
            largePic: props.message.pic ? `${props.route.thread}/src/${props.message.pic}` : "",
        }
    );

    const onRefClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const target = event.target as HTMLElement;

        const ref = target.dataset.ref;

        ref && props.onRefClick(ref, target);
    }

    return MicroBinder.applyBindings(element, { onRefClick });
}