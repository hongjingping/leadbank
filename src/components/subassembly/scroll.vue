<template>
  <div ref="wrapper"
       class="defaultWrapper"
       :class="wrapperClass">
    <div :style="{minHeight:contentHeight}">
      <slot></slot>
      <div class="loading-wrapper"
           v-if="isNeedLoading">
        <img src="../../img/loading.gif"
             alt="加载中"
             v-if="loadMoreDataFlag && pullingUpFlag">
        <p class="fs-24 fc-96969B"
           v-if="!loadMoreDataFlag">{{ loadAllText }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';

export default {
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    /** * 点击列表是否派发click事件 */
    click: {
      type: Boolean,
      default: true
    },
    /** * 是否开启横向滚动 */
    scrollX:
    {
      type: Boolean,
      default: false
    },
    /** * 是否开启回弹动画 */
    bounce:
    {
      type: Boolean,
      default: true
    },
    momentum: {
      type: Boolean,
      default: true
    },
    // 'vertical'、'horizontal
    eventPassthrough: {
      type: String,
      default: ''
    },
    /** * 是否派发滚动事件 */
    listenScroll: {
      type: Number,
      default: 1
    },
    /** * 是否派发滚动结束事件 */
    listenScrollEnd: {
      type: Number,
      default: 1
    },
    /** * 列表的数据 */
    data: {
      type: [
        String, Array, Object
      ],
      default: null
    },
    /** * 是否派发滚动到底部的事件，用于上拉加载 */
    pullup: {
      type: Boolean,
      default: true
    },
    /** * 是否派发顶部下拉的事件，用于下拉刷新 */
    pulldown: {
      type: Boolean,
      default: false
    },
    /** * 是否派发列表滚动开始的事件 */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /** * 当数据更新后，刷新scroll的延时。 */
    refreshDelay: {
      type: Number,
      default: 20
    },
    // 是否需要loading
    isNeedLoading: {
      type: Number,
      default: 1
    },
    // 是否还有更多数据加载
    loadMoreDataFlag: {
      type: Number,
      default: 1
    },
    loadAllText: {
      type: String,
      default: '已加载全部数据'
    },
    // 滚动区域的类名
    wrapperClass: {
      type: String,
      default: 'wrapper'
    }
  },
  data () {
    return {
      pullingUpFlag: 0,
      contentHeight: 0};
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data () {
      let _this = this;
      setTimeout(function () {
        _this.$nextTick(function () {
          _this.pullingUpFlag = 0;
          if (_this.scroll) {
            _this.scroll.finishPullUp();
          }
          _this.refresh();
        });
      }, 20);
    },
    loadMoreDataFlag () {
      this.scroll.finishPullUp();
      this.refresh();
    }
  },
  mounted () {
    let _this = this;
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      _this.checkContentHeight();
      _this._initScroll();
    }, 20);
  },
  methods: {
    // 解决内容高度没有超过wrapper时，无法滚动的问题
    checkContentHeight () {
      this.contentHeight = this.$refs.wrapper.clientHeight + 2 + 'px';
    },
    _initScroll () {
      let wrapperEle = this.$refs.wrapper;
      if (!wrapperEle) {
        return;
      }
      // better-scroll的初始化
      this.scroll = new BScroll(wrapperEle, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        pullUpLoad: true,
        eventPassthrough: this.eventPassthrough,
        bounce: this.bounce,
        momentum: this.momentum
      });

      // 是否派发滚动事件
      if (this.listenScroll) {
        let me = this;
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos);
        });
      }
      // 是否派发滚动结束事件
      if (this.listenScrollEnd) {
        let me = this;
        this.scroll.on('scrollEnd', (pos) => {
          me.$emit('scrollEnd', pos);
        });
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on('pullingUp', () => {
          this.pullingUpFlag = 1;
          this.$emit('pullingUp');
          // 上拉加载时关闭调取接口时的loading
          this.$store.commit('UPDATE_LOADINGFLAG', -1);
        });
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pulldown) {
        this.scroll.on('touchEnd', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit('pulldown');
          }
        });
      }
      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll');
        });
      }
    },
    disable () {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable();
    },
    enable () {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable();
    },
    refresh () {
      this.contentHeight = this.$refs.wrapper.clientHeight + 2 + 'px';
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh();
    },
    scrollTo () {
      // x, y, time, easing
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollBy () {
      // x, y, time, easing
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollBy.apply(this.scroll, arguments);
    },
    scrollToElement (x, y, time, easing) {
      // x, y, time, easing
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  }
};
</script>

<style lang="less" scoped>
.defaultWrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .loading-wrapper {
    padding: 20/40rem 0;
    text-align: center;
    img {
      width: 2.5rem;
      height: auto;
    }
  }
}
</style>
