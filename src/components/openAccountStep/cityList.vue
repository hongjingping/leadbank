<template>
  <div>
    <input id="nowValue"
           type="text"
           readonly
           placeholder="选择办卡城市"
           class="comIput" >
    <input id="nowCode"
           type="hidden"
           class="comIput" >
    <span class="nameDown"
          @click="picker"></span>
  </div>
</template>
<script>
import 'css/picker.css';
import 'lib/picker.js';
import {cityList} from 'js/request.js';
export default {
  data () {
    return {
      provs: []
    };
  },
  mounted () {
    this.getCityList();
  },
  methods: {
    getCityList () {
      let self = this;
      cityList().then(function (resp) {
        let list = resp.data.data.list;
        for (let i in list) {
          for (let j in list[i]) {
            let cityName = JSON.parse(j);
            cityName.level = list[i][j];
            self.provs = self.provs.concat(cityName);
          }
        }
      });
    },
    picker () {
      let self = this;
      let nowValue = document.getElementById('nowValue');
      let nowCode = document.getElementById('nowCode');
      new window.Area({
        'title': '选择办卡城市', // 标题(可选)
        'defaultValue': nowValue.value, // 默认值-多个以空格分开（可选）
        'type': 2, // 需要联动级数[1、2、3]（可选）
        'data': self.provs, // 数据(必传)
        'keys': {
          'id': 'areaCode',
          'value': 'areaName',
          'childData': 'level'// 最多3级联动
        }, // 数组内的键名称(必传，id、text、data)
        'callBack': function (val, code) {
          // 回调函数（val为选择的值）
          nowValue.value = val;
          nowCode.value = code;
          self.$emit('input', val);
        }
      });
    }
  }
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
