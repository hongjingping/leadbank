<template>
  <div class="loadingWrapper"
       v-show="loadingFlag > 0"
       :class="{'get-loading' : loadingFlag > 1}"
       @touchstart="stopEvent"
       @touchmove="stopEvent"
       @touchend="stopEvent">
    <div class="loadingContent">
      <img src="../../img/loading.gif"
           alt="加载中">
    </div>
  </div>
</template>
<script>
export default {
  name: 'FirtLoading',
  data () {
    return {

    };
  },
  computed: {
    loadingFlag () {
      return this.$store.getters.loadingFlag;
    }
  },
  methods: {
    stopEvent (e) {
      let event = e || window.event;
      event.stopPropagation();
      event.preventDefault();
    }
  }
};
</script>
<style lang="less" scoped>
.loadingWrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  z-index: 999;
  .loadingContent {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: auto;
    text-align: center;
    transform: translate(-50%,-50%);
    img {
      width: 3rem;
      height: auto;
    }
    p {
      font-size: 0.7rem;
      .point {
        display: inline-block;
        min-width: 1rem;
        text-align: left;
      }
    }
  }
}
.loadingWrapper.get-loading {
  background-color: transparent;
}
</style>
