import { fetchQuestions } from '../api';
import routeHandler from '../routes';
import checkAnswer from './checkAnswer';
import utils from '../utils';
import timer from './timer';
import loading from './loading';
import { handleScoreUi, resetScoreUi } from './score';
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
            console.log(data);
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
        const pEl = elementCreator('p', {className: 'timer'});
        timerDiv.appendChild(pEl);
        questionDiv.appendChild(timerDiv);
    }
    
    // create question title
    const questionTitle = elementCreator('h2', {innerHTML: title});
    // create container for answers
    const answerContainer = elementCreator('div', isFlag ? {className: 'flag-answer-container'} : {className: 'answer-container'});
    
    // append question options
    shuffle(incorrectAnswers.concat(correctAnswer)).forEach((el) => {
        let option;
        // check whether the question relates to flags or not
        if (!isFlag) {
            option = elementCreator('div', {innerHTML: el, className: 'answer'});
            option.addEventListener('click', handleCheckAnswer);
        } else {
            option = handleFlagImg(el); 
        }
        answerContainer.appendChild(option);
    });
    
    questionDiv.appendChild(questionTitle);
    // append question count
    handleQuestionCount(questionDiv);
    questionDiv.appendChild(answerContainer);
    
    // initially set quiz div to display: none, in case we need to wait for flag img loading
    questionContainer.classList.add('no-show');
    questionContainer.appendChild(questionDiv);
    quiz.appendChild(questionContainer);
    // if difficulty is hard set the timer
    difficulty === 'hard' ? setTimer(questions[count]) : null;
    
    // if question is for flags then load only once all imgs have loaded
    if (isFlag) {
        loading({loadingState: true, text: 'LOADING QUESTION...'});
        imagesLoaded(document.querySelector('.flag-answer-container'), () => {
            loading({loadingState: false});
            questionContainer.classList.remove('no-show');
        });
    } else {
        questionContainer.classList.remove('no-show');
    }
}

// helpers

const handleQuestionCount = (container) => {
    const currentCount = count + 1;
    
    const counterDiv = elementCreator('p', {
        innerHTML: `Question ${currentCount}/15`,
        className: 'question-count'
    });

    container.appendChild(counterDiv);
}

const handleFlagImg = (el) => {
    const answer = elementCreator('div', {className: 'flag-answer'});
    const imgContainer = elementCreator('div', {className: 'img-container'});
    const imgEl = elementCreator('img', {src: el});
    
    imgContainer.appendChild(imgEl);
    answer.appendChild(imgContainer);
    // add handler to flag img container
    imgContainer.addEventListener('click', handleCheckAnswer);
    
    return answer;
}

export const removeListeners = () => {
    [...document.querySelectorAll('.img-container, .answer-container .answer')].forEach((el) => el.removeEventListener('click', handleCheckAnswer));
}

const finish = () => {
    elementRemover('#questionContainer');
    // render the score route
    showScore();
    resetScoreUi();
    handleScoreUi();
}

// handlers

export const handleCheckAnswer = ({ target }) => {
    const { difficulty } = utils.getPlayerInfo();
    const isFlag = target.nodeName === 'IMG' ? true : false;
    
    if (difficulty === 'hard') {
        resetTimer();
    }
    
    // process answer ui
    checkAnswer(questions[count], {
        isFlag, 
        answer: isFlag ? target.src : target.innerHTML,
        answerEl: isFlag ? target.parentElement : target
    });
    
    removeListeners();
}

export const incrementHandler = () => {
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
};