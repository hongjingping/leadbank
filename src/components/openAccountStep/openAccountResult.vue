<template>
  <div class="openAccountResult">
    <space-empty/>
    <div class="sucess"
         v-if="result === 'T'">
      <div class="OASucess">
        <img src="../../img/cardsucess.png" >
      </div>
      <label class="openResult">
        <em>恭喜您</em>
        恭喜，您已成功<span v-if="status=='1'">开户</span><span v-else>绑卡</span>!
      </label>
    </div>
    <div class="fail"
         v-else-if="result ==='F'">
      <div class="OAFail">
        <img src="../../img/cardFail.png" >
      </div>
      <label class="openResult">
        <em class="failResion">{{ reasion }}</em>
        请致电客服寻求帮助 <a href="tel:400-921-7755">400-921-7755</a>
      </label>
    </div>
    <div class="TFail"
         v-else>
      <div class="OATFail">
        <img src="../../img/tradeFail.png" >
      </div>
      <label class="openResult">
        <em>待银行确认</em>
        <span v-if="status=='1'">开户</span><span v-else>绑卡</span>结果待银行确认...
      </label>
    </div>
    <space-empty/>
    <space-empty/>
    <space/>
    <space-empty/>
    <div class="OPButStyle">
      <base-button :styleObj="buttonObj"
                   @click.native="openAccountResult"
                   :disabled="disabled"
                   v-if="result=='T'">
        返回（{{ time }}秒自动返回）
      </base-button>
      <base-button :styleObj="buttonObj"
                   @click.native="openAccountResult"
                   :disabled="disabled"
                   v-else>
        返回
      </base-button>
    </div>
  </div>
</template>

<script>
import space from 'components/subassembly/space.vue';
import spaceEmpty from 'components/subassembly/spaceEmpty.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import {isRouterPath} from 'js/api.js';
export default {
  components: {
    'space-empty': spaceEmpty,
    'base-button': baseButton,
    'space': space
  },
  data () {
    return {
      buttonObj: {
        color: '#fff',
        backgroundColor: '#DC2828'
      },
      disabled: false,
      result: sessionStorage.getItem('result') ? sessionStorage.getItem('result') : 'F',
      time: '5',
      reasion: sessionStorage.getItem('reasion') ? sessionStorage.getItem('reasion') : '出错啦',
      isBindCard: sessionStorage.getItem('openStatus') ? sessionStorage.getItem('openStatus') : ''
    };
  },
  computed: {
    status () {
      return this.$store.getters.openAccountStauts;
    }
  },
  mounted () {
    let self = this;
    self.getResult();
    // 判断是绑卡还是开户
    if (sessionStorage.getItem('openStatus')) {
      if (sessionStorage.getItem('openStatus') == '2') {
        self.$store.commit('UPDATE_TITLENAME', '绑定银行卡');
        document.title = '绑定银行卡';
      } else {
        self.$store.commit('UPDATE_TITLENAME', '开户');
        document.title = '开户';
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_HOWSTEP', to.meta.step);
      vm.$store.commit('UPDATE_SHOWBACKBUTTON', 0);
    });
  },
  methods: {
    // 获取绑卡结果
    getResult () {
      let self = this;
      if (self.result == 'T') {
        self.timeOut();
      }
    },
    // 邦卡成功跳转
    openAccountResult () {
      let self = this;
      // 是否有返回URL标志  有通过跳转返回  没有通过后退返回
      if (sessionStorage.getItem('backHtml')) {
        // 该URL是否是当前路由系统中的地址 是通过vue-router的API跳转  不是通过window.location.href跳转
        if (isRouterPath(sessionStorage.getItem('backHtml'))) {
          let isRout = isRouterPath(sessionStorage.getItem('backHtml'));
          // 判断该地址是否携带参数
          if (typeof (isRout) === 'string') {
            self.$router.push({path: isRout});
          } else {
            self.$router.push({path: isRout.path, query: isRout.query});
          }
        } else {
          window.location.href = sessionStorage.getItem('backHtml');
        }
      } else {
        // 采用后对方式返回
        // 1 是开户 需要五步
        // 其他 是绑卡 需要3步
        if (self.isBindCard == '1') {
          // 是否有足够的历史记录可以后退  没有后退到当前历史记录的第一条
          if (window.history.length > 5) {
            self.$router.go(-5);
          } else {
            self.$router.go(-(window.history.length - 1));
          }
        } else {
          if (window.history.length > 3) {
            self.$router.go(-3);
          } else {
            self.$router.go(-(window.history.length - 1));
          }
        }
      }
    },
    // 5秒倒计时
    timeOut () {
      let self = this;
      let times = 5;
      let interval = setInterval(function () {
        times = times - 1;
        self.time = times;
        if (times == 0) {
          clearInterval(interval);
          self.openAccountResult();
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less">
  .openAccountResult {
    .OASucess, .OAFail, .OATFail{
      width: 260/40rem;
      height: 260/40rem;
      margin: 0 auto;
      padding-bottom: 0.5rem;
    }
    img{
      width: 100%
    }
    .openResult{
      text-align: center;
      font-size: 0.75rem;
      color: #96969B;
      display: block;
      em{
        display: block;
        font-size: 1rem;
        padding-bottom: 0.3rem;
      }
      a{
         color: #DC2828;
      }
      .failResion{
        padding: 0rem 2rem 0.3rem;
      }
    }
    .OPButStyle{
      padding: 0rem 0.75rem;
    }
  }
</style>
