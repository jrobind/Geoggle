import shuffle from './shuffle';
import loading from './loading';
import { getPlayerInfo } from './player';

// excluded countries with missing region and subregion data
const EXCLUDE_ONE = 'Antarctica';
const EXCLUDE_TWO = 'Heard Island and McDonald Islands';
const EXCLUDE_THREE = 'Bouvet Island';

const dataBank = {
    countries: null,
    formattedQuestions: null
}

const formatQuestion = (difficulty) => {
    const { countries } = dataBank;
    let questionTitles;
    const drafts = [
        'Which is the flag of _ ?', 
        '_ belongs to which region of the world?',
        '_ is the capital of which country?', 
        '_ is found in which world subregion?',
        'The population of _ is aproximately how many?'
    ];
    // remove population and subregion questions for easy difficulty
    if (difficulty === 'easy') {
        questionTitles = [
            ...duplicator(drafts[0], 5), 
            ...duplicator(drafts[1], 5),
            ...duplicator(drafts[2], 5),
        ];
    } else {
        questionTitles = [
            ...duplicator(drafts[0], 4), 
            ...duplicator(drafts[1], 1),
            ...duplicator(drafts[2], 4),
            ...duplicator(drafts[3], 2),
            ...duplicator(drafts[4], 4),
        ];
    }

    // shuffle the question titles
    questionTitles = shuffle(questionTitles);
    // countries for correct answers
    const questionsArr = countries.slice(0, 15);
    
    // format the questions
    return questionTitles.map((title) => {
        const { name,  flag, region, capital, subregion, population } = questionsArr[0];
        let questionObj;
        
        switch(title) {
            case 'Which is the flag of _ ?':
                questionObj = {
                    title,
                    replaceUnderscore: name, 
                    incorrectAnswers: getIncorrect('flag'),
                    correctAnswer: flag,
                    points: 2
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case '_ belongs to which region of the world?':
                questionObj = {
                    title,
                    replaceUnderscore: name, 
                    incorrectAnswers: getIncorrectRegion(region),
                    correctAnswer: region,
                    points: 1
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case '_ is the capital of which country?':
                questionObj = {
                    title,
                    replaceUnderscore: capital, 
                    incorrectAnswers: getIncorrect('name'),
                    correctAnswer: name,
                    points: 2
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case '_ is found in which world subregion?':
                questionObj = {
                    title,
                    replaceUnderscore: name, 
                    incorrectAnswers: getIncorrectSubregion(subregion),
                    correctAnswer: subregion,
                    points: 2
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case 'The population of _ is aproximately how many?':
                questionObj = {
                    title,
                    replaceUnderscore: name, 
                    incorrectAnswers: getIncorrect('population'),
                    correctAnswer: population,
                    points: 3
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
        }
    }); 
}

const getIncorrect = (type) => {
    const { countries } = dataBank;
    
    return shuffle(countries.slice(15)).map((country) => country[type])
            .splice(0, 3);
}

const getIncorrectRegion = (correct) => {
    const regions = ['Oceania', 'Asia', 'Africa', 'Americas', 'Europe'];
    
    // ensure the correct answer is not duplicated
    const correctIndex = regions.indexOf(correct);
    regions.splice(correctIndex, 1);
    regions.pop();
    
    return regions;
}

const getIncorrectSubregion = (correct) => {
    const subregions = [
        'Northern America', 'Central America', 'Caribbean', 'South America', 'Northern Europe', 
        'Western Europe', 'Southern Europe', 'Eastern Europe', 'Northern Africa', 
        'Western Africa', 'Middle Africa', 'Southern Africa', 'Eastern Africa', 'Western Asia', 
        'Central Asia', 'Southern Asia', 'Eastern Asia', 'Southeastern Asia', 'Micronesia', 
        'Melanesia', 'Polynesia', 'Australia and New Zealand'
    ];
    
    // make sure we have no duplicate subregion answers
    const correctIndex = subregions.indexOf(correct);
    subregions.splice(correctIndex, 1);
    subregions.length = 3;
    
    return subregions;
}

const duplicator = (question, number = 3) => {
    const arr = [];
    for (let i = 0; i < number; i++) {
        arr.push(question)
    }
    return arr;
} 

const formatPopulation = (arr) => arr.forEach(({ population }, index, arr) => arr[index].population = population.toLocaleString('en'));

const easyFilter = (countries) => {
    // remove small islands and also remove countries within oceania region except for Australia and New Zealand
    const ausNz = countries.filter(({ name }) => name === 'Australia' || name === 'New Zealand');
    
    return countries.filter(({ name, region }) => name !== EXCLUDE_ONE && !name.includes('Island') && region !== 'Oceania')
        .concat(ausNz);
};

export const fetchQuestions = () => {
    const { difficulty } = getPlayerInfo();
    
    loading(true);
    
    // determine diffculty mode
    if (difficulty === 'easy') {
        return fetch('https://restcountries.eu/rest/v2/all?fields=name;capital;flag;region;')
            .then((response) => response.json())
            .then((data) => {
                // format for easier countries and shuffle
                dataBank.countries = shuffle(easyFilter(data));
                // create formatted questions
                dataBank.formattedQuestions = formatQuestion('easy');
                loading(false);
                return dataBank.formattedQuestions;
            })
            .catch((error) => console.log(error)); 
    } else {
        return fetch('https://restcountries.eu/rest/v2/all?fields=name;capital;flag;population;region;subregion')
            .then((response) => response.json())
            .then((data) => {
                // remove countries with missing data 
                const filteredCountries = data.filter(({ name }) => name !== EXCLUDE_ONE && name !== EXCLUDE_TWO && name !== EXCLUDE_THREE);
                // format population number
                formatPopulation(filteredCountries);
                // shuffle remaining countries and format population number
                dataBank.countries = shuffle(filteredCountries);
                // create formatted questions
                dataBank.formattedQuestions = formatQuestion('hard');
                loading(false);
                return dataBank.formattedQuestions;
            })
            .catch((error) => console.log(error));    
    }
    
}