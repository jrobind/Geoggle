import { fetchQuestions } from './api';
import shuffle from './shuffle';
import { updateScore, handleScoreUi } from './score';
const quiz = document.querySelector('#quiz');

let count = 0;

let questions;

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
        })
}

const questionCreator = ({ 
    title, 
    correctAnswer, 
    incorrectAnswers,
    answers,
    replaceUnderscore 
}) => {
    // replace the title underscore with correct value
    title = formatTitle(title, replaceUnderscore);
    
    // build question
    const questionDiv = document.createElement('div');
    questionDiv.id = 'question';
    
    // create question title
    const questionTitle = document.createElement('h2');
    questionTitle.innerHTML = title;
    
    const questionUl = document.createElement('ul');
    
    // append question options
    shuffle(incorrectAnswers.concat(correctAnswer)).forEach((el) => {
        // check whether the question relates to flags or not
        const option = !title.includes('flag') ? document.createElement('li') : document.createElement('img');
        // set src attribute for img if dealing with flags, otherwise just set text
        !title.includes('flag') ? option.innerHTML = el : option.setAttribute('src', el);
        // setup click handler for each option
        option.addEventListener('click', checkAnswer);
        questionUl.appendChild(option);
    });
    
    questionDiv.appendChild(questionTitle);
    questionDiv.appendChild(questionUl);
    questionDiv.appendChild(nextQuestionBtn());
    quiz.appendChild(questionDiv);
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

    // add selected style
    target.classList.add('selected');
    
    if (target.innerText === correctAnswer) {
        updateScore(points);
    }
    
    removeListeners();
}

const removeListeners = () => {
    [...document.querySelectorAll('li')].forEach((el) => el.removeEventListener('click', checkAnswer));
}

const incrementCount = () => {
    // check if user has selected an answer. If not, prevent from moving on
    if (![...document.querySelectorAll('#question li')].filter((el) => el.classList.contains('selected')).length) {
        alert('Please select an answer');
    } else {
        if (count !== 14) {
            count++;
            removeQuestion();
            questionCreator(questions[count]);   
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