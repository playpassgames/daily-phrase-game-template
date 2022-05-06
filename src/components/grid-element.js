import { BULL } from "./keyState";
import "./grid-element.css";

// The NxM grid of letters
export class Grid extends HTMLElement {
    get attempts() {
        return this.getAttribute("max-attempts") || 6;
    }
    
    set attempts(newValue) {
        this.setAttribute("max-attempts", newValue);
    }

    set answer(phrase) {
        this._answer = phrase;
        this.build();
    }

    build() {
        this.replaceChildren([]);

        const words = this._answer.split(" ");
        words.forEach(
            (word) => {
                const wordElement = Array.from(word).reduce(
                    (e) => {
                        const letterElement = document.createElement('div');
                        letterElement.classList.add('cell');

                        e.appendChild(letterElement);

                        return e;
                    },
                    document.createElement('div'),
                )

                this.appendChild(wordElement);
            }
        )
    }

    setState({ guesses }) {
        this._answer.split(" ").forEach((word, i) => {
            const wordGroup = this.children[i];

            Array.from(word).forEach(
                (letter, j) => {
                    const cell = wordGroup.children[j];

                    if (guesses.includes(letter)) {
                        cell.setAttribute("s", BULL);
                        cell.textContent = letter;
                    } else {
                        cell.removeAttribute("s");
                        cell.textContent = "";
                    }
                },
            );
        });
    }
}

export const gridTagName = "game-grid";

window.customElements.define(gridTagName, Grid);
