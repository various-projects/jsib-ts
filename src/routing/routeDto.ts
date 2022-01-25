import { RouteType } from "./routeType";

export type RouteDto = {
    /** Board slug */
    board?: string,
    /** thread number/slug (relative to board) */
    thread?: number,
    /** message number/slug (relative to thread) */
    message?: number,
    /** Full URI path to object as string. Appropriate to use as a link to it. */
    uri?: string,
    /** Path type — what kind of object it is pointing to. */
    type?: RouteType,
}