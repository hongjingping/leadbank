<template>
  <div class="rank">
    <scroll :isNeedLoading="0"
            :wrapperClass="'rank-con'"
            ref="scroll"
            @scroll="pageScroll"
            :bounce="false"
            :momentum="true">
      <img src="../img/diagnosis/bannerRank.jpg"
           alt="排行榜"
           class="banner"
           ref="banner">
      <!-- <div class="fund-type-con"
           v-show="!ft2">
        <div class="fun-type-list-wrap"
            id="ft_list_wrap">
          <ul id="ft_list">
            <li @click="getRankList('10000-01')"
                :class="{active: ftIndex==0}">股票</li>
            <li @click="getRankList('10000-08')"
                :class="{active: ftIndex==1}">债券</li>
            <li @click="getRankList('10000-04')"
                :class="{active: ftIndex==2}">混合偏股</li>
            <li @click="getRankList('10000-05')"
                :class="{active: ftIndex==3}">混合偏债</li>
            <li @click="getRankList('10000-02')"
                :class="{active: ftIndex==4}">指数偏股</li>
            <li @click="getRankList('10000-09')"
                :class="{active: ftIndex==5}">指数偏债</li>
            <li @click="getRankList('10000-06')"
                :class="{active: ftIndex==6}">货币</li>
            <li @click="getRankList('10000-03')"
                :class="{active: ftIndex==7}">QDII</li>
            <li @click="getRankList('10000-07')"
                :class="{active: ftIndex==8}">另类</li>
          </ul>
        </div>
      </div> -->
      <div class="product-list-wrap"
           ref="product_list_wrap">
        <div class="hd">
          <span class="col4-1"></span>
          <span class="col4-2">基金名称</span>
          <span class="col4-3"
                v-text="roseTypeName"></span>
          <span class="col4-4">评分</span>
        </div>

        <ul class="product-list"
            id="product_list">
          <li v-for="(item , index) in list"
              :key="index"
              @click="jumpDetails($event,item.fundCode)">
            <div class="col col4-1">
              <span class="ii"
                    :class="{top3: index<3}"
                    v-text="index+1">
              </span>
            </div>
            <div class="col col4-2">
              <a class="name"
                 v-text="item.fundName || '--'"></a>
              <span class="code"
                    v-text="item.fundCode"></span>
            </div>
            <div class="col col4-3">
              <span class="lh-c1"
                    v-text="item.rose+'%'"
                    :class="{'lh-c2':item.rose.indexOf('-')>=0}"
                    v-if="item.rose && item.rose !='null'"></span>
              <span v-else>--</span>
            </div>
            <div class="col col4-4">
              <span v-text="item.score || '--'"></span>
            </div>
          </li>
        </ul>

        <span class="edges lt"></span>
        <span class="edges rt"></span>
        <span class="edges lb"></span>
        <span class="edges rb"></span>
      </div>
      <div class="h1r"></div>
    </scroll>
    <div class="fund-type-con"
         ref="fund_type">
      <div class="fun-type-list-wrap"
           id="ft_list_wrap">
        <ul id="ft_list">
          <li @click="getRankList('10000-01')"
              :class="{active: ftIndex==0}">股票</li>
          <li @click="getRankList('10000-08')"
              :class="{active: ftIndex==1}">债券</li>
          <li @click="getRankList('10000-04')"
              :class="{active: ftIndex==2}">混合偏股</li>
          <li @click="getRankList('10000-05')"
              :class="{active: ftIndex==3}">混合偏债</li>
          <li @click="getRankList('10000-02')"
              :class="{active: ftIndex==4}">指数偏股</li>
          <li @click="getRankList('10000-09')"
              :class="{active: ftIndex==5}">指数偏债</li>
          <li @click="getRankList('10000-06')"
              :class="{active: ftIndex==6}">货币</li>
          <li @click="getRankList('10000-03')"
              :class="{active: ftIndex==7}">QDII</li>
          <li @click="getRankList('10000-07')"
              :class="{active: ftIndex==8}">另类</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import scroll from 'components/subassembly/scroll.vue';
import {toast} from 'js/api.js';
import {fundDiagnoseRank} from 'js/request.js';
export default {
  components: {
    scroll
  },
  data () {
    return {
      fundType: this.$router.currentRoute.query.fundType || '10000-01',
      list: {},
      ftIndex: 0,
      roseTypeName: '',
      ft2: 0
    };
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_TITLESHOWFLAG', false);
    });
  },
  created () {
    this.getRankList(this.fundType);
  },
  methods: {
    // 获取排行榜列表
    getRankList (type) {
      let _ = this;
      _.ftIndex = _.getFindex(type);
      fundDiagnoseRank({
        fundType: type
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _.list = resp.data.data.fundDiagnoseRankBeanList;
          _.roseTypeName = resp.data.data.roseTypeName;
          _.$refs.scroll.scrollTo(0, 0, 500);
          let numImgHeight = _.$refs.banner.height;
          _.$refs.fund_type.style.top = numImgHeight + 'px';
          if (_.ftIndex > 4) {
            let lw = document.getElementById('ft_list_wrap');
            let eul = document.getElementById('ft_list');
            let numSub = eul.offsetWidth - lw.offsetWidth;
            lw.scrollLeft = numSub;
          }
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 获取产品类型对应的tab index
    getFindex (type) {
      let arrFundType = [
        '10000-01', '10000-08', '10000-04', '10000-05', '10000-02', '10000-09', '10000-06', '10000-03', '10000-07'
      ];
      for (let i = 0; i < arrFundType.length; i++) {
        if (type == arrFundType[i]) {
          return i;
        }
      }
      return 0;
      // return arrFundType.findIndex(v=>v == type);
    },
    // 跳转诊断详情
    jumpDetails (e, id) {
      if (window.isApp) {
        this.$router.push({path: 'diagnosisDetail', query: {fundId: id}});
      } else {
        this.$router.push({path: 'fundConsultingRoom', query: {fundId: id}});
      }
    },
    // 页面滚动监听
    pageScroll (o) {
      let numImgHeight = this.$refs.banner.height;
      let curSrollY = Math.abs(o.y);
      if (curSrollY >= numImgHeight) {
        this.$refs.fund_type.className = 'fund-type-con fixed';
        this.$refs.product_list_wrap = 'product-list-wrap active';
        this.$refs.fund_type.style.top = 0.4 + 'rem';
      } else {
        this.$refs.fund_type.className = 'fund-type-con';
        this.$refs.fund_type.style.top = numImgHeight - curSrollY + 'px';
        this.$refs.product_list_wrap = 'product-list-wrap';
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .h1r {
    padding-bottom: 1rem;
  }
  .lh-c1{
    color: #ff5353;
  }
  .lh-c2{
    color: #4ff7ff;
  }
  .rank{
    height: 100%;
    overflow-y: auto;
    background-color: #030d26;
    font-size: .6rem;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }
  .banner{
    width: 100%;
  }
  .fund-type-con{
    position: absolute;
    left: 1.45rem;
    right: 1.45rem;
    top: 34.7%;
    margin: 0;
    background-color: #0e2e45;
    border: solid 1px #4ff7ff;
    border-radius: 4px;
    box-shadow:inset 0 0  15px 5px rgba(42,222,242,.33);
    .fun-type-list-wrap{
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      position: relative;
      z-index: 2;
    }
    &::before,&::after{
      content: "";
      position: absolute;
      width: 7/2rem;
      height: 3rem;
      left: -7px;
      top: -7px;
      background: url("../img/diagnosis/brd_t1-0.png") no-repeat;
      background-size: cover;
      z-index: 1;
    }
    &::after{
      position: absolute;
      left: auto;
      right: -7px;
      top: -7px;
      background: url("../img/diagnosis/brd_t1-1.png") no-repeat;
      background-size: cover;
    }
    &.fixed{
      position: fixed;
      top: .4rem;
    }
    ul{
      padding: 0 15/20rem;
      display: flex;
      width: 32.6rem;
      li{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15/20rem;
        padding: .85rem .4rem;
        min-width: 1.5rem;
        &.active{
          color: #4ff7ff;
          position: relative;
          &::after{
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            right: 0;
            border-bottom: solid 4px #4ff7ff;
          }
        }
        & + li {
          margin-left: 10px;
        }
      }
    }
  }
  .product-list-wrap{
    margin: 3.3rem 1.45rem .7rem;
    border: solid 1px #36b2c1;
    background-color: rgba(75, 234, 243, .14);
    box-shadow: inset 0 0 15px 5px rgba(42, 222, 242, 0.33);
    border-radius: 4px;
    position: relative;
    &.active {
      margin-top: 70/20rem;
    }
  }
  .product-list-wrap{
    .edges{
      position: absolute;
      width: 16/20rem;
      height: 16/20rem;
      &.lt{
        border-top: solid 2px #4ff7ff;
        border-left: solid 2px #4ff7ff;
        left: -2px;
        top: -2px;
        border-top-left-radius: 4px;
      }
      &.rt{
        border-top: solid 2px #4ff7ff;
        border-right: solid 2px #4ff7ff;
        right: -2px;
        top: -2px;
        border-top-right-radius: 4px;
      }
      &.lb{
        border-bottom: solid 2px #4ff7ff;
        border-left: solid 2px #4ff7ff;
        left: -2px;
        bottom: -2px;
        border-bottom-left-radius: 4px;
      }
      &.rb{
        border-right: solid 2px #4ff7ff;
        border-bottom: solid 2px #4ff7ff;
        right: -2px;
        bottom: -2px;
        border-bottom-right-radius: 4px;
      }
    }
    .hd{
      padding: 0 14/20rem;
      border-bottom: solid 1px #4beaf3;
      display: flex;

      span{
        padding: 14/20rem 0;
      }
    }
    .col4-1{
      width: 15%;
    }
    .col4-2{
      width: 45%;
    }
    .col4-3{
      width: 25%;
      text-align: right;
    }
    .col4-4{
      width: 15%;
      text-align: right;
    }
  }
  .product-list{
    li{
      display: flex;
      padding: 22/20rem 14/20rem;
      .col{
        display: flex;
        align-items: center;
      }
      .col4-2{
        flex-direction: column;
        align-items: flex-start;
      }
      .col4-3,.col4-4{
        justify-content: flex-end;
      }
      .ii{
        display: flex;
        font-size: 15/20rem;
        color: #4ff7ff;
        width: 23/20rem;
        height: 23/20rem;
        border: solid 1px #4ff7ff;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        &.top3{
          width: 23/20rem;
          height: 30/20rem;
          border: none;
          border-radius: 0;
          background: url("../img/diagnosis/top3.png") no-repeat;
          background-size: cover;
          align-items: unset;
          line-height: 2.5;
        }
      }
      .name{
        margin-bottom: .3rem;
        color: #ffffff;
        max-width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      &+li{
        border-top: solid 1px #4beaf3;
      }
    }
  }
</style>
