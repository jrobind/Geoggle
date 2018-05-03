import utils from '../utils';

export default {
    incorrect(countries, type) {
        const { shuffle } = utils;
        
        return shuffle(countries.slice(15)).map((country) => country[type]).splice(0, 3);  
    },
    incorrectRegion(correct) {
        const regions = ['Oceania', 'Asia', 'Africa', 'Americas', 'Europe'];
    
        // ensure the correct answer is not duplicated
        const correctIndex = regions.indexOf(correct);
        regions.splice(correctIndex, 1);
        regions.pop();

        return regions;
    },
    incorrectSubregion(correct) {
        const subregions = [
            'Northern America', 'Central America', 'Caribbean', 'South America', 'Northern Europe', 'Western Europe', 
            'Southern Europe', 'Eastern Europe', 'Northern Africa', 'Western Africa', 'Middle Africa', 'Southern Africa', 
            'Eastern Africa', 'Western Asia', 'Central Asia', 'Southern Asia', 'Eastern Asia', 'Southeastern Asia', 
            'Micronesia', 'Melanesia', 'Polynesia', 'Australia and New Zealand'
        ];

        // make sure we have no duplicate subregion answers
        const correctIndex = subregions.indexOf(correct);
        subregions.splice(correctIndex, 1);
        subregions.length = 3;

        return subregions;
    }
}
