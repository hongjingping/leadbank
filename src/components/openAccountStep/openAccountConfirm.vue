<template>
  <div>
    <div class="account">
      <div class="openAccount">
        <input-box :inputMessage="phone"
                   :styleObj="styleObj"
                   type="text"
                   readonly />
        <div class="code">
          <base-button :styleObj="buttonObj"
                       @click.native="getMessage"
                       :disabled="disabled">
            {{ mesg }}
          </base-button>
        </div>
      </div>
      <space-empty/>
      <input-box :inputMessage="code"
                 type="text"
                 v-model="inputName"
                 maxlength="6"
                 @input="inputText"
                 :inputType="inputType" />
      <space-empty/>
    </div>
    <space/>
    <div class="account">
      <space-empty/>
      <div class="bind">
        <base-button :styleObj="buttonObj1"
                     @click.native="openAccountNext"
                     :disabled="disabled1" >
          下一步
        </base-button>
      </div>
    </div>
  </div>
</template>

<script>
import space from 'components/subassembly/space.vue';
import inputBox from 'components/subassembly/input.vue';
import spaceEmpty from 'components/subassembly/spaceEmpty.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import {toast} from 'js/api.js';
import {openAccountMessage, openAccountConfirm, openAccountSucess} from 'js/request.js';

export default {
  components: {
    'input-box': inputBox,
    'space-empty': spaceEmpty,
    'base-button': baseButton,
    'space': space
  },
  data () {
    return {
      phone: '',
      inputName: '',
      styleObj: {
        width: '60%',
        backgroundColor: '#F1F1F1'
      },
      buttonObj: {
        color: '#fff',
        backgroundColor: '#DC2828',
        fontSize: '0.75rem'
      },
      disabled: false,
      code: '请输入验证码',
      buttonObj1: {
        color: '#fff',
        backgroundColor: ''
      },
      disabled1: true,
      mesg: '重新获取',
      custAUTOrderId: '',
      inputType: 'number',
      operatorType: ''
    };
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_HOWSTEP', to.meta.step);
    });
  },
  computed: {
    status () {
      return this.$store.getters.openAccountStauts;
    }
  },
  mounted () {
    let self = this;
    if (sessionStorage.getItem('phone')) {
      self.phone = sessionStorage.getItem('phone').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    if (sessionStorage.getItem('chkType')) {
      self.timeOut();
    }
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
  methods: {
    // 倒计时
    timeOut () {
      let self = this;
      let time = 60;
      self.mesg = '重发' + 60 + 's';
      self.disabled = true;
      self.buttonObj.backgroundColor = '';
      let interval = setInterval(function () {
        time--;
        if (time == 0) {
          sessionStorage.removeItem('chkType');
          clearInterval(interval);
          self.mesg = '重新获取';
          self.disabled = false;
          self.buttonObj.backgroundColor = '#DC2828';
          self.operatorType = 'RS';
        } else {
          self.mesg = '重发' + time + 's';
        }
      }, 1000);
    },
    // 获取短信验证码
    getMessage () {
      let self = this;
      let parm = {
        channelCode: 'LD',
        saleMercId: 'LD',
        custAUTOrderId: sessionStorage.getItem('custAUTOrderId'),
        verifyType: '1',
        operatorType: self.operatorType
      };
      openAccountMessage(parm).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.mesg = '重发' + 60 + 's';
          self.timeOut();
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 文本框输入
    inputText () {
      let self = this;
      let txt = /[^0-9]/g;
      if (self.inputName != '' && !txt.test(self.inputName)) {
        self.disabled1 = false;
        self.buttonObj1.backgroundColor = '#DC2828';
      } else {
        self.disabled1 = true;
        self.buttonObj1.backgroundColor = '';
      }
    },
    // 开户提交
    openAccountNext () {
      let self = this;
      let parm = {
        operatorType: 'cs',
        custAUTOrderId: sessionStorage.getItem('custAUTOrderId'),
        mpSmsValCode: self.inputName,
        channelCode: 'LD',
        saleMercId: 'LD'
      };
      openAccountConfirm(parm).then(function (resp) {
        self.$store.commit('UPDATE_LOADINGFLAG', 3);
        if (resp.data.respCode == '000') {
          self.custAUTOrderId = resp.data.data.custAUTOrderId;
          sessionStorage.setItem('custAUTOrderId', self.custAUTOrderId);
          let num = 0;
          let interval = null;
          // 开户轮询
          let param = {
            queryType: 'L,F',
            custAUTOrderId: self.custAUTOrderId
          };
          interval = setInterval(function () {
            openAccountSucess(param).then(function (resp) {
              if (resp.data.respCode == '000') {
                let result = resp.data.data.openAccountResult;
                sessionStorage.setItem('result', result);
                sessionStorage.setItem('reasion', resp.data.respMessage);
                num++;
                if (result == 'I') {
                  if (num > 3) {
                    self.$store.commit('UPDATE_LOADINGFLAG', 0);
                    clearInterval(interval);
                    self.$router.push({path: '/openAccount/openAccountResult'});
                  }
                } else {
                  self.$store.commit('UPDATE_LOADINGFLAG', 0);
                  clearInterval(interval);
                  self.$router.push({path: '/openAccount/openAccountResult'});
                }
              } else {
                self.$store.commit('UPDATE_LOADINGFLAG', 0);
                toast(resp.data.respMessage);
                clearInterval(interval);
              }
            });
          }, 3000);
        } else {
          self.$store.commit('UPDATE_LOADINGFLAG', 0);
          toast(resp.data.respMessage);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.account{
  padding: 0 0.75rem;
  .openAccount{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .code{
      width: 6rem;
    }
  }
}

</style>
