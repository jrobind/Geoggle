export default {
    shuffle(array) {
        // shuffle array in place and splice and format population number if necessary
        for (let i = array.length -1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1));
            [array[i], array[random]] = [array[random], array[i]];
        }

        return array; 
    },
    getPlayerInfo() {
        return JSON.parse(localStorage.getItem('current player'));
    },
    removePlayer() {
        const nameInput = document.querySelector('.playername-container');
        nameInput.classList.contains('no-show') ? nameInput.classList.remove('no-show') : null;
        localStorage.clear();
    },
    duplicator(question, number = 3){
        const arr = [];
        for (let i = 0; i < number; i++) {
            arr.push(question);
        }
        return arr;
    },
    formatPopulation(array) {
        // make population number more readable 
        array.forEach(({ population }, index, arr) => arr[index].population = population.toLocaleString('en'));
        
        return array;
    },
    formatFlagLink(array) {
        array.forEach((country, index, arr) => {
            // grab country code
            const code = country.alpha2Code.toLowerCase();
            // replace current link with call to flag png
             arr[index].flag = `http://flagpedia.net/data/flags/normal/${code}.png`; 
        });
        
        return array;        
    },
    elementCreator(type, options) {
        const el = document.createElement(type);
        // process any attributes
        if (options) {
            const { innerHTML, src, id, className } = options;
            
            innerHTML ? el.innerHTML = innerHTML : null;
            src ? el.setAttribute('src', src) : null;
            id ? el.id = id : null;
            // check if there is more than one classname
            if (Array.isArray(className)) {
                className.forEach((name) => el.classList.add(name))
            } else {
                className ? el.classList.add(className) : null;   
            }
        }
        
        return el;
    },
    elementRemover(selector) {
        const el = document.querySelector(selector);
        
        if (el) {
            el.parentNode.removeChild(el);
        } else {
            return;
        }
    },
    formatTitle(title, replaceUnderscore) {
        return title.replace('_', replaceUnderscore);
    },
    classHandler(element, { className, allElements }) {
        // ensure only one element has class at any given time
        allElements.forEach((el) => el.classList.remove(className));
        element.classList.add(className);
    }
}