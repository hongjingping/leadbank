<template>
  <div>
    <div class="redPacketList"
         v-show="show">
      <div class="content">
        <div class="contentTop bg-f0f0f0">
          <span class="cancel fc-19191E fs-30"
                @click="close">取消</span>
          <span class="title fc-19191E fs-36">选择红包</span>
          <span class="confirm fc-19191E fs-30"
                @click="noPacket">不使用</span>
        </div>
        <div class="contentBottom bg-ffffff">
          <ul class="listWrapper"
              v-show=" redPacketList.lists != '' ">
            <scroll :data="redPacketList.lists"
                    @pullingUp = "addList"
                    :loadMoreDataFlag = "redPacketList.noContent">
              <li class="list"
                  v-for="( item, index ) in redPacketList.lists"
                  :key="index"
                  @click="select(index, item.equityNo, item.flag, item.hint)">
                <div class="listL">
                  <em class="redPacketIcon">
                    <span class="numText">{{ item.equityAmount }}</span>
                  </em>
                  <p class="time fc-3c3c00">{{ item.days }}<span class="timeText">天后过期</span> </p>
                </div>
                <div class="listR">
                  <div class="content">
                    <p class="top fs-30 fc-19191E">{{ item.equityName }}</p>
                    <ul>
                      <li class="bottomList bottom fs-24 fc-96969B">{{ item.rules_1 }}</li>
                      <li class="bottomList fs-24 fc-96969B">{{ item.rules_2 }}</li>
                      <li class="bottomList fs-24 fc-96969B">{{ item.rules_3 }}</li>
                    </ul>
                  </div>
                </div>
                <em :class="{'checkIcon': isActive == item.equityNo }"></em>
              </li>
            </scroll>
          </ul>
        </div>
      </div>
    </div>
    <div class="redPacketListWrapper"
         v-show="show"
         @touchstart="stopEvent"
         @touchmove="stopEvent"
         @touchend="stopEvent"
         @click.self="show = false">
    </div>
  </div>
</template>

<script>
import scroll from 'components/subassembly/scroll.vue';
import {toast} from 'js/api.js';

export default {
  components: {
    'scroll': scroll
  },
  props: {
    redPacketList: {
      type: Object,
      default () {
        return {};
      }
    },
    equityNo: {
      type: [
        String, Number
      ],
      default () {
        return '';
      }
    }
  },
  data () {
    return {
      show: false,
      isActive: this.equityNo
    };
  },
  methods: {
    close () {
      this.show = false;
    },
    noPacket () {
      this.show = false;
      this.isActive = '';
      this.$store.commit('UPDATE_BUYSTATE', {
        stateName: 'redPacketDetail',
        data: {
          'equityAmount': '0.00',
          'equityNo': ''
        }
      });
    },
    handleParentClick (e) {
      this.show = true;
    },
    select (a, equityNo, flag, hint) {
      var _this = this;
      if (flag == '0') {
        toast(hint);
        return;
      }
      _this.isActive = equityNo;
      _this.$store.commit('UPDATE_BANKCARDDETAIL', _this.redPacketList.lists[a]);
      this.show = false;
    },
    addList () {
      this.$emit('addList');
    },
    stopEvent (event) {
      // 阻止事件穿透
      event.stopPropagation();
    }
  }
};
</script>

<style lang="less" scoped>
  .redPacketList {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    overflow: hidden;
    .content {
      .contentTop {
        display: flex;
        padding: .65rem .75rem;
        // margin-bottom: .25rem;
        .cancel {
          margin: auto;
          padding-right: 1rem;
        }
        .title {
          flex: 1;
          text-align: center;
        }
        .confirm {
          margin: auto;
          padding-left: 1rem;
        }
      }
      .contentBottom {
        padding: 0 .75rem;
        padding-bottom: 1rem;
        .listWrapper {
          height: 17rem;
          overflow: hidden;
          .list {
            position: relative;
            display: flex;
             padding: 1rem 0;
            .listL {
              margin-right: 1rem;
              .redPacketIcon {
                display: inline-block;
                width: 2.4rem;
                height: 2.75rem;
                background-image: url('../../img/redPacket.png');
                background-repeat: no-repeat;
                background-size: contain;
                display: flex;
                justify-content: center;
                .numText {
                  font-size: .9rem;
                  line-height: 2rem;
                  color: #FDFF81;
                  align-self: flex-end;
                }
              }

              .time {
                font-size: .5rem;
                line-height: .5rem;
                margin-top: .25rem;
                color: #DC2828;
              }
              .timeText {
                font-size: .5rem;
                line-height: .5rem;
                margin-top: .25rem;
                color: #96969B;
              }
            }
            .listR {
              flex: 1;
              .content {
                .top {
                }
                ul {
                  padding-left: .75rem;
                }
                .bottomList {
                  list-style-type: disc;
                }
                .bottom {
                  margin: .2rem 0;
                }
              }
            }
            .checkIcon {
              display: inline-block;
              width: 0.85rem;
              height: .85rem;
              background: url('../../img/selectIcon.png');
              background-repeat: no-repeat;
              background-size: contain;
              margin: auto;
            }
          }
          .list::before {
            position: absolute;
            content: " ";
            display: inline-block;
            width: 100%;
            height: 1px;
            right: 0;
            bottom: 0;
            background-color: #DCDCDC;
          }
        }

      }
    }
  }
  .redPacketListWrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
