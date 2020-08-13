
const DisplayData = require( '../../lib/DisplayData.js' );

class JSONLoader {


  constructor() {

    this._json = {};

  }


  load( jsonObject ) {

    let json = JSON.parse( JSON.stringify( jsonObject ) );

    this._json = expandJSON( json );

  }


  getDataAt( t, displayData ) {

    const json = this._json;

    const sequences = json.sequences;
    const interval = json.interval || 500;

    if( !sequences ){

      displayData.clear();
      return;

    }

    const sqi = Math.floor( t / interval ) % sequences.length;
    if( sequences[ sqi ] ) displayData.fromDataArray( sequences[ sqi ].data );
    else displayData.clear();

  }


}

module.exports = JSONLoader;




function expandJSON( json ) {

  if( json.sequences ){

    const pool = new DisplayData();

    if( json.color ){ pool.defaultPixel.color.set.apply( pool.defaultPixel.color, json.color ); }

    const defaultIntensity = json.intensity !== undefined ? json.intensity : 1;

    delete json.color;
    delete json.intensity;

    const sequences = json.sequences;

    for( let i = 0; i < sequences.length; i++ ) {

      const sequence = sequences[ i ];


      if( sequence.hold >= 2 ) {

        const holdLength = sequence.hold;
        delete sequence.hold;

        const copy = JSON.parse( JSON.stringify( sequence ) );
        delete copy.hold;

        const copies = new Array( holdLength - 1 ).fill( copy );
        sequences.splice.apply( sequences, [ i + 1, 0 ].concat( copies ) );

      }


      // pool.defaultPixel.color.set.apply( pool.defaultPixel.color, [ sequence.color || json.color || [ 0, 0, 0, 255 ] ] );
      // pool.defaultPixel.setIntensity( sequence.intensity !== undefined ? sequence.intensity : defaultIntensity );


      if( sequence.text ) {

        pool.putString( sequence.text, sequence.textOffset || 0 );

      }else if( sequence.segments ) {

        sequence.segments.forEach( ( s, i ) => pool.setSegments( i, s, true ) ); 

      }else if( sequence.data ) {

        // pool.loadData( sequence.data );

      }


      delete sequence.text;
      delete sequence.textOffset;
      delete sequence.segments;

      sequence.data = pool.toDataArray();


    }

  }

  return json;

}

