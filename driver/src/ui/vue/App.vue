
<template>

  <div class="container">
    <div class="column">
      <node-list></node-list>
    </div>
    <div class="column">
      <stack-editor></stack-editor>
    </div>
    <div class="column">
      <option-editor></option-editor>
    </div>
  </div>

</template>

<style lang="sass" scoped>

  .container
    display: flex

    .column
      flex: 1 1 auto


</style>

<script>

  import NodeList from './NodeList';
  import StackEditor from './StackEditor';
  import OptionEditor from './OptionEditor';

  export default {

    prop: [ 'store' ],
    components: {
      NodeList,
      StackEditor,
      OptionEditor,
    },

  };

</script>
