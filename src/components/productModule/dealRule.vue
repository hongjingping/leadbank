<template>
  <div id="dealRule">
    <div class="rlue-tab">
      <p :class="{'active' : tabFlag == 1}"
         @click="changePage(1)" >
        买入规则
      </p>
      <p :class="{'active' : tabFlag == 2}"
         @click="changePage(2)" >
        卖出规则
      </p>
    </div>
    <div class="rule-content">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import {toast} from 'js/api.js';
import {qryFundRate} from 'js/request.js';

export default {
  name: 'DealRule',
  data () {
    return {
      fundId: this.$router.currentRoute.query.fundId
    };
  },
  computed: {
    tabFlag () {
      return this.$store.getters.dealRuleTabFlag;
    }
  },
  activated () {
    let fundId = this.$router.currentRoute.query.fundId;
    if (fundId != this.fundId) {
      this.fundId = fundId;
      this.getRuleDetails();
    }
  },
  mounted () {
    this.getRuleDetails();
  },
  methods: {
    getRuleDetails () {
      let _this = this;

      qryFundRate({
        proId: _this.fundId
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.$store.commit('UPDATE_DEALRULEDETAILS', resp.data.data);
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    changePage (tab) {
      if (tab == 1) {
        this.$router.replace({path: '/dealRule', query: this.$router.currentRoute.query});
      } else {
        this.$router.replace({path: '/dealRule/salePage', query: this.$router.currentRoute.query});
      }
    }
  }
};
</script>
<style lang="less" scoped>
#dealRule {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  .rlue-tab {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 9.12%;
    font-size: 0.75rem;
    color: #19191e;
    background-color: #fff;
    p {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      height: 100%;
      text-align: center;
      border-bottom: 2px solid transparent;
    }
    .active {
      color: #DC2828;
      border-color: #DC2828;
    }
  }
  .rule-content {
    margin-top: 2.66%;
    width: 100%;
    height: 89.22%;
    overflow: hidden;
  }
}
</style>
