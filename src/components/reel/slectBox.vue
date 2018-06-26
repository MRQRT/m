<template>
  <div class="pd-select-box">
    <slot></slot>
  </div>
</template>
<script>
  export default{
    name: 'pdSelectBox'
  }
</script>
<style scoped="">
  .pd-select-box {
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
    display: -ms-flex;
  }
</style>
