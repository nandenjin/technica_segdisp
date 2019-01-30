
import { DisplayDataFragment } from './DisplayDataFragment';
import { Node } from './Node';

class BlinkNode extends Node {

  type: string = 'BlinkNode';

  options = {
    speed: 0,
  };

  constructor( init? :Partial<BlinkNode> ) {

    super( init );
    (<any>Object).assign( this, init );

  }


  render( data: DisplayDataFragment, time: number ): DisplayDataFragment {

    super.render( data, time );

    const speed = this.options.speed;
    const cycle = 1000 / speed;
    const position = time / cycle % 1;

    data.pixels.forEach( pixel => {

      if( speed !== 0 && position < 0.5 ) pixel.set( 0, 0, 0, 0 );

    } );

    return data;

  }

}

export { BlinkNode };
