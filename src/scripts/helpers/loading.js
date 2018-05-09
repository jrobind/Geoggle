const loadingDiv = document.querySelector('#loading');

export default ({ loadingState, text = 'Loading...' }) => {
    if (!loadingState) {
        loadingDiv.classList.add('no-show');
        loadingDiv.innerHTML = '';
    } else {
        loadingDiv.classList.remove('no-show');
        loadingDiv.innerHTML = text;
    } 
}