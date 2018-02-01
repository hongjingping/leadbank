<template>
  <div class="dgs-load-wrap"
       v-show="isShow > 0">
    <div class="load-bg">
      <div class="load-con">
        <img src="../../img/diagnosis/bg-load.png"
             alt="诊断中..."
             @load="loadingImgDone">
      </div>
    </div>
    <div class="tip">
      <span v-if="imgDone">诊断中</span>
      <span class="dot-wrap"
            v-if="imgDone">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  components: {

  },
  data () {
    return {
      imgDone: 0
    };
  },
  computed: {
    isShow () {
      return this.$store.getters.loadingFlag;
    }
  },
  methods: {
    // 检测图片是否加载完成
    loadingImgDone () {
      this.imgDone = 1;
    }
  }
};
</script>
<style lang="less" scoped>
.dgs-load-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: -webkit-linear-gradient(top,#030d25,#071930,#030d25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 10;
}
.load-bg {
  display: flex;
  justify-content: center;
}
.load-con {
  position: relative;
  width: 52.8%;
  img {
    width: 100%;
    display: block;
  }
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(../../img/diagnosis/fan-load.png) no-repeat;
    background-size: cover;
    left: 0;
    top: 0;
    animation: tfr 1.5s linear 0s infinite normal;
  }
}

@keyframes tfr {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.tip {
  font-size: 18/20rem;
  color: #4ff7ff;
  width: 88/20rem;
  min-height: 80/40rem;
  margin: .9rem auto 0;
  .dot-wrap{
      display: inline-block;
      width: 0;
      overflow: hidden;
      animation: dotsh 1s ease 0s infinite normal;
      white-space: nowrap;
  }
  .dot{
      display: inline-block;
      width: 2.5px;
      height: 2.5px;
      margin-left: 3px;
      background-color: #4ff7ff;
      overflow: hidden;
      border-radius: 50%;
  }
}
@keyframes dotsh {
  25% {
      width: 5.5px;
  }
  50% {
      width:11px;
  }
  75% {
    width:16.5px;
  }
  100% {
    width:16.5px;
  }
}
</style>
