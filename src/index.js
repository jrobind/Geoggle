import routeHandler from './utils/routes';
import { playerSetup } from './utils/storage';
import createQuestions from './utils/createQuestions';
import './style.scss';

// initialise the app on first load
routeHandler.init();

// setup 
document.querySelector('#start').addEventListener('click', routeHandler.showSetup); 
document.querySelector('#begin').addEventListener('click', () => {
    if (!document.querySelector('#playerName').value) {
        alert('you must type a username');
    } else {
        routeHandler.showQuiz();
        // setup player
        playerSetup(document.querySelector('#playerName').value);
        // create questions
        createQuestions()
    };
});
document.querySelector('#restart').addEventListener('click', () => {
    routeHandler.showHome();
});