import { MessageDto } from "../../common/models/messageDto.js";
import { getThreadRoute, getUri, mapFromDto, MessageRoute, parseUri, Route } from "../../routing/route.js";
import { RouteType } from "../../routing/routeType.js";
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
    route: MessageRoute,
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

    const originalThreadUri = "#" + (props.onGoOriginal ? getUri(getThreadRoute(props.route)) : "");

    const linkCompleter = (ref: string) => {
        const parts = ref.split("/").reverse();

        const messageRoute = mapFromDto({
            message: +parts[0],
            thread: parts[1] === undefined ? props.route.thread : +parts[1],
            board: parts[2] === undefined ? props.route.board : parts[2],
        }) as MessageRoute;

        return getUri(messageRoute);
    } 

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
            text: props.message.text ? parseMarkup(props.message.text, linkCompleter) : "",
            title: props.message.title,
            number: props.route.message!,
            originalThreadUri,
            pic: props.message.pic ? `boards/${props.route.board}/${props.route.thread}/thumb/${props.message.pic}` : "",
            largePic: props.message.pic ? `boards/${props.route.board}/${props.route.thread}/src/${props.message.pic}` : "",
        }
    );

    const onRefClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const target = event.currentTarget as HTMLElement;
        const ref = target.dataset.ref;

        if(!ref) return;

        const messageRoute = parseUri(ref);

        if(messageRoute.type !== RouteType.message) return;

        props.onRefClick(messageRoute as MessageRoute, target);
    }

    return MicroBinder.applyBindings(element, { onRefClick }, false);
}