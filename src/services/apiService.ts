import { MessageDto } from "../common/models/messageDto.js";
import { ThreadDto } from "../common/models/threadDto.js";
import { getUri, ThreadRoute } from "../routing/route.js";

const threadRequestsActive: Record<string, AbortController> = {};

export const getThread = async (route: ThreadRoute, skipBytes = 0): Promise<ThreadDto> => {
    const uri = getUri(route);
    if (threadRequestsActive[uri]) {
        threadRequestsActive[uri].abort();
    }

    const abortController = new AbortController();
    threadRequestsActive[uri] = abortController;
    const signal = abortController.signal;

    const response = (await fetch(`boards/${uri}/posts.json`, {
        signal,
        headers: {
            range: `bytes=${skipBytes}-`,
        },
    }));

    if (response.status === 416) {
        return {
            messages: [],
            size: 0,
        }
    }

    const size = +response.headers.get("content-length")!;
    const bodyText = await response.text();
    let data = "";

    if (skipBytes) {
        // partial data looks like: `, {"prop": "value", "prop": "value" }, {"prop": "value", "prop": "value" }`
        // so we trim the leading comma and wrap in square brackets:
        data = `[${bodyText.slice(1)}]`;
    } else {
        // full data looks like: `[{"prop": "value", "prop": "value" }, {"prop": "value", "prop": "value" }`
        // so we just close the ending bracket:
        data = bodyText + "]";
        // Why does it not have a closing bracket? So that we can add lines by just appending to the file, with no re-writes.
    }
    return {
        messages: JSON.parse(data) as MessageDto[],
        size,
    };
}

export const postMessage = (data: FormData) =>
    fetch("post.php", {
        method: "POST",
        body: data
    })