import { app, BrowserWindow, Menu, dialog } from "electron";
import * as path from "path";
import fs from 'fs';

// import './controller';

let mainWindow: Electron.BrowserWindow;

const menuTemplate = [
  {
    label: 'D',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit',
      },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click() {
          const path = dialog.showOpenDialog( {
            properties: [ 'openFile' ],
          } );
          filePath = path[0];
          dumpData = JSON.parse( fs.readFileSync( filePath, 'utf-8' ) );
          mainWindow.webContents.send( 'loadData', dumpData );
        },
      }, {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click() {
          if( !filePath ) {
            filePath = dialog.showSaveDialog( {} );
          }
          fs.writeFileSync( filePath, JSON.stringify( dumpData ) );
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      // { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  },
]

function init() {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      // preload: path.join( __dirname, './ui/index.js' ),
    },
    icon: path.join( __dirname, './assets/icons/icon.png' ),
  });

  mainWindow.loadFile( path.join( __dirname, 'ui/index.html' ) );

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate( menuTemplate );
  Menu.setApplicationMenu( menu );

  // global.win = mainWindow;

}

app.on('ready', init);






import electron from 'electron';
const ipc = electron.ipcMain;

import artnet from 'artnet';

import { Node } from './Node';
import { TextNode } from './TextNode';
import { ColorMaskNode } from './ColorMaskNode';
import { RainbowColorMaskNode } from './RainbowColorMaskNode';
import { BlinkNode } from './BlinkNode';
import { WaveDimmingNode } from './WaveDimmingNode';
import { CompositionNode } from './CompositionNode';

import { DisplayDataFragment } from './DisplayDataFragment';

let timeOrigin = Date.now();
let root: Node = new Node();

let dumpData = {};
let filePath = null;

const artnetClient = artnet( {
  host: '192.168.0.3',
  sendAll: true,
  refresh: 1000 / 60,
} );

setInterval( () => {

  let data;

  try{
    data = root.render( new DisplayDataFragment(), Date.now() - timeOrigin );
    data.length = 46 * 4;

    const dmx = data.toDMXArray();

    for( let i = 0; i * 512 < dmx.length; i++ ) {
      artnetClient.set( i, 1, dmx.slice( i * 512, ( i + 1 ) * 512 ) );
    }

  }catch( e ) {

    console.error( e );
    mainWindow.webContents.send( 'renderError', e.message );

  }


}, 1000/30 );

ipc.on( 'dumpUpdate', ( evt, c ) => {

  dumpData = c;

  if( filePath ) {

  }

} );

ipc.on( 'updateComposition', ( evt, c ) => {

  const r = toInstance( c );

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

    case 'ColorMaskNode': {
      return new ColorMaskNode( c );
    }

    case 'RainbowColorMaskNode': {
      return new RainbowColorMaskNode( c );
    }

    case 'BlinkNode': {
      return new BlinkNode( c );
    }

    case 'WaveDimmingNode': {
      return new WaveDimmingNode( c );
    }

  }

}
