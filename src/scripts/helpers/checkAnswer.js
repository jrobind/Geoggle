import { updateScore } from './score';
import utils from '../utils';
import { incrementHandler, removeListeners } from './createQuestions';

const { elementCreator } = utils;

export default ({ correctAnswer, title }, answerData) => {
    // build answer ui feedback
    if (answerData) {
        const { isFlag, answer, answerEl } = answerData;
        const questionDiv = document.querySelector('#question');
        
        if (answer === correctAnswer) {
            updateScore();
            // add correct class to answer element
            answerEl.classList.add('selected-correct');
            // append the next question btn
            questionDiv.appendChild(nextQuestionBtn());
        } else {
            // add incorrect class to answer element
            answerEl.classList.add('selected-incorrect');
            // add flashing correct class
            handleFlash(isFlag, correctAnswer);
        }      
    } else {
        // determine if flag question
        handleFlash(title.includes('flag'), correctAnswer);
        removeListeners();
    }
}

const handleFlash = (isFlag, correctAnswer) => {
    const questionDiv = document.querySelector('#question');
    let intervalId;
    let flashCount = 0;
    
    [...document.querySelectorAll(isFlag ? '.img-container img' : '.answer')].forEach((el) => {
        const elAnswer = isFlag ? el.src : el.innerHTML;
        const elForCorrectClass = isFlag ? el.parentElement : el;

        if (elAnswer === correctAnswer) {
            intervalId = setInterval(() => {
                if (flashCount === 7) {
                    questionDiv.appendChild(nextQuestionBtn());
                    clearInterval(intervalId);
                } else {
                    // create flash effect
                    if (elForCorrectClass.classList.contains('selected-correct')) {
                        elForCorrectClass.classList.remove('selected-correct');
                    } else {
                        elForCorrectClass.classList.add('selected-correct');   
                    }

                    flashCount++;   
                }
            }, 400);
        }
    });
}

const nextQuestionBtn = (questionNumber) => {
    const nextBtn = elementCreator('button', {id: 'next', innerHTML: 'Next Question'});
    // setup increment handler for next question
    nextBtn.addEventListener('click', incrementHandler);
    return nextBtn;
}