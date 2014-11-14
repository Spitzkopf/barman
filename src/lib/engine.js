var utils = require('./color.js');

var rangeGenerator = function (palette, cocktailCollection, maximalFit) {
	var count = maximalFit || 5;
	var similarCocktails = [];
	for (var index in cocktailCollection) {
		var currentCocktail = cocktailCollection[index];
		var diff = currentCocktail.palette.rankSimilarity(palette);
		similarCocktails.push([currentCocktail, diff]);
	}

	var topMatches = similarCocktails.sort(function(a, b) { return a[1] - b[1] }).slice(0, similarCocktails.length >= count ? count : similarCocktails.length).map(function(item){ return item[0]; });
	console.log(topMatches.map(function(c) { return c.title; }))
	return topMatches[Math.floor(Math.random() * topMatches.length)];
};

var closestMatchGenerator = function (palette, cocktailCollection) {
	var similarCocktail = null;
	var highestRank = undefined;
	for (var cocktail in cocktailCollection) {
		var currentCocktail = cocktailCollection[cocktail];
		var currentRank = currentCocktail.palette.rankSimilarity(palette);
		if (undefined == highestRank) {
				highestRank = currentRank;
		}
		if (currentRank < highestRank) {
			similarCocktail = currentCocktail;
			highestRank = currentRank;
			if (currentRank == 0) {
				break;
			}
		}
	}

	return similarCocktail;
};

exports.getCocktailByPalette = rangeGenerator;
