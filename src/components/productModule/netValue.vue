<template>
  <div id="netValue">
    <!-- 净值和分红tab -->
    <div class="tabHeader">
      <p :class="{'active' : tabFlag == 1}"
         @click="changeList(1)">
        历史净值
      </p>
      <p :class="{'active' : tabFlag == 2}"
         @click="changeList(2)">
        分红配送
      </p>
    </div>
    <!-- 净值和分红tab end -->

    <!-- 净值和分红列表 -->
    <div class="content-list">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <!-- 净值和分红列表end -->
  </div>
</template>
<script>
export default {
  name: 'NetValue',
  data () {
    return {

    };
  },
  computed: {
    tabFlag () {
      return this.$store.getters.netValueTabFalg;
    },
    noDataFlag () {
      return this.$store.getters.noDataFlag;
    }
  },
  methods: {
    changeList (tab) {
      let _this = this;
      switch (tab) {
      case 1 :
        this.$router.replace({path: '/netValue', query: _this.$router.currentRoute.query});
        break;
      case 2 :
        this.$router.replace({path: 'netValue/profitList', query: _this.$router.currentRoute.query});
        break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
#netValue {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow: auto;
  overflow-x: hidden;
  .tabHeader {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 9.12%;
    background-color: #fff;
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 50%;
      height: 100%;
      text-align: center;
      font-size: 0.75rem;
      color: #19191E;
      border-bottom: 2px solid transparent;
    }
    p.active {
      color: #DC2828;
      border-color: #DC2828;
    }
  }
  .content-list {
    position: relative;
    margin-top: 2.66%;
    width: 100%;
    height: 89.23%;
    overflow: hidden;
    background-color: #fff;
  }
}
</style>
