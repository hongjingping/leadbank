<template>
  <div id="netWorth">
    <!-- 货币型 -->
    <div class="list-title fs-24 fc-96969B list-style-hb"
         v-if="fundType == '04' || fundType == '98'">
      <span>日期</span>
      <span>万分收益</span>
      <span>七日年化</span>
    </div>
    <!-- 非货币 -->
    <div class="list-title fs-24 fc-96969B list-common-style"
         v-else>
      <span>日期</span>
      <div>
        <span>单位净值</span>
        <span>累计净值</span>
        <span>日增加率</span>
      </div>
    </div>
    <div class="list">
      <!-- 货币型 -->
      <scroll :data="netValueList"
              :loadMoreDataFlag="loadMoreDataFlag"
              @pullingUp="getnetValues"
              v-if="fundType == '04' || fundType == '98'">
        <div class="list-row list-style-hb"
             v-for="(item,index) in netValueList"
             :key="index">
          <span>{{ item.statisticaldate ? item.statisticaldate : '--' }}</span>
          <span>{{ item.unitnav ? parseFloat(item.unitnav).toFixed(4) : '--' }}</span>
          <span class="fc-dc2828"
                v-if="item.daygain">
            {{ parseFloat(item.daygain).toFixed(2) }}%
          </span>
          <span v-else>--</span>
        </div>
      </scroll>
      <!-- 非货币 -->
      <scroll :data="netValueList"
              :loadMoreDataFlag="loadMoreDataFlag"
              @pullingUp="getnetValues"
              v-if="fundType != '04' && fundType != '98' ">
        <div class="list-row list-common-style"
             v-for="(item,index) in netValueList"
             :key="index">
          <span>{{ item.statisticaldate ? item.statisticaldate : '--' }}</span>
          <div>
            <span>{{ item.unitnav ? parseFloat(item.unitnav).toFixed(4) : '--' }}</span>
            <span>{{ item.cumulativenav ? parseFloat(item.cumulativenav).toFixed(4) : '--' }}</span>
            <span class="fc-dc2828"
                  :class="{'fc-59b395' : parseFloat(item.daygain) < 0}"
                  v-if="item.daygain">
              {{ parseFloat(item.daygain).toFixed(2) }}%
            </span>
            <span class="fc-dc2828"
                  v-else>
              --
            </span>
          </div>
        </div>
      </scroll>
      <listNoData :noDataFlag="noDataFlag"/>
    </div>
  </div>
</template>
<script>
import {toast} from 'js/api.js';
import {getnetValues} from 'js/request.js';
import scroll from 'components/subassembly/scroll.vue';
import listNoData from 'components/subassembly/listNoData.vue';

export default {
  name: 'NetWorth',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_NETVALUETABFALG', to.meta.tab);
    });
  },
  components: {
    scroll,
    listNoData
  },
  data () {
    return {
      fundId: this.$router.currentRoute.query.fundId,
      pageIndex: 0,
      pageSize: 1,
      netValueList: [],
      loadMoreDataFlag: 1,
      noDataFlag: 0,
      fundType: this.$router.currentRoute.query.fundType || '01'
    };
  },
  activated () {
    let fundId = this.$router.currentRoute.query.fundId;
    if (fundId != this.fundId) {
      this.fundId = fundId;
      this.getnetValues();
    }
  },
  mounted () {
    this.getnetValues();
  },
  methods: {
    getnetValues () {
      let _this = this;
      if (_this.pageSize <= _this.pageIndex && _this.pageIndex > 0) {
        _this.loadMoreDataFlag = 0;
        return;
      }
      _this.pageIndex = _this.pageIndex + 1;
      getnetValues({
        proId: _this.fundId,
        pageIndex: _this.pageIndex,
        pageCount: 10
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.netValueList = _this.netValueList.concat(resp.data.data.fundnavAndRoseList);
          _this.pageSize = resp.data.data.size;
          if (_this.netValueList.length <= 0) {
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
#netWorth {
  width: 100%;
  height: 100%;
  .list-title {
    padding: 0 0.75rem;
    height: 7.43%;
  }
  .list-style-hb {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 0.6rem;
    border-bottom: 1px solid #dcdcdc;
    span {
      display: block;
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
  .list {
    box-sizing: border-box;
    padding: 0 0.75rem;
    width: 100%;
    height: 92.57%;
    overflow: hidden;
    .list-row {
      padding: 0.825rem 0;
      color: #19191e;
    }
    .list-row:last-child {
      border: none;
    }
  }
  .list-common-style {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    font-size: 0.6rem;
    border-bottom: 1px solid #dcdcdc;
    span {
      display: block;
      flex-grow : 1;
      width: 27.73%;
      text-align: left;
    }
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 64.26%;
      span {
        width: auto;
        flex-grow: 1;
        text-align: center;
      }
      span:last-child {
        text-align: right;
      }
    }
  }
}
</style>
