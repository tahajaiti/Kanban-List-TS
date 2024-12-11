export const msg = <B extends HTMLElement>(message:string, container:B): void => {
    if (message.length != 0 && container){
        const oldMsg = document.querySelector('.typeMsg') as HTMLParagraphElement;
        if (oldMsg) {oldMsg.remove()}

        const newMsg = document.createElement('p');
        newMsg.textContent = message;
        newMsg.className = "typeMsg block text-center text-2xl font-bold"
        
        const child = container.firstChild as HTMLDivElement;
        container.insertBefore(newMsg, child);

        setTimeout(() => {
            newMsg.remove();
        },2000)
    }
}