import { ThreadDto } from "../common/models/threadDto.js"
import { getUri, ThreadRoute } from "../routing/route.js";

const threads: Record<string, ThreadDto> = {};

export const getThread = (route: ThreadRoute): ThreadDto | undefined => {
    return threads[getUri(route)];
}

export const addToThread = (route: ThreadRoute, threadDto: ThreadDto) => {
    const uri = getUri(route);
    const thread = threads[uri] || {
        messages: [],
        size: 0,
    };
    // Mutability warning!
    thread.messages.push(...threadDto.messages);
    thread.size += threadDto.size;

    threads[uri] = thread;
}