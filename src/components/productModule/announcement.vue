<template>
  <div id="announcementPage">
    <scroll :data="announcementList"
            :loadMoreDataFlag="loadMoreDataFlag"
            @pullingUp="getAnnouncementList" >
      <div class="announcement-c"
           @click="downPDF(item.annocontent)"
           v-for="(item,index) in announcementList"
           :key="index" >
        <p class="title fs-30 fc-19191E annotitle">{{ item.annotitle }}</p>
        <p class="time fs-24 fc-96969B">{{ item.annodate }}</p>
      </div>
    </scroll>
    <listNoData :noDataFlag="noDataFlag" />
  </div>
</template>
<script>
import {toast} from 'js/api.js';
import {getAnnouncementList} from 'js/request.js';
import scroll from 'components/subassembly/scroll.vue';
import listNoData from 'components/subassembly/listNoData.vue';

export default {
  name: 'AnnouncementPage',
  components: {
    scroll,
    listNoData
  },
  data () {
    return {
      fundId: this.$router.currentRoute.query.fundId,
      announcementList: [],
      pageIndex: 0,
      totalPages: 0,
      loadMoreDataFlag: 1,
      noDataFlag: 0
    };
  },
  activated () {
    let fundId = this.$router.currentRoute.query.fundId;
    if (fundId != this.fundId) {
      this.fundId = fundId;
      this.getFundDetails();
    }
  },
  mounted () {
    this.getAnnouncementList();
  },
  methods: {
    getAnnouncementList () {
      let _this = this;
      if (_this.pageIndex > 0 && _this.totalPages <= _this.pageIndex) {
        _this.loadMoreDataFlag = 0;
        return;
      }
      _this.pageIndex = _this.pageIndex + 1;
      getAnnouncementList({
        proId: _this.fundId,
        pageIndex: _this.pageIndex
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.announcementList = _this.announcementList.concat(resp.data.data.annoList);
          _this.totalPages = resp.data.data.totalPages;
          if (_this.announcementList <= 0) {
            _this.noDataFlag = 1;
          }
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    downPDF (url) {
      window.location.href = url;
    }
  }
};
</script>
<style lang="less" scoped>
#announcementPage {
  box-sizing: border-box;
  padding: 0 15/40rem;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .announcement-c {
    box-sizing: border-box;
    padding: 40/40rem 30/40rem;
    width: 100%;
    border-bottom: 1px solid #dcdcdc;
    p:last-child {
      margin-top: 14/40rem;
      text-align: right;
    }
    .annotitle {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .announcement-c:last-child {
    border-bottom: none;
  }
  .loading-wrapper  {
    padding: 20/40rem 0;
    text-align: center;
  }
}
</style>
