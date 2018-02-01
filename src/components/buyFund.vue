<template>
  <div id="buyFund"
       v-if="pageReady">
    <div class="buyFund bg-ffffff">
      <div class="buyFundT">
        <p class="fc-19191E title">{{ prdInfoBean }}</p>
        <p class="fc-96969B code"><span>{{ prdCode }}</span> <span>{{ prdTypeName }}</span></p>
      </div>
      <spaceWrapper/>
      <div class="buyFundC">
        <!-- 1.未开户 -->
        <div class="personInfo fc-96969B"
             v-if="isOpenAccount == '0'">
          <p class="oneInfo">
            您还没有开户，
            <span class="fc-dc2828"
                  @click="openAccount">
              请开户
            </span>
          </p>
        </div>
        <!-- 2.未绑卡 -->
        <div class="personInfo fc-96969B"
             v-if="isOpenAccount == '1' && isBindCard == '0'">
          <p class="oneInfo">
            您还没有绑卡，
            <span class="fc-dc2828"
                  @click="bindCard">
              请绑卡
            </span>
          </p>
        </div>
        <!-- 3.已开户已绑卡 -->
        <div class="personInfo fc-96969B personInfoTwo"
             v-if="isOpenAccount == '1' && isBindCard == '1'"
             @click="showBankList">
          <img class="bankIcon"
               :src="bankDel.bankIco"
               alt="银行">
          <div class="twoInfo">
            <p class="twoInfoT fc-19191E">{{ bankDel.bankName }}&nbsp;尾号{{ bankDel.tailNum }}</p>
            <p class="twoInfoB fc-96969B">{{ bankDel.limitDesc }}</p>
          </div>
          <em class="downIcon"></em>
        </div>
        <p class="fc-19191E payText"></p>
        <div class="payMoney">
          <p class="payMoneyInput fc-19191E">
            <span>购买金额</span>
            <input type="text"
                   @input="dealRate(inputMoney)"
                   v-model="inputMoney"
                   :placeholder="holder"
                   :disabled="isOpenAccount != '1' || isBindCard != '1'">
          </p>
        </div>
        <div class="rate fc-9b9b9b">
          <div class="rateL">优惠费率</div>
          <div class="rateR">
            <span class="striping"
                  v-if="disList.length != 0 && originRate != '0.00' && rateFlag == '0'">
              {{ originRate }}
              <span v-if="rateFlag == '0'">%</span>
            </span>&nbsp;
            <span class="fc-dc2828">
              {{ disRate }}
              <span v-if="rateFlag == '0'">%</span>
              <span v-if="rateFlag == '1'">元/笔</span>
            </span>
          </div>
        </div>
        <div class="charge fc-9b9b9b">
          <div class="chargeL">优惠手续费</div>
          <div class="chargeR">
            <span class="striping"
                  v-if="originalFee != 'NaN.00' && disList.length != 0 && originalFee != '0.00' && rateFlag == '0'" >
              {{ originalFee }}元
            </span>
            <span class="fc-dc2828"
                  v-if="actualFee != 'NaN.00'">
              {{ actualFee }}元
            </span>
          </div>
        </div>
      </div>
      <spaceWrapper/>
      <div class="buyFundB">
        <BaseButton :styleObj="styleObj"
                    :disabled="disabled"
                    @click.native="confirmBuy">
          确认购买
        </BaseButton>
        <div class="tips">
          <reminder/>
        </div>
      </div>
      <bottomCompanyName/>
      <BankList ref="BankList"
                :bankList="bankList"/>
      <!-- model start -->
      <!-- model start -->
      <model>
        <div slot="body">
          <div class="modal-body">
            <p class="notice"
               v-if="buyFundEvalValiData.collectFlag == 'Y'">
              根据相关法律法规和政策，您需要进行投资者测评
            </p>
            <p class="notice"
               v-if="buyFundEvalValiData.collectFlag != 'Y' && buyFundEvalValiData.riskReviewFlag == 'Y'">
              根据相关法律法规和政策，您需要进行风险测评
            </p>
            <p class="notice"
               v-if="buyFundEvalValiData.collectFlag != 'Y' && buyFundEvalValiData.riskReviewFlag != 'Y'">
              本产品风险等级为
              <span class="fc-dc2828">{{ buyFundEvalValiData.productRiskLevel }}</span>,
              已超出您的风险承受能力
              <span class="fc-dc2828"
                    v-if=" buyFundEvalValiData.lowRiskLevel == 'Y'">
                {{ buyFundEvalValiData.customerRiskLevel }}风险承受能力最低类别投资者
              </span>
              <span v-if=" buyFundEvalValiData.lowRiskLevel == 'Y'">。</span>
              <span class="fc-dc2828"
                    v-if=" buyFundEvalValiData.lowRiskLevel != 'Y'">
                {{ buyFundEvalValiData.customerRiskLevel }}
              </span>
              <span v-if=" buyFundEvalValiData.lowRiskLevel != 'Y'">。</span>
              您可以购买{{ validProductRiskLevel }}等级产品。
            </p>
            <p class="fc-96969B moreText"
               v-if="buyFundEvalValiData.collectFlag != 'Y' && buyFundEvalValiData.riskReviewFlag != 'Y' && buyFundEvalValiData.lowRiskLevel !='Y'">
              若您想继续购买，则视为您已充分认识并愿意承担本产品可能存在的风险。
            </p>
          </div>
        </div>
        <div slot="button">
          <div class="modal-footer">
            <div class=" button buttonLeft"
                 v-if="modal.btnLeft != ''"
                 @click="incident(modal.btnLeft)">
              {{ modal.btnLeft }}
            </div>
            <div class="button btn-active"
                 v-if="modal.btnRight != ''"
                 @click="incident(modal.btnRight)">
              {{ modal.btnRight }}
            </div>
          </div>
        </div>
      </model>
      <!-- model end -->
      <!-- model end -->
    </div>
  </div>
</template>

<script>
import spaceWrapper from 'components/subassembly/space.vue';
import BaseButton from 'components/subassembly/BaseButton.vue';
import reminder from 'components/buyVue/reminder.vue';
import bottomCompanyName from 'components/buyVue/bottomCompanyName.vue';
import BankList from 'components/buyVue/BankList.vue';
import model from 'components/subassembly/model.vue';
import {toast} from 'js/api.js';
import {buyPermissionsValidation, buyDetailFund, qryBuyFundRate} from 'js/request.js';

export default {
  name: 'BuyFund',
  components: {
    spaceWrapper: spaceWrapper,
    BaseButton: BaseButton,
    reminder: reminder,
    bottomCompanyName: bottomCompanyName,
    BankList: BankList,
    model: model
  },
  data () {
    return {
      pageReady: 0,
      tag: 0,
      flag: 2,
      factorage: '',
      charge: '0.00',
      disCharge: '0.00',
      buttonDisabled: false,
      bankList: {
        show: false,
        lists: []
      },
      isOpenAccount: '',
      isBindCard: '',
      prdInfoBean: '',
      prdCode: '',
      prdTypeName: '',
      inputMoney: '',
      styleObj: {
        background: '',
        borderRadius: '2px',
        color: '#FFF'
      },
      disabled: true,
      bank: {},
      rateNum: '', //
      rateText: '', //
      originalFee: '0.00', // 原始费用
      actualFee: '0.00', // 折扣费用
      originRate: '0.00', // 原始费率
      discount: '0', // 折扣率
      disRate: '0.00', // 优惠费用
      rateList: [], // 原始费率
      disList: [], // 折扣费率
      maxValue: '',
      prdType: '',
      minvalueInput: '', // input最小值
      maxvalueInput: '', // input最大值
      holder: '',
      /** 风险等级数据 */
      buyFundEvalValiData: '',
      rateFlag: '0',
      validProductRiskLevel: ''
    };
  },
  computed: {
    // 银行卡信息
    bankDel () {
      return this.$store.getters.bankCardDetail;
    },
    // 费率
    buyRate () {
      return this.$store.getters.subscribeRate;
    },
    rate () {
      return this.$store.getters.rate;
    },
    modal () {
      return this.$store.getters.modal;
    }
  },
  watch: {
    inputMoney (newV, oldV) {
      if (isNaN(newV)) {
        this.inputMoney = '';
        return;
      }
      if (newV.substr(0, 1) == '0' && newV.substr(1, 1) && newV.substr(1, 1) != '.') {
        this.inputMoney = oldV;
        return;
      }
      if (newV.indexOf('.') > 0) {
        if (newV.substr(newV.indexOf('.')).length > 3) {
          this.inputMoney = oldV;
        }
      } else if (newV.indexOf('.') == 0) {
        this.inputMoney = oldV;
      }
    }
  },
  mounted () {
    this.buyPermissionsValidation();
    this.buyDetailFund();
  },
  methods: {
    // 风险测评1220
    buyPermissionsValidation () {
      let _this = this;
      buyPermissionsValidation({
        backHtml: window.location.href,
        productType: 'LMF',
        fundCode: this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID')
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.buyFundEvalValiData = resp.data.data;
          if (_this.buyFundEvalValiData.validProductRiskLevel != '' && _this.buyFundEvalValiData.validProductRiskLevel !== null) {
            _this.validProductRiskLevel = _this.buyFundEvalValiData.validProductRiskLevel.toString();
          }
          // 是否为专业投资者 P：专业
          if (_this.buyFundEvalValiData.subInvestorType != 'P') {
            // 是否需要信息采集
            if (_this.buyFundEvalValiData.collectFlag == 'Y') {
              _this.$store.commit('UPDATE_ROOTSTATE', {
                stateName: 'modal',
                data: {
                  modalShow: true,
                  title: '测评提示',
                  btnLeft: '暂不购买',
                  btnRight: '立即进行'
                }
              });
            } else if (_this.buyFundEvalValiData.riskReviewFlag == 'Y') {
              // 是否需要风险测评
              _this.$store.commit('UPDATE_ROOTSTATE', {
                stateName: 'modal',
                data: {
                  modalShow: true,
                  title: '风险测评',
                  btnLeft: '暂不购买',
                  btnRight: '立即测评'
                }
              });
            } else if (_this.buyFundEvalValiData.mapperStatus != '1') {
              // 用户承受风险和产品风险是否匹配
              // 用户是否是最低风险等级
              if (_this.buyFundEvalValiData.lowRiskLevel == 'Y') {
                _this.$store.commit('UPDATE_ROOTSTATE', {
                  stateName: 'modal',
                  data: {
                    modalShow: true,
                    title: '风险提示',
                    btnLeft: '暂不购买',
                    btnRight: ''
                  }
                });
              } else {
                _this.$store.commit('UPDATE_ROOTSTATE', {
                  stateName: 'modal',
                  data: {
                    modalShow: true,
                    title: '风险提示',
                    btnLeft: '暂不购买',
                    btnRight: '同意，继续购买'
                  }
                });
              }
            }
          }
        }
      });
    },
    incident (data) {
      if (data == '暂不购买') {
        window.history.go(-1);
      } else if (data == '同意，继续购买') {
        this.$store.commit('UPDATE_ROOTSTATE', {
          stateName: 'modal',
          data: {
            modalShow: false
          }
        });
      } else if (data == '立即进行') {
        // 1220start
        if (this.buyFundEvalValiData.collectFlag == 'Y') {
          // 信息采集
          this.$router.push({
            path: '/information'
          });
        }
        // 1220end
      } else if (data == '立即测评') {
        // 1220start
        if (this.buyFundEvalValiData.riskReviewFlag == 'Y') {
          // 风险测评
          this.$router.push({
            path: '/riskTest'
          });
        }
        // 1220end
      } else if (data == '取消') {
        window.history.go(-1);
      }
      this.$store.commit('UPDATE_ROOTSTATE', {
        stateName: 'modal',
        data: {
          modalShow: false
        }
      });
    },
    // 购买基金
    buyDetailFund () {
      let _this = this;
      buyDetailFund({
        productId: _this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID'),
        productType: _this.$router.currentRoute.query.fundType || sessionStorage.getItem('FUNDTYPE'),
        orderId: '',
        backHtml: window.location.href
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.prdInfoBean = resp.data.data.prdInfoBean.prdName;
          _this.prdCode = resp.data.data.prdInfoBean.prdCode;
          _this.prdTypeName = resp.data.data.prdInfoBean.prdTypeName;
          _this.isOpenAccount = resp.data.data.isOpenAccount;
          _this.isBindCard = resp.data.data.isBindCard;
          _this.maxValue = resp.data.data.prdInfoBean.maxvalue;
          _this.prdType = resp.data.data.prdInfoBean.prdType;
          _this.minvalueInput = resp.data.data.prdInfoBean.minvalue;
          _this.maxvalueInput = resp.data.data.prdInfoBean.maxvalue;
          if (
            parseFloat(_this.minvalueInput) != 0 &&
            parseFloat(_this.maxvalueInput) == 0
          ) {
            _this.holder = parseFloat(_this.minvalueInput) + '元起购';
          } else if (
            parseFloat(_this.minvalueInput) == 0 &&
            parseFloat(_this.maxvalueInput) != 0
          ) {
            _this.holder = '最高可购' + parseFloat(_this.maxvalueInput);
          } else if (
            parseFloat(_this.minvalueInput) != 0 &&
            parseFloat(_this.maxvalueInput) != 0
          ) {
            _this.holder =
              parseFloat(_this.minvalueInput) +
              '元~' +
              parseFloat(_this.maxvalueInput) +
              '元';
          }
          if (_this.prdType != '04' || _this.prdType != '98') {
            _this.qryBuyFundRate();
          }
          // isOpenAccount 0未开户 1已开户
          if (resp.data.data.isOpenAccount == '0') {
          } else if (resp.data.data.isOpenAccount == '1') {
            sessionStorage.setItem('openStatus', '2');
          }
          // isBindCard 0未绑卡 1已绑卡
          if (resp.data.data.isBindCard == '0') {
          } else if (resp.data.data.isBindCard == '1') {
            _this.bankList.lists = resp.data.data.cardList;
            _this.$store.commit('UPDATE_BANKCARDDETAIL', resp.data.data.cardList[0]);
          }
        }
        _this.$nextTick(function () {
          _this.pageReady = 1;
        });
      });
    },
    // 开户
    openAccount () {
      this.$router.push({
        path: '/openAccount'
      });
    },
    // 绑卡
    bindCard () {
      this.$router.push({
        path: '/openAccount/openAccountBindCard'
      });
    },
    // 费率
    qryBuyFundRate () {
      let _this = this;
      qryBuyFundRate({
        fundCode: _this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID'),
        buyAmt: _this.inputMoney == '' ? null : _this.inputMoney
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.rateList = resp.data.data.rateList;
          _this.disList = resp.data.data.disList;
          _this.dealRate();
        }
      });
    },
    // 计算费率
    dealRate (money = 0) {
      let _this = this;
      if (
        _this.prdType != '04' ||
        _this.prdType != '98' ||
        _this.prdType == ''
      ) {
        if (parseFloat(_this.inputMoney) > parseFloat(_this.maxvalueInput)) {
          toast('最多购买' + _this.maxvalueInput + '元');
          _this.inputMoney = '';
        }
        if (
          parseFloat(_this.inputMoney) != '' && !isNaN(_this.inputMoney) &&
          _this.inputMoney.length > 0 &&
          parseFloat(_this.inputMoney) <= parseFloat(_this.maxvalueInput)
        ) {
          _this.styleObj.background = '#DC2828';
          _this.styleObj.borderRadius = '2px';
          _this.styleObj.color = '#FFF';
          _this.disabled = false;
        } else {
          _this.styleObj.background = '';
          _this.styleObj.borderRadius = '2px';
          _this.styleObj.color = '#FFF';
          _this.disabled = true;
        }
      }
      // 原始费率
      if (_this.rateList && _this.rateList.length != '0') {
        for (let i = 0; i < _this.rateList.length; i++) {
          let originMaxRate = _this.rateList[0].maxamount;
          let rateListItem = _this.rateList[i];
          var maxamountRate = rateListItem.maxamount;
          let minamountRate = rateListItem.minamount;
          if (maxamountRate > originMaxRate) {
            originMaxRate = maxamountRate;
          }
          if (money == '' || money === null || money == undefined || money < 1) {
            _this.originRate = _this.rateList[0].fareratio;
          }
          if (money > minamountRate && money < maxamountRate) {
            // 未达到限额
            _this.rateFlag = rateListItem.flag;
            console.log('_this.rateFlag:' + _this.rateFlag);
            if (rateListItem.flag == '0') {
              _this.originRate = _this.rateList[i].fareratio;
              // 达到限额
            } else if (rateListItem.flag == '1') {
              _this.originRate = _this.rateList[i].farevalue;
            }
          }
          if (_this.originRate == 0) {
            _this.originRate = '0.00';
          }
        }
      } else {
        // 无原始费率
      }
      // 折扣费率
      if (_this.disList && _this.disList.length != '0') {
        for (let i = 0; i < _this.disList.length; i++) {
          let disListItem = _this.disList[i];
          let minamount = disListItem.minamount;
          let maxamount = disListItem.maxamount;
          if (money == '' || money === null || money == undefined || money < 1) {
            _this.discount = _this.disList[0].discount;
          }
          if (money > minamount && money < maxamount) {
            _this.discount = _this.disList[i].discount;
          }
        }
        // 是否有折扣费率
        _this.disRate = (_this.discount * _this.originRate).toFixed(2);
        _this.originalFee = (money - money / (1 + _this.originRate / 100)).toFixed(2);
        if (_this.rateFlag == '0') {
          _this.actualFee = (money - money / (1 + _this.disRate / 100)).toFixed(2);
        } else if (_this.rateFlag == '1') {
          _this.actualFee = _this.disRate;
        }
        if (_this.originalFee == 'NaN.00' || _this.originalFee == '0') {
          _this.originalFee = '0.00';
        }
        if (_this.actualFee == 'NaN.00' || _this.actualFee == '0') {
          _this.actualFee = '0.00';
        }
      } else {
        // 无折扣率
        _this.disRate = _this.originRate;
        _this.originalFee = (money - money / (1 + _this.originRate / 100)).toFixed(2);
        if (_this.originalFee == 'NaN.00' || _this.originalFee == '0') {
          _this.originalFee = '0.00';
        }
      }
      _this.serviceCharge();
    },
    // 显示银行卡列表
    showBankList () {
      this.$refs.BankList.handleParentClick();
    },
    // 申购手续费
    serviceCharge () {
      let _this = this;
      _this.buttonDisabled = true;
      if (_this.inputMoney != '' && !isNaN(_this.inputMoney)) {
        _this.styleObj.background = '#DC2828';
        _this.styleObj.borderRadius = '2px';
        _this.styleObj.color = '#FFF';
        _this.disabled = false;
      } else {
        _this.styleObj.background = '';
        _this.styleObj.borderRadius = '';
        _this.styleObj.color = '#FFF';
        _this.disabled = true;
      }
    },
    // 确认购买
    confirmBuy () {
      let _this = this;
      if (_this.inputMoney == '0') {
        toast('购买金额必须大于0');
        _this.inputMoney = '';
      }
      if (
        _this.inputMoney != '' &&
        parseFloat(_this.inputMoney) < parseFloat(_this.minvalueInput)
      ) {
        toast('至少购买' + _this.minvalueInput + '元');
        _this.inputMoney = '';
        _this.styleObj.background = '';
        _this.styleObj.borderRadius = '';
        _this.styleObj.color = '';
        _this.disabled = true;
      } else if (
        parseFloat(_this.inputMoney) >= parseFloat(_this.minvalueInput) &&
        _this.inputMoney <= parseFloat(_this.maxvalueInput)
      ) {
        // 存数据
        _this.bank = _this.$store.getters.bankCardDetail;
        sessionStorage.setItem('prdInfoBean', _this.prdInfoBean);
        sessionStorage.setItem('prdCode', _this.prdCode);
        sessionStorage.setItem('prdTypeName', _this.prdTypeName);
        sessionStorage.setItem('bankIco', _this.bank.bankIco);
        sessionStorage.setItem('bankName', _this.bank.bankName);
        sessionStorage.setItem('tailNum', _this.bank.tailNum);
        sessionStorage.setItem('inputMoney', _this.inputMoney);
        sessionStorage.setItem('bankId', _this.bank.bankId);
        sessionStorage.setItem('bankCardNo', _this.bank.cardNo);
        sessionStorage.setItem('prdType', _this.prdType);
        this.$router.push({
          path: '/buyFundAffirm',
          query: {
            fundId: _this.prdCode,
            fundType: _this.prdType
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
#buyFund {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
input[disabled] {
  background-color: #FFF;
  }
.buyFund {
  .buyFundT {
    padding: 1rem 0.75rem 1.25rem;
    .title {
      font-size: 0.75rem;
      line-height: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .code {
      font-size: 0.6rem;
      line-height: 0.6rem;
    }
  }
  .buyFundC {
    padding: 1rem 0.75rem 1.25rem;
    .personInfo {
      padding: 0.7rem 1rem;
      border: 1px solid #dcdcdc;
      border-radius: 2px;
      input,
      .oneInfo {
        height: 0.75rem;
        font-size: 0.75rem;
        line-height: 0.75rem;
      }
      input {
        width: 100%;
      }
      .oneInfo {
        width: 100%;
      }
    }
    .personInfoTwo {
      padding: 0.4rem 1rem;
      display: flex;
      border-radius: 2px;
      .bankIcon {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        margin: auto;
        margin-right: 0.75rem;
      }
      .twoInfo {
        flex: 1;
        .twoInfoT {
          font-size: 0.75rem;
          line-height: 0.75rem;
          margin-bottom: 0.35rem;
        }
        .twoInfoB {
          font-size: 0.6rem;
          line-height: 0.6rem;
        }
      }
      .downIcon {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background: url("../../src/img/down.png") no-repeat;
        background-size: contain;
        margin: auto;
      }
    }
    .payMoney {
      padding: 0.7rem 1rem;
      border: 1px solid #dcdcdc;
      border-radius: 2px;
      .payMoneyInput {
        font-size: 0;
        display: flex;
        span {
          font-size: 0.75rem;
          line-height: 0.95rem;
        }
        input {
          flex: 1;
          font-size: 0.75rem;
          line-height: 0.75rem;
          text-align: right;
        }
      }
    }
    .payText {
      font-size: 0.6rem;
      line-height: 0.6rem;
      text-decoration: underline;
      margin: 0.75rem 0;
    }
    .rate {
      margin: 1rem 0;
      display: flex;
      font-size: 0.75rem;
      .rateL {
        flex: 1;
        text-align: left;
      }
      .rateR {
        flex: 2;
        text-align: right;
        .striping {
          text-decoration: line-through;
        }
      }
    }
    .charge {
      display: flex;
      font-size: 0.75rem;
      .chargeL {
        flex: 1;
        text-align: left;
      }
      .chargeR {
        flex: 2;
        text-align: right;
        .striping {
          text-decoration: line-through;
        }
      }
    }
  }
  .buyFundB {
    padding: 1rem 0.75rem 0;
    .btnRed {
    }
    .tips {
      padding: 1.25rem 0 3.25rem;
    }
  }
  .modal-body {
    padding: 0 2.4rem;
    line-height: 1.2rem;
    font-size: 0.75rem;
    color: #19191e;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #dcdcdc;
    .notice {
      line-height: 1.2rem;
    }
  }
  .modal-footer {
    height: 2.75rem;
    line-height: 2.75rem;
    font-size: 0.75rem;
    color: #19191e;
    display: flex;
    .button {
      flex: 1;
    }
    .buttonLeft {
      position: relative;
    }
    .buttonLeft::before {
      position: absolute;
      content: " ";
      display: inline-block;
      width: 1px;
      height: 100%;
      right: 0;
      top: 0;
      background-color: #dcdcdc;
    }
  }
  .btn-default {
    color: #19191e;
  }
  .btn-active {
    color: #dc2828;
  }
}

.moreText {
  margin-top: 20/40rem;
}
</style>
