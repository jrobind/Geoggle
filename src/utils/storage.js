export const playerSetup = (username) => {
    localStorage.clear();
    
    if (JSON.parse(!localStorage.getItem('current player'))) {
        localStorage.setItem('current player', JSON.stringify({
            name: username,
            score: null
        }));
    } 
}