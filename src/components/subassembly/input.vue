<template>
  <input :placeholder="inputMessage"
         :style="styleObj"
         v-model="currentValue"
         class="comIput"
         @input="$emit('input', $event.target.value)">
</template>

<script>
export default {
  props: {
    inputMessage: {
      type: [
        Object, String, Number, Array
      ],
      default: ''
    },
    styleObj: {
      type: Object,
      default: function () {
        return {};
      }
    },
    value: {
      type: String,
      default: function () {
        return '';
      }
    },
    inputType: {
      type: [
        Object, String, Number, Array
      ],
      default: ''
    }
  },
  data () {
    return {
      currentValue: ''
    };
  },
  watch: {
    currentValue (val) {
      if (this.inputType == 'number') {
        this.currentValue = val.replace(/[^0-9]/g, '');
      } else if (this.inputMessage == '设置交易密码') {
        this.currentValue = val.replace(/[^\w\.\/]/ig, '');
      } else if (this.inputType == 'name') {
        this.currentValue = val.replace(/^ +| +$/g, '');
      } else {
        this.currentValue = val;
      }
    }
  }
  // computed : {
  //   currentValue: {
  //       // 动态计算currentValue的值
  //       get:function() {
  //         if(this.inputType=='number'){
  //           return this.value.replace(/[^0-9]/g,'');
  //         }else if(this.inputMessage=='设置交易密码'){
  //           return this.value.replace(/[^0-9]/g,'');
  //         }else{
  //           return this.value;
  //         }// 将props中的value赋值给currentValue
  //       },
  //       set:function(val) {
  //         this.$emit('input', val); // 通过$emit触发父组件
  //       }
  //     },
  //     // styles (){
  //     //   let styles;
  //     //   if (this.styleObj) {
  //     //     styles = this.styleObj
  //     //   }else{
  //     //     styles = "";
  //     //   }
  //     //   return styles;
  //     // }
  // }
};
</script>

<style lang="less">
  input.comIput{
    width: 100%;
    height: 45/20rem;
    border: 1px solid #dcdcdc;
    padding-left: 1rem;
    line-height: 45/20rem;
    box-sizing: border-box;
    color: #19191E;
    border-radius: 2px;
    font-size: 15/20rem;
  }
  input.comIput::-webkit-input-placeholder{
    color:#96969B;
  }
  input.comIput:-moz-placeholder{
    color:#96969B;
  }
  input.comIput::-moz-placeholder{
    color:#96969B;
  }
  input.comIput:-ms-input-placeholder{
    color:#96969B;
  }
</style>
