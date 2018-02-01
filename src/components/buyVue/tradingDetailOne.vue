<template>
  <div>
    <div class="tradingDetailCenter">
      <div class="text fc-19191E fs-30">
        <em class="delIcon"
            :class="{'awaitIcon': tradingDetailCenter.flag == 1 }"></em>
        <p class="delText">{{ tradingDetailCenter.delText }}</p>
      </div>
      <!-- 失败 -->
      <p class="why fc-96969B fs-24"
         v-show=" tradingDetailCenter.flag == '0'">{{ tradingDetailCenter.why }}</p>
      <!-- 确认中 -->
      <p class="why fc-96969B fs-24"
         v-show=" tradingDetailCenter.flag == '1'">待确认可能时间较长，如超过20分钟</p>
      <p class="call fc-96969B fs-24">
        <!-- 待确认 -->
        <span v-show=" tradingDetailCenter.flag == '1' ">请致电客服寻求帮助</span>
        <!-- 失败 -->
        <span v-show=" tradingDetailCenter.flag == '0' ">如需帮助，请致电客服</span>
        <span class="onlineCall">
          <a class="fc-dc2828 fs-24"
             href="tel:400-921-7755">
            400-921-7755
          </a>
        </span>
        <!-- <em class="callIcon"></em> -->
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tradingDetailCenter: {
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
      padding: 1rem .75rem 1.25rem;
      .text {
        display: flex;
        .delIcon {
          display: inline-block;
          width: .9rem;
          height: .9rem;
          background-image: url('../../img/fail.png');
          background-repeat: no-repeat;
          background-size: contain;
          margin: auto;
          margin-right: .45rem;
        }
        .awaitIcon {
          display: inline-block;
          width: .9rem;
          height: .9rem;
          border-radius: 50%;
          background-color: green;
          margin: auto;
          margin-right: .45rem;
        }
        .delText {
          flex: 1;
        }
      }
      .why {
        padding-left: 1.35rem;
        margin: .25rem 0;
      }
      .call {
        padding-left: 1.35rem;
        line-height: 1rem;
        .onlineCall {
          text-decoration: underline;
        }
        .callIcon {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          margin-left: .25rem;
          background-image: url('../../img/service.png');
          background-repeat: no-repeat;
          background-size: contain;
          vertical-align: bottom;
        }
      }
    }
</style>
