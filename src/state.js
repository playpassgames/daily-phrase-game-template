import * as playpass from "playpass";
import { State } from "./boilerplate/state";
import UserModel from "./models/userModel";
import DailyModel from "./models/dailyModel";
import * as dictionary from "../content/dictionary.json";

const MAX_ATTEMPTS = 6;

const state = new State(
    "daily",
    new UserModel(MAX_ATTEMPTS),
    new DailyModel(Date.parse("2022-04-21T12:00:00")),
); 

// The dice the player rolled today
export default {
    store: null,
    correctAnswer: null,
    
    async init() {
        this.store = await state.loadObject();

        this.correctAnswer = dictionary.phrases[this.store.day % dictionary.phrases.length];
    },
    get incorrect() {
        return this.store.guesses.filter(
            c => !this.currentPhrase.includes(c)
        );
    },
    get remainingLives() {
        return Math.max(0, MAX_ATTEMPTS - this.incorrect.length);
    },
    get currentPhrase() {
        return this.correctAnswer.phrase.toUpperCase();
    },
    /** compute if every letter in the phrase has been guess */
    isSolved() {
        return this.store.guesses.reduce(
            (phrase, c) => {
                return phrase.replace(new RegExp(c, 'gi'), '');
            },
            this.currentPhrase,
        ).trim().length === 0;
    },
    isDone() {
        return this.remainingLives <= 0 || this.isSolved();
    },
    submit(letter) {
        this.store.guesses.push(letter);

        if (this.isSolved()) {
            this.store.wins += 1;
        }

        this.save();
    },
    async login() {
        if (await playpass.account.login()) {
            document.body.classList.add("isLoggedIn");
        }
    },
    async logout() {
        playpass.account.logout();
        document.body.classList.remove("isLoggedIn");
        this.rolledDice = [];
    },
    save() {
        state.saveObject(this.store);
    }
}
