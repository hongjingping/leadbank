<template>
  <div>
    <div class="tradingDetailCenter">
      <div class="top wrapper">
        <div class="circle circle1"></div>
        <div class="content">
          <p class="fc-FFA041 fs-30 lh-30">{{ tradingDetailCenterTwo.scheduleDes1 }}</p>
          <p class="fc-FFA041 fs-24 lh-24 time">{{ tradingDetailCenterTwo.acceptanceDate }}</p>
        </div>
      </div>
      <div class="center wrapper">
        <div class="circle circle2"></div>
        <div class="content">
          <p class="fc-96969B fs-30 lh-30">{{ tradingDetailCenterTwo.scheduleDes2 }}</p>
          <p class="fc-96969B fs-24 lh-24 time">{{ tradingDetailCenterTwo.confirmDate }}</p>
        </div>
      </div>
      <div class="bottom wrapper">
        <div class="circle circle3"></div>
        <div class="content">
          <p class="fc-96969B fs-30 lh-30">{{ tradingDetailCenterTwo.scheduleDes3 }}</p>
          <p class="fc-96969B fs-24 lh-24 time">{{ tradingDetailCenterTwo.profitDate }}</p>
          <p class="fc-96969B fs-24 lh-24 time">(具体到账时间以实际到账日为准)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tradingDetailCenterTwo: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {

    };
  }
};
</script>

<style lang="less" scoped>
  .tradingDetailCenter {
    padding: 1rem .75rem;
    .wrapper {
      position: relative;
      .circle {
        position: absolute;
        display: inline-block;
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
        background: #DCDCDC;
        margin-right: 1rem;
      }
      .circle1 {
        background-color: #FFA041;
      }
      .circle1::before {
        content:'';
        position:absolute;
        width: 3px;
        height: 2.8rem;
        background: #F4F4F4;
        top: 0.7rem;
        left: .22rem;
      }
      .circle1::after {
        content:'';
        position:absolute;
        width: 3px;
        height: 1.4rem;
        background: #FFA041;
        top: 0.7rem;
        left: .22rem;
      }
      .circle2 {
        top: 30%;
      }
      .circle2::before {
        content:'';
        position:absolute;
        width: 3px;
        height: 4.0rem;
        background: #F4F4F4;
        top: 0.7rem;
        left: .22rem;
      }
      .circle3 {
        bottom: 0;
      }
      .content {
        padding-left: 1.6rem;
      }
    }
    .top {

    }
    .time {
      margin-top: .5rem;
    }
    .center {
      margin: 1.25rem 0;
    }
    .bottom {

    }
  }
</style>
