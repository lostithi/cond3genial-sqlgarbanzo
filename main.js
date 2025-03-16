"use strict";

import BarChart from "./BarChart.js";
// import DonutChart from './DonutChart.js';

let movieDataFull = await d3.csv("data/movies_mock.csv", (d) => {
  return {
    year: +d.release_year,
    revenues: parseFloat(d.revenues),
    genre: d.genre,
  };
});

let bar1 = new BarChart("#bar1", 800, 500, [10, 40, 65, 10]),
  bar2 = new BarChart("#bar2", 800, 500, [10, 40, 65, 10]),
  bar3 = new BarChart("#bar3", 800, 500, [10, 40, 65, 10]);


// PART 2 - Add callbacks function for highlighting years (and removing the highlight)
// PART 2 - Attach the highlight callbacks to bar1 and bar2

// PART 2 - Add callback to filter Genres
// PART 2 - Attach the filter callback to bar3

bar1.setLabels("Year", "Total Revenues").render(yearRevenues);
bar2.setLabels("Year", "Total Number of Releases").render(yearCount);
bar3.setLabels("Genre", "Total Number of Releases").render(genreCount);

let highlightYear = (e, d) => {
  let year = d[0];
  bar1.highlightBars([year]);
  bar2.highlightBars([year]);
};
let rmvhighlightYear = (e, d) => {
  bar1.highlightBars();
  bar2.highlightBars();
};

bar1.setBarHover(highlightYear).setBarOut(rmvhighlightYear);
bar2.setBarHover(highlightYear).setBarOut(rmvhighlightYear);
let sortYears = (a, b) => a[0] - b[0];

let yearRevenues = d3.flatRollup(movieDataFull,(v) => d3.sum(v, (d) => d.revenues),(d) => d.year)
    .sort(sortYears),
    yearCount = d3.flatRollup(movieDataFull,(v) => v.length,(d) => d.year)
    .sort(sortYears),
    genreCount = d3.flatRollup(movieDataFull,(v) => v.length,(d) => d.genre);

let filterGenre = (e,d =>{
    let genre = d[0];
    let filteredData = movieDataFull
        .filter(d=>d.genre ===genre),yearRevenueFiltered = d3.flatRollup(filteredData, v=>d3.sum(v, d=>d.revenues), d=>d.year)
        .sort(sortYears),yearCountFiltered = d3.flatRollup(filteredData, v=>v.length, d=>d.year).sort(sortYears);

bar1.setLabels('Year', `Revenues ${genre}`)
    .render(yearRevenueFiltered);
bar1.setLabels('Year', `Number of Releases ${genre}`)
    .render(yearCountFiltered);
})

bar3.setBarClick(filterGenre);