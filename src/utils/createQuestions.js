import { fetchQuestions } from './api';
import shuffle from './shuffle';
import setTimer from './timer';
import { getPlayerInfo } from './player';
import { updateScore, handleScoreUi } from './score';
const quiz = document.querySelector('#quiz');

let count = 0;
let questions;
const { difficulty } = getPlayerInfo();

export default () => {
    fetchQuestions()
        .then((data) => {
            // reset the count and remove score button for restarted games
            count = 0;
            removeScoreBtn();
            // set the current question data
            questions = data;
            console.log(data)
            // create the ui for the question
            questionCreator(data[count])
            // if difficulty is hard set the timer
            difficulty === 'hard' ? setTimer() : null;
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
    
    // build question
    const questionDiv = document.createElement('div');
    questionDiv.id = 'question';
    
    // determine whether we need a timer for hard difficulty
    if (difficulty === 'hard') {
        const timerDiv = document.createElement('div');
        const pEl = document.createElement('p');
        pEl.id = 'timer';
        timerDiv.appendChild(pEl);
        questionDiv.appendChild(timerDiv);
    }
        
    // create question title
    const questionTitle = document.createElement('h2');
    questionTitle.innerHTML = title;
    
    const questionUl = document.createElement('ul');
    
    // append question options
    shuffle(incorrectAnswers.concat(correctAnswer)).forEach((el) => {
        let option;
        // check whether the question relates to flags or not
        if (!title.includes('flag')) {
            option = document.createElement('li');
            option.innerHTML = el;
            option.addEventListener('click', checkAnswer);
        } else {
            option = handleFlagImg(el); 
        }
        questionUl.appendChild(option);
    });
    
    questionDiv.appendChild(questionTitle);
    questionDiv.appendChild(questionUl);
    questionDiv.appendChild(nextQuestionBtn());
    quiz.appendChild(questionDiv);
}

const handleFlagImg = (el) => {
    const liEl = document.createElement('li');
    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', el);
    liEl.appendChild(imgEl);
    // add handler to li containing flag img
    liEl.addEventListener('click', checkAnswer);
    
    return liEl;
}

const formatTitle = (title, replaceUnderscore) => title.replace('_', replaceUnderscore);

const removeQuestion = () => {
    const question = document.querySelector('#question');
    question.parentNode.removeChild(question);
}

const removeScoreBtn = () => {
    const scoreBtn = document.querySelector('#finish');
    
    if (scoreBtn)  {
        scoreBtn.parentNode.removeChild(scoreBtn);   
    } else {
        return;
    }
}

const nextQuestionBtn = (questionNumber) => {
    const nextBtn = document.createElement('button');
    nextBtn.id = 'next';
    nextBtn.innerText = 'Next Question';
    // setup increment handler for next question
    nextBtn.addEventListener('click', incrementCount);
    return nextBtn;
}

// handlers
const checkAnswer = ({ target }) => {
    const { correctAnswer, points } = questions[count];
    const isFlag = target.nodeName === 'IMG' ? true : false;
    
    // add selected style
    if (isFlag) {
        target.parentElement.classList.add('selected');
        target.src === correctAnswer ? updateScore(points) : null;
    } else {
        target.classList.add('selected');  
        target.innerText === correctAnswer ? updateScore(points) : null;
    }
    
    removeListeners();
}

const removeListeners = () => {
    [...document.querySelectorAll('li')].forEach((el) => el.removeEventListener('click', checkAnswer));
}

const incrementCount = (outOfTime) => {
    const checkedAnswers = [...document.querySelectorAll('#question li')].filter((el) => el.classList.contains('selected')).length;
    // check if user has selected an answer. If not, prevent from moving on
    if (!checkedAnswers && !outOfTime) {
        alert('Please select an answer');
    } else {
        if (count !== 14) {
            count++;
            removeQuestion();
            questionCreator(questions[count]);
            difficulty === 'hard' ? setTimer() : null;
        } else { 
            removeQuestion();
            // create 'see score' btn
            const finishBtn = document.createElement('button');
            finishBtn.id = 'finish';
            finishBtn.innerText = 'see score'
            // add route handler
            finishBtn.addEventListener('click', handleScoreUi);
            quiz.appendChild(finishBtn);   
        }    
    }
};

export { incrementCount };