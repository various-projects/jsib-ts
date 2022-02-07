export type TemplateProps = {
    onMessageClick?: (e: MouseEvent) => void,
    onNumberClick?: (e: MouseEvent) => void,
    onPicClick: (e: MouseEvent) => void,
    onReplyClick: (e: MouseEvent) => void,
    onGoOriginalThreadClick?: (e: MouseEvent) => void,
    email: string,
    title: string,
    date: string,
    pic: string,
    largePic: string,
    text: string,
    number: number,
    name: string,
}

export const template = document.createElement("message");

template.innerHTML = `
<div data-bind="onMessageClick > onclick" class="message">
    <div class="messageHeader">
        #<a class="messageNumber" data-bind="number > ,onNumberClick > onclick" title="Go to message">0</a>
        left at <span data-bind="date > " class="messageDate">12 Jan 1945 at 12:45</span>
        <a data-bind="email > href" class="messageMail"><span data-bind="name > " class="message-name">Anonymous</span></a>
        <span data-bind="title > " class="message-title"></span>
        <a data-bind="onGoOriginalThreadClick > onclick" class="orig-thread">→original thread</a>
        <a data-bind="onReplyClick > onclick" class="replyLink">→reply</a>
    </div>
    <a data-bind="onPicClick > onclick,largePic > href" href="#">
        <img data-bind="pic > src,largePic > data-alt-src" class="message-pic" alt="Thumb">
    </a>
    <span data-bind="text > " class="messageText"> </span>
</div>
`;