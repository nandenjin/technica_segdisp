
import { DisplayDataFragment } from './DisplayDataFragment';
import { Node } from './Node';

class ColorMaskNode extends Node {

  type: string = 'ColorMaskNode';

  options = {
    r: 0,
    g: 0,
    b: 0,
    w: 0,
  };

  constructor( init? :Partial<ColorMaskNode> ) {

    super( init );
    (<any>Object).assign( this, init );

  }


  render( data: DisplayDataFragment, time: number ): DisplayDataFragment {

    super.render( data, time );

    data.pixels.forEach( pixel => {

      if( pixel.r || pixel.g || pixel.b || pixel.w ) {

        pixel.set( this.options.r, this.options.g, this.options.b, this.options.w );

      }

    } );

    return data;

  }

}

export { ColorMaskNode };
