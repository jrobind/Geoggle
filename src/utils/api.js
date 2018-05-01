import shuffle from './shuffle';
import loading from './loading';

// excluded countries with missing region and subregion data
const EXCLUDE_ONE = 'Antarctica';
const EXCLUDE_TWO = 'Heard Island and McDonald Islands';
const EXCLUDE_THREE = 'Bouvet Island';

const dataBank = {
    countries: null,
    formattedQuestions: null
}

const incorrectAnswers = {
    flags: [],
    names: [],
    capitals: [],
    populations: []
}

const populateIncorrectAnswers = () => {
    const { countries } = dataBank;
    const { flags, capitals, populations, regions, subregions, names } = incorrectAnswers;
    
    const incorrectArr = countries.slice(15, 30);
    // add 9 incorrect answers to each property
    incorrectArr.map(({ flag, capital, name, region, subregion, population }) => {
        flags.length !== 9 ? flags.push(flag) : null;
        capitals.length !== 9 ? capitals.push(capital) : null;
        names.length !== 9 ? names.push(name) : null;
        populations.length !== 9 ? populations.push(population) : null;
    });
}

const formatQuestion = () => {
    const { countries } = dataBank;
    const questionDrafts = [
        'Which is the flag of _ ?', 
        '_ belongs to which region of the world?',
        '_ is the capital of which country?', 
        '_ is found in which world subregion?',
        'The population of _ is aproximately how many?'
    ];
    let questionTitles = [
        ...duplicator(questionDrafts[0]), 
        ...duplicator(questionDrafts[1]),
        ...duplicator(questionDrafts[2]),
        ...duplicator(questionDrafts[3]),
        ...duplicator(questionDrafts[4]),
    ];
    // shuffle the question titles
    questionTitles = shuffle(questionTitles, false);
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
                    incorrectAnswers: getIncorrect('flags'),
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
                    incorrectAnswers: getIncorrect('names'),
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
                    incorrectAnswers: getIncorrect('populations'),
                    correctAnswer: population,
                    points: 3
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
        }
    }); 
}

const getIncorrect = (property) => {
    const answers = incorrectAnswers[property].slice(0, 3);
    incorrectAnswers[property].splice(0, 3);
    
    return answers;
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
    ]
    
    // make sure we have no duplicate subregion answers
    const correctIndex = subregions.indexOf(correct);
    subregions.splice(correctIndex, 1);
    subregions.length = 3;
    
    return subregions;
}

const duplicator = (question) => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
        arr.push(question)
    }
    return arr;
} 

const formatPopulation = (arr) => {
    arr.forEach(({ population }, index, arr) => arr[index].population = population.toLocaleString('en'));
    return arr;
};

export const fetchQuestions = () => {
    loading(true);
    
    return fetch('https://restcountries.eu/rest/v2/all?fields=name;capital;flag;population;region;subregion')
        .then((response) => response.json())
        .then((data) => {
            // remove countries with missing data 
            const filteredCountries = data.filter(({ name }) => name !== EXCLUDE_ONE || name !== EXCLUDE_TWO || name !== EXCLUDE_THREE);
            // shuffle remaining countries and format population number
            dataBank.countries = formatPopulation(shuffle(filteredCountries, true));
            // populate incorrect answers
            populateIncorrectAnswers();
            // create formatted questions
            dataBank.formattedQuestions = formatQuestion();
            loading(false);
            return dataBank.formattedQuestions;
        })
        .catch((error) => console.log(error));
}