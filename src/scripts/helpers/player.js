import utils from '../utils';

export default ({ playerName, difficulty, playAgain = false } ) => {
    const { getPlayerInfo } = utils;
    
    if (!playAgain) {
        localStorage.clear();
        // initialise player to local storage api
        localStorage.setItem('current player', JSON.stringify({
            name: playerName,
            score: 0,
            difficulty,
            playAgain
        }));  
    } else {
        const currentPlayerInfo = getPlayerInfo();
        // reset score and playAgain bool
        currentPlayerInfo.score = 0;
        currentPlayerInfo.playAgain = true;
        localStorage.setItem('current player', JSON.stringify(currentPlayerInfo));
    }
}
