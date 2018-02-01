<template>
  <div class="step"
       v-if="step!='6'">
    <ul>
      <li :class="{'visited':step==1,'actived':step==2 || step==3}">
        <div>1</div>
        <span>填写个人信息</span>
      </li>
      <li :class="{'visited':step==2,'actived':step==3}">
        <div :class="{'actived':step==2}">2</div>
        <span>设置交易密码</span>
      </li>
      <li :class="{'visited':step==3}">
        <div>3</div>
        <span>绑定银行卡</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {

    };
  },
  computed: {
    step () {
      return this.$store.getters.howStep;
    }
  }
};
</script>
<style lang="less" scoped>
  .step{
    padding-top: 1rem;
    padding-bottom: 1.15rem;
    ul{
      display: flex;
      justify-content: center;
      li{
        display: flex;
        flex: 1;
        text-align: center;
        flex-direction: column;
        align-items: center;
        span{
          font-size: 0.6rem;
          padding-top: 0.5rem;
          color: #96969B;
        }
        div{
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          color: #fff;
          background: #DCDCDC;
          font-size: 0.75rem;
          line-height: 1.5rem;
          position: relative;
        }
        div::after{
          content: "";
          position: absolute;
          left: 1.75rem;
          top: 50%;
          height: 2px;
          width: 142%;
          background: #DCDCDC;
        }
        div::before{
          content: "";
          position: absolute;
          right: 1.8rem;
          top: 50%;
          height: 2px;
          width: 142%;
          background: #DCDCDC;
        }
      }
      li:last-child div::after{
        height: 0
      }
      li:first-child div::before{
        height: 0
      }
      li:last-child.visited div::before{
        background: #FFD9B4;
      }
      li.visited{
        div, div::after, div::before{
          background: #FFA041;
        }
        div.actived::before{
          background: #FFD9B4;
        }
        span{
          color: #FFA041;
        }
      }
      li.actived{
        div, div::after, div::before{
          background: #FFD9B4;
        }
        span{
          color: #FFD9B4 ;
        }
      }
    }
  }
</style>
