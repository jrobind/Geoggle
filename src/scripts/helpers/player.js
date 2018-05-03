export const playerSetup = (name, difficulty) => {
    localStorage.clear();
    
    if (JSON.parse(!localStorage.getItem('current player'))) {
        localStorage.setItem('current player', JSON.stringify({
            name,
            score: null,
            difficulty
        }));
    } 
}