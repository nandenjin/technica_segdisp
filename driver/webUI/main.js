
const socket = io();

const app = new Vue( {

  el: '#app',

  data: {

    text: '',

    interval: 500,

    motions: [

      'none',
      'scroll'

    ],

    motionId: 'none',

    color: {

      r: 0,
      g: 0,
      b: 0,
      w: 255,

    }

  },

  methods: {

    sendUpdate( data ) {

      socket.emit( 'update', data );

    },

    generateData() {

      const texts = this.text.split( '\n' );
      const sequences = [];

      switch( this.motionId ){

        case 'none':
          texts.forEach( t => sequences.push( { text: t } ) );
          break;

        case 'scroll':
          texts.forEach( t => {

            for( let i = 0; i < t.length + 4; i++ )
              sequences.push( { text: t, textOffset: 3 - i } );

          } );
          break;

      }

      return {
        color: [ this.color.r / 1, this.color.g / 1, this.color.b / 1, this.color.w / 1 ],
        interval: this.interval,
        sequences: sequences,
      };

    }

  },

  computed: {

  },

} );
