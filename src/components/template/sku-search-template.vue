<template>
  <div>
    <b>{{ item.sku }}</b>
    {{ item.name }}
  </div>
</template>

<script>
export default {
  props: {
    item: { required: true },
  },
};
</script>
