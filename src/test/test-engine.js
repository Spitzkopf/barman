// var engine = require("./engine");
// var color = require("./color");

// test_json = [
//               {name: "test_cocktail_near", palette:  new color.Palette([[0,0,255], [0,255,0], [255,0,0]])},
//               {name: "test_cocktail_far", palette:  new color.Palette([[0,0,150], [0,150,0], [150,0,0]])}
//             ];

// tested_against_palette = new color.Palette([[20,20,255], [20,255,20], [255,20,20]]);

// exports["test engine"] = function(assert) {
//   closeCocktail = engine.getCocktailByPalette(tested_against_palette, test_json);
//   assert.ok("test_cocktail_near" == closeCocktail.name, "engine is sane");
// }

// iteration_counter = 0;

// function mockPalette(normalPalette) {
//   this.innerPalette = normalPalette;

//   this.rankSimilarity = function(palette) {
//     iteration_counter += 1;
//     return palette.rankSimilarity(palette);
//   }
// }

// has_perfect_match = [
//                       {name: "test_cocktail_perfect_match", palette: new mockPalette(tested_against_palette)},
//                       {name: test_json[0].name, palette: new mockPalette(test_json[0].palette)},
//                       {name: test_json[1].name, palette: new mockPalette(test_json[1].palette)}
//                     ]

// exports["test engine break on perfect match"] = function(assert) {
//   closeCocktail = engine.getCocktailByPalette(tested_against_palette, has_perfect_match);
//   assert.ok(1 == iteration_counter, "engine doesn't go past perfect match");
// }

// require("sdk/test").run(exports);
