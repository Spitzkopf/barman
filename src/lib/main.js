var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var buttons = require('sdk/ui/button/action');
var engine = require('./engine.js');
var utils = require('./color.js');
var dbapi = require('./db.js');

const {Cu} = require("chrome");
const {TextEncoder, TextDecoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});

var preloaded = false;

var panel = require("sdk/panel").Panel({
  width: 450,
  height: 400,
  contentURL: data.url("panel/panel.html"),
  contentScriptFile: data.url("panel/panel.js"),
});

panel.on("hide", function() {
  panel.port.emit("hide");
})

panel.port.on("hide-request", function() {
  panel.hide();
});

panel.port.on("redirectToRecipe", function(recipeSiteUrl) {
  tabs.open(recipeSiteUrl);
});

var iconsDefault = {
  "16": "./icons/cocktail16.png",
  "32": "./icons/cocktail32.png",
  "64": "./icons/cocktail64.png"
};

var button = buttons.ActionButton({
  id: "main-btn",
  label: "Barman",
  icon: iconsDefault,
  onClick: startAnalysis
});


function preload(state) {
    var str = data.load("cocktails.json");
    var cocktails = JSON.parse(str);
    for (var index in cocktails) {
        var cocktail = cocktails[index];
        dbapi.insert(cocktail);
    }
    preloaded = true;
}

function startAnalysis(state) {
    if (!preloaded) {
      preload();
    }

    var startSignal = "startAnalysis";
    var doneSignal = "analysisFinished";
    var errorSignal = "error";

    var worker = tabs.activeTab.attach({
      contentScriptWhen: "end",
    	contentScriptFile: [data.url("barman.js"), data.url("ext/html2canvas.js"), data.url("ext/color-thief.min.js")],
    });

    worker.port.on(doneSignal, function(palette) {
      var sitePalette = new utils.Palette(JSON.parse(palette).map(function(c) { return utils.ColorFactory.fromRGB(c); }));
      var chosenCocktail = engine.getCocktailByPalette(sitePalette, dbapi.cocktails);
      panel.port.emit(doneSignal, chosenCocktail)
      panel.show({
         position: button
       });
    });

    worker.port.on(errorSignal, function(message) {
      console.log(message);
    });

    worker.port.emit(startSignal);
}
