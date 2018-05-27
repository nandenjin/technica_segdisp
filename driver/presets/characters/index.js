
const segPresets = require( '../segments.json' );

const obj = {};

[

  require( './alphabets.json' ),
  require( './digits.json' ),
  require( './katakana.json' ),

].forEach( d => {

  for( let key in d.presets ){

    let pixels;
    let preset = d.presets[ key ];

    if( d.format == 'segments' ){

      pixels = [];

      for( let i = 0; i < preset.length; i++ ){

        pixels = pixels.concat( segPresets[ preset.charAt( i ) ] );

      }

    }else{

      pixels = preset;

    }

    obj[ key ] = pixels;

  }

} );

module.exports = obj;
