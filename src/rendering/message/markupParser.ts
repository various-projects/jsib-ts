export const parseMarkup = (text: string, linkCompleter: (match: string) => string): string => {
    //URL links:
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

    //Message references:
    //like >>/b/123/123, >>123/123, >>123
    text = text.replace(
        />>((\w+\/|)(\d+\/|)\d+)/g,
        (match, submatch) => {
            const uri = linkCompleter(submatch);
            return `<a data-ref='${uri}' data-bind='onRefClick > onclick' href='#${uri}' class='msg_ref'>${match}</a>`;
        }
    );

    //Markup:
    //**bold**
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    //*italic*
    text = text.replace(/\*(.*?)\*/g, "<i>$1</i>");
    //__underline__
    text = text.replace(/__(.*?)__/g, "<u>$1</u>");
    //%%spoiler%%
    text = text.replace(/%%(.*?)%%/g, "<span class='spoiler'>$1</span>");
    //[s]strike-through[/s]
    text = text.replace(/\[s\](.*?)\[\/s\]/g, "<s>$1</s>");

    //>quote
    text = text.replace(/(^|<br>)(>[^>].*?)($|<br>)/g, "$1<span class='quote'>$2</span>$3");

    return text;
}