<template>
  <div class="line-chart-box"
       id="lineChart">
  </div>
</template>

<script>
import echarts from 'lib/echarts.min.js';

export default {
  name: 'LineChart',
  components: {},
  props: {
    chartData: {
      type: [
        Object,
        Array,
        String,
        Number
      ],
      default () {
        return {};
      }
    }
  },
  data () {
    return {};
  },
  watch: {
    chartData: function (n, o) {
      if (n) {
        this.drawFundTraChart(n);
      }
    }
  },
  methods: {
    // 格式化原始图表数据
    getFormatteData (data) {
      var chartData = {x: [],
        y1: [],
        y2: []};
      for (var i = 0; i < data.fundTotalList.length; i++) {
        chartData.x.push(data.fundTotalList[i].datetime);
        chartData.y1.push(data.fundTotalList[i].totalyield);
        chartData.y2.push(
          data.hsList[i]
            ? data.hsList[i].totalyield
            : ''
        );
      }
      return chartData;
    },
    drawFundTraChart (d) {
      var self = this;
      var data = self.getFormatteData(d);
      let chartWrapper = echarts.init(document.getElementById('lineChart'));
      let chartOption1 = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#eb9191',
          borderWidth: 0,
          padding: [
            4, 7
          ],
          textStyle: {color: '#fff', fontSize: 12},
          axisPointer: {
            type: 'line',
            lineStyle: {color: '#ffbe8c', width: 1, type: 'solid'}
          },
          formatter: function (a) {
            self.$emit('rateChartTooltip', [
              a[0].data, a[1].data
            ]);
            return a[0].axisValue;
          }
        },
        grid: {
          show: false,
          left: 0,
          top: 20,
          bottom: 20,
          right: 5,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitNumber: 3,
          boundaryGap: false,
          axisTick: false,
          data: data.x,
          axisLine: {show: false},
          axisLabel: {
            textStyle: {color: '#aaa', fontSize: 13},
            margin: 20,
            interval: 'auto'
          },
          splitLine: {show: false}
        },
        yAxis: [{
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {color: '#f0f0f0', width: 1, type: 'solid'}
          },
          axisLabel: {
            textStyle: {
              color: '#aaa',
              fontSize: 13
            },
            formatter: function (value, index) {
              return value.toFixed(2) + '%';
            }
          },
          splitLine: {lineStyle: {color: '#dcdcdc', width: 1, type: 'solid'}},
          axisTick: {
            show: false
          },
          max (val) {
            return (val.max) * 1.2;
          }
        }],
        series: [
          {
            name: '期间收益率',
            type: 'line',
            symbol: '',
            symbolSize: 5,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#dc2828',
                lineStyle: {color: '#dc2828', width: 1}
              },
              emphasis: {
                color: '#dc2828',
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            data: data.y1 // 期间收益率
          },
          {
            name: '沪深300',
            type: 'line',
            symbol: '',
            symbolSize: 5,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#84c0ff',
                lineStyle: {color: '#64a9e2', width: 1}
              },
              emphasis: {
                color: '#84c0ff',
                borderWidth: 1,
                borderColor: '#fff'
              }
            },
            data: data.y2 // 沪深300
          }
        ]
      };
      if (data.y1.length && data.y2.length) {
        chartWrapper.setOption(chartOption1);
        chartWrapper.hideLoading();
      } else {
        chartWrapper.showLoading({
          text: '暂无数据',
          effect: 'whirling',
          textStyle: {
            fontSize: 30
          }
        });
      }
      // 显示 tooltip
      chartWrapper.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: data.y1.length - 1
      });
    }
  }
};
</script>
<style lang="less" scoped>
  .line-chart-box {
    box-sizing: border-box;
    width: 100%;
    height: 300/20rem;
    overflow: hidden;
  }
</style>
