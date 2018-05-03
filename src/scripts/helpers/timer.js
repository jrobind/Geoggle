import { forceNextQuestion } from './createQuestions';

let intervalId;

export default {
    setTimer() {
        const time = document.querySelector('#timer');
        
        let counter = 10;
        // set initial starting time
        time.innerHTML = `00:${counter}`;

        intervalId = setInterval(() => {  
            if (counter === 0) {
                clearInterval(intervalId);
                // move to next question
                forceNextQuestion();
            }
            counter--;
            time.innerHTML = `00:0${counter}`;
        }, 1000);    
    },
    resetTimer() {
        clearInterval(intervalId);
    }
}