<template>
  <div id="saleRulePage"
       class="rule-c-wrapper">
    <div v-if="pageReadyFlag && xfFundFlg == '01'">
      <!-- 费率部分 -->
      <div class="rate-part">
        <div class="rule-part-header">
          赎回费率：
        </div>
        <div class="rate-part-c">
          <p v-if="fundType == '98'"><span>不限</span><span class="fc-dc2828">0.00%</span></p>
          <p v-for="(item,index) in saleRateList"
             :key="index"
             v-else >
            <span>{{ item.amountdesc }}</span>
            <span class="fc-dc2828">{{ item.ratevalue }}</span>
          </p>
        </div>
        <div class="rate-part-c rateText"
             v-if="fundType != '04' && fundType != '98'" >
          <span>基金卖出费率由基金持有天数（自然日）长短决定，基金卖出时一般按照先进先出规则，实际费用收取以基金公司计算为准。</span><br>
          <span>赎回计算：</span><br>
          <span>赎回总额=赎回数量*T日基金份额净值</span><br>
          <span>赎回费用=赎回总额*赎回费率</span><br>
          <span>赎回金额=赎回总额-赎回费用</span>
        </div>
      </div>
      <!-- 费率部分end -->
      <!-- 进度示意 -->
      <div class="schedule-part">
        <div class="rule-part-header">
          卖出进度示例：
        </div>
        <div class="schedule-part-c">
          <div class="progress-bar">
            <p><span>{{ saleState1Top }}</span><span>确认份额</span><span>预计到账</span></p>
            <div class="progress-line">
              <span class="circle"></span>
              <span class="line"></span>
              <span class="circle"></span>
              <span class="line"></span>
              <span class="circle"></span>
            </div>
            <p><span>T日</span><span>{{ repurConfirm }}</span><span>{{ expRedAcc }}</span></p>
          </div>
          <div class="schedule-explain explain">
            <div class="ico-circle"></div>
            <div>
              <p v-for="(item,index) in saleStateExplain"
                 :key="index">{{ item }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 进度示意end -->
      <!-- 交易时间确认表 -->
      <div class="dealTime-list">
        <div class="rule-part-header">
          交易时间确认表：
        </div>
        <div class="list-wrapper">
          <p class="list-title">
            <span>交易时间</span>
            <span>确认份额</span>
            <span>预计到账</span>
          </p>
          <div class="list-c">
            <p v-for="(item,index) in saleDateList"
               :key="index" >
              <span>{{ item.startDate }}至<br>{{ item.endDate }}</span>
              <span>{{ item.confirmDate }}</span><span>{{ item.gainDate }}</span>
            </p>
          </div>
        </div>
        <div class="time-explain explain">
          <div class="ico-circle"></div>
          <div class="fs-24 fc-96969B">
            注：如遇法定节假日，确认份额及查看收益时间顺延。QDII基金确认份额及查看收益会受海外节假日影响，与国内基金交易日可能不同，具体以招募说明书为准。
          </div>
        </div>
      </div>
      <!-- 交易时间确认表 end-->
    </div>
    <div class="newFundExplain"
         v-if="xfFundFlg == '00'">
      该基金新发阶段，暂不支持卖出操作！
    </div>
  </div>
</template>
<script>
export default {
  name: 'SaleRulePage',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_DEALRULETABFLAG', to.meta.tab);
    });
  },
  data () {
    return {
      pageReadyFlag: 0,
      expRedAcc: '',
      xfFundFlg: '',
      saleState1Top: '卖出',
      saleStateExplain: [
        'T日：交易日，QDII基金交易日会受海外节假日影响，与国内基金交易日可能不同，具体以基金招募书为准。',
        'T+1日：T日的下一交易日。'
      ],
      saleRateList: [],
      saleDateList: [],
      fundType: ''
    };
  },
  mounted () {
    this.getSaleRuleData();
  },
  methods: {
    getSaleRuleData () {
      let _this = this;
      let RuleData = this.$store.getters.dealRuleDetails;
      if (RuleData) {
        _this.xfFundFlg = RuleData.xfFundFlg;
        _this.fundType = RuleData.fundType;
        // 是否新发基金  00：新发，01：不是
        if (RuleData.xfFundFlg != '00') {
          // 理财型 98
          if (RuleData.fundType == '98') {
            _this.saleState1Top = '到期日发起卖出';
            _this.saleStateExplain[2] = '持有到期后，本金+收益将继续买入下一期，收益不间断。';
            _this.saleStateExplain[3] = '目前已支持理财型基金的预约赎回，用户可随时预约到期后自动赎回哦。';
          } else {
            _this.saleState1Top = '卖出';
            _this.saleStateExplain[2] = '';
            _this.saleStateExplain[3] = '';
          }
          // 预计赎回到账
          _this.expRedAcc = RuleData.expRedAcc;
          // 赎回确认时间
          _this.repurConfirm = RuleData.repurConfirm;
          _this.saleRateList = RuleData.repurRateList;
          _this.saleDateList = RuleData.saleDateList;
          for (let i = 0; i < _this.saleDateList.length; i++) {
            let transDateArry = (_this.saleDateList)[i].transDate.split('~');
            (_this.saleDateList)[i].startDate = transDateArry[0];
            (_this.saleDateList)[i].endDate = transDateArry[1];
          }
          _this.$nextTick(function () {
            _this.pageReadyFlag = 1;
          });
        } else {

        }
      } else {
        /** 检测不到数据时每隔500ms重新检测一次 */
        setTimeout(function () {
          _this.getSaleRuleData();
        }, 500);
      }
    }
  }
};
</script>
<style lang="less" scoped>
#saleRulePage {
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  .newFundExplain {
    box-sizing: border-box;
    padding-top: 4rem;
    margin-bottom: 0;
    width: 100%;
    height: 100%;
    font-size: 18/20rem;
    color: #96969b;
    text-align: center;
    background-color: #fff;
  }
}
.rule-c-wrapper > div {
  margin-bottom: 0;
  background-color: transparent;
}
.rule-c-wrapper > div > div {
  margin-bottom: 0.5rem;
  background-color: #fff;
}
</style>
