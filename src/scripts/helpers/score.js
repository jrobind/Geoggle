import routeHandler from '../routes';
import utils from '../utils';

const { elementCreator } = utils;
const scoreEl = document.querySelectorAll('#playerScore, #score h2');
const scoreLevelDiv = document.querySelector('#scoreLevel');

export const updateScore = () => {
    const storageScore = JSON.parse(localStorage.getItem('current player'));
    storageScore.score = storageScore.score + 1;
    localStorage.setItem('current player', JSON.stringify(storageScore));
} 

export const handleScoreUi = () => {
    const { score, name } = JSON.parse(localStorage.getItem('current player'));

    // set h2 player name text
    scoreEl[0].innerHTML = `${name}, you scored...`;
    scoreEl[1].innerHTML = `${score}/15`;

    // set score level
    if (score < 5) {
        
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-leaf']
        }), ' GeoNovice');
        
    } else if (score >= 5 && score <= 9) {
        
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-bolt']
        }), ' GeoPhenom');
        
    } else if (score > 9 && score <= 12 ) {
        
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-rocket']
        }), ' GeoRocket');
        
    } else if (score > 12) {
        
        createIcon(elementCreator('i', {
            className: ['fa', 'fa-magic']
        }), ' GeoMage');
    }
}

export const resetScoreUi = () => {
    const icon = document.querySelector('#scoreLevel i');
    const iconText = document.querySelector('#scoreLevel span');

    if (scoreLevelDiv.firstChild) {
        scoreEl[0].innerHTML = '';
        scoreEl[1].innerHTML = '';
        // remove icon and icon text
        icon.parentElement.removeChild(icon);
        iconText.parentElement.removeChild(iconText);   
    }
}

const createIcon = (iconEl, text) => {
    const iconText = elementCreator('span', {innerHTML: text});
    scoreLevelDiv.appendChild(iconEl);
    scoreLevelDiv.appendChild(iconText);
}