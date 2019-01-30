
<template>

  <div v-if="composition">

    <input v-model="name" type="text" @keydown.enter="updateComposition( { id, name } )" />
    <button @click="setPlayComposition( id )">Play</button>

    <ul>
      <li v-for="node in composition.nodes"
        :class="{ selected: node.id === selectedNodeId }"
        @click="selectNode( node.id )">
        <span class="type-badge">{{ node.type }}</span>
        <span>{{ node.id.slice( 0, 6 ) }}</span>
        <span>
          <button @click="deleteNode( node.id )">-</button>
        </span>
      </li>
    </ul>

  </div>

</template>

<script>

  import { mapState, mapMutations, mapActions } from 'vuex';

  export default {

    data: () => ( {

      name: '',

    } ),

    computed: {

      ...mapState( {

        id: 'selectedCompositionId',

      } ),

      ...mapState( [

        'selectedNodeId',

      ] ),

      composition() {

        if( !this.id ) return null;
        return this.$store.state.compositions.find( n => n.id === this.id );

      }

    },

    methods: {

      ...mapMutations( [

        'updateComposition',
        'selectNode',
        'deleteNode',
        'setPlayComposition',

      ] ),

    },

    watch: {

      composition( v ) {

        this.name = v ? v.name : '';

      },

    },

  };

</script>

<style lang="sass" scoped>

  .type-badge
    display: inline-block
    margin: 0 10px
    padding: 0.1em
    font-size: 0.8em
    color: #fff
    background-color: #888

  .selected
    font-weight: bold

</style>
