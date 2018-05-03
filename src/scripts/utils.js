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
    }
}