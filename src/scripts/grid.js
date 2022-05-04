
// The 5x6 grid of letters
export class Grid {
    static isSolved({letters}, answer) {
        const remaining = answer.split("").filter(letter => !letters.includes(letter) && letter.match(/[a-z]/i));
        return remaining.length === 0;
    }

    constructor(answer) {
        const words = answer.includes(" ")
            ? answer.split(" ").map(word => word.toUpperCase()) : [answer.toUpperCase()];
        const grid = document.getElementsByClassName("grid")[0];  
        
        words.forEach(word => {
            const wordElement = document.createElement('div');

            word.split("").forEach(letter => {
                const letterElement = document.createElement('div');
                letterElement.innerHTML = letter;
                wordElement.appendChild(letterElement);
            });

            grid.appendChild(wordElement);
        });
    }

    setState({letters}) {
        const grid = document.getElementsByClassName("grid")[0];
        for (let w = 0; w < grid.children.length; w++) {
            const word = grid.children.item(w);
            for (let l = 0; l < word.children.length; l++) {
                const letter = word.children.item(l);
                letter.classList = letters.includes(letter.textContent) ? 'active' : 'unselectable';
            }
        }
    }
}
