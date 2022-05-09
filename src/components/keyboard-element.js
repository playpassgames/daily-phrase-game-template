import { EMPTY, BULL, NONE } from "./keyState";
import "./keyboard-element.css";

/**
 * Default Keyboard layout
 */
const template = `
<div class="row">
    <div class="key">Q</div>
    <div class="key">W</div>
    <div class="key">E</div>
    <div class="key">R</div>
    <div class="key">T</div>
    <div class="key">Y</div>
    <div class="key">U</div>
    <div class="key">I</div>
    <div class="key">O</div>
    <div class="key">P</div>
</div>
<div class="row">
    <div class="key">A</div>
    <div class="key">S</div>
    <div class="key">D</div>
    <div class="key">F</div>
    <div class="key">G</div>
    <div class="key">H</div>
    <div class="key">J</div>
    <div class="key">K</div>
    <div class="key">L</div>
</div>
<div class="row">
    <div class="key">Z</div>
    <div class="key">X</div>
    <div class="key">C</div>
    <div class="key">V</div>
    <div class="key">B</div>
    <div class="key">N</div>
    <div class="key">M</div>
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
