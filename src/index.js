import routeHandler from './utils/routes';
import { playerSetup } from './utils/player';
import createQuestions from './utils/createQuestions';
import './style.scss';

// initialise the app on first load
routeHandler.init();

// setup 
document.querySelector('#start').addEventListener('click', routeHandler.showSetup); 

document.querySelector('#playerSetup').addEventListener('submit', (e) => {
    const playerName = document.querySelector('#playerName').value;
    const inputs = document.querySelectorAll('input');

    if (!playerName) {
        alert('you must type a username');
        e.preventDefault();
        document.querySelector('#playerSetup').reset();
    } else {
        const difficulty = [...inputs].filter((input) => input.type === 'radio' && input.checked)[0].id;
            
        routeHandler.showQuiz();
        // setup player
        playerSetup(playerName, difficulty);
        // create questions
        createQuestions(); 
        
        e.preventDefault();
        document.querySelector('#playerSetup').reset();
    }
});

document.querySelector('#restart').addEventListener('click', () => {
    routeHandler.showHome();
});