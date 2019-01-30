
import vm from 'vm';
import uuid from 'uuid/v4';

import { DisplayDataFragment } from './DisplayDataFragment';

import segmentPresets from './presets/segments';
const PIXELS_PER_UNIT = segmentPresets._PIXELS_PER_UNIT;

class Node {

  id: string = uuid();
  type: string = 'Node';
  name: string = '';
  options?: object = {};
  customCode?: string;
  private vm;

  constructor( init? :Partial<Node> ) {

    (<any>Object).assign( this, init );

  }

  render( data: DisplayDataFragment, time: number ): DisplayDataFragment {

    this.execCustomCode( data, time );

    return data;

  }

  execCustomCode( data: DisplayDataFragment, time: number ) {

    if( !this.customCode ) return;

    const context = {
      time,
      data,
      options: this.options,

      PIXELS_PER_UNIT,
      PI: Math.PI,

      nsin: d => ( Math.sin( d ) + 1 ) / 2,
      ncos: d => ( Math.cos( d ) + 1 ) / 2,
      
    }

    vm.createContext( context );
    vm.runInContext( this.customCode, context );

  }

}

export { Node };
