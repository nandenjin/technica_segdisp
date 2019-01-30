
import electron from 'electron';
const ipc = electron.ipcMain;

import artnet from 'artnet';

import { Node } from './Node';
import { TextNode } from './TextNode';
import { CompositionNode } from './CompositionNode';

import { DisplayDataFragment } from './DisplayDataFragment';

let timeOrigin = Date.now();
let root: Node = new Node();

const artnetClient = artnet( {
  host: '192.168.0.7',
  sendAll: true,
  refresh: 100,
} );

setInterval( () => {

  let data;

  try{
    data = root.render( new DisplayDataFragment(), Date.now() - timeOrigin );
    data.length = 46 * 4;

    const dmx = data.toDMXArray().reverse();

    for( let i = 0; i * 512 < dmx.length; i++ ) {
      artnetClient.set( i, 1, dmx.slice( i * 512, ( i + 1 ) * 512 ) );
    }

  }catch( e ) {
    // global.win.send( 'renderError', e );

  }


}, 100 );


ipc.on( 'updateComposition', ( evt, c ) => {

  console.log( JSON.stringify( c, null, 2 ) );
  const r = toInstance(c);

  if( !r ) return;

  root = r;
  timeOrigin = Date.now();

} );

function toInstance( c ): Node {

  if( !c ) return;

  switch( c.type ) {

    case 'Node': {
      return new Node( c );
    }

    case 'TextNode': {
      return new TextNode( c );
    }

    case 'CompositionNode': {
      const composition = new CompositionNode( c );
      composition.nodes = c.nodes.map( n => toInstance( n ) );
      return composition;
    }

  }

}
