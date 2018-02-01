<template>
  <div id="explainModel"
       v-show="explainModelShowFlag"
       @touchmove="stopEvent">
    <div class="diagnose-explain-wrapper">
      <div class="model-title">
        {{ modelTitle }}
      </div>
      <div class="model-content">
        <div class="model-scroll-wrapper"
             ref="modelScrollConent">
          <scroll :isNeedLoading="0"
                  :data="showData"
                  ref="modelScrollWrapper">
            <p class="model-content-list">基金评分是根据基金的类型和几大指标综合评估基金的整体表现。</p>
            <p class="model-content-list"
               v-for="(item,index) in showData"
               :key="index">
              {{ item }}
            </p>
          </scroll>
        </div>
      </div>
    </div>
    <div class="close-model-button"
         @click="closeModel">
    </div>
  </div>
</template>
<script>
import scroll from 'components/subassembly/scroll.vue';

export default {
  name: 'ExplainModel',
  components: {
    scroll
  },
  props: {
    explainModelShow: {
      type: Number,
      default: 0
    },
    listenCloseModel: {
      type: Number,
      default: 0
    },
    modelTitle: {
      type: String,
      default: '什么是基金诊断？'
    },
    items: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      explainModelShowFlag: 0,
      allData: {
        '产品优势': '考量基金规模、基金管理费等基金特性',
        '盈利能力': '反映基金过去一段时间内的业绩表现',
        '风险收益比': '反映基金每承受一单位总风险所产生的超额回报',
        '稳定性': '反映基金净值的波动情况',
        '超额收益': '反映基金跑赢标的指数的表现情况',
        '择时能力': '反映基金在牛熊市中仓位控制以及行业配置能力',
        '选股能力': '反映基金在牛熊市中同构精选个股跑赢同类的能力',
        '跟踪能力': '反映基金对标指数跟踪误差的把握能力'
      },
      showData: []
    };
  },
  watch: {
    items () {
      this.disposalData();
    },
    explainModelShow (n) {
      let _this = this;
      _this.explainModelShowFlag = n;
      if (n == 1) {
        _this.$nextTick(function () {
          _this.$refs.modelScrollWrapper.refresh();
        });
      }
    }
  },
  mounted () {
    if (this.showData.length > 0) {
      this.disposalData();
    }
  },
  methods: {
    closeModel () {
      // 是否派发model关闭事件
      if (this.listenCloseModel) {
        this.$emit('closeModel');
      }
    },
    disposalData () {
      let _this = this;
      _this.showData = [];

      for (let i = 0; i < _this.items.length; i++) {
        let item = '';
        for (let j in _this.allData) {
          if (_this.items[i] == j) {
            item = _this.items[i] + '：' + _this.allData[j];
            break;
          }
        }
        _this.showData.push(item);
      }
    },
    stopEvent (event) {
      event.preventDefault();
    }
  }
};
</script>
<style lang="less" scoped>
#explainModel{
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.8);
  z-index: 999;
  .diagnose-explain-wrapper {
    box-sizing: border-box;
    padding: 0 30/40rem;
    padding-bottom: 60/40rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 603/40rem;
    height: 68.5%;
    background-color: rgba(0,74,77,.9);
    border: 1px solid #4ff7ff;
    .model-title {
      padding: 30/40rem 0;
      width: 100%;
      font-size: 32/40rem;
      text-align: center;
      border-bottom: 1px solid #4ff7ff;
    }
    .model-content {
      flex: 1;
      width: 100%;
      overflow: hidden;
      position: relative;
      .model-scroll-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
      }
      .model-content-list {
        padding-top: 40/40rem;
      }
    }
  }
  .close-model-button {
    margin-top: 30/40rem;
    width: 72/40rem;
    height: 72/40rem;
    background-image: url("../../img/diagnosis/button-close-ico.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
