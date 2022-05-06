import { showScreen } from "../../boilerplate/screens";
import state from "../../state";

function back() {
    showScreen("#game-screen");
}

const template = document.querySelector("#stats-screen");

template.querySelector("button[name=back]").onclick = back;
template.addEventListener("active", () => {
    template.querySelector("#winStats").textContent = `You won ${state.store.wins} times.`;
});
