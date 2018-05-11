import checkAnswer from './checkAnswer';

let intervalId;

export default {
    setTimer(questionData) {
        const time = document.querySelector('.timer');
        
        let counter = 10;
        // set initial starting time
        time.innerHTML = `00:${counter}`;

        intervalId = setInterval(() => {  
            if (counter === 0) {
                clearInterval(intervalId);
                // move to next question
                checkAnswer(questionData, null);
            } else {
                // last 5 seconds add countdown warning class
                if (counter <= 6) {
                    time.classList.add('warning');
                }
                // increment counter and update counter ui
                counter--;
                time.innerHTML = `00:0${counter}`;   
            }
        }, 1000);    
    },
    resetTimer() {
        clearInterval(intervalId);
    }
}