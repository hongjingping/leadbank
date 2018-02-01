<template>
  <div id="performance">
    <p>
      <img src="../../img/cha.png"
           alt="差"
           v-if="levelFlag == '-1'">
      <img src="../../img/zhong.png"
           alt="中"
           v-if="levelFlag == '0'">
      <img src="../../img/liang.png"
           alt="良"
           v-if="levelFlag == '1'">
      <img src="../../img/you.png"
           alt="优"
           v-if="levelFlag == '2'">
    </p>
    <p class="text"
       v-if="levelFlag == '-1'" >差</p>
    <p class="text"
       v-if="levelFlag == '0'" >中</p>
    <p class="text"
       v-if="levelFlag == '1'" >良</p>
    <p class="text"
       v-if="levelFlag == '2'" >优</p>
  </div>
</template>
<script>
export default {
  name: 'Performance',
  props: {
    levelFlag: {
      type: String,
      default: '2'
    }
  }
};
</script>
<style lang="less" scoped>
#performance {
  width: 100%;
  height: 100%;
  p {
    text-align: center;
    font-size: 0.6rem;
    color: #96969b;
    img {
      display: block;
      width: 70/40rem;
      height: 100/40rem;
    }
  }
  .text {
    margin-top: 20/40rem;
  }
}
</style>
