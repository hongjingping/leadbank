<template>
  <div class="line-chart-box"
       id="valChart"
       style="height: 300px;width:100%"></div>
</template>

<script>
import echarts from 'lib/echarts.min.js';

export default {
  name: 'ValChart',
  components: {},
  props: {
    fundId: {
      type: String,
      required: true
    },
    chartData: {
      type: [
        Object, Array
      ],
      default: function () {
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
        this.drawActuTimeAssessChart(n);
      }
    }
  },
  mounted () {
    var self = this;
    setTimeout(function () {
      self.drawActuTimeAssessChart(self.chartData);
    }, 1000);
  },
  methods: {
    drawActuTimeAssessChart (data) {
      var self = this;
      let chartWrapper = echarts.init(document.getElementById('valChart'));
      if (data && data.count > 0) {
        chartWrapper.hideLoading();
        let chartData = this.getFormatteData(data);
        var myDate = new Date();
        var curDate = myDate.getMonth() + 1 + '-' + myDate.getDate();
        var option = {
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
              var html = curDate + ' ' + a[0].name;
              self.$emit('valChartTooltip', [
                a[0].data, a[1].data
              ]);
              return html;
            },
            position: 'top'
          },
          grid: {
            show: false,
            left: 0,
            top: 20,
            bottom: 20,
            right: 0,
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#dcdcdc'
              }
            },
            axisLabel: {
              color: '#96969b',
              fontSize: 10,
              margin: 10,
              interval: 59
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#dcdcdc'
              }
            },
            data: chartData.x
          }],
          yAxis: [
            {
              splitNumber: 4,
              axisLine: {
                lineStyle: {
                  width: 1,
                  color: '#dcdcdc'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: '#96969b',
                fontSize: 10,
                formatter: function (data) {
                  return parseFloat(data).toFixed(4);
                },
                verticalAlign: 'middle'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#dcdcdc'
                }
              },
              // data: chartData.y1,
              min: chartData.y1[0],
              max: chartData.y1[4]
            },
            {
              splitNumber: 4,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: function (val, i) {
                  return val >= 0 ? '#dc2828' : '#59b395';
                },
                fontSize: 10,
                formatter: function (data) {
                  return parseFloat(data).toFixed(2) + '%';
                },
                verticalAlign: 'middle'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#dcdcdc'
                }
              },
              // data: chartData.y2,
              min: chartData.y2[0],
              max: chartData.y2[4]
            }
          ],
          series: [
            {
              name: '净值估算',
              yAxisIndex: 0,
              type: 'line',
              symbol: 'circle',
              symbolSize: 4,
              smooth: true, // 折线平滑
              itemStyle: {
                normal: {
                  color: 'rgba(255,255,255,0)',
                  lineStyle: {color: '#f75553', width: 1}
                },
                emphasis: {
                  color: '#f74e4b',
                  borderWidth: 12,
                  borderColor: 'rgba(247,78,75,0.1)'
                }
              },
              data: chartData.data1
            },
            {
              name: '估算涨幅',
              yAxisIndex: 1,
              type: 'line',
              symbol: 'circle',
              symbolSize: 4,
              itemStyle: {
                normal: {
                  color: 'rgba(255,255,255,0)',
                  lineStyle: {color: '#f75553', width: 0}
                }
              },
              data: chartData.data2
            }
          ]
        };
        chartWrapper.setOption(option);
        // 显示 tooltip
        chartWrapper.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: chartData.data1.length - 1
        });
      } else {
        chartWrapper.showLoading({
          text: '暂无数据',
          effect: 'whirling',
          textStyle: {
            fontSize: 30
          }
        });
      }
    },
    // 格式化原始图表数据
    getFormatteData (data) {
      var self = this;
      if (data && data.count > 0) {
        if (Array.isArray(data.resultList)) {
          var obj = {
            x: self.getXAxisData(),
            y1: [
              data.fundUnvtBaseD,
              data.fundUnvtBaseC,
              data.fundUnvtBase,
              data.fundUnvtBaseB,
              data.fundUnvtBaseA
            ],
            y2: [
              data.estNavD, data.estNavC, 0, data.estNavB, data.estNavA
            ],
            // y1: [1.5050,1.5100,1.5150,1.5200,1.5250,1.5300],
            // y2: [-0.88,-0.49,0,],
            data1: [],
            data2: [],
            newestX: []
          };
          data.resultList.forEach(function (item, i) {
            obj.data1.push(item.estNav);
            obj.data2.push(item.estChangePct);
            if (i == data.resultList.length - 1) {
              obj.newestX.push(item.time);
            }
          });
          return obj;
        }
      }
    },
    // 获取X轴data
    getXAxisData () {
      var timeData = []; // 时间数据
      var pData = '';
      for (var i = 30; i < 60; i++) {
        pData = '09:' + i;
        timeData.push(pData);
      }
      for (var j = 0; j < 60; j++) {
        if (j < 10) {
          pData = '10:0' + j;
        } else {
          pData = '10:' + j;
        }
        timeData.push(pData);
      }
      for (var k = 0; k <= 30; k++) {
        if (k < 10) {
          pData = '11:0' + k;
        } else if (k >= 10 && k <= 29) {
          pData = '11:' + k;
        } else {
          pData = '11:30/13:00';
        }
        timeData.push(pData);
      }
      for (var l = 1; l < 60; l++) {
        if (l < 10) {
          pData = '13:0' + l;
        } else {
          pData = '13:' + l;
        }
        timeData.push(pData);
      }
      for (var m = 0; m < 60; m++) {
        if (m < 10) {
          pData = '14:0' + m;
        } else {
          pData = '14:' + m;
        }
        timeData.push(pData);
      }
      timeData.push('15:00');
      return timeData;
    }
  }
};
</script>
