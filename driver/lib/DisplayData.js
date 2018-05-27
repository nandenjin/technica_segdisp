
const PixelData = require( './PixelData.js' );

const segmentMap = require( '../presets/segments.json' );
const characterPreset = require( '../presets/characters/index.js' );

const PIXELS_PER_CHAR = 46;
const CHARS_PER_UNIT = 4;

class DisplayData {

  constructor( charLength, opt ) {

    charLength = charLength || 4;
    this.charLength = charLength;

    this.data = new Array( 46 * charLength );

    for( let i = 0; i < this.data.length; i++ ) this.data[ i ] = new PixelData();

    const defaultPixel = new PixelData();
    defaultPixel.color.set( 0, 0, 0, 255 );
    this.defaultPixel = defaultPixel;

    this._defaults = {

    };

    this.setOptions( this._defaults );
    this.setOptions( opt || {} );

  }


  toPixelArray() {

    const charLength = this.charLength;

    const pixels = new Uint8ClampedArray( 46 * charLength * 4 );

    for( let i = 0; i < this.data.length; i++ ) {

      const dataArray = this.data[ i ].toDataArray();
      
      pixels[ i * 4 + 0 ] = dataArray[ 0 ];
      pixels[ i * 4 + 1 ] = dataArray[ 1 ];
      pixels[ i * 4 + 2 ] = dataArray[ 2 ];
      pixels[ i * 4 + 3 ] = dataArray[ 3 ];

    }

    return pixels;

  }


  setOptions( opt ) {
    
    Object.keys( this._defaults ).forEach( k => {

      this[ k ] = opt[ k ] !== undefined ? opt[ k ] : this[ k ];

    } );

    return this;

  }


  setSegments( offset, segString, sw ) {

    for( let i = 0; i < segString.length; i++ ){

      const map = segmentMap[ segString.charAt( i ) ];

      if( map ) map.forEach( pi => this.setPixel( pi + PIXELS_PER_CHAR * offset, sw ) );

    }

    return this;

  }


  setPixel( index, sw ) {

    const pixel = this.data[ index ];

    if( !pixel ) return;

    if( sw === false ) pixel.clear();
    else if( sw === true ) pixel.copy( this.defaultPixel );
    else pixel.copy( sw );

    return this;

  }


  loadData( dataArray ) {

    for( let i = 0; i < dataArray.length; i++ ) this.data[ i ] = dataArray[ i ];

    return this;

  }


  clear() {

    this.data.forEach( p => p.clear() );

    return this;

  }


  putString( str, offset, formatPixel ) {

    offset = offset || 0;
    this.clear();

    for( let i = 0; i < Math.min( str.length, CHARS_PER_UNIT ) - offset; i++ ){

      const preset = characterPreset[ str.charAt( i ) ] || [];

      preset
        .map( p => p + PIXELS_PER_CHAR * ( offset + i ) )
        .forEach( p => { this.setPixel( p, formatPixel || true ); } );

    }

    return this;

  }

}

module.exports = DisplayData;
