<template>
  <div id="qukLogin">
    <div id="qukCont">
      <div class="titleStep">
        <div class="back"
             v-if="!isApp && !isWechat && !isWebview" >
          <a @click="goBack"><img src="../img/back-white.png" ></a>
        </div>
        <span>登录</span>
      </div>
      <div class="contStep">
        <input-box type="text"
                   maxlength="11"
                   v-model="tel"
                   :inputMessage="phone"
                   @input="inputTest"
                   :inputType="inputType" />
        <space-empty/>
        <div class="login">
          <input-box type="text"
                     maxlength="5"
                     v-model="pCode"
                     :inputMessage="picCode"
                     :styleObj="styleObj"
                     @input="inputTest"
                     :inputType="inputType" />
          <div class="code">
            <img :src="imgUrl"
                 @click="getImgCode">
          </div>
        </div>
        <space-empty/>
        <div class="login">
          <input-box type="text"
                     :inputMessage="phoneCode"
                     :styleObj="styleObj"
                     v-model="vCode"
                     @input="inputTest"
                     :inputType="inputType"
                     maxlength="6"/>
          <div class="code">
            <base-button :styleObj="buttonObj1"
                         :disabled="disabled1"
                         @click.native="getVCode" >
              {{ timeOut }}
            </base-button>
          </div>
        </div>
        <div class="protocol">
          <span :class="{'noCheck':!check}"
                @click="isCheck">
          </span>
          我已阅读并同意
          <a v-for="(item,index) in protocolCont"
             :key="index"
             :href="item.agreementUrl" >
            《{{ item.agreementName }}》
          </a>
        </div>
        <base-button :styleObj="buttonObj2"
                     :disabled="disabled2"
                     @click.native="loginStatus">
          免注册登录
        </base-button>
        <div class="footer">
          <span><em></em>浦发银行全程保障交易资金安全</span>
          <span>客服电话：<a href="tel:400-921-7755">400-921-7755</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inputBox from 'components/subassembly/input.vue';
import spaceEmpty from 'components/subassembly/spaceEmpty.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import {toast, isRouterPath} from 'js/api.js';
import {getLoginCode, loginVerification, allProtocol} from 'js/request.js';
export default {
  components: {
    'input-box': inputBox,
    'space-empty': spaceEmpty,
    'base-button': baseButton
  },
  data () {
    return {
      timeOut: '获取验证码',
      phone: '请输入手机号',
      picCode: '请输入图形验证码',
      phoneCode: '请输入手机动态码',
      styleObj: {
        width: '63%'
      },
      imgUrl: '',
      buttonObj1: {
        color: '#fff',
        fontSize: '0.75rem',
        backgroundColor: ''
      },
      buttonObj2: {
        color: '#fff',
        backgroundColor: ''
      },
      disabled1: true,
      disabled2: true,
      check: true,
      tel: '',
      pCode: '',
      vCode: '',
      flag: 1,
      inputType: 'number',
      protocolCont: '',
      isApp: window.isApp, // 判断是否在APP里面打开
      isWechat: window.isWechat, // 判读是否在微信里面打开
      isWebview: window.isWebview
    };
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_TITLESHOWFLAG', false);
    });
  },
  mounted () {
    this.getImgCode();
    this.protocol();
  },
  methods: {
    goBack () {
      // 顶部返回按钮
      this.$router.go(-1);
    },
    // 获取图片验证码
    getImgCode () {
      let self = this;
      let src = '/front-gateway-web/imgCode.app?';
      // self.$refs.picCode.src=src+new Date().getTime();
      self.imgUrl = src + new Date().getTime();
    },
    // 获取手机动态验证码
    getVCode () {
      let self = this;
      let time = 60;
      let parm = {
        'phone': self.tel,
        'verifyPicNo': self.pCode
      };
      getLoginCode(parm).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.flag = 2;
          self.timeOut = '重新获取' + 60 + '秒';
          self.disabled1 = true;
          self.buttonObj1.backgroundColor = '';
          self.buttonObj1.fontSize = '0.6rem';
          let interval = setInterval(function () {
            time--;
            if (time == 0) {
              self.timeOut = '重新获取';
              clearInterval(interval);
              self.disabled1 = false;
              self.buttonObj1.backgroundColor = '#DC2828';
              self.buttonObj1.fontSize = '0.75rem';
              self.flag = 1;
            } else {
              self.timeOut = '重新获取' + time + '秒';
            }
          }, 1000);
        } else {
          self.getImgCode();
          toast(resp.data.respMessage);
          self.disabled1 = false;
          self.buttonObj1.backgroundColor = '#DC2828';
        }
      });
    },
    // 协议是否勾选
    isCheck () {
      var self = this;
      let txt = /[^0-9]/g;
      if (self.check == true) {
        self.check = false;
        self.disabled2 = true;
        self.buttonObj2.backgroundColor = '';
      } else {
        self.check = true;
        if (self.tel != '' && self.pCode != '' && self.vCode != '' && !txt.test(self.tel) && !txt.test(self.pCode) && !txt.test(self.vCode)) {
          self.disabled2 = false;
          self.buttonObj2.backgroundColor = '#DC2828';
        }
      }
    },
    // 输入框内容校验
    inputTest (parm) {
      var self = this;
      let txt = /[^0-9]/g;
      if (self.tel != '' && self.pCode != '' && self.vCode != '' && self.check == true && !txt.test(self.tel) && !txt.test(self.pCode) && !txt.test(self.vCode)) {
        self.disabled2 = false;
        self.buttonObj2.backgroundColor = '#DC2828';
        if (self.tel.length == 11 && self.pCode.length == 5 && self.flag == 1) {
          self.disabled1 = false;
          self.buttonObj1.backgroundColor = '#DC2828';
        }
      } else {
        self.disabled2 = true;
        self.buttonObj2.backgroundColor = '';
        if (self.tel.length == 11 && self.pCode.length == 5 && self.flag == 1) {
          self.disabled1 = false;
          self.buttonObj1.backgroundColor = '#DC2828';
        } else {
          self.disabled1 = true;
          self.buttonObj1.backgroundColor = '';
        }
      }
    },
    // 登录验证
    loginStatus () {
      let self = this;
      let text = /[^0-9]/g;
      let parm = {
        'phoneNO': self.tel,
        'verifyPicNo': self.pCode,
        'verifySMSNo': self.vCode
      };
      if (self.tel.length < 11) {
        toast('手机号码位数不正确');
      } else if (text.test(self.tel)) {
        toast('请输入正确的手机号');
      } else if (self.pCode.length < 5) {
        toast('图片验证码不正确');
      } else if (self.vCode.length < 6) {
        toast('手机动态码不正确');
      } else {
        loginVerification(parm).then(function (resp) {
          if (resp.data.respCode == '000') {
            localStorage.setItem('TOKEN', resp.data.data.token);
            if (resp.data.data.redirectUrl) {
              if (isRouterPath(resp.data.data.redirectUrl)) {
                let isRout = isRouterPath(resp.data.data.redirectUrl);
                if (typeof (isRout) === 'string') {
                  self.$router.replace({path: isRout});
                } else {
                  self.$router.replace({path: isRout.path, query: isRout.query});
                }
              } else {
                window.location.href = resp.data.data.redirectUrl;
              }
            } else {
              self.$router.go(-1);
            }
          } else {
            self.getImgCode();
            toast(resp.data.respMessage);
          }
        });
      }
    },
    // 登录协议
    protocol () {
      let self = this;
      let parm = {
        'agreementScent': 'registerAgreement'
      };
      allProtocol(parm).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.protocolCont = resp.data.data.agreemenList;
        } else {
          toast(resp.data.respMessage);
        }
      });
    }
  }
};
</script>

<style lang="less">
#qukLogin{
  height: 98%;
  overflow-y: auto;
}
.titleStep{
   width: 100%;
   background: url("../img/loginBg.png") no-repeat;
   background-size: 100% 100%;
   padding-bottom: 16/20rem;
  .back{
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
      height: 2.15rem;
      line-height: 2.15rem;
      img{
        display: block;
        width: 1.25rem;
        height: 1.25rem;
      }
  }
  span{
    margin-left: 1.5rem;
    color:#fff;
    font-size: 50/40rem;
    border-bottom: 1px solid #ffffff;
    padding: 28/20rem 0rem 12/20rem;
    display: inline-block;
  }
}
.contStep{
  background-color: #fff;
  padding: 2.5rem 1.5rem 0 1.5rem;
  .shortWidth{
    width: 63%
  }
  .login{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .code{
      width: 5rem;
      img{
        width: 192/40rem;
        height: 60/40rem;
      }
    }
  }
  .protocol{
    padding: 58/40rem 0 48/40rem 0;
    font-size: 12/20rem;
    color: #19191E;
    span{
      width: 1rem;
      height: 1rem;
      background: url("../img/check.png") no-repeat;
      display: inline-block;
      background-size: 100% 100%;
      vertical-align: middle;
    }
    span.noCheck{
      background: url("../img/nosel.png") no-repeat;
      background-size: 100% 100%;
    }
    a{
      color: #DC2828;
    }
  }
  .footer{
    padding: 0rem 0.75rem;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    color: #96969B;
    font-size: 0.6rem;
    line-height: 1.55rem;
    padding-top: 0.5rem;
    span{
      display: block;
      em{
        width: 0.75rem;
        height: 0.75rem;
        background: url("../img/footerIcon.png");
        display: inline-block;
        background-size: 100%;
        vertical-align: middle;
        margin-right: 0.5rem;
      }
    }
    span a{
      color: #DC2828;
    }
  }
  .footer.bottom{
    position: absolute;
    bottom: 1rem;
    left: 0;
  }
}
</style>
