import * as playpass from "playpass";
import { showScreen } from "../../boilerplate/screens";
import * as timer from "../../boilerplate/timer";
import state from "../../state";

function getTodaysEmojis() {
    const emojiMap = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
    const livesLeft = state.remainingLives;
    const emojis = livesLeft === 0 ? '\nI lost 😭' : '\nWon with ' + emojiMap[livesLeft] + ' lives left!';

    return emojis;
}

function share() {
    // Create a link to our game
    const link = playpass.createLink();

    // Share some text along with our link
    const text = `Phrase Game #${state.store.day + 1} ${getTodaysEmojis()}\n${link}`;
    
    // Share some text along with our link
    playpass.share({ text });
}

let timerUpdate;

const template = document.querySelector("#results-screen");

template.querySelector("button[name=share]").onclick = share;
template.addEventListener("active", () => {
    if (!state.isDone()) {
        showScreen("#game-screen");
        return;
    }

    const nextGameAt = timer.getNextGameTime();
    timerUpdate = setInterval(() => {
        const until = timer.getUntil(nextGameAt);
        template.querySelector("#timeLeft").textContent = `${until.hours}h ${until.minutes}m ${until.seconds}s`;
    }, 1000);

    // Set the results lines
    template.querySelector("#resultLine1").textContent = state.isSolved() ?
        "You guessed today's phrase!" : ("You couldn't guess today's phrase...");
    template.querySelector("#resultLinePhrase").textContent = state.currentPhrase;
    template.querySelector("#resultLine2").textContent = state.isSolved() ?
        getTodaysEmojis() : '😭';
    template.querySelector("#resultLine3").textContent = state.isSolved() ? 'Keep it going tomorrow!' : 'Try again tomorrow...';
});

template.addEventListener("inactive", () => {
    if (timerUpdate) {
        clearInterval(timerUpdate);
    }
});
