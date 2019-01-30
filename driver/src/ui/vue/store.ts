
import electron from 'electron';
const ipc = electron.ipcRenderer;

import Vue from 'vue';
import Vuex from 'vuex';

import uuid from 'uuid/v4';

Vue.use( Vuex );

const store = new Vuex.Store( {

  state: {
    nodes: [
      {
        id: 'default',
        type: 'Node',
        options: {},
        optionSchema: {},
      },{
        id: 'default-text',
        type: 'TextNode',
        deletable: true,
        options: {
          text: '',
          speed: 0,
          noBlank: false,
        },
        optionSchema: {
          text: [],
        },
      },
      {
        id: 'default-color-mask',
        type: 'ColorMaskNode',
        deletable: true,
        options: {
          r: 0,
          g: 0,
          b: 0,
          w: 255,
        },
        optionSchema: {
          r: [ 0, 1 ],
          g: [ 0, 1 ],
          b: [ 0, 1 ],
          w: [ 0, 1 ],
        },
      },{
        id: 'default-rainbow-color-mask',
        type: 'RainbowColorMaskNode',
        deletable: true,
        options: {
          speed: 0.2,
        },
        optionSchema: {
          r: [ 0, 1 ],
          g: [ 0, 1 ],
          b: [ 0, 1 ],
          w: [ 0, 1 ],
        },
      },{
        id: 'default-blink',
        type: 'BlinkNode',
        deletable: true,
        options: {
          speed: 0,
        },
        optionSchema: {
        },
      },{
        id: 'default-wave-dimming',
        type: 'WaveDimmingNode',
        deletable: true,
        options: {
          speed: 0,
        },
        optionSchema: {
        },
      },
    ],
    compositions: [

    ],
    selectedCompositionId: null,
    selectedNodeId: null,
    playingCompositionId: null,
    renderError: null,
  },

  getters: {

    selectedComposition( state ) {

      if( !state.selectedCompositionId ) return;

      const composition = state.compositions.find( n => n.id === state.selectedCompositionId );

      return composition;

    },

    selectedNode( state ) {

      if( !state.selectedCompositionId ) return;

      const composition = state.compositions.find( n => n.id === state.selectedCompositionId );
      if( !composition || !composition.nodes ) return;

      const node = composition.nodes.find( n => n.id === state.selectedNodeId );

      return node;

    },

    playingComposition( state ) {

      if( !state.playingCompositionId ) return;

      const composition = state.compositions.find( n => n.id === state.playingCompositionId );

      return composition;

    }

  },

  mutations: {

    setCompositions( state, compositions ) {
      state.compositions = compositions;
    },

    selectComposition( state, id ) {
      state.selectedCompositionId = id;
      state.selectedNodeId = null;
    },

    updateComposition( state, opr ) {

      const node = state.compositions.find( n => n.id === opr.id );
      Object.keys( opr ).forEach( k => node[ k ] = opr[ k ] );

    },

    selectNode( state, id ) {
      state.selectedNodeId = id;
    },

    deleteNode( state, id ) {
      state.compositions.forEach( c => {
        if( !c.nodes ) return;
        c.nodes = c.nodes.filter( n => n.id !== id );
      } );
      if( state.selectedNodeId === id ) state.selectedNodeId = null;
    },

    setRenderError( state, error ) {
      state.renderError = error;
    },

    setPlayComposition( state, id ) {
      state.playingCompositionId = id;
    },

    load( state, data ) {
      state.compositions = data.compositions;
    }

  },

  actions: {

    cloneCompostion( { commit, state }, nodeId ) {

      const node = state.compositions.find( n => n.id === nodeId );

      const newNode: any = JSON.parse( JSON.stringify( node ) );

      newNode.id = uuid();
      newNode.deletable = false;

      newNode.nodes.forEach( n => n.id = uuid() );

      commit( 'setCompositions', [ ...state.compositions, newNode ] );

    },

    deleteComposition( { commit, state }, nodeId ) {

      commit( 'setCompositions', state.compositions.filter( n => n.id !== nodeId ) );

    },

    createComposition( { commit, state } ) {

      const id = uuid();
      const type = 'CompositionNode';

      commit( 'setCompositions', [ ...state.compositions, { id, type, nodes: [] } ] );
      commit( 'selectComposition', id );

    },

    addToStack( { commit, state }, node ) {

      if( !state.selectedCompositionId ) return;

      const composition = state.compositions.find( n => n.id === state.selectedCompositionId );
      if( !composition || !composition.nodes ) return;

      const cloned: any = JSON.parse( JSON.stringify( node ) );
      cloned.id = uuid();

      composition.nodes.push( cloned );

      commit( 'setCompositions', state.compositions );
      commit( 'selectNode', cloned.id );

    },

    updateCurrentOption( { commit, getters, state }, options ) {

      if( !state.selectedCompositionId ) return;

      const composition = state.compositions.find( n => n.id === state.selectedCompositionId );
      if( !composition || !composition.nodes ) return;

      const node = composition.nodes.find( n => n.id === state.selectedNodeId );
      if( !node ) return;

      node.options = options;

      commit( 'setCompositions', state.compositions );

    },

    updateCurrentCustomCode( { commit, getters, state }, code ) {

      if( !state.selectedCompositionId ) return;

      const composition = state.compositions.find( n => n.id === state.selectedCompositionId );
      if( !composition || !composition.nodes ) return;

      const node = composition.nodes.find( n => n.id === state.selectedNodeId );
      if( !node ) return;

      node.customCode = code;

      commit( 'setCompositions', state.compositions );

    }

  },

} );


store.subscribe( ( mutation, state ) => {
  ipc.send( 'dumpUpdate', state );
  if( mutation.type === 'setPlayComposition' ) ipc.send( 'updateComposition', store.getters.playingComposition )
} );

ipc.on( 'renderError', ( evt, error ) => {
  console.error( "RENDER ERROR: " + error );
  store.commit( 'setRenderError', error )
} );

ipc.on( 'loadData', ( evt, data ) => {
  store.commit( 'load', data );
} )

export { store };
