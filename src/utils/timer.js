import { incrementCount } from './createQuestions';

export default () => {
    const time = document.querySelector('#timer');
    // set initial starting time
    time.innerHTML = '10';
    
    const id = setInterval(() => {
        if (time.innerHTML === '0') {
            clearInterval(id);
            time.innerHTML = 'You are out of time!';
            // move on to next question after short delay
            setTimeout(() => {
                incrementCount(true);
            }, 1500);
        } else {
            time.innerHTML = time.innerHTML -1;   
        }
    }, 1000);  
}