<template>
  <div id="informationResult">
    <scroll :isNeedLoading="0">
      <div class="ico-wrapper">
        <p>
          <img src="../img/cardsucess.png"
               alt="测评完成">
        </p>
        <p class="text">测评已完成</p>
      </div>
      <div class="bg-f5f5f5 line-obstruct"></div>
      <div class="buttonWrapper">
        <baseButton :styleObj="buttonStyle"
                    @click.native="confirm">
          确定
        </baseButton>
      </div>
    </scroll>
  </div>
</template>
<script>
import baseButton from 'components/subassembly/BaseButton.vue';
import scroll from 'components/subassembly/scroll.vue';

export default {
  name: 'InformationResult',
  components: {
    scroll,
    baseButton
  },
  data () {
    return {
      buttonStyle: {
        backgroundColor: '#DC2828',
        fontSize: '0.9rem',
        color: '#fff'
      }
    };
  },
  mounted () {
    this.$store.commit('UPDATE_SHOWBACKBUTTON', 0);
  },
  methods: {
    confirm () {
      let _this = this;
      if (window.isApp) {
        window.mutual.closeWebview();
      } else {
        _this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="less" scoped>
#informationResult {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ico-wrapper {
    padding: 80/40rem 0;
    margin-bottom: 20/40rem;
    text-align: center;
    p>img {
      display: inline-block;
      width: 260/40rem;
      height: auto;
    }
    p.text {
      font-family: PingFangSC-Light;
      font-size: 40/40rem;
      color: #96969B;
      line-height: 40/40rem;
    }
  }
  .line-obstruct {
    width: 100%;
    height: 20/40rem;
  }
  .buttonWrapper {
    box-sizing: border-box;
    width: 100%;
    padding: 0 30/40rem;
    padding-top: 40/40rem;
  }
}
</style>
