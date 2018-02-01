<template>
  <div class="protocolCont">
    <p>致上海利得金融服务有限公司</p>
    <p>上海利得基金销售有限公司：</p>
    <p>本人（授权人）现就本人所开立的银行账户，授权贵公司（被授权人）通过贵公司指定的第三方支付机构及商业银行按照本人在贵公司交易平台上的交易申请金额从本人的银行账户主动进行交易资金的代收扣收，用于完成本人的合同资金交付。</p>
    <p>本人银行账户信息如下：<br>
      账户姓名：{{ name }}<br>
      账户号码：{{ cardNumber }}<br>
      账户开户银行名称：{{ bankName }}<br>
      账户开户证件：身份证<br>
      账户开户证件号码：{{ card }}
    </p>
    <p>本人知晓并确认，本授权书系使用本人身份证件号码（或交易平台账户）、以网络在线点击确认的方式向贵公司发出。本授权书自本人在贵公司网站或APP输入身份证件号码（或交易账户密码）并点击确认时生效。本人已经通过本授权书确认代扣款项的银行账户信息，在代扣的过程中，贵公司根据本授权书提供的银行账户信息进行相关操作，无需再向本人确认银行账户信息和密码。</p>
    <p>本人在此声明已清楚知悉本次授权代收的性质和后果。贵公司根据本授权书所采取的全部行动和措施的法律后果均由本人承担。</p>
    <p>本人知晓并同意，受本人银行账户状态、银行、第三方支付机构及网络等原因所限，本授权书项下交易申请可能会通过多次代扣交易方可完成，且贵公司无需对资金到账时间做任何承诺。贵公司或贵公司委托的第三方支付机构或银行仅根据本授权书所述的授权进行相关操作，贵公司或贵公司委托的第三方支付机构或银行无义务对根据本授权书所采取的全部行动和措施的时效性和结果承担任何责任。</p>
    <p>未经本人签署《银行自动转账授权终止通知书》之前，本授权持续有效</p>
    <p class="last">授权人：{{ name }}<br>
      <span>{{ date }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Protocol',
  data () {
    return {
      name: '--',
      cardNumber: '--',
      bankName: '--',
      card: '--',
      date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    };
  },
  mounted () {
    if (this.$router.currentRoute.query.nameFull) {
      this.name = this.$router.currentRoute.query.nameFull;
    }
    if (this.$router.currentRoute.query.cardNumber) {
      this.cardNumber = this.$router.currentRoute.query.cardNumber;
    }
    if (this.$router.currentRoute.query.bank) {
      this.bankName = this.$router.currentRoute.query.bank;
    }
    if (this.$router.currentRoute.query.card) {
      this.card = this.$router.currentRoute.query.card;
    }
  }
};
</script>

<style lang="less">
  .protocolCont{
    padding: 0.75rem;
    height: 97%;
    overflow-y: auto;
    color: #3d3d3d;
    font-size: 0.75rem;
    line-height: 1rem;
    p{
      padding-bottom: 0.5rem;
    }
    .last{
      text-align: right;
      display: block
    }
  }

</style>
