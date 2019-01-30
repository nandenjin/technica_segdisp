
import { Node } from './Node';
import { DisplayDataFragment } from './DisplayDataFragment';

class CompositionNode extends Node {

  nodes: Node[] = [];

  render( data: DisplayDataFragment, time: number ): DisplayDataFragment {

    for( let i = 0; i < this.nodes.length; i++ ) {

      data = this.nodes[ i ].render( data, time );

    }

    return data;

  }

}

export { CompositionNode };
