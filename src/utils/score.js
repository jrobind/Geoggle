import routeHandler from './routes';

export const updateScore = (points) => {
    const storageScore = JSON.parse(localStorage.getItem('current player'));
    storageScore.score = storageScore.score + points;
    localStorage.setItem('current player', JSON.stringify(storageScore));
} 

export const handleScoreUi = () => {
    routeHandler.showScore();
    const scoreEl = document.querySelector('#playerScore');
    scoreEl.innerHTML = JSON.parse(localStorage.getItem('current player')).score;
}