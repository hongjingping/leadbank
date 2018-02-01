<template>
  <div id="riskResult"
       v-if="pageReady">
    <p class="fs-30 fc-19191E fa-pingfangsc type"
       v-if="viewData.riskLevel">
      {{ viewData.subInvestorType =='P' ? '专业投资者': '普通投资者' }}
    </p>
    <p class="riskImg"
       :class="{'riskImg11' : viewData.riskLevel == 'C1' && viewData.lowRiskLevel=='Y','riskImg12' : viewData.riskLevel == 'C1' && viewData.lowRiskLevel =='N', 'riskImg2' : viewData.riskLevel == 'C2','riskImg3' : viewData.riskLevel == 'C3','riskImg4' : viewData.riskLevel == 'C4','riskImg5' : viewData.riskLevel == 'C5'}" >
    </p>
    <p class="fs-24 fc-96969B fa-pingfangsc"
       v-if="viewData.riskLevel">
      您的风险测试等级为
    </p>
    <div class="fs-60 fc-dc2828 level"
         v-if="viewData.riskLevel" >
      <span class="line bg-dc2828"></span>
      <span>
        {{ viewData.riskLevel }}&nbsp;
        {{ viewData.riskLevelInfo.riskLevelName }}
      </span>
      <span class="line bg-dc2828"></span>
      <p class="fa-pingfangsc fs-24 fc-19191E"
         v-if="viewData.lowRiskLevel=='Y'" >
        风险承受能力最低类别投资者
      </p>
    </div>
    <p class="backButton"
       v-if="isH5" >
      <baseButton :styleObj="styleObj"
                  @click.native="back">
        完成
      </baseButton>
    </p>
    <p class="fs-28"
       :class="{ 'isH5': !isH5 }"
       @click="reTest">
      <baseButton :styleObj="isH5 ? testButtonStyles : testBtn">重新测评</baseButton>
    </p>
  </div>
</template>
<script>
import baseButton from 'components/subassembly/BaseButton.vue';
import {isRouterPath, toast} from 'js/api.js';
import {queryRiskRecord} from 'js/request.js';

export default {
  name: 'RiskResult',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_SHOWBACKBUTTON', 0);
    });
  },
  components: {
    baseButton
  },
  data () {
    return {
      pageReady: 0,
      styleObj: {
        backgroundColor: '#DC2828',
        color: '#fff'
      },
      testButtonStyles: {
        backgroundColor: '#fff',
        color: '#DC2828',
        border: '1px solid #DC2828'
      },
      testBtn: {
        backgroundColor: '#DC2828',
        color: '#fff'
      },
      viewData: '',
      isH5: this.$route.query.isH5
    };
  },
  mounted () {
    this.getRiskResult();
  },
  methods: {
    getRiskResult () {
      let _this = this;
      queryRiskRecord().then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.viewData = resp.data.data;
        } else {
          toast(resp.data.respMessage);
        }
        _this.$nextTick(function () {
          _this.pageReady = 1;
        });
      });
    },
    back () {
      if (window.isApp) {
        window.mutual.closeWebview();
      } else {
        if (this.viewData.redirectUrl) {
          let redirect = this.viewData.redirectUrl;
          if (isRouterPath(redirect)) {
            let isRout = isRouterPath(redirect);
            if (typeof (isRout) === 'string') {
              this.$router.replace({path: isRout});
            } else {
              this.$router.replace({path: isRout.path, query: isRout.query});
            }
          } else {
            window.location.href = redirect;
          }
        }
      }
    },
    reTest () {
      this.$router.replace({path: 'riskTest'});
    }
  }
};
</script>
<style lang="less" scoped>
#riskResult {
  box-sizing: border-box;
  padding: 20/20rem 30/40rem;
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  p:first-child {
    /*<!--padding: 10/20rem 0 30/20rem 0;-->*/
    /*<!--font-size: 16/20rem;-->*/
  }
  .riskImg {
    margin-bottom: 12/20rem;
    width: 100%;
    height: 100/20rem;
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: 100/20rem 100/20rem;
  }
  .riskImg11 {
    background-image: url("../img/c1-1.png")
  }
  .riskImg12 {
    background-image: url("../img/c1-2.png")
  }
  .riskImg2 {
    background-image: url("../img/c2.png")
  }
  .riskImg3 {
    background-image: url("../img/c3.png")
  }
  .riskImg4 {
    background-image: url("../img/c4.png")
  }
  .riskImg5 {
    background-image: url("../img/c5.png")
  }
  .type {
    margin-bottom: 38/20rem;
  }
  .level {
    margin-top: 10/20rem;
    span {
      vertical-align: middle;
    }
    p {
      margin-top: 15/20rem;
    }
  }
  .line {
    display: inline-block;
    width: 25/20rem;
    height: 1px;
  }
  .backButton {
    margin-top: 60/20rem;
    margin-bottom: 20/20rem;
  }
  .isH5 {
    margin-top: 60/20rem;
  }
  .notice:first-child {
    padding: 0;
    line-height: 1.5;
  }
}
</style>
