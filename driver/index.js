
const SerialPort = require( 'serialport' );

// Serial Port
var portName = '/dev/cu.usbmodem1411';

var sp = new SerialPort( portName, { baudRate: 500000 }, ( err ) => {

  if( err ) throw new Error( err );

  sp.on( 'data', d => {

    var buffer = new Buffer( d, 'utf8' );
    console.log( buffer.toString() );

  } )

  const com = new Array( 184 * 4 );


  let o = 0;

  setInterval( () => {

    for( let i = 0; i < 184 * 4; i++ ){

      switch( i % 4 ){

        case 0: com[ i ] = o % 4 == 0 ? 0xfe : 0; break;
        case 1: com[ i ] = o % 4 == 1 ? 0xfe : 0; break;
        case 2: com[ i ] = o % 4 == 2 ? 0xfe : 0; break;
        case 3: com[ i ] = o % 4 == 3 ? 0xfe : 0; break;

      }

    }

    const t = [ 255 ].concat( com );

    const start = t.length / 10 * ( o % 10 );
    const end = t.length / 10 * ( o % 10 + 1 );

    const p = t;

    // console.log( p.join( ' ' ) );

    sp.write( new Buffer( p ) );


    o++;
    if( o >= com.length ) o = 0;

  }, 1000 / 10 );

} );