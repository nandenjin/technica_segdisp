
const DeviceClient = require( './lib/DeviceClient.js' );
const DisplayData = require( './lib/DisplayData.js' );

const data = new DisplayData();
const client = new DeviceClient();

/*data.data.forEach( d => {

  d.color.set( 0, 0, 0, 255 );
  d.setIntensity( 0.2 );

} );*/

const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';

let i = 0;
setInterval( () => {
  data.clear();
  data.putString( 'NICE', i );
client.send( data );

  //i--;
}, 500 );
