
const RGBWColor = require( './RGBWColor.js' );

class PixelData {

  constructor( options ) {

    this._defaults = {

      intensity: 1,
      color: new RGBWColor(),

    };

    options = options || {};

    for( let key in this._defaults ){

      this[ key ] = options[ key ] !== undefined ? options[ key ] : this._defaults[ key ];

    }

    return this;

  }

  clear() {

    this.intensity = 1;
    this.color.clear();

  }

  setIntensity( intensity ) {

    this.intensity = intensity;

    return this;

  }

  copy( pixel ) {

    this.setIntensity( pixel.intensity );
    this.color.copy( pixel.color );

    return this;

  }

  fromDataArray( dataArray ) {

    this.color.set( dataArray[ 0 ], dataArray[ 1 ], dataArray[ 2 ], dataArray[ 3 ] );
    this.intensity = 1;

    return this;

  }

  toDataArray() {

    const data = new Uint8ClampedArray( 4 );
    const color = this.color;
    const intensity = this.intensity;

    data[ 0 ] = Math.min( Math.max( color.r * intensity, 0 ), 254 );
    data[ 1 ] = Math.min( Math.max( color.g * intensity, 0 ), 254 );
    data[ 2 ] = Math.min( Math.max( color.b * intensity, 0 ), 254 );
    data[ 3 ] = Math.min( Math.max( color.w * intensity, 0 ), 254 );

    return data;

  }

}

module.exports = PixelData;
