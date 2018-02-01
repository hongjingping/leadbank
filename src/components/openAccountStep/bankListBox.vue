<template>
  <div>
    <div class="bankList"
         v-show="show">
      <div class="bankListContent">
        <div class="contentHeader fc-19191E bg-f0f0f0">
          <span class="cancel"
                @click="closeBankList">
            取消
          </span>
          <span class="title">选择银行</span>
        </div>
        <div class="contentInfo">
          <!-- <ul class="infoLists"
                   v-show=" bankList != '' "> -->
          <ul class="infoLists">
            <li class="list"
                v-for="(item, index) in bankList"
                :key="index"
                @click="selectStyle(index)">
              <div class="listL">
                <img class="bankIcon"
                     :src="item.bankImg"
                     alt="银行">
              </div>
              <div class="listC">
                {{ item.bankName }}
              </div>
              <div class="listR">
                <em :class="{'checkIcon': isActive == index }"></em>
              </div>
            </li>
            <li class="list last">若您的银行卡不被支持，请更换上述支持的银行卡进行认证</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bankListWrapper"
         @touchstart="stopEvent"
         @touchmove="stopEvent"
         @touchend="stopEvent"
         v-show="show">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bankList: {
      type: [
        Array,
        Object
      ],
      default () {
        return {};
      }
    },
    show: {
      type: [
        Number,
        Boolean,
        String
      ],
      default: 0
    }
  },
  data () {
    return {
      'isActive': -1
    };
  },
  methods: {
    // 银行卡列表选择
    selectStyle (a) {
      let _this = this;
      _this.isActive != a ? _this.isActive = a : _this.isActive = 0;
      this.$emit('input', _this.bankList[a]);
      _this.closeBankList();
    },
    // 银行卡列表关闭
    closeBankList () {
      this.$emit('closed');
    },
    stopEvent (event) {
      // 阻止事件穿透
      event.stopPropagation();
    }
  }
};
</script>

<style lang="less" scoped>
  .bankList {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    overflow: scroll;
    .bankListContent {
      width: 100%;
      background-color: #FFF;
      -webkit-animation: slideInUp .3s;
      animation: slideInUp .3s;
      .contentHeader {
        width: 100%;
        height: 2.25rem;
        line-height: 2.25rem;
        position: relative;
        font-size: .9rem;
        text-align: center;
        .cancel {
          position: absolute;
          left: 0;
          top: 0;
          padding: 0 .75rem;
          font-size: .75rem;
        }
      }
      .contentInfo {
        max-height: 12.5rem;
        overflow: scroll;
        .infoLists {
          padding: 0 .75rem;
          .list {
            padding: .9rem 0;
            position: relative;
            display: flex;
            .listL {
              .bankIcon {
                display: inline-block;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                margin: auto;
                margin-right: .5rem;
              }
            }
            .listC {
              flex: 1;
              font-size: 0.75rem;
              color: #19191E;
              line-height: 1.5rem;
            }
            .listR {
              margin: auto;
              .checkIcon {
                display: inline-block;
                width: 1rem;
                height: 1rem;
                background: url('../../img/selectIcon.png') no-repeat;
                background-size: 100% 100%;
              }
            }
          }
          .last{
            color: #96969B;
            font-size: 12/20rem;
          }
          .list+.list::before {
            content: '';
            position: absolute;
            width: 200%;
            height: 1px;
            top: 0;
            border-bottom: 1px solid #DCDCDC;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scale(.5,.5);
            transform: scale(.5,.5);
            -webkit-box-sizing: border-box;
            box-sizing: border-box
          }
        }
      }
    }
  }
  .bankListWrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
