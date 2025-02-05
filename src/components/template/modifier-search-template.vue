<template>
  <div>
    <b>M{{ item.mcodeStr }}</b>
    {{ item.text }}
  </div>
</template>

<script>
export default {
  props: {
    item: { required: true },
  },
};
</script>
