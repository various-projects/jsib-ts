import { BoardRoute, getThreadRoute, makeComplete, mapFromDto, MessageRoute, parseUri, Route, ThreadRoute } from "./route.js";
import { RouteDto } from "./routeDto.js";
import { showBoard } from "./routes/boardRoute.js";
import { highlightMessage } from "./routes/messageRoute.js";
import { showThread } from "./routes/threadRoute.js";
import { RouteType } from "./routeType.js";

let currentRoute: Route = mapFromDto({
});

export const defaultTitle = document.title + " ";

export const getAbsoluteRoute = (relativeRoute: RouteDto) =>
    makeComplete(relativeRoute, currentRoute);

export const go = async (uri?: string) => {
    if (typeof (uri) === "string") {
        location.hash = uri;
    } else {
        uri = location.hash.replace("#", "");
    }

    const newRoute = parseUri(uri);

    if (newRoute.type === RouteType.invalid) {
        //if URI's unparsable — get out.
        alert("Invalid URI");
        return;
    }

    const validRoute = newRoute as (BoardRoute | ThreadRoute | MessageRoute);
    
    if (validRoute.type === RouteType.board) {
        showBoard(validRoute.board!);
    }
    else {
        await showThread(getThreadRoute(validRoute));
    }

    if (validRoute.type === RouteType.message && validRoute.message !== undefined) {
        highlightMessage(validRoute.message);
    }

    currentRoute = newRoute;
}