<template>
  <div id="pieChart"
       ref="pieChart"></div>
</template>
<script>
import echarts from 'lib/echarts.min.js';
export default {
  name: 'PieChart',
  props: {
    pieChartTitleOptions: {
      type: Object,
      default () {
        return {};
      }
    },
    pieChartSeriesOptions: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      chartWrapper: '',
      option: {}
    };
  },
  watch: {
    pieChartSeriesOptions () {
      this.drawChart();
    }
  },
  mounted () {
    let _this = this;
    _this.chartWrapper = echarts.init(_this.$refs.pieChart);
    _this.drawChart();
  },
  methods: {
    drawChart () {
      let _this = this;

      _this.option = {
        title: {
          show: false,
          text: '默认title',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#333333',
            fontSize: '0.6rem'
          }
        },
        series: []
      };

      let seriesItem = {
        name: '饼图名称',
        type: 'pie',
        radius: [
          '50%', '100%'
        ],
        avoidLabelOverlap: false,
        hoverAnimation: false,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 20,
            name: '默认1',
            itemStyle: {
              normal: {
                color: 'rgba(220,40,40,.6)'
              }
            }
          },
          {
            value: 30,
            name: '默认2',
            itemStyle: {
              normal: {
                color: 'rgba(255,160,65,.6)'
              }
            }
          },
          {
            value: 50,
            name: '默认3',
            itemStyle: {
              normal: {
                color: 'rgba(50,150,255,.6)'
              }
            }
          }
        ],
        animation: false,
        silent: true
      };

      if (_this.pieChartTitleOptions) {
        _this.option.title = {..._this.option.title, ..._this.pieChartTitleOptions};
      }
      if (_this.pieChartSeriesOptions && _this.pieChartSeriesOptions.length > 0) {
        for (var i = 0; i < _this.pieChartSeriesOptions.length; i++) {
          _this.option.series[i] = {...seriesItem, ..._this.pieChartSeriesOptions[i]};
        }
      }
      _this.chartWrapper.setOption(_this.option);
      window.onresize = function () {
        _this.chartWrapper.resize();
      };
    }
  }
};
</script>
<style lang="less" scoped>
#pieChart {
  width: 100%;
  height: 100%
}
</style>
