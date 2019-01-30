
import { DisplayDataFragment } from './DisplayDataFragment';
import { Node } from './Node';

class WaveDimmingNode extends Node {

  type: string = 'BlinkNode';

  options = {
    speed: 0,
  };

  constructor( init? :Partial<WaveDimmingNode> ) {

    super( init );
    (<any>Object).assign( this, init );

  }


  render( data: DisplayDataFragment, time: number ): DisplayDataFragment {

    super.render( data, time );

    const speed = this.options.speed;
    const cycle = 1000 / speed;
    const position = time / cycle % 1;

    const d = ( Math.sin( position * Math.PI * 2 ) + 1 ) / 2;

    data.pixels.forEach( pixel => {

      if( speed !== 0 )
        pixel.set(
          pixel.r * d,
          pixel.g * d,
          pixel.b * d,
          pixel.w * d,
        );

    } );

    return data;

  }

}

export { WaveDimmingNode };
