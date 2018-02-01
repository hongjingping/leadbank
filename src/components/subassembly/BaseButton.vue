<template>
  <div id="baseButton">
    <button class="button"
            :style="styles"
            :disabled="disabled">
      <slot></slot>
    </button>
  </div>
</template>
<script>
// 基础按钮组件
export default{
  name: 'BaseButton',
  props: {
    styleObj: {
      type: Object,
      default: function () {
        return {};
      },
      required: false
    },
    disabled: {
      type: [
        Number, Boolean
      ],
      required: false,
      default: false
    }
  },
  computed: {
    styles () {
      let styles;
      if (this.styleObj) {
        styles = this.styleObj;
      } else {
        styles = '';
      }
      return styles;
    }
  }
};
</script>
<style scoped>
  #baseButton {
    width: 100%;
    height: 100%;
  }
  .button {
    display: inline-block;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    border: none;
    border-radius: 2px;
    font-size: .9rem;
    letter-spacing: 0;
    background-color: #DCDCDC;
    color: #000;
  }
</style>
