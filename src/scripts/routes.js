const display = [...document.querySelectorAll('#home, #setup, #quiz, #score')];

const routeHandler = {
    init() {
        display.forEach((el) => el.id === 'home' ? null : el.classList.add('no-show'));
    },
    showHome() {
        handleClass('home');
    },
    showSetup() {
        handleClass('setup');
        // set autofocus on nickname/playername input
        document.querySelector('#playerName').focus();
    },
    showQuiz() {
        handleClass('quiz');
    },
    showScore() {
        handleClass('score');
    }
}

const handleClass = (id) => {
    display.forEach((el) => {
        if (el.classList.contains('no-show') && el.id === id) {
                el.classList.remove('no-show');
        } else if (el.id !== id) {
                el.classList.add('no-show');
        }
    }); 
}

export default routeHandler;