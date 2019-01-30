
<template>

  <div>

    <ul>
      <li v-for="node in nodes">
        <span>{{ node.name || node.type || node.id }}</span>
        <span>
          <button @click="addToStack( node )">+</button>
        </span>
      </li>
    </ul>

    <hr />

    <ul>
      <li v-for="node in this.$store.state.compositions"
        :class="{ selected: node.id === selectedCompositionId, playing: node.id === playingCompositionId }"
        @click="selectComposition( node.id )">
        <span>{{ node.name || node.id.slice(0,6) }}</span>
        <span>
          <button @click="addToStack( node.id )" disabled>+</button>
          <button @click="deleteComposition( node.id )">-</button>
          <button @click="cloneCompostion( node.id )">D</button>
        </span>
      </li>
      <li>
        <button @click="createComposition()">+</button>
      </li>
    </ul>


  </div>

</template>

<script>

  import { mapState, mapMutations, mapActions } from 'vuex';

  export default {

    computed: {

      ...mapState( [

        'selectedCompositionId',
        'nodes',
        'compositions',
        'playingCompositionId',

      ] ),

    },

    methods: {

      ...mapMutations( [

        'selectComposition',

      ] ),

      ...mapActions( [

        'cloneCompostion',
        'deleteComposition',
        'createComposition',
        'addToStack',

      ] ),

    },

  };

</script>

<style lang="sass" scoped>

  .selected
    font-weight: bold

  .playing::before
    content: ''
    display: inline-block
    width: 1em
    height: 1em
    border-radius: 50%
    background-color: #0bf

</style>
