import { MessageDto } from "./messageDto";

export type ThreadDto = {
    /** The size of the datafile retrieved for the thread on the last successful request. */
    size: number,
    /** Messages of the thread */
    messages: MessageDto[],
}