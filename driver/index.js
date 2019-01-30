
const artnet = require( 'artnet' )( {
  host: '192.168.0.7',
  sendAll: true,
  refresh: 100,
} );

let i = 0;
let c = 0;
setInterval( () => {
  c++;
  for(let i = 0; i < 1024; i++) {
    artnet.set( Math.floor( i / 512 ), i % 512, i % 4 === 1 ? i < c ? 255 : 0 : 0 );
  }
}, 10 );
