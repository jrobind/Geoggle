import routeHandler from '../routes';
import utils from '../utils';

const { elementCreator } = utils;
const scoreEl = document.querySelectorAll('#playerScore, #score h2');
const scoreLevelDiv = document.querySelector('#scoreLevel');

export const updateScore = (points) => {
    const storageScore = JSON.parse(localStorage.getItem('current player'));
    storageScore.score = storageScore.score + points;
    localStorage.setItem('current player', JSON.stringify(storageScore));
} 

export const handleScoreUi = () => {
    const { score, name, difficulty } = JSON.parse(localStorage.getItem('current player'));
    const scoreTotal = difficulty === 'easy' ? 25 : 33;
    const scorePercentage = score/scoreTotal * 100;
    
    // set h2 player name text
    scoreEl[0].innerHTML = `${name}, you scored...`;
    scoreEl[1].innerHTML = `${score}/${scoreTotal}`;
    
    // set score level
    if (scorePercentage < 40) {
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-leaf'],
            innerHTML: ` GeoNovice`
        }));
    } else if (scorePercentage > 40 && scorePercentage < 60) {
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-fire'],
            innerHTML: ` GeoHotshot`
        }));
    } else if (scorePercentage > 60 && scorePercentage < 85 ) {
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-bolt'],
            innerHTML: ` GeoPhenom`
        }));
    } else if (scorePercentage > 85) {
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-magic'],
            innerHTML: ` GeoMage`
        }));
    }
}

export const resetScoreUi = () => {
    const icon = document.querySelector('#scoreLevel span i');

    if (scoreLevelDiv.firstChild) {
        scoreEl[0].innerHTML = '';
        scoreEl[1].innerHTML = '';
        // remove icon
        icon.parentElement.removeChild(icon);   
    }
}

const createIcon = (iconEl) => {
    const iconSpan = elementCreator('span');
    iconSpan.appendChild(iconEl);
    scoreLevelDiv.appendChild(iconSpan);   
}