var color = require("./color");

exports["test similarity ranking, same palettes"] = function(assert) {
  var palettes =[
    [[0,0,255]], [[255,0,0]], [[0,255,0], [0,0,0], [100,120,90]], [[0,255,0], [0,0,0]],
    [[255,0,255], [1,0,1]], [[0,0,0], [0,0,0]]
  ];

  for (var index in palettes) {
    var palette = new color.Palette(palettes[index].map(function(c) { return color.ColorFactory.fromRGB(c); }));
    assert.ok(palette.rankSimilarity(palette) == 0,
    "Similarity ranking of same palettes is 0")
  }
}

exports["test similarity ranking on palettes with different lengths"] = function(assert) {
  var palettes =[
    [[0,255,0], [0,0,0], [100,120,90]], [[0,255,0], [0,0,0]]
  ];

  var palette = new color.Palette(palettes[0].map(function(c) { return color.ColorFactory.fromRGB(c); }));
  var palette1 = new color.Palette(palettes[1].map(function(c) { return color.ColorFactory.fromRGB(c); }));
  assert.ok(typeof palette.rankSimilarity(palette1) === "number",
  "Similarity ranking works on palettes with different lengths");
}


exports["test CIE94 comparison, black and white"] = function(assert) {
  var black = color.ColorFactory.fromRGB([0,0,0]);
  var white = color.ColorFactory.fromRGB([255,255,255]);

  assert.ok(Math.round(color.ColorComparer.CIE94(black, white)) == 100, "CIE94 for black and white is 100");
}

require("sdk/test").run(exports);
