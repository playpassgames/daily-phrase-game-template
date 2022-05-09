import * as playpass from "playpass";
import { asyncHandler, showScreen } from "../../boilerplate/screens";
import { gridTagName } from "../../components/grid-element";
import { keyboardTagName } from "../../components/keyboard-element";
import state from "../../state";

const template = document.querySelector("#game-screen");
template.addEventListener(
    "active",
    asyncHandler(async () => {
        // Take new users to help screen first
        const sawTutorial = await playpass.storage.get("sawTutorial");
        if (!sawTutorial) {
            showScreen("#help-screen");
            return;
        }

        if (state.isDone()) {
            // The player has already played today, show results
            showScreen("#results-screen");
            return;
        }


        // format title prompt based on real content
        template.querySelector("#category").textContent = state.correctAnswer.category
    
        template.querySelector("#lives").textContent = state.remainingLives;

        grid.attempts = state.attempts;
        grid.answer = state.currentPhrase;
        keyboard.answer = state.currentPhrase;

        const viewState = {
            guesses: state.store.guesses,
            incorrect: state.incorrect,
        };
    
        grid.setState(viewState);
        keyboard.setState(viewState);
    }),
);

const grid = template.querySelector(gridTagName);

const keyboard = template.querySelector(keyboardTagName);
keyboard.addEventListener("key", event => {
    if (state.isDone()) {
        return;
    }

    const key = event.detail;

    state.submit(key);

    if (state.isDone()) {
        showScreen("#results-screen");
        return;
    }
    
    template.querySelector("#lives").textContent = state.remainingLives;

    const viewState = {
        guesses: state.store.guesses,
        incorrect: state.incorrect,
    };

    grid.setState(viewState);
    keyboard.setState(viewState);
});
