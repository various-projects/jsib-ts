import { MessageDto } from "../../common/models/messageDto.js";
import { mapFromDto, MessageRoute, Route } from "../../routing/route.js";
import * as MicroBinder from "../microBinder.js";
import { parseMarkup } from "./markupParser.js";
import { template, TemplateProps } from "./messageTemplate.js";

type Props = {
    onMessageClick?: (route: Route) => void,
    onNumberClick?: (route: Route) => void,
    onReplyClick: () => void,
    onRefClick: (targetRoute: MessageRoute, target: HTMLElement) => void,
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

        const anchor = event.currentTarget as HTMLAnchorElement;
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
            name: props.message.name,
            date: props.message.date,
            email: props.message.email,
            text: props.message.text ? parseMarkup(props.message.text) : "",
            title: props.message.title,
            number: props.route.message!,
            pic: props.message.pic ? `boards/${props.route.board}/${props.route.thread}/thumb/${props.message.pic}` : "",
            largePic: props.message.pic ? `boards/${props.route.board}/${props.route.thread}/src/${props.message.pic}` : "",
        }
    );

    const onRefClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const target = event.target as HTMLElement;

        const ref = target.dataset.ref!.split("/").reverse();

        const messageRoute = mapFromDto({
            message: +ref[0],
            thread: ref[1] === undefined ? props.route.thread : +ref[1],
            board: ref[2] === undefined ? props.route.board : ref[2],
        }) as MessageRoute;

        ref && props.onRefClick(messageRoute, target);
    }

    return MicroBinder.applyBindings(element, { onRefClick }, false);
}