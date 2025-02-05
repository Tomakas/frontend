<template>
  <div>
  <div class="custom-control custom-switch" v-if="!disabled">
    <input type="checkbox" v-model="rightSwitch" class="custom-control-input" role="switch" :id="rightId" @change="change">
    <label class="custom-control-label" :for="rightId">
      <i v-show="edit === false" class="fa-regular fa-eye"></i>
      <i v-show="edit === true" class="fa-solid fa-pen-to-square"></i>
      {{ $t('right.'+rightId)}}</label>
  </div>
  <div v-if="disabled">
    <div v-show="rightSwitch">
      <div style="font-weight: bold">
      <i v-show="edit === false" class="fa-regular fa-eye"></i>
      <i v-show="edit === true" class="fa-solid fa-pen-to-square"></i>
     {{ $t('right.'+rightId)}}</div>
    </div>
    <div v-show="!rightSwitch">
      <div style="text-decoration: line-through;color: #6c757d">
      <i v-show="edit === false" class="fa-regular fa-eye"></i>
      <i v-show="edit === true" class="fa-solid fa-pen-to-square"></i>
      {{ $t('right.'+rightId)}}</div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    rightId: { required: true },
    rightModel: {required: true},
    disabled: {required: false, default: false},
    edit: {required: false, default: false}
  },
  mounted() {
    const vm = this;
    vm.$nextTick(function () {
      vm.refresh();
    });
  },
  watch: {
    rightModel : function() {
      this.refresh();
    }
  },
  data: function() {
    return {
      rightSwitch: false
    }
  },
  methods: {
    refresh: function() {
      this.rightSwitch = this.rightModel.includes(this.rightId);
    },
    change: function () {
      this.$emit('changeRight',{
        rightId: this.rightId,
        present: this.rightSwitch
      });
    }
  }
};
</script>