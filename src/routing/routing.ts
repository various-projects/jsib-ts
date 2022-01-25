import { KnownRoute, makeComplete, mapFromDto, parseUri, Route, ThreadRoute } from "./route";
import { RouteDto } from "./routeDto";
import { highlightMessage } from "./routes/messageRoute";
import { showThread } from "./routes/threadRoute";
import { RouteType } from "./routeType";

let currentRoute: Route = mapFromDto({
    uri: "",
});

export const defaultTitle = document.title + " ";

export const getAbsoluteRoute = (relativeRoute: RouteDto) =>
    makeComplete(relativeRoute, currentRoute);

export const go = async (uri: string) => {
    if (typeof (uri) === "string") {
        location.hash = uri;
    } else {
        uri = location.hash.replace("#", "");
    }

    currentRoute = parseUri(uri);

    if (currentRoute.type === RouteType.invalid) {
        //if URI's unparsable — get out.
        alert("Invalid URI");
        return;
    }
    
    if (currentRoute.type === RouteType.board) {
        loadBoard(currentRoute.board);
    }
    else {
        showThread({ ...currentRoute, message: undefined, type: RouteType.thread } as ThreadRoute);
    }

    if (currentRoute.type === RouteType.message && currentRoute.message !== undefined) {
        highlightMessage(currentRoute.message);
    }
}