import { MessageDto } from "../common/models/messageDto";
import { ThreadDto } from "../common/models/threadDto";
import { ThreadRoute } from "../routing/route";

const threadRequestsActive: Record<string, AbortController> = {};

export const getThread = async (route: ThreadRoute, skipBytes = 0): Promise<ThreadDto> => {
    if(threadRequestsActive[route.uri]){
        threadRequestsActive[route.uri].abort();
    }

    const abCon = new AbortController();
    threadRequestsActive[route.uri] = abCon;
    const signal = abCon.signal;

    const response = (await fetch(route.uri, {
        signal,
        headers: {
            range: `bytes=${skipBytes}-`,
        },
    }));

    const size = +response.headers.get("content-length")!;
    const data =
        (skipBytes ? "" : "[")
        + (await response.text())
        + "]";
    return {
        messages: JSON.parse(data) as MessageDto[],
        size,
    };
}