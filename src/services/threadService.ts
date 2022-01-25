import { ThreadRoute } from "../routing/route";
import * as Repository from "../repositories/threadRepository";
import * as ApiService from "./apiService";

export const getThread = async (route: ThreadRoute, update = false) => {
    if(update) {
        Repository.addToThread(route, await ApiService.getThread(route));
    }
    
    return Repository.getThread(route);
}