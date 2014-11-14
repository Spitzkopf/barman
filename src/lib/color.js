var emath = require("./math.js");

var values = function(arr) {
  var vals = [];
  for (var index in arr) {
    vals.push(arr[index]);
  }
  return vals;
}

function Color(rgb) {
  r = rgb[0];
  g = rgb[1];
  b = rgb[2];
  xyz = RGBtoXYZ(r, g, b);
  this.lab = XYZtoLAB(xyz[0], xyz[1], xyz[2]);
  this.l = this.lab[0];
  this.a = this.lab[1];
  this.b = this.lab[2];

  this.distanceFrom = function(color) {
    // Returns an euclidean distance from another color
    return emath.euclideanDistance(this.lab, color.lab);
  }
}

function RGBtoXYZ(R, G, B)
{
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
}

function XYZtoLAB(x, y, z)
{
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

function Palette(colors, IVector) {
  this.colors = [];
  this.IVector = IVector;

  for (var index in colors) {
    this.colors.push(new Color(colors[index]))
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
    var JND = 2.3;

    var diffs = [];
    this.colors.forEach(function(color) {
      var diff = palette.colors.map(function(color2){
        return color.distanceFrom(color2);
      }).sort(function(a, b){ return a-b; })[0];
      diffs.push(diff);
    });
    
    return diffs.reduce(function(a, b) { return a + b; }) / (diffs.length);
  }
}

exports.Palette = Palette;
exports.Color = Color;
