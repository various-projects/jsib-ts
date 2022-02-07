import { makeComplete, mapFromDto, parseUri, Route, ThreadRoute } from "./route.js";
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
    
    if (newRoute.type === RouteType.board) {
        showBoard(newRoute.board!);
    }
    else {
        await showThread({ ...newRoute, message: undefined, type: RouteType.thread } as ThreadRoute);
    }

    if (newRoute.type === RouteType.message && newRoute.message !== undefined) {
        highlightMessage(newRoute.message);
    }

    currentRoute = newRoute;
}