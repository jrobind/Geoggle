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
    duplicator(question, number = 3){
        const arr = [];
        for (let i = 0; i < number; i++) {
            arr.push(question);
        }
        return arr;
    },
    formatPopulation(array) {
        // make population number more readable 
        return array.forEach(({ population }, index, arr) => arr[index].population = population.toLocaleString('en'));
    },
    elementCreator(type, options) {
        const el = document.createElement(type);
        // process any attributes
        if (options) {
            const { innerHTML, src, id } = options;
            
            innerHTML ? el.innerHTML = innerHTML : null;
            src ? el.setAttribute('src', src) : null;
            id ? el.id = id : null;
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
    }
}