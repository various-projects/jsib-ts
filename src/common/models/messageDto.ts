export type MessageDto = {
    /** Message title */
    title: string,
    /** Author's email */
    email: string,
    /** Attached picture's filename (no path, just the file's name) */
    pic: string,
    /** Author's name */
    name: string,
    /** Message posting tymestamp */
    date: string,
    /** Raw message text/markup */
    text: string,
}