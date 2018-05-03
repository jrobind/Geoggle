export const playerSetup = (name, difficulty) => {
    localStorage.clear();
    // initialise player to local storage api
    localStorage.setItem('current player', JSON.stringify({
        name,
        score: null,
        difficulty
    }));
}