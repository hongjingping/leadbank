<template>
  <div class="searchBg">
    <div class="searchInput">
      <input placeholder="请输入基金代码／简称／名称"
             @input="searchFund"
             v-model="searchText">
      <div class="searchIcon search"
           @click="searchConfirm"></div>
      <div class="searchIcon delete"
           v-if="deleteSearch"
           @click="searchDelete"></div>
    </div>
    <!-- 热搜基金开始 -->
    <div class="searchHot"
         v-if="showHotFund">
      <div class="hotTitle"><em class="hotIcon"></em>热搜基金</div>
      <ul>
        <li v-for="(item,index) in hotFundList"
            :key="index"
            @click="targetFund(item.fundcode)">
          <div>
            <label>{{ item.fundname }}</label>
            <p>
              <span>{{ item.fundcode }}</span>
              <em>{{ item.fundtypename }}</em>
            </p>
          </div>
          <em class="diagnosis">诊断</em>
        </li>
      </ul>
    </div>
    <!-- 热搜基金结束 -->

    <!-- 基金搜索开始 -->
    <div class="searchHot searchCurrent"
         v-if="showSearch">
      <scroll :isNeedLoading="0"
              :data="searchList">
        <ul>
          <li v-for="(item,index) in searchList"
              :key="index"
              @click="targetFund(item.fundcode)">
            <div>
              <label>{{ item.fundname }}</label>
              <p>
                <span>{{ item.fundcode }}</span>
                <em>{{ item.fundtypename }}</em>
              </p>
            </div>
            <em class="diagnosis">诊断</em>
          </li>
        </ul>
      </scroll>
    </div>
    <!-- 基金搜索结束 -->

    <!-- 历史搜索开始 -->
    <div class="searchHistory"
         v-if="historyList!=''">
      <div class="searchHot">
        <div class="hotTitle"><em class="history"></em>历史记录</div>
        <ul>
          <li v-for="(item,index) in historyList"
              v-if="item!=''"
              :key="index"
              @click="targetFund(item)">{{ item }}</li>
        </ul>
      </div>
      <div class="clearHistory"
           @click="clearHistory">清除历史记录</div>
    </div>
    <!-- 历史搜索结束 -->
  </div>
</template>

<script>
import scroll from 'components/subassembly/scroll.vue';
import {toast} from 'js/api.js';
import {hotFund, searchFund} from 'js/request.js';

export default {
  components: {
    scroll
  },
  data () {
    return {
      deleteSearch: false,
      showSearch: false,
      showHotFund: true,
      hotFundList: [],
      searchText: '',
      searchList: [],
      historyList: ''
    };
  },
  mounted () {
    this.hotFund();
    let {historyItems} = localStorage;
    if (historyItems != undefined) {
      this.historyList = historyItems.split(',');
    }
  },
  methods: {
    // 基金搜索内容输入
    searchFund () {
      let self = this;
      if (self.searchText.length != '') {
        self.deleteSearch = true;
      } else {
        self.deleteSearch = false;
      }
      if (self.searchText.replace(/^ +| +$/g, '')) {
        self.fundList();
        self.showHotFund = false;
        self.showSearch = true;
      } else {
        self.showHotFund = true;
        self.showSearch = false;
      }
    },
    // 搜索的基金列表
    fundList () {
      let self = this;
      searchFund({
        fundkey: encodeURI(self.searchText)
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.searchList = resp.data.data.fundSearchList;
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 基金搜索确认
    searchConfirm () {
      let self = this;
      self.deleteSearch = false;
      if (self.searchText == '') {
        toast('请输入搜索内容');
      }
    },
    // 删除输入的内容
    searchDelete () {
      let self = this;
      self.searchText = '';
      self.deleteSearch = false;
      self.showHotFund = true;
      self.showSearch = false;
    },
    // 热搜基金
    hotFund () {
      let self = this;
      hotFund().then(function (resp) {
        if (resp.data.respCode == '000') {
          self.hotFundList = resp.data.data.hotSearchFundList;
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 基金跳转及历史记录
    targetFund (keyword) {
      let {historyItems} = localStorage;
      if (historyItems === undefined) {
        localStorage.historyItems = keyword;
      } else {
        historyItems = keyword + ',' + historyItems.split(',').filter(e => e != keyword).join(',');
        localStorage.historyItems = historyItems;
      }
      if (window.isApp) {
        this.$router.push({path: 'diagnosisDetail', query: {fundId: keyword}});
      } else {
        this.$router.push({path: 'fundConsultingRoom', query: {fundId: keyword}});
      }
    },
    // 清除历史记录
    clearHistory () {
      let self = this;
      self.historyList = '';
      localStorage.removeItem('historyItems');
    }
  }
};
</script>

<style lang="less">
  .searchBg{
    background: #f5f5f5;
    height: 100%;
    overflow: auto;
    .searchInput{
      background: #f5f5f5;
      padding: 0.775rem 0.75rem;
      position: absolute;
      width: 100%;
      z-index: 99;
      display: flex;
      align-items: center;
      input{
        width: 100%;
        box-sizing: border-box;
        height: 1.5rem;
        padding-left: 2.375rem;
        border:1px solid #DCDCDC;
        border-radius: 2px;
        color: #96969B;
        font-size: 0.6rem;
        display: inline-block;
        line-height: 1.5rem;
      }
      input::-webkit-input-placeholder{
        color: #96969B;
        font-size: 0.6rem;
      }
      input:-moz-placeholder{
        color: #96969B;
        font-size: 0.6rem;
      }
      input::-moz-placeholder{
        color: #96969B;
        font-size: 0.6rem;
      }
      input:-ms-input-placeholder{
        color: #96969B;
        font-size: 0.6rem;
      }
      .search,.delete{
        position: absolute;
        display: inline-block;
        bottom: 1rem;
      }
      .search{
        width: 1rem;
        height: 1rem;
        left: 1.9rem;
        background: url("../img/search.png") no-repeat;
        background-size: 100% 100%;
      }
      .delete{
        width: 1rem;
        height: 1rem;
        right: 1.9rem;
        background: url("../img/sDelete.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .searchHistory{
      padding-top: 0.5rem;
      .searchHot{
        padding-top: 0rem;
      }
    }
    .searchHot{
      background: #ffffff;
      padding-top: 3rem;
      .hotTitle{
        display: flex;
        line-height: 2.75rem;
        border-bottom: 1px solid #DCDCDC;
        padding-left: 0.75rem;
        font-size: 0.75rem;
        color: #19191E;
        align-items: center;
      }
      .hotIcon{
        width: 0.75rem;
        height: 0.75rem;
        display: inline-block;
        background: url("../img/hot.png") no-repeat;
        background-size: 100% 100%;
        margin-right: 0.5rem;
      }
      .history{
        width: 0.75rem;
        height: 0.75rem;
        display: inline-block;
        background: url("../img/history.png") no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 0.5rem;
      }
      ul{
        padding: 0rem 0.75rem;
      }
      ul li{
        padding: 1rem 0rem;
        border-bottom: 1px solid #DCDCDC;
        font-size: 0.75rem;
        color: #19191E;
        line-height: 0.75rem;
        display: flex;
        align-items: center;
        div{
          flex: 1;
          label{
          padding-bottom: 0.4rem;
          display: block;
          }
          p{
            font-size: 0.6rem;
            color: #96969B;
            line-height: 0.6rem;
            display: flex;
            align-items: center;
            span{
              padding-right: 0.5rem;
            }
            em{
              border: 1px solid #DCDCDC;
              border-radius: 2px;
              padding: 0rem 0.25rem;
              display: flex;
              align-items: center;
              font-size: 0.5rem;
            }
          }
        }
        em.diagnosis{
          font-size: 0.6rem;
          color: #1185FF;
          line-height: 0.6rem;
          border: 1px solid #1185FF;
          border-radius: 2px;
          padding: 0.2rem 0.4rem;
          display: flex;
          align-items: center;
        }
      }
      ul li:last-child{
        border-bottom: none;
      }
    }
    .searchCurrent {
      height: 100%;
    }
    .clearHistory{
      padding: 0.6rem 0rem 0.55rem;
      text-align: center;
      border-top: 1px solid #DCDCDC;
      font-size: 0.6rem;
      color: #96969B;
      line-height: 0.6rem;
      background: #ffffff;
    }
  }

</style>
