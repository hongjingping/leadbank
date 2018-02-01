<template>
  <div id="profitList">
    <div class="list-title list-common-style">
      <span>权益登记日</span>
      <span>除息日</span>
      <span>每份分红</span>
      <span>分红发放日</span>
    </div>
    <div class="list">
      <scroll :data="pofitList"
              :loadMoreDataFlag="0"
              :loadAllText="''">
        <div class="list-row list-common-style"
             v-for="(item,index) in pofitList"
             :key="index">
          <span>{{ item.registerdate }}</span>
          <span>{{ item.exdividenddate }}</span>
          <span class="fc-dc2828">{{ item.everydividend ? parseFloat(item.everydividend).toFixed(4) : '--' }}</span>
          <span>{{ item.dividenddate }}</span>
        </div>
      </scroll>
      <listNoData :noDataFlag="noDataFlag"/>
    </div>
  </div>
</template>
<script>
import {toast} from 'js/api.js';
import {qryFundDividends} from 'js/request.js';
import listNoData from 'components/subassembly/listNoData.vue';
import scroll from 'components/subassembly/scroll.vue';

export default {
  name: 'ProfitLsit',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_NETVALUETABFALG', to.meta.tab);
    });
  },
  components: {
    listNoData,
    scroll
  },
  data () {
    return {
      fundId: this.$router.currentRoute.query.fundId,
      pofitList: [],
      noDataFlag: 0
    };
  },
  activated () {
    let fundId = this.$router.currentRoute.query.fundId;
    if (fundId != this.fundId) {
      this.fundId = fundId;
      this.getPofitList();
    }
  },
  mounted () {
    this.getPofitList();
  },
  methods: {
    getPofitList () {
      let _this = this;
      qryFundDividends({
        proId: _this.fundId
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.pofitList = resp.data.data.fundDividendDistrList;
          if (_this.pofitList.length <= 0) {
            _this.noDataFlag = 1;
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
  #profitList {
    width: 100%;
    height: 100%;
    .list-title {
      padding: 0 0.75rem;
      height: 7.43%;
      color: #96969b;
    }
    .list {
      box-sizing: border-box;
      padding: 0 0.75rem;
      width: 100%;
      height: 92.57%;
      overflow:hidden;
      .list-row {
        padding: 0.825rem 0;
      }
      .list-row:last-child {
        border:none;
      }
    }
    .list-common-style {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background-color: #fff;
      font-size: 0.6rem;
      border-bottom: 1px solid #dcdcdc;
      span {
        width: 25%;
        text-align: center;
      }
      span:first-child {
        text-align: left;
      }
      span:last-child {
        text-align: right;
      }
    }
  }
</style>
