// https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
export class Keyboard extends EventTarget {
    constructor (element) {
        super();

        element.addEventListener("click", event => {
            if (event.target.childElementCount == 0) {
                const key = event.target.textContent;
                this.dispatchEvent(new CustomEvent("key", { detail: key }));
            }
        });
    }
    
    setState({letters, incorrect}) {
        const combined = [...letters, ...incorrect];
        const keyboard = document.getElementsByClassName("keyboard")[0];
        for (let row = 0; row < keyboard.children.length; row++) {
            for (let btn = 0; btn < keyboard.children.item(row).children.length; btn++) {
                const key = keyboard.children.item(row).children.item(btn);
                key.classList = combined.includes(key.textContent) ? 'hidden' : '';
            }
        }
    }
}
