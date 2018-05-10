import 'isomorphic-fetch';
import loading from './helpers/loading';
import formatQuestion from './helpers/formatQuestion';
import exclude from './exclude';
import utils from './utils';

const countryFilter = (countries) => {
    // remove countries without png flag reference
    const filtered = countries.filter(({ name }) => !exclude.includes(name))
    // switch incorrect country code for Kosovo flag
    filtered.forEach((country, index, array) => {
        if (country.name === 'Republic of Kosovo') {
            array[index].alpha2Code = 'KS';
        }
    });
    
    return filtered;
};

export const fetchQuestions = () => {
    const { difficulty } = utils.getPlayerInfo();
    const { shuffle, formatFlagLink, formatPopulation } = utils;
    const URL = difficulty === 'easy' ? 'https://restcountries.eu/rest/v2/all?fields=name;capital;region;alpha2Code' : 
    'https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;subregion;alpha2Code';

    loading({loadingState: true});
    
    // make api call and format results
    return fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            const formattedCountries = difficulty === 'hard' ? formatFlagLink(formatPopulation(countryFilter(data))) : formatFlagLink(countryFilter(data));
            // create formatted questions from countries array and shuffle
            const finalFormat = formatQuestion(shuffle(formattedCountries), difficulty);
            loading({loadingState: false});
            return finalFormat;
        });
}