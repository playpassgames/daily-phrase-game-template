import { EMPTY, BULL, NONE } from "./keyState";
import "./keyboard-element.css";

/**
 * Default Keyboard layout
 */
const template = `
<div>
    <div>Q</div>
    <div>W</div>
    <div>E</div>
    <div>R</div>
    <div>T</div>
    <div>Y</div>
    <div>U</div>
    <div>I</div>
    <div>O</div>
    <div>P</div>
</div>
<div>
    <div>A</div>
    <div>S</div>
    <div>D</div>
    <div>F</div>
    <div>G</div>
    <div>H</div>
    <div>J</div>
    <div>K</div>
    <div>L</div>
</div>
<div>
    <div>Z</div>
    <div>X</div>
    <div>C</div>
    <div>V</div>
    <div>B</div>
    <div>N</div>
    <div>M</div>
</div>
`;

// https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
export class Keyboard extends HTMLElement {
    constructor () {
        super();

        this.addEventListener("click", event => {
            if (event.target.childElementCount == 0) {
                const key = event.target.textContent;
                this.dispatchEvent(new CustomEvent("key", { detail: key }));
            }
        });

        this.innerHTML = template;
    }

    set answer(phrase) {
        this._answer = phrase;
    }

    setState({ guesses, incorrect }) {
        for (let row = 0; row < this.children.length; row++) {
            for (let btn = 0; btn < this.children.item(row).children.length; btn++) {
                const key = this.children.item(row).children.item(btn);
                const ch = key.textContent;

                if (incorrect.includes(ch)) {
                    key.setAttribute("s", NONE);
                } else if (guesses.includes(ch)) {
                    key.setAttribute("s", BULL);
                } else {
                    key.setAttribute("s", EMPTY);
                }
            }
        }
    }
}

export const keyboardTagName = "game-keyboard";

window.customElements.define(keyboardTagName, Keyboard);
