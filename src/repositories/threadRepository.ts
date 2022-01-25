import { ThreadDto } from "../common/models/threadDto"
import { ThreadRoute } from "../routing/route";

const threads: Record<string, ThreadDto> = {};

export const getThread = (route: ThreadRoute): ThreadDto | undefined => {
    return threads[route.uri];
}

export const addToThread = (route: ThreadRoute, threadDto: ThreadDto) => {
    const thread = threads[route.uri] || {
        messages: [],
        size: 0,
    };
    // Mutability warning!
    thread.messages.push(...threadDto.messages);
    thread.size += threadDto.size;
}