<template>
  <div>
    <div class="bind">
      <div class="information">
        <span id="name"
              v-text="status=='1'? name : personName" ></span>
        <span class="card"
              id="card"
              v-text="status=='1'? card : personCard" ></span>
      </div>
      <space-empty/>
      <input-box type="text"
                 :inputMessage="bankCard"
                 @input="inputText('number')"
                 v-model="cardNumber"
                 :value="cardNumber"
                 :inputType="inputType"
                 maxlength="19" />
      <space-empty/>
      <div class="bank">
        <input-box :inputMessage="bankName"
                   @input="inputText"
                   v-model="cardName"
                   :value="cardName"
                   readonly/>
        <span class="nameDown"
              @click="showBankList"
              v-if="isClick"></span>
        <show-bank-list :bankList="lists"
                        :show="show"
                        @closed="closeSelectModel"
                        @input="getCardName"/>
      </div>
      <space-empty/>
      <div class="bank">
        <cityList @input="inputText"
                  v-model="cardCity"/>
      </div>
      <space-empty/>
      <input-box :inputMessage="bankPhone"
                 type="text"
                 @input="inputText"
                 v-model="phone"
                 :value="phone"
                 :inputType="inputType"
                 maxlength="11"/>
      <div class="protocol">
        <span :class="{'noCheck':!check}"
              @click="isCheck"></span>
        我已阅读并同意
        <a v-for="(item, index) in protocolCont"
           :key="index"
           @click="link(index)">
          《{{ item.agreementName }}》
          <em v-if="(index+1)!=protocolCont.length">、</em>
        </a>
      </div>
    </div>
    <space/>
    <div class="bind">
      <space-empty/>
      <base-button :styleObj="buttonObj"
                   @click.native="openAccountLast"
                   :disabled="disabled">
        下一步
      </base-button>
    </div>
  </div>
</template>

<script>
import space from 'components/subassembly/space.vue';
import inputBox from 'components/subassembly/input.vue';
import spaceEmpty from 'components/subassembly/spaceEmpty.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import cityList from 'components/openAccountStep/cityList.vue';
import showBankList from 'components/openAccountStep/bankListBox.vue';
import {toast} from 'js/api.js';
import {showBankInformation, allBankList, openAccountVerification, allProtocol} from 'js/request.js';

export default {
  components: {
    'input-box': inputBox,
    'space-empty': spaceEmpty,
    'base-button': baseButton,
    'space': space,
    'cityList': cityList,
    'show-bank-list': showBankList
  },
  data () {
    return {
      bankCard: '输入银行卡号',
      bankName: '选择开户银行',
      bankPhone: '输入银行预留手机号',
      name: '',
      card: '',
      buttonObj: {
        color: '#fff',
        backgroundColor: ''
      },
      disabled: true,
      inputType: 'number',
      lists: [],
      show: false,
      cardNumber: '',
      cardName: '',
      cardCity: '',
      phone: '',
      check: false,
      bankInform: '',
      protocolCont: '',
      isClick: true
    };
  },
  computed: {
    status () {
      return this.$store.getters.openAccountStauts;
    },
    personCard () {
      return this.$store.getters.card;
    },
    personName () {
      return this.$store.getters.name;
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_HOWSTEP', to.meta.step);
    });
  },
  mounted () {
    let self = this;
    // 判断缓存是否有值
    if (sessionStorage.getItem('cN')) {
      self.cardNumber = sessionStorage.getItem('cN');
      self.cardName = sessionStorage.getItem('bN');
      self.phone = sessionStorage.getItem('pH');
      sessionStorage.removeItem('cN');
      sessionStorage.removeItem('bN');
      sessionStorage.removeItem('pH');
    }
    if (sessionStorage.getItem('name')) {
      self.name = Array(sessionStorage.getItem('name').length).join('*') + sessionStorage.getItem('name').substr(-1);
      self.card = sessionStorage.getItem('card').substr(0, 3) + Array(sessionStorage.getItem('card').length - 6).join('*') + sessionStorage.getItem('card').substr(-4);
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
    self.bindCardProtocol();
  },
  methods: {
    // 协议是否勾选
    isCheck () {
      let self = this;
      let txt = /[^0-9]/g;
      if (self.check == true) {
        self.check = false;
        self.disabled = true;
        self.buttonObj.backgroundColor = '';
      } else {
        self.check = true;
        if (self.cardNumber != '' && self.cardName != '' && self.cardCity != '' && self.phone != '' && !txt.test(self.phone) && !txt.test(self.cardNumber)) {
          self.disabled = false;
          self.buttonObj.backgroundColor = '#DC2828';
        }
      }
    },
    // 绑卡协议
    bindCardProtocol () {
      let self = this;
      let parm = {
        'agreementScent': 'bindCardAgreement'
      };
      allProtocol(parm).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.protocolCont = resp.data.data.agreemenList;
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 带出银行卡号
    showList () {
      var self = this;
      let parm = {
        'cardNumber': self.cardNumber,
        'senceCode': 'F'
      };
      showBankInformation(parm).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.bankInform = resp.data.data.bankCardBean;
          self.cardName = self.bankInform.bankName;
          sessionStorage.setItem('bankCode', self.bankInform.bankAbbr);
          sessionStorage.setItem('bankNoH', self.bankInform.bankNo);
          sessionStorage.setItem('bankNames', self.bankInform.bankName);
          self.isClick = false;
        } else {
          self.isClick = true;
        }
      });
    },
    // 银行卡号输入
    inputText (val) {
      let self = this;
      let txt = /[^0-9]/g;
      if (val == 'number') {
        if (self.cardNumber == '') {
          self.cardName = '';
          self.isClick = true;
        }
      }
      if (self.cardNumber != '' && self.cardName != '' && self.cardCity != '' && self.phone != '' && self.check == true && !txt.test(self.phone) && !txt.test(self.cardNumber)) {
        self.disabled = false;
        self.buttonObj.backgroundColor = '#DC2828';
        if (val == 'number') {
          self.showList();
        }
      } else {
        self.disabled = true;
        self.buttonObj.backgroundColor = '';
        if (self.cardNumber.length > 6 && self.cardNumber.length < 20) {
          if (val == 'number') {
            self.showList();
          }
        }
      }
    },
    // 银行卡列表选择
    showBankList () {
      let self = this;
      let parm = {
        'proType': 'L,F'
      };
      if (self.isClick == true || self.cardNumber == '') {
        allBankList(parm).then(function (resp) {
          if (resp.data.respCode == '000') {
            self.lists = resp.data.data.bankInfoList;
          }
        });
        self.show = true;
      }
    },
    // 开户提交按钮验证
    openAccountLast () {
      let self = this;
      if (self.cardNumber.length < 16 || self.cardNumber.length > 20) {
        toast('银行卡号必须为16~19位');
      } else if (self.phone.length < 11) {
        toast('手机号不满11位');
      } else {
        let custName = '';
        let idNo = '';
        let transPwd = '';
        if (sessionStorage.getItem('openStatus') == '1') {
          custName = sessionStorage.getItem('name');
          idNo = sessionStorage.getItem('card');
          transPwd = sessionStorage.getItem('passWord');
        } else {
          custName = self.personName;
          idNo = self.personCard;
        }
        let parm = {
          openType: 'L,F',
          scnCode: 'HM5-BCV-LD',
          operatorType: 'SIGNUP',
          custName: encodeURI(custName),
          idType: '01',
          idNo: idNo,
          bankCrdNo: self.cardNumber,
          bankCode: sessionStorage.getItem('bankCode'),
          bankNo: sessionStorage.getItem('bankNoH'),
          bankName: encodeURI(sessionStorage.getItem('bankNames')),
          bankProvinceId: document.getElementById('nowCode').value.split(',')[0],
          bankProvinceName: encodeURI(self.cardCity.split(' ')[0]),
          bankCityId: document.getElementById('nowCode').value.split(',')[1],
          bankCityName: encodeURI(self.cardCity.split(' ')[1]),
          reservedMobile: self.phone,
          dcFlag: 'D',
          pubPri: 'PR',
          transPwd: transPwd,
          productType: 'L,F',
          openCard: sessionStorage.getItem('openStatus') ? sessionStorage.getItem('openStatus') : '1',
          channelCode: 'LD',
          saleMercId: 'LD'
        };
        sessionStorage.setItem('phone', self.phone);
        openAccountVerification(parm).then(function (resp) {
          if (resp.data.respCode == '000') {
            let chkType = resp.data.data.chkType;
            sessionStorage.setItem('custAUTOrderId', resp.data.data.custAUTOrderId);
            sessionStorage.setItem('chkType', chkType);
            self.$router.push({path: '/openAccount/openAccountConfirm'});
          } else {
            toast(resp.data.respMessage);
          }
        });
      }
    },
    // 关闭银行卡列表
    closeSelectModel () {
      this.show = false;
    },
    // 获取银行列表所选择的银行卡
    getCardName (val) {
      this.cardName = val.bankName;
      this.bankInform = val;
      if (this.cardNumber != '' && this.cardName != '' && this.cardCity != '' && this.phone != '' && this.check == true) {
        this.disabled = false;
        this.buttonObj.backgroundColor = '#DC2828';
      } else {
        this.disabled = true;
        this.buttonObj.backgroundColor = '';
      }
      sessionStorage.setItem('bankCode', this.bankInform.bankAbbr);
      sessionStorage.setItem('bankNoH', this.bankInform.bankNo);
      sessionStorage.setItem('bankNames', this.bankInform.bankName);
    },
    // 协议链接跳转
    link (val) {
      let self = this;
      sessionStorage.setItem('cN', self.cardNumber);
      sessionStorage.setItem('bN', self.cardName);
      sessionStorage.setItem('pH', self.phone);
      if (val == 0 && self.protocolCont[val].agreementName == '转账划款授权协议') {
        let cardN = self.cardNumber ? self.cardNumber.substr(0, 4) + '********' + self.cardNumber.substr(-4) : '';
        self.$router.push({path: '/protocol?nameFull=' + document.getElementById('name').innerText + '&cardNumber=' + cardN + '&bank=' + self.cardName + '&card=' + document.getElementById('card').innerText});
      } else {
        window.location.href = self.protocolCont[val].agreementUrl;
      }
    }
  }
};
</script>

<style lang="less">
  .bind{
    padding: 0rem 0.75rem 0.5rem;
    .information{
      color: #19191E;
      font-size: 15/20rem;
      .card{
        text-align: right;
        float: right;
      }
    }
    .bank{
      position: relative;
      .nameDown{
        width: 1rem;
        height: 1rem;
        background: url("../../img/down.png") no-repeat;
        background-size: 100%;
        position: absolute;
        bottom:0.6rem;
        right: 44.5/40rem;
      }
    }
    .protocol{
      padding: 1rem 0 0.75rem 0;
      font-size: 12/20rem;
      color: #19191E;
      margin-left: 1.5rem;
      line-height: 1rem;
      span{
        width: 1rem;
        height: 1rem;
        background: url("../../img/check.png") no-repeat;
        display: inline-block;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-left: -1.5rem;
      }
      span.noCheck{
        background: url("../../img/nosel.png") no-repeat;
        background-size: 100% 100%;
      }
      a{
        color: #DC2828;
      }
    }
  }
</style>
