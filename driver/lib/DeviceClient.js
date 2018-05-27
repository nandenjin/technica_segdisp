
const SerialPort = require( 'serialport' );

const BOUD_RATE = 500000;

class DeviceClient {
  
  constructor( portName, charLength ) {

    charLength = charLength || 4;
    this.charLength = charLength;

    this.ready = false;
    this._data = new Array( 46 * charLength * 4 ).fill( 0 );


    if( !portName ){

      SerialPort.list( ( err, ports ) => {

        if( err ) throw err;

        ports.forEach( port => {

          const manufacturer = port[ 'manufacturer' ];
          if( manufacturer !== undefined && manufacturer.match( /arduino/i ) ){

            portName = port.comName;
            return;

          }

        } );

        if( !portName ) throw new Error( 'Connection error: Cannot find connected arduino device.' );

        this.portName = portName;
        this._open();

      } );

    }

    if( portName ) this._open();

  }

  _open() {

    const port = new SerialPort( this.portName, {

      baudRate: BOUD_RATE,

    } );

    port.on( 'error', err => () => { throw err; } );
    port.on( 'open', () => {

      this.ready = true;

      setInterval( () => this._tick(), 1000 / 10 );

    } )

    this.port = port;


  }

  send( displayData ) {

    this._data = displayData.toPixelArray();

  }

  _tick() {

    if( !this.ready ) return;

    const _data = this._data;
    const port = this.port;

    const data = new Uint8ClampedArray( _data.length + 1 );

    for( let i = 0; i < data.length; i++ ){

      data[ i ] = i === 0 ? 255 : _data[ i - 1 ];

    }

    port.write( new Buffer( data ) );

  }

}

module.exports = DeviceClient;
