<template>
  <div id="buyRulePage"
       class="rule-c-wrapper"
       v-if="pageReadyFlag" >
    <!-- 费率部分 -->
    <div class="rate-part">
      <div class="rule-part-header">
        <p v-if="buyRateState == '01'">认购费率：</p>
        <p v-else>申购费率：</p>
      </div>
      <div class="rate-part-c">
        <p v-for="(item,index) in buyRateList"
           :key="index" >
          <span>{{ item.amountdesc }}</span>
          <span>
            <em class="fc-dc2828">{{ item.disValue ? item.disValue : item.ratevalue }}</em>&nbsp;
            <em class="line-through"
                v-if="item.disValue">
              {{ item.ratevalue }}
            </em>
          </span>
        </p>
      </div>
      <div class="rate-part-c rateText"
           v-if="fundType != '04' && fundType != '98'" >
        <span>申购计算：</span><br>
        <span>净申购金额=申购金额/（1+申购费率）</span><br>
        <span>申购费用=申购金额-净申购金额</span><br>
        <span>申购份额=净申购金额/T日基金份额净值</span>
      </div>
    </div>
    <!-- 费率部分end -->
    <!-- 进度示意 -->
    <div class="schedule-part">
      <div class="rule-part-header">
        买入进度示例：
      </div>
      <div class="schedule-part-c">
        <div class="progress-bar">
          <p><span>买入</span><span>确认份额</span><span>{{ buyState3Top }}</span></p>
          <div class="progress-line">
            <span class="circle"></span>
            <span class="line"></span>
            <span class="circle"></span>
            <span class="line"></span>
            <span class="circle"></span>
          </div>
          <p><span>T日</span><span>{{ purConfirm }}</span><span>{{ buyState3Bottom }}</span></p>
        </div>
        <div class="schedule-explain explain">
          <div class="ico-circle"></div>
          <div>
            <p v-for="(item,index) in buyStateExplain"
               :key="index">
              {{ item }}
            </p>
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
        <p class="list-title"><span>交易时间</span>
          <span>确认份额</span>
        <span>查看收益</span></p>
        <div class="list-c">
          <p v-for="(item,index) in buyDateList"
             :key="index"><span>{{ item.startDate }}至<br>{{ item.endDate }}</span>
          <span>{{ item.confirmDate }}</span><span>{{ item.gainDate }}</span></p>
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
</template>
<script>
export default {
  name: 'BuyRulePage',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_DEALRULETABFLAG', to.meta.tab);
    });
  },
  data () {
    return {
      pageReadyFlag: 0,
      buyState3Top: '查看收益',
      buyState3Bottom: '确认份额后次日',
      buyStateExplain: [
        'T日：交易日，QDII基金交易日会受海外节假日影响，与国内基金交易日可能不同，具体以基金招募书为准。', 'T+1日：T日的下一交易日。'
      ],
      purConfirm: '',
      buyRateState: '',
      xfFundFlg: '00',
      buyRateList: [],
      buyDateList: [],
      fundType: ''
    };
  },
  mounted () {
    this.getBuyRuleData();
  },
  methods: {
    getBuyRuleData () {
      let _this = this;
      let RuleData = this.$store.getters.dealRuleDetails;
      if (RuleData) {
        _this.purConfirm = RuleData.purConfirm;
        _this.fundType = RuleData.fundType;
        _this.xfFundFlg = RuleData.xfFundFlg;
        /** 是否是新发基金 00 ：是， 01：不是 */
        if (RuleData.xfFundFlg == '00') {
          _this.buyState3Top = '基金成立';
          _this.buyState3Bottom = '以基金公司公告为准';
          _this.buyStateExplain[2] = '募集期基金份额的确认时间，以基金公司确认为准。基金成立后，可查询确认份额，当日净值更新后即可查看首笔盈亏。';
        } else {
          /** 是RuleData.否是理财型基金 98 */
          if (RuleData.fundType == '98') {
            _this.buyState3Top = '到期前不可取';
            _this.buyState3Bottom = '封闭期结束';
            _this.buyStateExplain[2] = '持有期：该产品有' + RuleData.operationPeriod + '天封闭期，期间不可取出。';
            _this.buyStateExplain[3] = '到期后：产品到期后可选择存入利活宝或自动转入下一期。';
            _this.buyStateExplain[4] = '周末收益周一更新，收益合计计算在上周收益中，可在周一通过该基金的收益明细查看。';
          } else {
            _this.buyState3Top = '查看收益';
            _this.buyState3Bottom = '确认份额后次日';
            _this.buyStateExplain[2] = '';
            _this.buyStateExplain[3] = '';
            _this.buyStateExplain[4] = '';
          }
        }

        _this.buyRateState = RuleData.fundState;
        /** 01认购 02申购 03其他 */
        if (RuleData.fundState == '01') {
          _this.buyRateList = RuleData.subRateList;
        } else {
          _this.buyRateList = RuleData.purRateList;
        }
        _this.buyDateList = RuleData.buyDateList;
        for (let i = 0; i < _this.buyDateList.length; i++) {
          let transDateArry = (_this.buyDateList)[i].transDate.split('~');
          (_this.buyDateList)[i].startDate = transDateArry[0];
          (_this.buyDateList)[i].endDate = transDateArry[1];
        }
        _this.$nextTick(function () {
          _this.pageReadyFlag = 1;
        });
      } else {
        /** 检测不到数据时每隔500ms重新检测一次 */
        setTimeout(function () {
          _this.getBuyRuleData();
        }, 500);
      }
    }
  }
};
</script>
    <style lang="less">
    .rule-c-wrapper {
      width: 100%;
      height: 100%;
      overflow: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .rule-part-header {
        padding: 1rem 0.75rem;
        width: 100%;
        font-size: 0.75rem;
        color: #19191E;
        border-bottom: 1px solid #dcdcdc;
      }
      .rate-part-c {
        padding: 1rem 0.75rem 1.25rem;
        font-size: 0.75rem;
        color: #96969b;
        p {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        p:last-child {
          margin-bottom: 0;
        }
      }
      .rateText {
        padding-top: 0rem;
        font-size: .6rem;
        color: #96969B;
        line-height: 1rem;
      }
      .schedule-part-c {
        padding: 1rem 0.75rem 1.25rem 0.75rem;
        font-size: 24/40rem;
        .progress-bar {
          padding: 0 0.75rem;
          margin-bottom: 48/40rem;
          p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              width: 33%;
              text-align: center;
              white-space: nowrap;
            }
            span:first-child {
              text-align: left;
            }
            span:last-child {
              text-align: right;
            }
          }
          .progress-line {
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 20/40rem  6/40rem;
            span {
              display: block;
            }
            .circle {
              width: 24/40rem;
              height: 24/40rem;
              border-radius: 50%;
              background-color: #FFA041;
            }
            .line {
              width: 268/40rem;
              height: 6/40rem;
              background-color: rgba(255,160,65, 0.3);
            }
          }
        }
        .schedule-explain {
          color: #96969b;
          div:last-child {
            p {
              margin-bottom: 10/40rem;
            }
            p:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      .dealTime-list {
        margin-bottom: 1rem;
        font-size: 24/40rem;
        color: #19191e;
        .rule-part-header {
          border-bottom: none;
        }
        .list-wrapper {
          p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              width: 33.33%;
              text-align: center;
            }
            span:first-child {
              text-align: left;
            }
            span:last-child {
              text-align: right;
            }
          }
          p.list-title {
            padding: 28/40rem 30/40rem;
            background-color: #f5f5f5;
          }
          .list-c {
            padding: 0 30/40rem;
            p {
              padding: 15/40rem 0;
              border-bottom: 1px solid #dcdcdc;
            }
          }
        }
        .time-explain {
          padding: 1rem 30/40rem 50/40rem 30/40rem;

        }
      }

    }
    .explain {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      div.ico-circle {
        margin-top: 12/40rem;
        width: 10/40rem;
        height: 10/40rem;
        border-radius: 50%;
        background-color: #FFA041;
        opacity: 0.5;
      }

      div:last-child {
        width: 660/40rem;
      }
    }
    .rule-c-wrapper>div {
      background-color: #fff;
      margin-bottom: 0.5rem;
    }
    </style>
