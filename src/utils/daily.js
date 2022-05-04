import * as playpass from "playpass";
import { getCurrentDay, getDay } from "./timer";

export class Daily {
    constructor (firstDate) {
        this.day = getCurrentDay() - getDay(firstDate);
    }

    /** Loads an object from storage, returning null if there was no object previously saved today. */
    async loadObject () {
        let state = await playpass.storage.get("daily");
        const newState = {
            letters: [],
            incorrect: [],
            currentStreak: 0,
            maxStreak: 0,
            wins: 0, // wins count for each successful attempt
        };
        if (!state) {
            state = {
                ...newState,
                day: this.day,
                timestamp: new Date().getTime(),
            };
        } else if (state.day !== this.day) {
            state = {
                ...newState,
                ...state,
                letters: [],
                incorrect: [],
                day: this.day,
                timestamp: new Date().getTime(),
            };
        } else {
            state = {
                ...newState,
                ...state,
            };
        }

        this.saveObject(state);

        return state;
    }

    /** Saves an object to storage, which will expire the next day. */
    async saveObject (state) {
        await playpass.storage.set("daily", state);
    }

    /** Gets a random number between 0 and 1 unique to this day. */
    random () {
        return ((1103515245*this.day + 12345) >>> 0) / 0xffffffff;
    }
}
