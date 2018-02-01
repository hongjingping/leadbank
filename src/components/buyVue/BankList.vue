<template>
  <div>
    <div class="bankList"
         v-show="show">
      <div class="bankListContent">
        <div class="contentHeader fc-19191E bg-f0f0f0">
          <span class="cancel"
                @click="closeBankList">取消</span>
          <span class="title">选择开户银行</span>
        </div>
        <div class="contentInfo">
          <ul class="infoLists"
              v-show=" bankList.lists != '' ">
            <li class="list"
                v-for="(item, index) in bankList.lists"
                :key="index"
                @click="selectStyle(index)" >
              <div class="listL">
                <img class="bankIcon"
                     :src=" item.bankIco"
                     alt="银行卡">
              </div>
              <div class="listC">
                <p class="listCtop fc-19191E">{{ item.bankName }} 尾号{{ item.tailNum }}</p>
                <p class="listCbottom fc-96969B">{{ item.limitDesc }}</p>
              </div>
              <div class="listR">
                <em :class="{'checkIcon': isActive == index }"></em>
              </div>
            </li>
          </ul>
          <div class="contentAdd">
            <div class="addWrapper">
              <div class="addL">
                <em class="addIcon"></em>
              </div>
              <div class="addC">
                <p class="fc-19191E"
                   @click="bindCard">添加新的银行卡</p>
              </div>
              <div class="addR">
                <em class="rightIcon"></em>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bankListWrapper"
         v-show="show"
         @touchstart="stopEvent"
         @touchmove="stopEvent"
         @touchend="stopEvent"
         @click.self=" show = false">
    </div>
  </div>
</template>

<script>

export default {
  props: {
    bankList: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      'show': false,
      'isActive': 0
    };
  },
  methods: {
    handleParentClick (e) {
      this.show = true;
    },
    closeBankList () {
      this.show = false;
    },
    selectStyle (a) {
      var _this = this;
      _this.isActive != a ? _this.isActive = a : _this.isActive = 0;
      _this.$store.commit('UPDATE_BANKCARDDETAIL', _this.bankList.lists[a]);
      this.show = false;
    },
    // 绑卡
    bindCard () {
      this.$router.push({path: '/openAccount/openAccountBindCard'});
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
        .title {

        }
      }
      .contentInfo {
        max-height: 10.5rem;
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
                // background-color: pink;
                border-radius: 50%;
                margin: auto;
                margin-right: .5rem;
              }
            }
            .listC {
              flex: 1;
              .listCtop {
                font-size: .75rem;
                line-height: .75rem;
                margin-bottom: .35rem;
              }
              .listCbottom {
                font-size: .6rem;
                line-height: .6rem;
              }
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
      .contentAdd {
        padding: 0 .75rem;
        .addWrapper {
          padding: 1rem 0 2rem;
          position: relative;
          display: flex;
          .addL {
            .addIcon {
              display: inline-block;
              width: 1.5rem;
              height: 1.5rem;
              background: url('../../img/add.png') no-repeat;
              background-size: contain;
              // border-radius: 50%;
              margin: auto;
              margin-right: .5rem;
            }
          }
          .addC {
            flex: 1;
            font-size: .75rem;
            line-height: 1.75rem;
          }
          .addR {
            margin: auto;
            .rightIcon {
              display: inline-block;
              width: 1rem;
              height: 1rem;
              background: url('../../img/link.png') no-repeat;
              background-size: contain;
            }
          }
        }
        .addWrapper::before {
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
