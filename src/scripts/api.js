import loading from './helpers/loading';
import formatQuestion from './helpers/formatQuestion';
import utils from './utils';

// excluded countries with missing region and subregion data
const EXCLUDE_ONE = 'Antarctica';
const EXCLUDE_TWO = 'Heard Island and McDonald Islands';
const EXCLUDE_THREE = 'Bouvet Island';

const easyFilter = (countries) => {
    // remove small islands and also remove countries within oceania region except for Australia and New Zealand
    const ausNz = countries.filter(({ name }) => name === 'Australia' || name === 'New Zealand');
    
    return countries.filter(({ name, region }) => name !== EXCLUDE_ONE && !name.includes('Island') && region !== 'Oceania')
        .concat(ausNz);
};

export const fetchQuestions = () => {
    const { difficulty } = utils.getPlayerInfo();
    const { shuffle } = utils;
    
    loading(true);
    
    // determine diffculty mode
    if (difficulty === 'easy') {
        return fetch('https://restcountries.eu/rest/v2/all?fields=name;capital;flag;region;')
            .then((response) => response.json())
            .then((data) => {
                // format for easier countries, shuffle, and format questions
                const formatted = formatQuestion(shuffle(easyFilter(data)), 'easy');
                loading(false);
                return formatted;
            })
            .catch((error) => console.log(error)); 
    } else {
        return fetch('https://restcountries.eu/rest/v2/all?fields=name;capital;flag;population;region;subregion')
            .then((response) => response.json())
            .then((data) => {
                // remove countries with missing data 
                const filteredCountries = data.filter(({ name }) => name !== EXCLUDE_ONE && name !== EXCLUDE_TWO && name !== EXCLUDE_THREE);
                // format population number
                utils.formatPopulation(filteredCountries);
                // shuffle remaining countries, format population number and format questions
                const formatted = formatQuestion(shuffle(filteredCountries), 'hard');
                loading(false);
                return formatted;
            })
            .catch((error) => console.log(error));    
    }
    
}