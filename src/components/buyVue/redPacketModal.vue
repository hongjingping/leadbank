<template>
  <div>
    <div class="redPacket"
         v-show="redPacket.flag == '1'">
      <div class="modalDialog">
        <div style="padding: 0 .7rem; background: #FFF; border-radius: 2px">
          <div class="modalDialogContent">
            <div class="modalHeader">
              <slot name="header">
                <p class="title fc-19191E">{{ redPacket.header }}</p>
              </slot>
            </div>
            <div class="modalContent fc-19191E">
              <div class="innerContent">
                <span class="innerLeft">购买金额:</span>
                <span class="innerRight fc-dc2828">{{ redPacket.purchase }}</span>
              </div>
              <div class="innerContent innerContentTwo">
                <span class="innerLeft">红包抵扣:</span>
                <span class="innerRight fc-dc2828">
                  <span class="innerRightTop"
                        :class="{'innerRightTop2': redPacket.textDeduction == null || redPacket.textDeduction == ''}">{{ redPacket.deduction }}</span><br>
                  <span class="innerRightBottom fc-3c3c00"
                        v-if="redPacket.textDeduction">({{ redPacket.textDeduction }})</span>
                </span>
              </div>
              <div class="innerContent">
                <span class="innerLeft">实付金额:</span>
                <span class="innerRight fc-dc2828">{{ redPacket.pocket }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modalDialogClose"
             @click="close">
          <em></em>
        </div>
      </div>
    </div>
    <div v-show="redPacket.flag == '1'"
         class="redPacketBackUp"></div>
  </div>
</template>

<script>
export default {
  props: {
    redPacket: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
    };
  },
  methods: {
    close () {
      this.redPacket.flag = '0';
    }
  }
};
</script>

<style lang="less" scoped>
  .redPacket {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    overflow: scroll;
    margin: 45% auto 0;
    .modalDialog {
      position: absolute;
      left: 10%;
      top: 0;
      right: 10%;
      margin: 0 auto;
      // background: #fff;
      text-align: center;
      .modalDialogContent {
        padding: 0 .75rem;
        .modalHeader {
          padding: 1rem 0;
          border-bottom: 1px solid #DCDCDC;
          .title {
            font-size: .9rem;
          }
        }
        .modalContent {
          padding: .375rem 0 .875rem;
           .innerContent {
              display: flex;
              font-size: .75rem;
              line-height: 2rem;
              .innerLeft {
                flex: 1;
                text-align: left;
              }
              .innerRight {
                flex: 1;
                text-align: right;
                .innerRightTop {
                  line-height: 1rem;
                }
                .innerRightTop2 {
                  line-height: 2rem;
                }
                .innerRightBottom {
                  line-height: 1rem;
                  color: #3C3C00;
                }
              }
          }
          .innerContentTwo {
            line-height: 1rem;
            .innerLeft {
              line-height: 2rem;
            }
          }
        }
      }
      .modalDialogClose {
          padding-top: 1.25rem;
          // background: rgba(0, 0, 0, 0.5);
          em {
            display: block;
            width: 1.75rem;
            height: 1.75rem;
            margin: 0 auto;
            background: url('../../img/deleteIcon.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }
    }
  }
  .redPacketBackUp {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
