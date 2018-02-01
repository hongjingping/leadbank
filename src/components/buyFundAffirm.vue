<template>
  <div class="buyFundAffirm"
       id="buyFundAffirm">
    <!-- 交易确认页 -->
    <div class="buyFundT">
      <p class="fc-19191E title">{{ prdInfoBean }}</p>
      <p class="fc-96969B code"><span>{{ prdCode }}</span> <span>{{ prdTypeName }}</span></p>
    </div>
    <spaceWrapper/>
    <div class="buyFundC">
      <div class="info">
        <div class="infoL fc-9b9b9b">银行卡</div>
        <div class="infoR fc-19191E">
          <span>
            <img class="bankIcon"
                 :src="bankIco" >
          </span>
          {{ bankName }}(尾号{{ tailNum }})
        </div>
      </div>
      <div class="info">
        <div class="infoL fc-9b9b9b">购买金额</div>
        <div class="infoR fc-19191E">{{ inputMoney }}元</div>
      </div>
      <div class="info">
        <div class="infoL fc-9b9b9b">金额大写</div>
        <div class="infoR fc-19191E">{{ bigNum }}</div>
      </div>
      <!-- 有红包 -->
      <div class="redPacketInfo fc-96969B"
           v-if="flag == 1 && redPacketDel.equityAmount != ''"
           @click="showBankList">
        <div class="infoL fc-19191E">红包抵扣</div>
        <div class="infoR fc-dc2828">{{ redPacketDel.equityAmount || '0.00' }}元<em class="downIcon"></em></div>
      </div>
    </div>
    <spaceWrapper/>
    <div class="buyFundB">
      <!-- 有红包 -->
      <div class="redPacketMon"
           v-if="flag == 1 && redPacketDel.equityAmount != ''">
        <p class="redPacketMonL fc-96969B"
           @click="redPacketMon">实付金额 <em class="icon"></em></p>
        <p class="redPacketMonR fc-dc2828">{{ realPayMoney }}元</p>
      </div>
      <BaseButton :styleObj = "styleObj"
                  :disabled = "disabled"
                  @click.native="payFund">
        立即支付
      </BaseButton>
    </div>
    <EnterPwd :enterPwd = "enterPwd"
              @confirm = "purchaseFund()"
              v-model="tradepwd"
              @input="changeColor"/>
    <redPacketList v-if="equityNo && redPacketList.lists.length > 0"
                   ref="redPacketList"
                   :equityNo="equityNo"
                   :redPacketList = "redPacketList"
                   @addList = "queryWorkEquityFlagList"/>
    <model>
      <div slot="body">
        <div class="modal-body modal-body2">
          <p class="notice"
             v-html="modal.modelText"></p>
        </div>
      </div>
      <div slot="button">
        <div class="modal-footer">
          <div class=" button buttonLeft"
               v-if="modal.btnLeft != ''"
               @click="incident(modal.btnLeft)"
               v-html="modal.btnLeft">
          </div>
          <div class="button btn-active"
               v-if="modal.btnRight != ''"
               @click="incident(modal.btnRight)">
            {{ modal.btnRight }}
          </div>
        </div>
      </div>
    </model>
  </div>
</template>

<script>
import spaceWrapper from 'components/subassembly/space.vue';
import BaseButton from 'components/subassembly/BaseButton.vue';
import EnterPwd from 'components/buyVue/enterPwd.vue';
import redPacketList from 'components/buyVue/redPacketList.vue';
import model from 'components/subassembly/model.vue';
import {convertCurrency, subFloat, toast} from 'js/api.js';
import {queryBuyEquityCount, purchaseFund, qryFundOrd, queryEquityMax, queryWorkEquityFlagList} from 'js/request.js';

export default {
  name: 'BuyFundAffirm',
  components: {
    'spaceWrapper': spaceWrapper,
    'BaseButton': BaseButton,
    'EnterPwd': EnterPwd,
    'redPacketList': redPacketList,
    'model': model
  },
  data () {
    return {
      'flag': 0,
      'bigNum': '',
      'styleObj': {
        color: '#FFF',
        background: '#DC2828'
      },
      'disabled': false,
      'redPacketList': {
        'noContent': 1,
        lists: []
      },
      'prdInfoBean': '',
      'prdCode': '',
      'prdTypeName': '',
      'bankIco': '',
      'bankName': '',
      'tailNum': '',
      'inputMoney': '',
      'reqTime': '',
      'redPacketNum': '',
      'tradepwd': '',
      'num': 0,
      'time': 2000,
      'interval': '',
      'enterPwd': {},
      'pageIndex': 0,
      'redPacketSize': 0,
      'equityNo': ''
    };
  },
  computed: {
    redPacketDel () {
      return this.$store.getters.redPacketDetail;
    },
    buyMon () {
      return this.$store.getters.buyMon;
    },
    modal () {
      return this.$store.getters.modal;
    },
    // 实付金额
    realPayMoney () {
      let realPayMoneyString = String(subFloat(this.inputMoney, this.redPacketDel.equityAmount));
      if (realPayMoneyString.indexOf('.') > -1 && realPayMoneyString.substr(realPayMoneyString.indexOf('.') + 1).length > 2) {
        return realPayMoneyString.substr(0, realPayMoneyString.indexOf('.')) + realPayMoneyString.substr(realPayMoneyString.indexOf('.'), 3);
      } else {
        return subFloat(this.inputMoney, this.redPacketDel.equityAmount);
      }
    }
  },
  mounted () {
    this.affirmDetail();
  },
  methods: {
    redPacketMon () {
      let _this = this;
      _this.$store.commit('UPDATE_ROOTSTATE', {
        stateName: 'modal',
        data: {
          'modalShow': true,
          'modelText': '实付金额 = 投资金额 - 红包抵扣',
          'btnLeft': '',
          'btnRight': '确定'
        }
      });
    },
    changeColor () {
      if (this.tradepwd.length >= 6 && this.tradepwd.length <= 20) {
        this.enterPwd.flag = 1;
      } else {
        this.enterPwd.flag = 0;
      }
    },
    // 是否有红包
    redPacket () {
      let _this = this;
      var dateTime = new Date();
      _this.reqTime = dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getDate() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds();
      queryBuyEquityCount({
        'productId': _this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID'),
        'reqTime': _this.reqTime
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          if (resp.data.data.flag == '1') {
            _this.flag = 1;
          }
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 显示最大红包
    queryEquityMax () {
      let _this = this;
      queryEquityMax({
        'productId': _this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID'),
        'productType': _this.$router.currentRoute.query.fundType || sessionStorage.getItem('prdType'),
        'buyAmount': sessionStorage.getItem('inputMoney'),
        'productCategory': 3
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.redPacketNum = resp.data.data.equityAmount;
          _this.equityNo = resp.data.data.equityNo;
          _this.$store.commit('UPDATE_BUYSTATE', {
            stateName: 'redPacketDetail',
            data: {
              'equityAmount': _this.redPacketNum,
              'equityNo': _this.equityNo
            }
          });
        }
      });
    },
    // 红包列表
    queryWorkEquityFlagList () {
      let _this = this;
      if (_this.pageIndex == 0 || _this.pageIndex < _this.redPacketSize) {
        _this.pageIndex = _this.pageIndex + 1;
      } else {
        _this.redPacketList.noContent = 0;
        return;
      }
      queryWorkEquityFlagList({
        'productId': _this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID'),
        'productType': _this.$router.currentRoute.query.fundType || sessionStorage.getItem('prdType'),
        'buyAmount': sessionStorage.getItem('inputMoney'),
        'productCategory': '3',
        'pageIndex': _this.pageIndex,
        'pageCount': '10'
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          // 红包列表
          _this.redPacketSize = resp.data.data.size;
          _this.redPacketList.lists = _this.redPacketList.lists.concat(resp.data.data.useableList);
          _this.$nextTick(function () {
            _this.$refs.redPacketList.handleParentClick();
          });
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    affirmDetail () {
      let _this = this;
      _this.prdInfoBean = sessionStorage.getItem('prdInfoBean');
      _this.prdCode = sessionStorage.getItem('prdCode');
      _this.prdTypeName = sessionStorage.getItem('prdTypeName');
      _this.bankIco = sessionStorage.getItem('bankIco');
      _this.bankName = sessionStorage.getItem('bankName');
      _this.tailNum = sessionStorage.getItem('tailNum');
      _this.inputMoney = sessionStorage.getItem('inputMoney');
      _this.redPacket();
      _this.bigNumText();
      _this.queryEquityMax();
    },
    payFund () {
      let _this = this;
      _this.$store.commit('UPDATE_SHOWENTERPWD', true);
    },
    showBankList () {
      let _this = this;
      _this.pageIndex = 0;
      _this.redPacketList.lists = [];
      _this.queryWorkEquityFlagList();
    },
    incident (data) {
      let _this = this;
      if (data == '重新输入') {
        _this.$store.commit('UPDATE_ROOTSTATE', {
          stateName: 'modal',
          data: {
            'modalShow': false,
            'modelText': '',
            'btnLeft': '',
            'btnRight': ''
          }
        });
        _this.$store.commit('UPDATE_SHOWENTERPWD', true);
      } else if (data == '知道了') {
        _this.$store.commit('UPDATE_ROOTSTATE', {
          stateName: 'modal',
          data: {
            'title': '',
            'modalShow': false
          }
        });
      } else if (data == '联系客服') {
      } else if (data == '确定') {
        _this.$store.commit('UPDATE_ROOTSTATE', {
          stateName: 'modal',
          data: {
            'title': '',
            'modalShow': false
          }
        });
      }
      _this.closeLoad();
    },
    bigNumText () {
      let _this = this;
      _this.bigNum = convertCurrency(sessionStorage.getItem('inputMoney'));
    },
    // 立即购买
    purchaseFund () {
      let _this = this;
      if (_this.tradepwd.length < 6 || _this.tradepwd.length > 20) {
        return;
      }
      _this.$store.commit('UPDATE_SHOWENTERPWD', false);
      purchaseFund({
        'fundcode': sessionStorage.getItem('prdCode'),
        'fundName': encodeURI(sessionStorage.getItem('prdInfoBean')),
        'balance': sessionStorage.getItem('inputMoney'),
        'tradepwd': _this.tradepwd,
        'fundType': sessionStorage.getItem('prdType'),
        'bankCardNo': sessionStorage.getItem('bankCardNo'),
        'bankId': sessionStorage.getItem('bankId'),
        'vouchersId': _this.$store.getters.redPacketDetail.equityNo,
        'deduceCash': _this.$store.getters.redPacketDetail.equityAmount
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.$store.commit('UPDATE_LOADINGFLAG', 3);
          if (resp.data.data.txnStatus == '2') {
            // 轮询接口
            _this.interval = setInterval(function () {
              _this.num++;
              _this.qryFundOrd(resp.data.data.orderId);
              if (_this.num > 3 && _this.num < 5) {
                _this.time = 3000;
              } else if (_this.num > 5) {
                clearInterval(_this.interval);
                sessionStorage.setItem('orderId', resp.data.data.orderId);
                _this.closeLoad();
                _this.$router.push({path: '/tradingDetail'});
              }
            }, _this.time);
          } else {
            sessionStorage.setItem('orderId', resp.data.data.orderId);
            _this.closeLoad();
            _this.$router.push({path: '/tradingDetail'});
          }
        } else if (resp.data.respCode == '999') {
          // 交易密码错误，账号冻结
          if (resp.data.subSysRepCode == '122025') {
            _this.$store.commit('UPDATE_ROOTSTATE', {
              stateName: 'modal',
              data: {
                'title': '',
                'modalShow': true,
                'modelText': resp.data.respMessage,
                'btnLeft': '<a href="tel:4009217755">联系客服</a>',
                'btnRight': '知道了'
              }
            });
            // 密码错误，还有X次机会
          } else if (resp.data.subSysRepCode == '122044') {
            _this.$store.commit('UPDATE_ROOTSTATE', {
              stateName: 'modal',
              data: {
                'modalShow': true,
                'modelText': resp.data.respMessage,
                'btnLeft': '',
                'btnRight': '重新输入'
              }
            });
            // 交易密码锁定
          } else if (resp.data.subSysRepCode == '122014') {
            _this.$store.commit('UPDATE_ROOTSTATE', {
              stateName: 'modal',
              data: {
                'modalShow': true,
                'modelText': resp.data.respMessage,
                'btnLeft': '',
                'btnRight': '知道了'
              }
            });
          } else {
            toast(resp.data.respMessage);
            _this.closeLoad();
          }
        }
      });
    },
    // 轮询接口
    qryFundOrd (orderId) {
      let _this = this;
      _this.$store.commit('UPDATE_LOADINGFLAG', 3);
      qryFundOrd({
        'orderId': orderId
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          // 确认中
          if (resp.data.data.txnStatus != '2') {
            clearInterval(_this.interval);
            sessionStorage.setItem('orderId', resp.data.data.orderId);
            _this.closeLoad();
            _this.$router.push({path: '/tradingDetail'});
          }
        } else {
          clearInterval(_this.interval);
          _this.closeLoad();
          toast(resp.data.respMessage);
        }
      });
    },
    closeLoad () {
      let _this = this;
      _this.$store.commit('UPDATE_LOADINGFLAG', 0);
    }
  }
};
</script>

<style lang="less" scoped>
  #buyFundAffirm {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow: scroll;
    -webkit-overflow-scrolling : touch;
  }
  .buyFundAffirm {
    .buyFundT {
      padding:1rem .75rem 1.25rem;
      .title {
        font-size: .75rem;
        line-height: .75rem;
        margin-bottom: .5rem;
      }
      .code {
        font-size: .6rem;
        line-height: .6rem;
      }
    }
    .buyFundC {
      padding:1rem .75rem 1.25rem;
      .info {
        display: flex;
        font-size: .75rem;
        .infoL {
          flex: 1;
        }
        .infoR {
          flex: 2;
          text-align: right;
          .bankIcon {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            vertical-align: sub;
            margin-right: .5rem;
          }
        }
      }
      .redPacketInfo {
        display: flex;
        font-size: .75rem;
        padding: .9rem  1rem;
        margin-top: 1rem;
        border: 1px solid #DCDCDC;
        border-radius: 2px;
        .infoL {
          flex: 1;
        }
        .infoR {
          flex: 2;
          text-align: right;
          .downIcon {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            background: url('../../src/img/down.png') no-repeat;
            background-size: contain;
            margin-left: .5rem;
            vertical-align: bottom;
          }
        }
      }
      .info + .info {
        margin-top: 1rem;
      }
    }
    .buyFundB {
      padding: 1rem .75rem 0;
      .redPacketMon {
        display: flex;
        font-size: .75rem;
        margin-bottom: 1.25rem;
        .redPacketMonL {
          flex: 1;
          text-align: left;
          .icon {
            display: inline-block;
            width: .6rem;
            height: .6rem;
            background: url('../../src/img/Group.png') no-repeat;
            background-size: contain;
            vertical-align: inherit;
          }
        }
        .redPacketMonR {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
  .modal .modal-dialog .modal-body2 {
    padding: 0 2rem;
    line-height: .75rem;
    font-size: .75rem;
    color: #19191E;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #DCDCDC;
  }
</style>
