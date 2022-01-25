import { RouteType } from "./routeType";
import { RouteDto } from "./routeDto";

export type Route = RouteDto & {
    /** Full URI path to object as string. Appropriate to use as a link to it. */
    uri: string,
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

const getUri = (path: RouteDto) => {
    let parts = [];
    path.board !== undefined && parts.push(path.board);
    path.thread !== undefined && parts.push(path.thread);
    path.message !== undefined && parts.push(path.message);
    return parts.join("/");
}

const getThreadId = (route: RouteDto) => `${route.board}/${route.thread}`;

const getRouteType = (route: RouteDto): RouteType => {
    if (route.type !== undefined) {
        return route.type;
    }

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

export const makeComplete = (cripple: Readonly<Partial<Route>>, donor: Route): Route => mapFromDto({
    message: cripple.message || donor.message,
    thread: cripple.thread || donor.thread,
    board: cripple.board || donor.board,
    type: Math.max(cripple.type || 0, donor.type)
});

export const mapFromDto = (dto: RouteDto): Route => ({
    ...dto,
    type: getRouteType(dto),
    uri: getUri(dto)
});

const uriParseRegex = /^((\w+)\/?(\/(\d+)|))\/?(\/(\d+)|)?$/;

export const parseUri = (uri: string): Route => {
    const matches = uri.match(uriParseRegex);

    if (!matches) {
        return { uri, type: RouteType.invalid };
    }

    return mapFromDto({
        board: matches[2],
        thread: +matches[4],
        message: +matches[6]
    });
}