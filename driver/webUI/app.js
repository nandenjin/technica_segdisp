
const path = require( 'path' );

const express = require( 'express' )
const app = express();
const http = require( 'http' ).Server( app );
const io = require( 'socket.io' )( http );

const DeviceClient = require( '../lib/DeviceClient.js' );
const DisplayData = require( '../lib/DisplayData.js' );

const JSONLoader = require( './lib/JSONLoader.js' );

const displayData = new DisplayData();
const client = new DeviceClient();
const loader = new JSONLoader();

app.use( express.static( __dirname ) );

app.get( '/node_modules/vue.js', ( req, res ) => {

  res.sendFile( path.resolve( __dirname + '/../node_modules/vue/dist/vue.min.js' ) );

} );

http.listen( 3000, () => {

  console.log( 'Listening@3000...' );

} );


io.on( 'connect', socket => {

  socket.on( 'update', data => {

    console.log( data );

    loader.load( data );


  } );

} );

const startTime = Date.now();

setInterval( () => {

  loader.getDataAt( Date.now() - startTime, displayData );
  client.send( displayData );

}, 100 );


process.on( 'unhandledRejection', console.dir );