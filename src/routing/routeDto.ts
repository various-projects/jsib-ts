import { RouteType } from "./routeType.js";

export type RouteDto = {
    /** Board slug */
    board?: string,
    /** thread number/slug (relative to board) */
    thread?: number,
    /** message number/slug (relative to thread) */
    message?: number,
    /** Path type — what kind of object it is pointing to. */
    type?: RouteType,
}