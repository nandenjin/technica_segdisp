
import { DisplayDataFragment } from './DisplayDataFragment';
import { Node } from './Node';

class RainbowColorMaskNode extends Node {

  type: string = 'ColorMaskNode';

  options = {
    speed: 0.2,
  };

  constructor( init? :Partial<RainbowColorMaskNode> ) {

    super( init );
    (<any>Object).assign( this, init );

  }


  render( data: DisplayDataFragment, time: number ): DisplayDataFragment {

    super.render( data, time );

    const d = time / ( 1000 / this.options.speed ) % 1 * Math.PI * 2;

    const r = ( Math.sin( d ) + 1 ) / 2;
    const g = ( Math.sin( d + Math.PI * 2 / 3 ) + 1 ) / 2;
    const b = ( Math.sin( d - Math.PI * 2 / 6 ) + 1 ) / 2;
    const w = 0;

    data.pixels.forEach( pixel => {

      if( pixel.r || pixel.g || pixel.b || pixel.w ) {

        pixel.set( r, g, b, w );

      }

    } );

    return data;

  }

}

export { RainbowColorMaskNode };
