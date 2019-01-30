
import Vue from 'vue';
import Vuex from 'vuex';

import { remote } from 'electron';
import fs from 'fs';

import App from './vue/App.vue';

import './style/global.sass';

import { store } from './vue/store'

Vue.use( Vuex );

const appView = new Vue( {
  el: '#app',
  store,
  render: createElement => createElement( App ),
} );

console.log( remote.app.getPath('home') );
