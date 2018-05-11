import getIncorrect from './incorrectAnswers';
import utils from '../utils';

export default (countries, difficulty = 'easy') => {
    const { incorrect, incorrectRegion, incorrectSubregion } = getIncorrect;
    const { shuffle } = utils; 
    
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
            ...utils.duplicator(drafts[0], 15), 
//            ...utils.duplicator(drafts[1], 5),
//            ...utils.duplicator(drafts[2], 5),
        ];
    } else {
        questionTitles = [
            ...utils.duplicator(drafts[0], 4), 
            ...utils.duplicator(drafts[1], 1),
            ...utils.duplicator(drafts[2], 4),
            ...utils.duplicator(drafts[3], 2),
            ...utils.duplicator(drafts[4], 4),
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
                    incorrectAnswers: incorrect(countries, 'flag'),
                    correctAnswer: flag
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case '_ belongs to which region of the world?':
                questionObj = {
                    title,
                    replaceUnderscore: name, 
                    incorrectAnswers: incorrectRegion(region),
                    correctAnswer: region
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case '_ is the capital of which country?':
                questionObj = {
                    title,
                    replaceUnderscore: capital, 
                    incorrectAnswers: incorrect(countries, 'name'),
                    correctAnswer: name
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case '_ is found in which world subregion?':
                questionObj = {
                    title,
                    replaceUnderscore: name, 
                    incorrectAnswers: incorrectSubregion(subregion),
                    correctAnswer: subregion
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
            case 'The population of _ is aproximately how many?':
                questionObj = {
                    title,
                    replaceUnderscore: name, 
                    incorrectAnswers: incorrect(countries, 'population'),
                    correctAnswer: population
                }
                
                questionsArr.splice(0, 1);
                return questionObj;
                break;
        }
    }); 
}