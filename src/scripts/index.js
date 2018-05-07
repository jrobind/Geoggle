import routeHandler from './routes';
import utils from './utils';
import playerSetup from './helpers/player';
import createQuestions from './helpers/createQuestions';
import '../styles/style.scss';

const difficultyElements = [...document.querySelectorAll('#easy, #hard')];
const { classHandler, removePlayer } = utils;
const { showHome, showSetup, showQuiz } = routeHandler;

// initialise the app on first load
routeHandler.init();

// setup 
document.querySelector('#start').addEventListener('click', showSetup);

difficultyElements.forEach((button) => {
    button.addEventListener('click', ({target}) => {
        classHandler(target, {
            className: 'selected-diff', 
            allElements: difficultyElements
        });
    });  
});

document.querySelector('#playerSetup').addEventListener('submit', (e) => {
    const playerName = document.querySelector('#playerName').value;
    const difficulty = difficultyElements.filter((el) => el.classList.contains('selected-diff'))[0].id;
    const nameInput = document.querySelector('.playername-container');
    // prevent form refresh
    e.preventDefault();

    if (!playerName && !nameInput.classList.contains('no-show')) {
        alert('you must type a username');
        document.querySelector('#playerSetup').reset();
    } else {
        // setup player
        !nameInput.classList.contains('no-show') ? playerSetup({playerName, difficulty}) :  playerSetup({playerName, difficulty, playAgain: true});
        showQuiz();
        // create questions
        createQuestions(); 
        document.querySelector('#playerSetup').reset();
    }
});

document.querySelector('#goHome').addEventListener('click', () => {
    removePlayer();
    showHome();
});

document.querySelector('#playAgain').addEventListener('click', () => {
    // remove name input
    document.querySelector('.playername-container').classList.add('no-show');
    showSetup();
});
