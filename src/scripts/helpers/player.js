import utils from '../utils';

export default ({ playerName, difficulty, playAgain = false } ) => {
    const { getPlayerInfo } = utils;
    const nameInput = document.querySelector('.playername-container');
    let currentName;
    
    // show name input depending on play state
    nameInput.classList.contains('no-show') ? nameInput.classList.remove('no-show') : null;
    // re-use current name if playing again
    currentName = playAgain ? getPlayerInfo().name : '';
    
    // reset storage
    localStorage.clear();
    
    // initialise player to local storage api
    localStorage.setItem('current player', JSON.stringify({
        name: !playAgain ? playerName : currentName,
        score: 0,
        difficulty,
        playAgain
    }));  
}