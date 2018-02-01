<template>
  <div>
    <div class="step2 stepTop">
      <input-box :inputMessage="password"
                 :type="inputType"
                 v-model="passWord"
                 @input="inputPW"
                 maxlength="20"/>
      <div class="commonIcon"
           :class="{'openEye' : passType == 'openEye' , 'closeEye' : passType == 'closeEye' }"
           @click="showPasswod()">
      </div>
      <space-empty/>
      <div class="confirm">友情提示：交易密码请设置和登录密码不同。</div>
      <space-empty/>
    </div>
    <space/>
    <space-empty/>
    <div class="step2">
      <base-button :styleObj="buttonObj"
                   @click.native="butNext">
        下一步
      </base-button>
    </div>
  </div>
</template>

<script>
import space from 'components/subassembly/space.vue';
import inputBox from 'components/subassembly/input.vue';
import spaceEmpty from 'components/subassembly/spaceEmpty.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import {toast} from 'js/api.js';
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_HOWSTEP', to.meta.step);
    });
  },
  components: {
    'input-box': inputBox,
    'space-empty': spaceEmpty,
    'base-button': baseButton,
    'space': space
  },
  data () {
    return {
      password: '设置交易密码',
      buttonObj: {
        color: '#fff',
        backgroundColor: ''
      },
      disabled: true,
      passType: 'closeEye',
      inputType: 'password',
      passWord: ''
    };
  },
  methods: {
    // 显示，隐藏密码
    showPasswod () {
      let self = this;
      if (self.passType == 'closeEye') {
        self.passType = 'openEye';
        self.inputType = 'text';
      } else {
        self.passType = 'closeEye';
        self.inputType = 'password';
      }
    },
    // 交易密码是否输入和按钮是否可用
    inputPW () {
      let self = this;
      let txt = new RegExp(/[^\w\.\/]/ig);
      if (self.passWord != '' && !txt.test(self.passWord)) {
        self.disabled = false;
        self.buttonObj.backgroundColor = '#DC2828';
      } else {
        self.disabled = true;
        self.buttonObj.backgroundColor = '#DCDCDC';
      }
    },
    butNext () {
      let self = this;
      let txtN = new RegExp(/^[a-z]+$/i);
      let tstS = new RegExp(/^[A-Za-z0-9]+$/);
      sessionStorage.setItem('passWord', self.passWord);
      if (txtN.test(self.passWord)) {
        toast('密码必须是纯数字或者数字与大小写字母的组合');
      } else if (!tstS.test(self.passWord)) {
        toast('密码必须是纯数字或者数字与大小写字母的组合');
      } else if (self.passWord.length < 6 || self.passWord.length > 20) {
        toast('密码长度为6-20位');
      } else {
        self.$store.commit('UPDATE_HOWSTEP', 3);
        self.$router.push({path: '/openAccount/openAccountBindCard'});
      }
    }
  }
};
</script>

<style lang="less">
  .step2{
    padding: 0rem 0.75rem 0.5rem;
    position: relative;
    .commonIcon{
      background: url("../../img/passwordIcon.png") no-repeat;
      background-size: 37/40rem 42/40rem;
      position: absolute;
      right: 31.2/40+0.75rem;
      top: 33.4/40rem;
    }
    .openEye{
      width: 36.8/40rem;
      height: 25/40rem;
    }
    .closeEye{
      width: 33/40rem;
      height: 15.3/40rem;
      background-position: 0rem -14/20rem;
      top: 37.7/40rem;
    }
    .confirm{
      color: #96969B;
      font-size: .6rem
    }
  }
  .stepTop{
    padding: 0rem 0.75rem 0.25rem;
  }
</style>
