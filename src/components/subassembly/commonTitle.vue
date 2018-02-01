<template>
  <div id="common-title"
       v-if="titleShow">
    <div class="common-title-wrapper">
      <p>
        <img src="../../img/back.png"
             alt="返回"
             @click="goBack"
             v-if="showBackButton"></p>
      <p>{{ titleName }}</p>
      <p></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CommonTitle',
  data () {
    return {
    };
  },
  computed: {
    titleShow () {
      return this.$store.getters.titleShowFlag;
    },
    titleName () {
      return this.$store.getters.titleName;
    },
    showBackButton () {
      return this.$store.getters.showBackButton;
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1);
    }
  }
};
</script>
<style scope lang="less">
#common-title {
  box-sizing: border-box;
  width: 100%;
  height: 46/20rem;
  border-bottom: 1px solid #DCDCDC;
  .common-title-wrapper {
    display: flex;
    align-items : center;
    justify-content: space-between;
    padding: 0 0.75rem;
    height: 100%;
    p {
      min-width: 1.25rem;
      min-height: 1.25rem;
      font-size: 0.9rem;
      color: #19191E;
      img {
        display: block;
        width: 1.25rem;
        height: auto;
      }
    }
  }
}
</style>
