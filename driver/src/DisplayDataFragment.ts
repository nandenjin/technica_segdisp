
import { Pixel } from './Pixel';

class DisplayDataFragment {

  pixels: Pixel[] = [];

  constructor( init?: Partial<DisplayDataFragment> ) {

    (<any>Object).assign( this, init );

  }

  get length() :number {

    return this.pixels.length;

  }

  set length( v ) {

    const lengthToPush = Math.max( 0, v - this.pixels.length );

    for( let i = 0; i < lengthToPush; i++ ) {

      this.pixels.push( new Pixel() );

    }

    this.pixels.length = v;

  }

  offset( offset: number ): DisplayDataFragment {

    if( offset < 0 ) {

      this.pixels.splice( 0, offset );

    }else {

      for( let i = 0; i < offset; i++ ) {

        this.pixels.unshift( new Pixel() );

      }

    }

    return this;

  }

  merge( data: DisplayDataFragment, offset: number = 0 ): DisplayDataFragment {

    for( let i = 0; i < data.length; i++ ) {

      this.pixels[ offset + i ] = data.pixels[ i ];

    }

    return this;

  }

  toDMXArray() :Uint8ClampedArray {

    const result = new Uint8ClampedArray( this.pixels.length * 4 );

    for( let i = 0; i < this.pixels.length; i++ ) {

      const pd = this.pixels[ i ].toDMXArray();
      result[ i * 4 + 0 ] = pd[ 0 ];
      result[ i * 4 + 1 ] = pd[ 1 ];
      result[ i * 4 + 2 ] = pd[ 2 ];
      result[ i * 4 + 3 ] = pd[ 3 ];

    }

    return result;

  }

}

export { DisplayDataFragment };
