'use strict';

// PART 0 - Review Lab 1 partial solutions

import BarChart from './BarChart.js';
import DonutChart from './DonutChart.js';

let cities  = [
    {city:'Dubai', pop: 3604000, area: 1610, alt: 5},
    {city:'Edinburgh', pop: 506000, area: 119, alt: 47},
    {city:'Lagos', pop: 8048000, area: 1171, alt: 41},
    {city:'Ottawa', pop: 1017000, area: 2790, alt: 70},
    {city:'Putrajaya', pop: 109000, area: 49, alt: 38},
    {city:'Qingdao', pop: 10071000, area: 11228, alt: 25}
];

let barData = cities.map(d=>[d.city,d.alt]);
let donutData = cities.map(d=>[d.city,d.pop]);

let bar1 = new BarChart('div#bar1', 600, 500, [25,40,80,5]);
bar1.render(barData).setTitle('Altitude by city').setLabels('City', 'Altitude');

let donut1 = new DonutChart('div#donut1', 600, 500, [25,5,5,5]);
donut1.render(donutData).setTitle('Population by city');

// PART 1 - Fetch movies_mock.csv
// let data = d3.csv("data/movies_mock.csv")    //SHOWS A PROMISE IN THE CONSOLE
// let data = await d3.csv("data/movies_mock.csv")
// console.log(data);

let data1 = await d3.csv("data/movies_mock.csv",(d)=>{
        // release_year:new year(+d.Year, 0, 1),
        const revenues = +d.revenues;   //PARSING THESE HERE BECAUSE ITS NEEDED FOR CALCULAING POSITIVE?NEGATIVE PROFIT.
        const budget = +d.budget;
        const profit = revenues - budget;  // Calculate profit as the difference
        // Check if the profit is positive
        const positive = profit > 0;
        return{
    
        year: new Date(+d.release_year, 0, 1),  //CHANGES TO GMT jan 1 for all years
        // year1: +d.release_year,              //JUST changes the year to number from string:NO DATE FORMAT here
        month: +d.release_month - 1,  // Store month as 0-based (0-11)-JS STyLE
        genre: d. genre,
        director: d. director,
        // budget: +d.budget,
        // revenues: +d.revenues,
        ratings_A: +d.ratings_A,
        ratings_B: +d.ratings_B,
        ratings_C: +d.ratings_C,
        // profit: +d.revenues- +d.budget,
        // positive: +d.profit > 0 //FINDS THE VALUE NOT USING PROFIT, BUT USING BUDGET AND REVENUES.INSTEAD DO THIS OUTSIDE.
        revenues: +d.revenues,   //PARSING THESE HERE BECAUSE ITS NEEDED FOR CALCULAING POSITIVE?NEGATIVE PROFIT.
        budget: +d.budget,
        profit: profit,
        positive: positive 
    };
});
// console.log(data1);


// @TEST1
// data1.slice(0,5).forEach((row, index) => {
//     console.log(`Row ${index}:`);
//     console.log(`  Year is Date: ${row.year instanceof Date}`);
//     console.log(`  Month is number: ${typeof row.month === 'number'}`);
//     console.log(`  Budget is number: ${typeof row.budget === 'number'}`);
//     console.log(`  Revenues is number: ${typeof row.revenues === 'number'}`);
//     console.log(`  Ratings_A is number: ${typeof row.ratings_A === 'number'}`);
//     console.log(`  Ratings_B is number: ${typeof row.ratings_B === 'number'}`);
//     console.log(`  Ratings_C is number: ${typeof row.ratings_C === 'number'}`);
//     console.log(`  Profit is number: ${typeof row.profit === 'number'}`);
// });

// console.log(data.slice(0, 5)); // Logs the first 5 rows
// console.log(data1.slice(0, 5)); // Logs the first 5 rows


// let movies = await ...

// console.log(movies);

//====================================

// PART 2 - Query the dataset

console.log(data1);


//  What are the unique genres of movie? 
// let uniqueGenres = data1.map(d=>d.genre).filter((genre,index,self) => self.indexOf(genre) === index);
// console.log(uniqueGenres);
let uniqueGenres = [new Set(data1.map(d=>d.genre))];
console.log(uniqueGenres);


// How many unique directors are there? 
// let uniqueDirector = data1.map(d=>d.director).filter((genre,index,self) => self.indexOf(genre) === index);
// console.log(uniqueGenres);
let uniqueDirector = [new Set(data1.map(d=>d.director))];
console.log(uniqueDirector);


//  What’s the total sum of revenue in the industry? 
let totalRevenue = data1.reduce((d,reven)=>{
    return (d + reven.revenues);
},0);   //INITIAL VALUE
console.log(totalRevenue);


//  How many movies were released between 2012 and 2014 (included)? 
// let moviesbtw = data1.filter(d =>{
//     return d.year1>=2012 && d.year1<=2014;        // if year is parced as date only=ie,not to jan 1 for each year(DATE FORMAT),this is easier
// });                                               //WORKS FOR YEAR1 attribute/object of the commented PARSING STRUCTURE;
// console.log(moviesbtw);

let moviesbtwyears = data1.filter(d =>{
    let movieyear = d.year.getFullYear();       //GIVES 2023 number as year instead of 23 or JAN 1 2023 or anything else.
    return (movieyear>=2012 && movieyear<2015);
});
console.log(moviesbtwyears);
// console.log(moviesbtwyears.length);

//  What is the average rating on website A for comedy movies? 

let movieslowercase = data1.filter(d => d.genre.toLowerCase() === "comedy");
let averageRating = movieslowercase.reduce((sum,movie) => {
    return sum + movie.ratings_A;
},0)/movieslowercase.length;

    console.log(`Average of Float between 0 and 10 is ${averageRating.toFixed(2)}`);

//  Has the industry made more profit before 2015 (included) or after? 

let profitBefore15 = data1.filter(d=> d.year<=2015)
let profitBefore = profitBefore15.reduce((d,movie)=>d + movie.profit,0);  
console.log(profitBefore);

let profitAfter15 = data1.filter(d=> d.year>2015)
let profitAfter = profitAfter15.reduce((d,movie)=>d + movie.profit,0);   
console.log(profitAfter);

if(profitBefore > profitAfter){
    console.log(`Industry has made a profit of ${profitBefore.toFixed(2)} Before 2015`);
}else{
    console.log(`Industry has made a profit of ${profitAfter.toFixed(2)} After 2015`);
}


// What’s the average budget of drama movies with a rating above 70% on website C? 
let dramaMovies =data1.filter(d=> d.genre.toLowerCase() === "drama")
    .filter(d=> d.ratings_C >70)
    console.log(dramaMovies);
let averageBudget = dramaMovies.reduce((d,movie) => {
        return d + movie.budget;
    },0)/dramaMovies.length;
console.log(averageBudget);

// let budgetAverage

// PART 3 -  Make aggregations

// Group the movies by Director and then by Genre.  
let moviesByDirectorByGenre = d3.group(data1, d => d.director, d => d.genre)
console.log(moviesByDirectorByGenre);

// Group the movies by Year and then Genre, and get the number of movies for each subset
    let moviesByYearByGenre = d3.rollup(data1,
    a=>a.length, 
    d => d.year.getFullYear(), 
    d => d.genre);
console.log(moviesByYearByGenre);


// Distribute the entries into 10 equally-sized categories based on budget values. 
const binning = d3.bin()
        .value(d=> d.budget)
        .domain([d3.min(data1, d=>d.budget), d3.max(data1, d=>d.budget)])
        .thresholds(10);
const bins = binning(data1);
console.log(bins);


// What are the average profits by Director? 
const profitByDirector = d3.group(data1, 
        d => d.director);
const meanProfitByDirector = new Map();
profitByDirector.forEach((movies, director) => {
    const meanProfit = d3.mean(movies, d => d.profit);  // Calculate mean profit for each director
    meanProfitByDirector.set(director, meanProfit);      // Store the result in the map
})
console.log(meanProfitByDirector);


// What are the total revenues by Genre? 
const revenueByGenre = d3.group(data1, d => d.genre);
const totalRevenueByGenre = new Map();
revenueByGenre.forEach((movies, genre) => {
    const totalRevenue = d3.sum(movies, d => d.revenues);  // Sum the revenues for each genre
    totalRevenueByGenre.set(genre, totalRevenue);  // Store the total revenue in the map
});

console.log(totalRevenueByGenre);


// Construct a new array, each entry with two values: the Director name and their ratio of commercial success (profitable / total number of movies) 
let successRatioByDirector = d3.rollup(data1, 
    v => {
        const totalMovies = v.length;
        const profitableMovies = v.filter(d => d.positive).length;
        return profitableMovies / totalMovies;  // Commercial success ratio
    },
    d => d.director  // Group by Director
);
console.log(successRatioByDirector); 


// Are there any common entries in both the top 10 Comedy (by revenue) and the top 10 directed by Professor Plum (by revenue)? 

let top10Comedy = data1.filter(d => d.genre === "Comedy")       // Get top 10 Comedy movies by revenue
    .sort((a, b) => b.revenues - a.revenues)  // Sort by revenue descending
    .slice(0, 10);  // Take top 10

let top10PlumDirected = data1.filter(d => d.director === "Professor Plum")      // Get top 10 movies directed by Professor Plum by revenue
    .sort((a, b) => b.revenues - a.revenues)  // Sort by revenue descending
    .slice(0, 10);  // Take top 10

let commonEntries = top10Comedy.filter(comedyMovie =>           // Find common movies in both top 10 Comedy and top 10 Professor Plum directed
    top10PlumDirected.some(plumMovie => plumMovie === comedyMovie)
);

console.log(commonEntries);  


// PART 4 - Histogram

// import Histogram from './Histogram.js';
// let histo1 = new Histogram('div#histo1', 600, 500, [25,40,80,5]);
// let distributionData = ...
// let thresholds = ...
// histo1.render(distributionData,thresholds).setTitle('Distribution of ...').setLabels('...', 'Frequency');

// PART 5 - Reshape movies dataset

// let cleanMovies = ...