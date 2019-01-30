
<template>

  <div v-show="selectedNode">

    <div ref="gui"></div>
    <div style="margin-top: 20px">
      <textarea class="customCode" v-model="customCode"></textarea>
    </div>
    <div style="margin-top: 20px">
      <button @click="sendCustomCode">Go</button>
    </div>
    <div>{{ renderError ? renderError.message: '' }}</div>

  </div>

</template>

<script>

  import { mapState, mapGetters } from 'vuex';
  import * as dat from 'dat.gui';

  export default {

    data() {

      return {

        gui: null,
        customCode: '',

      };

    },

    computed: {

      ...mapState( [

        'selectedNodeId',
        'renderError',

      ] ),

      ...mapGetters( [

        'selectedNode',

      ] ),

    },

    methods: {

      sendCustomCode() {

        if( !this.selectedNode ) return;

        this.$store.dispatch( 'updateCurrentCustomCode', this.customCode );

      },

    },

    watch: {

      selectedNodeId() {

        const v = this.selectedNode;

        if( this.gui ){

          console.log( this.$store.state.compositions );
          try{
            this.$refs.gui.removeChild( this.gui.domElement );
          }catch( e ){}
          this.gui.destroy();
        }

        this.customCode = '';

        if( !v ) {

          return;

        }

        this.customCode = v.customCode || '';

        const gui = new dat.GUI( { autoPlace: false } );
        Object.keys( v.options ).forEach( key => {
          gui.add( v.options, key, ...v.optionSchema[ key ] || [] )
             .onChange( () => this.$store.dispatch( 'updateCurrentOption', v.options ) );
        } );

        this.$refs.gui.appendChild( gui.domElement );
        this.gui = gui;

      },

    },

  };

</script>

<style lang="sass" scoped>

  .customCode
    height: 10em
    margin: 30px 0
    outline: 0
    border: none
    background: #333
    color: #fff
    font-family: monospace
    line-height: 1.2em

</style>
