var emath = require("./math.js");

var values = function(arr) {
  var vals = [];
  for (var index in arr) {
    vals.push(arr[index]);
  }
  return vals;
}

var comparer = {
  CIE76: function(color1, color2) {
      return color1.distanceFrom(color2);
  },
  CIE94: function(color1, color2) {
      //unity (k) and weights (K)
      var kL = 1.0;
      var kC = 1.0;
      var kH = 1.0;
      var K1 = 0.045;
      var K2 = 0.015;


      var dL = color1.l - color2.l;
      var C1 = Math.sqrt(Math.pow(color1.a, 2) + Math.pow(color1.b, 2));
      var C2 = Math.sqrt(Math.pow(color2.a, 2) + Math.pow(color2.b, 2));
      var dCab = C1 - C2;
      var da = color1.a - color2.a;
      var db = color1.b - color2.b;
      var dHab = Math.sqrt(Math.pow(da, 2) + Math.pow(db, 2) - Math.pow(dCab, 2)) || 0;
      var SL = 1.0;
      var SC = 1.0 + K1 * C1;
      var SH = 1.0 + K2 * C1;

      var dCIE94 = Math.sqrt(
        Math.pow(dL / (kL * SL), 2) +
        Math.pow(dCab / (kC * SC), 2) +
        Math.pow(dHab / (kH * SH), 2)
      );

      return dCIE94 ? dCIE94 : 0;
  }
};

var converter = {
  RGBtoXYZ: function (R, G, B) {
      var_R = parseFloat( R / 255 )        //R from 0 to 255
      var_G = parseFloat( G / 255 )        //G from 0 to 255
      var_B = parseFloat( B / 255 )        //B from 0 to 255

      if ( var_R > 0.04045 ) var_R = Math.pow(( ( var_R + 0.055 ) / 1.055 ), 2.4)
      else                   var_R = var_R / 12.92
      if ( var_G > 0.04045 ) var_G =  Math.pow(( ( var_G + 0.055 ) / 1.055 ), 2.4)
      else                   var_G = var_G / 12.92
      if ( var_B > 0.04045 ) var_B =  Math.pow(( ( var_B + 0.055 ) / 1.055 ), 2.4)
      else                   var_B = var_B / 12.92

      var_R = var_R * 100
      var_G = var_G * 100
      var_B = var_B * 100

      //Observer. = 2°, Illuminant = D65
      X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805
      Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722
      Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505
      return [X, Y, Z]
  },
  XYZtoLAB: function(x, y, z) {
      var ref_X =  95.047;
      var ref_Y = 100.000;
      var ref_Z = 108.883;

      var_X = x / ref_X          //ref_X =  95.047   Observer= 2°a, Illuminant= D65
      var_Y = y / ref_Y          //ref_Y = 100.000
      var_Z = z / ref_Z          //ref_Z = 108.883

      if ( var_X > 0.008856 ) var_X =  Math.pow(var_X, ( 1/3 ))
      else                    var_X = ( 7.787 * var_X ) + ( 16 / 116 )
      if ( var_Y > 0.008856 ) var_Y =  Math.pow(var_Y, ( 1/3 ))
      else                    var_Y =  Math.pow(( 7.787 * var_Y ), ( 16 / 116 ))
      if ( var_Z > 0.008856 ) var_Z = var_Z ^ ( 1/3 )
      else                    var_Z =  Math.pow(( 7.787 * var_Z ), ( 16 / 116 ))

      CIE_L = ( 116 * var_Y ) - 16
      CIE_a = 500 * ( var_X - var_Y )
      CIE_b = 200 * ( var_Y - var_Z )

    return [CIE_L, CIE_a, CIE_b]
  }
};

var colorFactory = {
  fromRGB: function(rgb) {
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
    xyz = converter.RGBtoXYZ(r, g, b);
    return this.fromXYZ(xyz);
  },
  fromXYZ: function(xyz) {
    return this.fromLab(converter.XYZtoLAB(xyz[0], xyz[1], xyz[2]));
  },
  fromLab: function(lab) {
    return new Color(lab);
  }
};

function Color(lab) {
  this.lab = lab;
  this.l = this.lab[0];
  this.a = this.lab[1];
  this.b = this.lab[2];

  this.distanceFrom = function(color) {
    // Returns an euclidean distance from another color
    return emath.euclideanDistance(this.lab, color.lab);
  }
}

function Palette(colors, IVector) {
  this.colors = [];
  this.IVector = IVector;

  for (var index in colors) {
    this.colors.push(colors[index]);
  };

    this.fit = function() {
      // Create a 3xn matrix where n = colors.length to represent the set of colors
      var ls = [];
      var as = [];
      var bs = [];
      for (i = 0; i < this.colors.length; i++) {
          ls.push(this.colors[i].l)
          as.push(this.colors[i].a)
          bs.push(this.colors[i].b)
      }
      return emath.multipleRegression(ls, as, bs);
  }


  this.getIVector = function() {
    if (!this.IVector) {
      this.IVector = emath.calcIVector(this.fit());
    }

    return this.IVector;
  }

  this.rankSimilarity = function(palette) {
    var diffs = [];
    this.colors.forEach(function(color) {
      var diff = palette.colors.map(function(color2){
        return comparer.CIE94(color, color2);
      }).sort(function(a, b){ return a-b; })[0];
      diffs.push(diff);
    });

    return diffs.reduce(function(a, b) { return a + b; }) / (diffs.length);
  }
}

exports.Palette = Palette;
exports.Color = Color;
exports.ColorConverter = converter;
exports.ColorFactory = colorFactory;
