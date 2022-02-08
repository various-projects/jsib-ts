import { ThreadRoute } from "../routing/route.js";
import * as Repository from "../repositories/threadRepository.js";
import * as ApiService from "./apiService.js";

export const getThread = async (route: ThreadRoute, update = false) => {
    const thread = Repository.getThread(route);
    if(update || !thread) {
        const skip = thread && thread.size;
        Repository.addToThread(route, await ApiService.getThread(route, skip));
    }
    
    return Repository.getThread(route);
}