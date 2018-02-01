<template>
  <div class="noDataWrapper"
       v-if="noDataFlag">
    <img src="../../img/noneRecord.png"
         alt="没有数据">
    <p class="fs-30 fc-96969B">暂时没有数据</p>
  </div>
</template>
<script>
export default {
  name: 'NoDataWrapper',
  props: {
    noDataFlag: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style lang="less" scoped>
.noDataWrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  img {
    display: block;
    width: 6.5rem;
    height: auto;
  }
  p {
    margin-top: 0.75rem;
    text-align: center;
  }
}
</style>
