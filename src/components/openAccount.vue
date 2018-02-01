<template>
  <div id="openAccount"
       ref="bigHeight">
    <div ref="contHeight">
      <open-account-step v-show="openStatus=='1'"/>
      <!-- 灰色背景间隔 -->
      <space v-if="step!='6' && openStatus=='1'"/>
      <space-empty/> <!-- 白色背景间隔 -->
      <router-view/>
      <div class="footer"
           v-if="step!='6'">
        <span><em></em>浦发银行全程保障交易资金安全</span>
        <span>客服电话：<a href="tel:400-921-7755">400-921-7755</a></span>
      </div>
    </div>
  </div>
</template>
<script>
import openAccountStepTitle from 'components/openAccountStep/openAccountStepTitle.vue';
import space from 'components/subassembly/space.vue';
import spaceEmpty from 'components/subassembly/spaceEmpty.vue';
import {toast} from 'js/api.js';
import {getUserInformation} from 'js/request.js';
export default {
  name: 'OpenAccount',
  components: {
    'open-account-step': openAccountStepTitle,
    'space': space,
    'space-empty': spaceEmpty
  },
  data () {
    return {
      openStatus: ''
    };
  },
  computed: {
    step () {
      return this.$store.getters.howStep;
    }
  },
  mounted () {
    let self = this;
    self.getInformation();
  },
  methods: {
    getInformation () {
      let self = this;
      getUserInformation().then(function (resp) {
        if (resp.data.respCode == '000') {
          let informatin = resp.data.data;
          let status = '';
          if (informatin.authnameStatus == '20') {
            status = '1'; // 开户
          } else if (informatin.authnameStatus == '0') {
            status = '2'; // 绑卡
          }
          self.openStatus = status;
          sessionStorage.setItem('openStatus', status);
          self.$store.commit('UPDATE_OPENACCOUNTSTAUTS', status);
          self.$store.commit('UPDATE_CARD', informatin.certificateNumber);
          self.$store.commit('UPDATE_NAME', informatin.name);
          self.$store.commit('UPDATE_BACkHTML', informatin.redirectUrl);
          if (informatin.redirectUrl && informatin.redirectUrl != '') {
            sessionStorage.setItem('backHtml', informatin.redirectUrl);
          }
        } else {
          toast(resp.data.respMessage);
        }
      });
    }
  }
};
</script>
 <style lang="less" scoped>
 #openAccount{
   height: 100%;
   overflow-y: auto;
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
 </style>
