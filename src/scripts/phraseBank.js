const phrases = [
    {
        category: "Famous dish originating from Italy",
        answers: [
            "spaghetti and meatballs"
        ]
    },
];

export function getTodaysCategory(today) {
    return phrases[today.day % phrases.length];
}

export function getTodaysAnswer(today) {
    const todaysCategory = getTodaysCategory(today);
    return todaysCategory.answers[today.day % todaysCategory.answers.length];
}