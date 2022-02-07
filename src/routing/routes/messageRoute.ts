/** Highlights a message with the given Id: adds the 'selected' CSS class to it and scrolls it into view
 * @param {String} messageId Id of the message to highlight.
 */
export const highlightMessage = (messageId: number) => {
    const highlightedMessages = document.querySelectorAll(".selected");
    highlightedMessages.forEach(messageElement =>
        messageElement.classList.remove("selected")
    );
    var messageDiv = document.querySelectorAll(".message")[messageId - 1];
    messageDiv.classList.add("selected");
    messageDiv.scrollIntoView();
}