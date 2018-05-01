const loadingDiv = document.querySelector('#loading');

export default (loadingState) => {
    if (!loadingState) {
        loadingDiv.classList.add('no-show');
    } else {
        loadingDiv.classList.remove('no-show');
    } 
}