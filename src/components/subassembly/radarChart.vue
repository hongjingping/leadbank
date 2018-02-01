<template>
  <div class="radar-box"
       id="radarChart"
       ref="chartWrapper">
  </div>
</template>

<script>
import echarts from 'lib/echarts.min.js';
export default {
  name: 'RadarChart',
  components: {},
  props: {
    fundContainer: {
      type: [
        Object,
        Array
      ],
      default () {
        return {};
      }
    }
  },
  data () {
    return {
    };
  },
  watch: {
    fundContainer () {
      this.chartShow();
    }
  },
  mounted () {
    if (this.fundContainer && this.fundContainer.length > 0) {
      this.chartShow();
    }
  },
  methods: {
    chartShow () {
      let self = this;
      let length = self.fundContainer.length;
      let radarChartDarw = echarts.init(self.$refs.chartWrapper);
      let option = {
        title: {
          text: self.fundContainer[length - 1],
          left: 'center',
          top: '45%',
          textStyle: {
            color: '#fff',
            fontWeight: 'bolder',
            fontSize: 22
          }
        },
        radar: [{
          center: [
            '50%', '55%'
          ],
          radius: '65.7%',
          indicator: (function () {
            var res = [];
            for (var i = 0; i < self.fundContainer[0][0].length; i++) {
              if (self.fundContainer[0][0][i] == '' || self.fundContainer[0][0][i] == 'undefined' || self.fundContainer[0][0][i] == undefined) {
                self.fundContainer[0][0][i] = '--';
              } else {
                self.fundContainer[0][0][i] = self.fundContainer[0][0][i];
              }
              res.push({text: self.fundContainer[0][1][i] + '\n' + self.fundContainer[0][0][i], max: 100});
            }
            return res;
          })(),
          name: {
            color: '#fff',
            formatter: '{a|{value}}',
            rich: {
              a: {
                align: 'center',
                padding: [
                  1, 7, 1, 8
                ]
              }
            }
          },
          nameGap: 5,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          splitArea: {
            areaStyle: {
              color: 'rgba(255,255,255,0)'
            }
          }
        }],
        series: [{
          name: '图表',
          type: 'radar',
          lineStyle: {
            normal: {
              width: 0
            }
          },
          label: {
            show: true
          },
          symbolSize: 0,
          data: [
            {
              value: this.fundContainer[0][0],
              name: '本基金',
              areaStyle: {
                normal: {
                  color: 'rgba(79, 247, 255, 0.7)'
                }
              }
            },
            {
              value: this.fundContainer[1][0],
              name: '同类型基金',
              areaStyle: {
                normal: {
                  color: 'rgba(255, 255, 255, 0.4)'
                }
              }
            }
          ]
        }]
      };
      radarChartDarw.setOption(option);
      window.onresize = function () {
        radarChartDarw.resize();
      };
    }
  }
};
</script>
<style lang="less" scoped>
.radar-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
