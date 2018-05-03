import routeHandler from './routes';
import utils from './utils';
import { playerSetup } from './helpers/player';
import createQuestions from './helpers/createQuestions';
import '../styles/style.scss';

const difficultyElements = [...document.querySelectorAll('#easy, #hard')];
const { classHandler } = utils;

// initialise the app on first load
routeHandler.init();

// setup 
document.querySelector('#start').addEventListener('click', routeHandler.showSetup);

difficultyElements.forEach((button) => {
    button.addEventListener('click', ({target}) => {
        classHandler(target, {
            className: 'selected', 
            allElements: difficultyElements
        });
    });  
});

document.querySelector('#playerSetup').addEventListener('submit', (e) => {
    const playerName = document.querySelector('#playerName').value;

    if (!playerName) {
        alert('you must type a username');
        e.preventDefault();
        document.querySelector('#playerSetup').reset();
    } else {
        const difficulty = difficultyElements.filter((el) => el.classList.contains('selected'))[0].id;
        // setup player
        playerSetup(playerName, difficulty);
        routeHandler.showQuiz();
        // create questions
        createQuestions(); 
        
        e.preventDefault();
        document.querySelector('#playerSetup').reset();
    }
});

document.querySelector('#restart').addEventListener('click', () => {
    routeHandler.showHome();
});