import * as playpass from "playpass";

// css
import "./../styles/common.css";
import "./../styles/main.css";
import "./../styles/dailyPhrase.css";

// utils
import { Daily } from "./../utils/daily";
import { getHoursUntil, getMinutesUntil, getNextGameTime, getSecondsUntil } from "./../utils/timer";

import { Grid } from "./grid";
import { Keyboard } from "./keyboard";
import { getTodaysAnswer, getTodaysCategory } from './phraseBank';

const daily = new Daily(Date.parse("2022-04-21T12:00:00"));

const todaysCategory = getTodaysCategory(daily);
const todaysAnswer = getTodaysAnswer(daily);

let state = null;

const grid = new Grid(todaysAnswer);
const lives = 8;

const keyboard = new Keyboard(document.querySelector(".keyboard"));
keyboard.addEventListener("key", event => {
    const key = event.detail;
    if (todaysAnswer.toUpperCase().includes(key)) {
        if (!state.letters.includes(key)) state.letters.push(key);
    } else if (!state.incorrect.includes(key) && !state.incorrect.includes(key)) {
        state.incorrect.push(key);
    }

    if (isGameFinished()) {
        if (isWon()) {
            state.wins++;
        }
        showResultScreen();
    }

    daily.saveObject(state);
    updateState();
});

// Shows either the results or gameplay screen
async function showMainScreen () {
    if (isGameFinished()) {
        showResultScreen();
    } else {
        updateState();
        // The player hasn't yet won today, show the playing screen
        showScreen("#playingScreen");
    }
}

function getRemainingLives() {
    return Math.max(0, lives - state.incorrect.length);
}

function isGameFinished() {
    const won = isWon();
    const lost = getRemainingLives() === 0;
    return won || lost;
}

function isWon() {
    return Grid.isSolved(state, todaysAnswer.toUpperCase());
}

function updateState() {
    grid.setState(state);
    keyboard.setState(state);
    document.querySelector("#lives").textContent = getRemainingLives();
}

function updateClock() {
    const next = getNextGameTime();
    const h = getHoursUntil(next);
    const m = getMinutesUntil(next);
    const s = getSecondsUntil(next);
    document.querySelector("#timeLeft").textContent = h + "h " +
        m.toString().padStart(2,0) + "m "+s.toString().padStart(2, 0) + "s";
}

updateClock();

setInterval(updateClock, 1000);

function showResultScreen () {
    // Go to the results screen
    showScreen("#resultScreen");

    // Set the results lines
    document.querySelector("#resultLine1").textContent = isWon() ?
        "You guessed today's phrase!" : ("You couldn't guess today's phrase...");
    document.querySelector("#resultLinePhrase").textContent = todaysAnswer.toUpperCase();
    document.querySelector("#resultLine2").textContent = isWon() ?
        getTodaysEmojis() : '😭';
    document.querySelector("#resultLine3").textContent = isWon() ? 'Keep it going tomorrow!' : 'Try again tomorrow...';
}

function showScreen (name) {
    for (let screen of document.querySelectorAll(".screen")) {
        screen.style.display = "none";
    }
    document.querySelector(name).style.display = "inherit";
}

function onShareClick () {
    // Create a link to our game
    const link = playpass.createLink();
    // Share some text along with our link
    const text = "Phrase Game #" + (daily.day + 1) + getTodaysEmojis() + "\n" + link;
    console.log(text);
    playpass.share({ text });
}

function getTodaysEmojis() {
    const emojiMap = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
    const livesLeft = getRemainingLives();
    const emojis = livesLeft === 0 ? '\nI lost 😭' : '\nWon with ' + emojiMap[getRemainingLives()] + ' lives left!';
    return emojis;
}

function onHelpClick () {
    showScreen("#helpScreen");
}

function onStatsClick () {
    document.querySelector("#winStats").textContent = "You won " + state.wins + " times.";
    showScreen("#statsScreen");
}

function onSettingsClick () {
    showScreen("#settingsScreen");
}

function onBackClick () {
    showMainScreen();
}

async function onLoginClick () {
    if (await playpass.account.login()) {
        document.body.classList.add("isLoggedIn");
    }
}

function onLogoutClick () {
    playpass.account.logout();
    document.body.classList.remove("isLoggedIn");
}

(async function () {
    // Initialize the Playpass SDK
    await playpass.init({
        gameId: "7e22e40b-af73-4370-b3ae-01d4121ebaba", // Do not edit!
    });

    // Get the stored state
    state = await daily.loadObject();
    // Take new users to help screen first
    const sawTutorial = await playpass.storage.get("sawTutorial");
    if (sawTutorial) {
        showMainScreen();
    } else {
        playpass.storage.set("sawTutorial", true);
        showScreen("#helpScreen");
    }

    // Set the login state for our UI
    if (playpass.account.isLoggedIn()) {
        document.body.classList.add("isLoggedIn");
    }
    
    document.querySelector("#category").textContent = todaysCategory.category

    // Add UI event listeners
    document.querySelector("#shareBtn").onclick = onShareClick;
    document.querySelector("#helpBtn").onclick = onHelpClick;
    document.querySelector("#helpBackBtn").onclick = onBackClick;
    document.querySelector("#statsBtn").onclick = onStatsClick;
    document.querySelector("#statsBackBtn").onclick = onBackClick;
    document.querySelector("#settingsBtn").onclick = onSettingsClick;
    document.querySelector("#loginBtn").onclick = onLoginClick;
    document.querySelector("#logoutBtn").onclick = onLogoutClick;
    document.querySelector("#settingsBackBtn").onclick = onBackClick;
})();
