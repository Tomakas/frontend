<template>
  <span>
  <span>{{begin}}</span>
  <span class="emphasize_text">{{emphasized}}</span>
  <span>{{end}}</span>
  </span>
</template>

<script>
export default {
  props: {
    value: { required: true },
    query: { required: true },
  },
  mounted() {
    this.emphasize();
  },
  watch: {
    value : function() {
      this.emphasize();
    },
    query: function() {
      this.emphasize();
    }
  },
  data: function() {
    return {
      begin: '',
      emphasized: '',
      end: ''
    }
  },
  methods: {
    emphasize: function() {
      const vm = this;
      //contains?
      if(vm.query!==null && vm.query.length>0 && vm.value != null && vm.value.length>0) {
        //found
        let pos = vm.value.toLowerCase().indexOf(vm.query.toLowerCase());
        if(pos !== -1) {
          vm.begin = vm.value.substring(0,pos)
          vm.emphasized = vm.value.substring(pos,pos+vm.query.length);
          vm.end = vm.value.substring(pos+vm.query.length,vm.value.length);
          return;
        }
      }
      //not found
      vm.begin = vm.value;
      vm.emphasized = '';
      vm.end = '';
    }
  }
};
</script>

<style>
 .emphasize_text {
   background: #70a6d2;
 }
</style>