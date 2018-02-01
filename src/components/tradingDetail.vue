<template>
  <div id="tradingDetail">
    <div class="tradingDetail">
      <div class="tradingDetailTop">
        <div class="topL">
          <p class="title fc-19191E fs-30">购买(元)</p>
          <p class="time fc-96969B fs-24">{{ transTime }}</p>
        </div>
        <div class="topB">
          <p class="num fc-dc2828 fs-36 lh-36">
            <span>{{ applyAmt }}</span><br>
            <span v-if="equityFlag == '1'">
              <em class="redPacket"></em>
              <span class="fc-19191E fs-24 lh-24 red"
                    @click="showRedPacket">
                抵扣明细
              </span>
            </span>
          </p>
        </div>
      </div>
      <spaceWrapper/>
      <tradingDetailOne v-show="tag && tag != 2"
                        :tradingDetailCenter = "tradingDetailCenter"/>
      <tradingDetailTwo v-show="tag == 2"
                        :tradingDetailCenterTwo = "tradingDetailCenterTwo"/>
      <spaceWrapper/>
      <div class="tradingDetailBottom">
        <p class="fc-19191E fs-24">请至APP查看交易详情</p>
        <BaseButton :styleObj = "styleObj"
                    :disabled = "disabled"
                    @click.native="downLoad">
          下载利得基金APP
        </BaseButton>
        <!-- <BaseButton :styleObj = 'styleObjTwo' :disabled = 'disabledTwo' @click.native="done">完成</BaseButton> -->
      </div>
      <redPacketModal :redPacket = "redPacket"/>
    </div>
  </div>
</template>

<script>
import spaceWrapper from 'components/subassembly/space.vue';
import BaseButton from 'components/subassembly/BaseButton.vue';
import tradingDetailOne from 'components/buyVue/tradingDetailOne.vue';
import tradingDetailTwo from 'components/buyVue/tradingDetailTwo.vue';
import redPacketModal from 'components/buyVue/redPacketModal.vue';
import {openApp} from 'js/api.js';
import {fundNewTradeDetail} from 'js/request.js';

export default {
  name: 'TradingDetail',
  components: {
    'spaceWrapper': spaceWrapper,
    'BaseButton': BaseButton,
    'tradingDetailOne': tradingDetailOne,
    'tradingDetailTwo': tradingDetailTwo,
    'redPacketModal': redPacketModal
  },
  data () {
    return {
      'tag': '2',
      'tradingDetailCenter': {
        'flag': '',
        'delText': '',
        'why': ''
      },
      'tradingDetailCenterTwo': {
        'scheduleDes1': '',
        'acceptanceDate': '',
        'scheduleDes2': '',
        'confirmDate': '',
        'scheduleDes3': '',
        'profitDate': ''
      },
      'styleObj': {
        'backgroundColor': '#DC2828',
        'color': '#fff',
        'marginBottom': '1.25rem',
        'marginTop': '.75rem'
      },
      'redPacket': {
        'flag': '0',
        'header': '红包使用明细',
        'purchase': '2000',
        'deduction': '5',
        'textDeduction': '购买送5元红包',
        'pocket': '1000'
      },
      'disabled': false,
      'styleObjTwo': {
        'backgroundColor': '#FFF',
        'color': '#DC2828',
        'border': '1px solid #DC2828'
      },
      'disabledTwo': false,
      'transTime': '',
      'applyAmt': '',
      'equityFlag': ''
    };
  },
  mounted () {
    this.fundNewTradeDetail();
  },
  methods: {
    showRedPacket () {
      this.redPacket.flag = '1';
    },
    downLoad () {
      openApp();
    },
    done () {
      window.open('', '_self').close();
    },
    // 结果页信息
    fundNewTradeDetail () {
      let _this = this;
      fundNewTradeDetail({
        'orderId': _this.$router.currentRoute.query.orderId || sessionStorage.getItem('orderId'),
        'orderType': 'LMF',
        'equityNo': '',
        'custName': '',
        'certificateNumber': '',
        'sceneCode': 'APP_PURCHASE',
        'productType': ''
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.transTime = resp.data.data.transTime;
          _this.applyAmt = resp.data.data.transAmt;
          /**
               红包是否展示 0：不展示，1：展示
              */
          if (resp.data.data.equityFlag == '0') {
            _this.equityFlag = '0';
          } else if (resp.data.data.equityFlag == '1') {
            _this.equityFlag = '1';
            // 红包modal内容
            // _this.redPacket.flag = '1'
            _this.redPacket.header = '红包抵扣明细';
            _this.redPacket.purchase = resp.data.data.appTransAmt;
            _this.redPacket.deduction = resp.data.data.deduceCash;
            _this.redPacket.textDeduction = resp.data.data.equityName;
            _this.redPacket.pocket = resp.data.data.confirmAmt;
          }
          // 成功
          if (resp.data.data.unifiedStatus == '00') {
            _this.tag = '2';
            _this.tradingDetailCenterTwo.scheduleDes1 = resp.data.data.scheduleDes1;
            _this.tradingDetailCenterTwo.acceptanceDate = resp.data.data.acceptanceDate;
            _this.tradingDetailCenterTwo.scheduleDes2 = resp.data.data.scheduleDes2;
            _this.tradingDetailCenterTwo.confirmDate = resp.data.data.confirmDate;
            _this.tradingDetailCenterTwo.scheduleDes3 = resp.data.data.scheduleDes3;
            _this.tradingDetailCenterTwo.profitDate = resp.data.data.profitDate;
            // 失败
          } else if (resp.data.data.unifiedStatus == '01' || resp.data.data.unifiedStatus == '02') {
            _this.tag = '0';
            _this.tradingDetailCenter.flag = '0';
            _this.tradingDetailCenter.delText = resp.data.data.transStatusDes;
            _this.tradingDetailCenter.why = resp.data.data.retDes;
            // 处理中
          } else if (resp.data.data.unifiedStatus == '03') {
            _this.tag = '1';
            _this.tradingDetailCenter.flag = '1';
            _this.tradingDetailCenter.delText = resp.data.data.transStatusDes;
            _this.tradingDetailCenter.why = resp.data.data.retDes;
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  #tradingDetail {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow: scroll;
    -webkit-overflow-scrolling : touch;
  }
  .tradingDetail {
    .tradingDetailTop {
      display: flex;
      padding: 1rem .75rem 1.25rem;
      .topL {
        flex: 1;
        .title {
          margin-bottom: .25rem;
        }
      }
      .topB {
        flex: 1;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .num {
          .red {
            text-decoration: underline;
          }
          .redPacket {
            display: inline-block;
            width: .5rem;
            height: .6rem;
            background-image: url('../../src/img/red.png');
            background-repeat: no-repeat;
            background-size: contain;
            vertical-align: middle;
            margin-right: .25rem;
          }
        }
      }
    }

    .tradingDetailBottom {
      padding: 1rem .75rem;
      p {
        text-align: center;
      }
    }
  }
</style>
