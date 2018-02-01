<template>
  <div>
    <div class="enterPwd bg-ffffff"
         v-show="show">
      <div class="content">
        <div class="enterPwdTop">
          <span class="cancel fc-19191E fs-30"
                @click="close">
            取消
          </span>
          <span class="title fc-19191E fs-36">输入交易密码</span>
          <span class="confirm fc-dcdcdc fs-30"
                :class="{'fc-19191E': enterPwd.flag == 1 }"
                @click="confirm">
            确定
          </span>
        </div>
        <div class="enterPwdCenter">
          <input class="pwdInput fs-36 fc-19191E"
                 maxlength="20"
                 @input="$emit('input', $event.target.value)"
                 :type="mytype"
                 v-model="pwdInput">
          <div class="iconWrapper"
               @click="toggleIcon">
            <em class="icon"
                :class="{'iconClose': open == false, 'iconOpen': open != false }"></em>
          </div>
        </div>
        <div class="enterPwdbottom">
          <!-- 2017.11.20delete -->
          <!-- <p class="forgetPwd fc-19191E fs-24">忘记密码?</p> -->
        </div>
      </div>
    </div>
    <div v-show="show"
         class="enterPwdWrapper">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    enterPwd: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      tag: 1,
      open: false,
      flag: 0,
      pwdInput: ''
    };
  },
  computed: {
    show () {
      return this.$store.getters.showEnterPwd;
    },
    mytype () {
      return this.open ? '' : 'password';
    }
  },
  methods: {
    toggleIcon () {
      this.open = !this.open;
    },
    close () {
      this.pwdInput = '';
      this.$emit('input', '');
      this.enterPwd.flag = 0;
      this.$store.commit('UPDATE_SHOWENTERPWD', false);
    },
    confirm () {
      let _this = this;
      _this.$emit('confirm');
      _this.pwdInput = '';
      _this.$emit('input', '');
      _this.enterPwd.flag = 0;
    }
  }
};
</script>

<style lang="less" scoped>
  .enterPwd {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    overflow: scroll;
    .content {
      padding: 0 .75rem;
    }
    .enterPwdTop {
      display: flex;
      padding: 1rem 0;
      margin-bottom: .25rem;
      .cancel {
        margin: auto;
        padding-right: 1rem;
      }
      .title {
        flex: 1;
        text-align: center;
      }
      .confirm {
        margin: auto;
        padding-left: 1rem;
      }
    }
    .enterPwdCenter {
      border: 1px solid #DCDCDC;
      display: flex;
      padding: .55rem 1rem;
      border-radius: 2px;
      .pwdInput {
        flex: 1;
      }
      .iconWrapper {
        padding-left: 1rem;
        .icon {
          display: inline-block;
          width: 0.85rem;
          height: .85rem;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .iconClose {
          background-image: url('../../img/closeeye.png');
        }
        .iconOpen {
          background-image: url('../../img/openeye.png');
        }
      }
    }
    .enterPwdbottom {
      padding: .75rem 0 1rem;
      .forgetPwd {
        text-align: right;
        text-decoration: underline;
      }
    }
  }

  .enterPwdWrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
