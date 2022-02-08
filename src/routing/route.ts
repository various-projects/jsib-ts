import { RouteType } from "./routeType.js";
import { RouteDto } from "./routeDto.js";

export type Route = RouteDto & {
    /** Path type — what kind of object it is pointing to. */
    type: RouteType,
}

export type BoardRoute = Route & {
    type: RouteType.board,
    board: string,
}

export type ThreadRoute = Route & {
    type: RouteType.thread,
    board: string,
    thread: number,
}

export type MessageRoute = Route & {
    type: RouteType.message,
    board: string,
    thread: number,
    message: number,
}

export type KnownRoute = BoardRoute | ThreadRoute | MessageRoute;

/** Full URI path to object as string. Appropriate to use as a link to it. */
export const getUri = (route: RouteDto): string => {
    let parts = [];
    route.board !== undefined && parts.push(route.board);
    route.thread !== undefined && parts.push(route.thread);
    route.message !== undefined && parts.push(route.message);
    return parts.join("/");
}

const getRouteType = (route: RouteDto): RouteType => {
    if (route.message) {
        return RouteType.message;
    }

    if (route.thread) {
        return RouteType.thread;
    }

    if (route.board) {
        return RouteType.board;
    }

    return RouteType.invalid;
}

export const makeComplete = <T extends Route>(cripple: Readonly<Partial<Route>>, donor: Route): T => mapFromDto({
    message: cripple.message || donor.message,
    thread: cripple.thread || donor.thread,
    board: cripple.board || donor.board,
    type: Math.max(cripple.type || 0, donor.type)
}) as T;

export const getThreadRoute = (messageRoute: MessageRoute | ThreadRoute): ThreadRoute =>
({
    ...messageRoute,
    message: undefined,
    type: RouteType.thread,
});

export const mapFromDto = (dto: RouteDto): Route => ({
    ...dto,
    type: getRouteType(dto),
});

const uriParseRegex = /^((\w+)\/?(\/(\d+)|))\/?(\/(\d+)|)?$/;

export const parseUri = (uri: string): Route => {
    const matches = uri.match(uriParseRegex);

    if (!matches) {
        return { type: RouteType.invalid };
    }

    return mapFromDto({
        board: matches[2],
        thread: (+matches[4]) || undefined,
        message: (+matches[6]) || undefined
    });
}