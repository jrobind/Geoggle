import { fetchQuestions } from '../api';
import utils from '../utils';
import timer from './timer';
import loading from './loading';
import { updateScore, handleScoreUi } from './score';
const quiz = document.querySelector('#quiz');
const imagesLoaded = require('imagesloaded');

const { difficulty } = utils.getPlayerInfo();
const { shuffle, elementCreator, formatTitle, elementRemover, classHandler } = utils;

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
            console.log(data)
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
    
    const questionUl = elementCreator('ul');
    
    // append question options
    shuffle(incorrectAnswers.concat(correctAnswer)).forEach((el) => {
        let option;
        // check whether the question relates to flags or not
        if (!title.includes('flag')) {
            option = elementCreator('li', {innerHTML: el})
            option.addEventListener('click', addSelect);
        } else {
            option = handleFlagImg(el); 
        }
        questionUl.appendChild(option);
    });
    
    questionDiv.appendChild(questionTitle);
    questionDiv.appendChild(questionUl);
    questionDiv.appendChild(nextQuestionBtn());
    // initially set quiz div to display: none, in case we need to wait for flag img loading
    questionDiv.classList.add('no-show');
    questionContainer.appendChild(questionDiv);
    quiz.appendChild(questionContainer);
    // if difficulty is hard set the timer
    difficulty === 'hard' ? timer.setTimer() : null;
    
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

const handleFlagImg = (el) => {
    const liEl = elementCreator('li');
    const imgEl = elementCreator('img', {src: el});
    liEl.appendChild(imgEl);
    // add handler to li containing flag img
    liEl.addEventListener('click', addSelect);
    
    return liEl;
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

const finishSetup = () => {
    elementRemover('#question');
    // create 'see score' btn
    const finishBtn = elementCreator('button', {id: 'finish', innerHTML: 'see score'})
    // add handler
    finishBtn.addEventListener('click', handleScoreUi);
    quiz.appendChild(finishBtn);   
}

const increment = () => {
    const { difficulty } = utils.getPlayerInfo();
    
    if (count !== 14) {
        count++;
        // reset countdown interval before removal
        difficulty === 'hard' ? timer.resetTimer() : null;
        elementRemover('#question');
        questionCreator(questions[count]);
    } else {
        difficulty === 'hard' ? timer.resetTimer() : null;
        finishSetup();
    }    
}

// handlers

const addSelect = ({ target }) => {
    const isFlag = target.nodeName === 'IMG' ? true : false;
    
    // add selected style
    classHandler(isFlag ? target.parentElement : target, {
        className: 'selected', 
        allElements: [...document.querySelectorAll('#question li')]
    });
}

const incrementHandler = () => {
    const { correctAnswer, points, title } = questions[count];
    const checkedAnswers = [...document.querySelectorAll('#question li')].filter((el) => el.classList.contains('selected'));
    
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