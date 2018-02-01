<template>
  <div>
    <div class="modal"
         v-show="modal.modalShow"
         transition="fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <!--头部-->
          <div class="modal-header"
               v-if="modal.title != '' ">
            <slot name="header">
              <p class="title">{{ modal.title }}</p>
            </slot>
          </div>
          <div class="space"
               v-if="modal.title == '' " ></div>
          <!--内容区域-->
          <slot name="body"></slot>
          <!--尾部,操作按钮-->
          <slot name="button"></slot>
        </div>
      </div>
    </div>
    <div v-show="modal.modalShow"
         class="modal-backup"
         transition="fade"></div>
  </div>
</template>

<script>
export default {
  props: {
    modalOptions: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data: function () {
    return {

    };
  },
  computed: {
    modal () {
      return this.$store.getters.modal;
    }
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
  .modal {
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
      .modal-dialog {
          position: absolute;
          left: 10%;
          top: 0;
          right: 10%;
          margin: 0 auto;
          background: #fff;
          text-align: center;
          border-radius: 2px;
          .modal-header {
            height: 3.4rem;
            line-height: 3.4rem;
            font-size: .9rem;
            color: #19191E;
          }
          .space {
            height: 1.25rem;
          }
          .modal-body {
            padding: 0 2.4rem;
            line-height: .75rem;
            font-size: .75rem;
            color: #19191E;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid #DCDCDC;
          }
          .modal-footer {
            height: 2.75rem;
            line-height: 2.75rem;
            font-size: .75rem;
            color: #19191E;
            display: flex;
            .button {
              flex: 1;
            }
            .buttonLeft {
              position: relative;
            }
            .buttonLeft::before {
                position: absolute;
                content: " ";
                display: inline-block;
                width: 1px;
                height: 100%;
                right: 0;
                top: 0;
                background-color: #DCDCDC;
              }
          }
          .btn-default {
            color: #19191E;
          }
          .btn-active {
            color: #DC2828;
          }
      }
  }
  .modal-backup {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.5);
  }
</style>
