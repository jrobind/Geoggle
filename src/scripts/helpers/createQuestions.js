import { fetchQuestions } from '../api';
import routeHandler from '../routes';
import utils from '../utils';
import timer from './timer';
import loading from './loading';
import { updateScore, handleScoreUi, resetScoreUi } from './score';
const quiz = document.querySelector('#quiz');
const imagesLoaded = require('imagesloaded');

const { shuffle, elementCreator, formatTitle, elementRemover, classHandler } = utils;
const { setTimer, resetTimer } = timer;
const { showScore } = routeHandler;

let count = 0;
let questions;

export default () => {
    fetchQuestions()
        .then((data) => {
            // reset the count and remove score button for restarted games
            count = 0;
            elementRemover('#finish');
            // set the current question data
            questions = data;
            // create the ui for the question
            questionCreator(data[count])
        });
}

const questionCreator = ({ 
    title, 
    correctAnswer, 
    incorrectAnswers,
    replaceUnderscore 
}) => {
    const { difficulty } = utils.getPlayerInfo();
    const isFlag = title.includes('flag');
    
    // replace the title underscore with correct value
    title = formatTitle(title, replaceUnderscore);
    
    // begin building question ui
    const questionContainer = elementCreator('div', {id: 'questionContainer'});
    const questionDiv = elementCreator('div', {id: 'question'});
    
    // determine whether we need a timer for hard difficulty
    if (difficulty === 'hard') {
        const timerDiv = elementCreator('div', {id: 'timerContainer'});
        const pEl = elementCreator('p', {id: 'timer'});
        timerDiv.appendChild(pEl);
        questionDiv.appendChild(timerDiv);
    }
    
    // create question title
    const questionTitle = elementCreator('h2', {innerHTML: title});
    // create container for answers
    const answerContainer = isFlag ? elementCreator('div', {className: 'answer-container'}) : elementCreator('ul');
    
    // append question options
    shuffle(incorrectAnswers.concat(correctAnswer)).forEach((el) => {
        let option;
        // check whether the question relates to flags or not
        if (!isFlag) {
            option = elementCreator('li', {innerHTML: el})
            option.addEventListener('click', addSelect);
        } else {
            option = handleFlagImg(el); 
        }
        answerContainer.appendChild(option);
    });
    
    questionDiv.appendChild(questionTitle);
    // append question count
    handleQuestionCount(questionDiv);
    questionDiv.appendChild(answerContainer);
    questionDiv.appendChild(nextQuestionBtn());
    // initially set quiz div to display: none, in case we need to wait for flag img loading
    questionDiv.classList.add('no-show');
    questionContainer.appendChild(questionDiv);
    quiz.appendChild(questionContainer);
    // if difficulty is hard set the timer
    difficulty === 'hard' ? setTimer() : null;
    
    // if question is for flags then load only once imgs have loaded
    if (title.includes('flag')) {
        loading(true);
        imagesLoaded(document.querySelector('#question'), () => {
            loading(false);
            questionDiv.classList.remove('no-show');
        });
    } else {
        questionDiv.classList.remove('no-show');
    }
}

// helpers

const handleQuestionCount = (container) => {
    const currentCount = count + 1;
    const counterDiv = elementCreator('p', {innerHTML: `Question ${currentCount}/15`});
    container.appendChild(counterDiv);
}

const handleFlagImg = (el) => {
    const answer = elementCreator('div', {className: 'flag-answer'});
    const imgContainer = elementCreator('div', {className: 'img-container'});
    const imgEl = elementCreator('img', {src: el});
    
    imgContainer.appendChild(imgEl);
    answer.appendChild(imgContainer);
    // add handler to li containing flag img
    imgContainer.addEventListener('click', addSelect);
    
    return answer;
}

const nextQuestionBtn = (questionNumber) => {
    const nextBtn = elementCreator('button', {id: 'next', innerHTML: 'Next Question'});
    // setup increment handler for next question
    nextBtn.addEventListener('click', incrementHandler);
    return nextBtn;
}

const removeListeners = () => {
    [...document.querySelectorAll('li')].forEach((el) => el.removeEventListener('click', addSelect));
}

const finish = () => {
    elementRemover('#questionContainer');
    // render the score route
    showScore();
    resetScoreUi();
    handleScoreUi();
}

const increment = () => {
    const { difficulty } = utils.getPlayerInfo();
    
    if (count !== 14) {
        count++;
        // reset countdown interval before removal
        difficulty === 'hard' ? resetTimer() : null;
        elementRemover('#questionContainer');
        questionCreator(questions[count]);
    } else {
        difficulty === 'hard' ? resetTimer() : null;
        finish();
    }    
}

// handlers

const addSelect = ({ target }) => {
    const isFlag = target.nodeName === 'IMG' ? true : false;
    
    // add selected style
    classHandler(isFlag ? target.parentElement : target, {
        className: 'selected', 
        allElements: isFlag ? [...document.querySelectorAll('.img-container')] : [...document.querySelectorAll('#question li')]
    });
}

const incrementHandler = ({ target }) => {
    const { difficulty } = utils.getPlayerInfo();
    const { correctAnswer, points, title } = questions[count];
    const nodeNum = difficulty === 'hard' ? 3 : 2;
    const isFlag = target.parentElement.childNodes[nodeNum].childNodes[0].firstElementChild ? true : false;
    const selector = isFlag ? '.img-container' : '#question li';
    const checkedAnswers = [...document.querySelectorAll(selector)].filter((el) => el.classList.contains('selected'));
    
    // if user tries to progress to next question but has not selected an answer, then alert them
    if (!checkedAnswers.length) {
        alert('Please select an answer');
    } else  {
        // process score 
        if (title.includes('flag')) {
            checkedAnswers[0].firstChild.src === correctAnswer ? updateScore(points) : null;   
        } else {
            checkedAnswers[0].innerHTML === correctAnswer ? updateScore(points) : null;
        }
        
        removeListeners();
        increment();
    }
};

export const forceNextQuestion = () => increment();