const phrases = [
    {
        category: "Famous Foods",
        answers: [
            "spaghetti and meatballs",
            "peanut butter and jelly sandwich",
            "beef stroganoff"
        ]
    },
    {
        category: "Video Games",
        answers: [
            "call of duty",
            "the legend of zelda",
            "world of warcraft"
        ]
    }
];

export function getTodaysCategory(today) {
    return phrases[today.day % phrases.length];
}

export function getTodaysAnswer(today) {
    const todaysCategory = getTodaysCategory(today);
    return todaysCategory.answers[today.day % todaysCategory.answers.length];
}