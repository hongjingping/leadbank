<template>
  <div class="diagnosisDetail"
       id="diagnosisDetail">
    <scroll :isNeedLoading="0"
            :data="fundCont">
      <div class="diagnosisDetail-content-wrapper">
        <!-- 装饰层 -->
        <div class="decorate-bg"></div>
        <!-- 装饰层end -->
        <!-- 基金信息 -->
        <div class="content1-wrapper">
          <div class="fundname-part"
               @click="toFundDetails(fundCont.fundCode)">
            <p>{{ fundCont.fundName }}</p>
            <p>{{ fundCont.fundCode }}</p>
          </div>
        </div>
        <!-- 基金信息end -->
        <!-- 诊断报告 -->
        <div class="content2-wrapper">
          <div class="report-part infor-common-wrapper">
            <div class="report-title infor-common-title">
              诊断报告
            </div>
            <div class="report-content infor-common-cotent">
              <template v-if="fundCont.diagnoseSummary">
                <div class="report-explain">
                  {{ fundCont.diagnoseSummary }}
                </div>
              </template>
              <template v-else>
                <div class="report-explain">基金成立时间太短，暂时没有评分</div>
              </template>
              <div class="radarChart-part">
                <div class="sQuestion"
                     @click="showBoxs(1)"></div>
                <div class="radar-chart-wrapper">
                  <radarChart :fundContainer="fundScoreBean" />
                </div>
                <ul>
                  <li>本基金</li>
                  <li>同类基金</li>
                </ul>
              </div>
              <div class="defeat-text fs-30">
                <p>打败了
                  <span class="fc-00fdff"
                        v-if="fundCont.beatFundRate">{{ fundCont.beatFundRate }}%</span>
                  <span v-else
                        class="fc-00fdff">--</span>
                  的同类基金
                </p>
                <p><span class="gradual-line left-right"></span><span class="gradual-line right-left"></span></p>
              </div>
            </div>
            <div class="report-bottom infor-common-bottom"></div>
          </div>
        </div>
        <!-- 诊断报告end -->
        <!-- 基金经理 -->
        <div class="content3-wrapper">
          <div class="infor-common-wrapper">
            <div class="infor-common-title">
              基金经理
            </div>
            <div class="infor-common-cotent manger-msg-wrapper"
                 v-for="(item,index) in fundCont.fundManagerBeanList"
                 :key="index">
              <div class="manger-msg-left">
                <div class="manger-header-pic">
                  <img :src="item.managerPhoto"
                       alt="基金经理"
                       v-if="item.managerPhoto"
                       :onerror="defaultMangerImg">
                  <!-- 没有基金经理头像 展示默认头像 -->
                  <img src="../img/fundmanager.png"
                       alt="基金经理"
                       v-else>
                </div>
                <div class="manger-msg">
                  <template v-if="item.managerName">
                    <p>{{ item.managerName }}</p>
                  </template>
                  <template v-else>
                    <p>--</p>
                  </template>
                  <p>
                    <span>任期回报率：</span>
                    <span class="rate-return"
                          :class="{'color-green': parseFloat(item.officeRepay)<0}"
                          v-if="item.officeRepay">
                      {{ item.officeRepay }}%
                    </span>
                    <span class="rate-return"
                          v-else>--</span>
                  </p>
                </div>
              </div>
              <div class="manger-rate">
                <div>
                  <img src="../img/diagnosis/star5.png"
                       v-if="item.managerScore=='5'">
                  <img src="../img/diagnosis/star1.png"
                       v-else-if="item.managerScore=='1'">
                  <img src="../img/diagnosis/star2.png"
                       v-else-if="item.managerScore=='2'">
                  <img src="../img/diagnosis/star3.png"
                       v-else-if="item.managerScore=='3'">
                  <img src="../img/diagnosis/star4.png"
                       v-else-if="item.managerScore=='4'">
                  <img src="../img/diagnosis/star0.png"
                       v-else>
                </div>
              </div>
            </div>
            <div class="infor-common-bottom"></div>
          </div>
        </div>
        <!-- 基金经理end -->
        <!-- 盈利能力 -->
        <div class="content4-wrapper">
          <div class="infor-common-wrapper">
            <div class="infor-common-title">
              盈利潜力
            </div>
            <div class="infor-common-cotent profit-wrapper">
              <div class="profit-explain">统计近一年内任意交易日买入并持有该基金到指定时长的盈利、亏损情况</div>
              <!-- 盈利亏损概率 -->
              <div class="profit-probability">
                <div class="probability-win">
                  <p class="gradual-line right-left"></p>
                  <p class="probability-value align-left">
                    盈利概率：
                    <span class="fc-ff5254"
                          v-if="parseFloat(pieChartData.profitabilityProb) || parseFloat(pieChartData.profitabilityProb) == 0">
                      {{ pieChartData.profitabilityProb }}%
                    </span>
                    <span class="fc-ff5254"
                          v-else>--</span>
                  </p>
                  <p class="gradual-line right-left"></p>
                </div>
                <div class="probability-loss">
                  <p class="gradual-line left-right"></p>
                  <p class="probability-value align-right">
                    亏损概率：
                    <span class="fc-00fdff"
                          v-if="parseFloat(pieChartData.deficitProb) || parseFloat(pieChartData.deficitProb) == 0">{{ pieChartData.deficitProb }}%</span>
                    <span class="fc-00fdff"
                          v-else>--</span>
                  </p>
                  <p class="gradual-line left-right"></p>
                </div>
              </div>
              <!-- 盈利亏损概率end -->
              <!-- 环形图表 -->
              <div class="pie-chart-wrapper">
                <div class="pie-chart-left">
                  <div>
                    <p><span class="bg-ffbebe"></span><span :class="{'lower-twelve-px' : lowerTwelve}">盈利0%-5%</span></p>
                    <p v-if="parseFloat(pieChartData.profitabilityLow) || parseFloat(pieChartData.profitabilityLow) >= 0">{{ pieChartData.profitabilityLow }}%</p>
                    <p v-else>--</p>
                  </div>
                  <div>
                    <p><span class="bg-ff7878"></span><span :class="{'lower-twelve-px' : lowerTwelve}">盈利5%-10%</span></p>
                    <p v-if="parseFloat(pieChartData.profitabilityMid) || parseFloat(pieChartData.profitabilityMid) >= 0">{{ pieChartData.profitabilityMid }}%</p>
                    <p v-else>--</p>
                  </div>
                  <div>
                    <p><span class="bg-ff5353"></span><span :class="{'lower-twelve-px' : lowerTwelve}">盈利10%以上</span></p>
                    <p v-if="parseFloat(pieChartData.profitabilityHig) || parseFloat(pieChartData.profitabilityHig) >= 0">{{ pieChartData.profitabilityHig }}%</p>
                    <p v-else>--</p>
                  </div>
                </div>
                <div class="pie-chart"><pieChart :pieChartSeriesOptions="pieChartSeriesOptions"/></div>
                <div class="pie-chart-right">
                  <div>
                    <p><span class="bg-c1f8ff"></span><span :class="{'lower-twelve-px' : lowerTwelve}">亏损0%-5%</span></p>
                    <p v-if="parseFloat(pieChartData.deficitLow) || parseFloat(pieChartData.deficitLow) >= 0">{{ pieChartData.deficitLow }}%</p>
                    <p v-else>--</p>
                  </div>
                  <div>
                    <p><span class="bg-70efff"></span><span :class="{'lower-twelve-px' : lowerTwelve}">亏损5%-10%</span></p>
                    <p v-if="parseFloat(pieChartData.deficitMid) || parseFloat(pieChartData.deficitMid) >= 0">{{ pieChartData.deficitMid }}%</p>
                    <p v-else>--</p>
                  </div>
                  <div>
                    <p><span class="bg-08d2eb"></span><span :class="{'lower-twelve-px' : lowerTwelve}">亏损10%以上</span></p>
                    <p v-if="parseFloat(pieChartData.deficitHig) || parseFloat(pieChartData.deficitHig) >= 0">{{ pieChartData.deficitHig }}%</p>
                    <p v-else>--</p>
                  </div>
                </div>
              </div>
              <!-- 环形图表end -->
              <!-- 持有时间tab -->
              <div class="holdtime-tab-wrapper">
                <span :class="{'active' : pieChartId == 14}"
                      @click="changePieChart(14)">持有14天</span>
                <span :class="{'active' : pieChartId == 30}"
                      @click="changePieChart(30)">持有30天</span>
                <span :class="{'active' : pieChartId == 60}"
                      @click="changePieChart(60)">持有60天</span>
                <span :class="{'active' : pieChartId == 90}"
                      @click="changePieChart(90)">持有90天</span>
              </div>
              <!-- 持有时间tab end -->
            </div>
            <div class="infor-common-bottom"></div>
          </div>
        </div>
        <!-- 盈利能力end -->
        <!-- 诊断日期 -->
        <div class="diagnosis-date">(诊断日期：{{ diagnoseDate }})</div>
        <!-- 诊断日期end -->
      </div>
    </scroll>
    <!-- 底部按钮 -->
    <div class="button-wrapper">
      <template v-if="showButton">
        <div class="button-type1"
             v-if="fundCont.buyStatus=='1'"
             @click="toBuy">购买</div>
        <div class="button-type1 notBuy"
             v-else>暂不开放</div>
      </template>
      <template v-else>
        <div class="button-type2">
          <span class="button-to-list"
                @click="targetRanking(fundCont.fundType)">看看同类好基</span>
          <span class="button-buy"
                v-if="fundCont.buyStatus=='1'"
                @click="toBuy">购买</span>
          <span class="button-buy notBuy"
                v-else>暂不开放</span>
        </div>
      </template>
    </div>
    <!-- 底部按钮end -->
    <!-- 什么是基金诊断弹框 -->
    <explainModel :explainModelShow="showBox"
                  :listenCloseModel="1"
                  @closeModel="showBoxs(0)"
                  :items="boxCont"/>
                  <!-- 什么是基金诊断弹框end -->
  </div>
</template>

<script>
import scroll from 'components/subassembly/scroll.vue';
import radarChart from 'components/subassembly/radarChart.vue';
import explainModel from 'components/diagnosis/diagnosisExplainModel.vue';
import pieChart from 'components/subassembly/pieChart.vue';
import {toast} from 'js/api.js';
import {diagnosisDetail, checkLoginState} from 'js/request.js';

export default {
  name: 'DiagnosisDetail',
  beforeRouteEnter (to, from, next) {
    // 路由拦截设置 app中进入页面前设置右上角分享按钮
    if (window.isApp) {
      let shareId = 'APP_JJZD_0118';
      window.mutual.isOpenShare(shareId, {
        url: window.location.href.replace(window.location.hash, '') + '#/fundConsultingRoom?fundId=' + to.query.fundId
      });
    }
    next();
  },
  // 路由拦截设置 app中离开页面前清空右上角按钮
  beforeRouteLeave (to, from, next) {
    if (window.isApp) {
      window.mutual.setNavRight({
        text: ''
      });
    }
    next();
  },
  components: {
    scroll,
    radarChart,
    explainModel,
    pieChart
  },
  data () {
    return {
      lowerTwelve: 0,
      pieChartSeriesOptions: [],
      pieChartId: 14,
      pieChartData: {},
      fundCont: '',
      showButton: 0,
      fundScoreBean: [],
      diagnoseDate: '',
      showBox: 0,
      boxCont: [],
      defaultMangerImg: 'this.src = "' + require('../img/fundmanager.png') + '";this.onerror = null;'
    };
  },
  mounted () {
    this.saveVertical();
    this.fundDetails();
  },
  methods: {
    // 判断是什么类型基金
    showType (codeType) {
      let self = this;
      let fundCore = self.fundCont[codeType];
      let type = self.fundCont.fundType;
      let dateList = [];
      if (type == '10000-01') { // 股票
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore,
            fundCore.marketTimingScore,
            fundCore.stockSelectionScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比',
            '择时能力',
            '选股能力'
          ]
        ];
      } else if (type == '10000-02') { // 被动指数型（偏股型）
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.excessProfitabilityScore,
            fundCore.trackingAbilityScore
          ],
          [
            '产品优势',
            '超额收益',
            '跟踪能力'
          ]
        ];
      } else if (type == '10000-03') { // QDII
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比'
          ]
        ];
      } else if (type == '10000-04') { // 混合型（除偏债型）
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore,
            fundCore.marketTimingScore,
            fundCore.stockSelectionScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比',
            '择时能力',
            '选股能力'
          ]
        ];
      } else if (type == '10000-05') { // 混合型（偏债型）
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比'
          ]
        ];
      } else if (type == '10000-06') { // 货币型
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore,
            fundCore.stabilityScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比',
            '稳定性'
          ]
        ];
      } else if (type == '10000-07') { // 另类
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比'
          ]
        ];
      } else if (type == '10000-08') { // 债券型
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比'
          ]
        ];
      } else if (type == '10000-09') { // 被动指数型（偏债型）
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.excessProfitabilityScore,
            fundCore.trackingAbilityScore
          ],
          [
            '产品优势',
            '超额收益',
            '跟踪能力'
          ]
        ];
      } else {
        dateList = [
          [
            fundCore.fundAdvantageScore,
            fundCore.profitabilityScore,
            fundCore.returnRiskScore,
            fundCore.marketTimingScore,
            fundCore.stockSelectionScore
          ],
          [
            '产品优势',
            '盈利能力',
            '风险收益比',
            '择时能力',
            '选股能力'
          ]
        ];
      }
      return dateList;
    },
    // 详情页面基本数据
    fundDetails () {
      let self = this;
      let fundId = self.$router.currentRoute.query.fundId;
      diagnosisDetail('', fundId).then(function (resp) {
        // 计算数据获取日期
        self.diagnoseDate = self.getDiagnoseDate(resp.headers.date);

        if (resp.data.respCode == '000') {
          self.fundCont = resp.data.data;
          // 画出盈利饼图
          self.changePieChart(14);
          // 判断底部有几个按钮
          if (+resp.data.data.beatFundRate > 50) {
            self.showButton = true;
          } else {
            self.showButton = false;
          }
          self.fundScoreBean.push(self.showType('fundScoreBean'));
          self.fundScoreBean.push(self.showType('sameFundScoreBean'));
          self.fundScoreBean.push(self.fundCont.fundScore);
          self.boxCont = self.fundScoreBean[0][1];
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 跳转基金详情
    toFundDetails (id) {
      if (window.isApp) {
        window.mutual.openURL('leadbank://page.ld/product.fund?id=' + id);
      } else {
        this.$router.push({path: 'productDetails', query: {fundId: id}});
      }
    },
    // 改变基金持有天数查看盈利能力图表
    changePieChart (time) {
      let _this = this;
      _this.pieChartId = time;

      let pieChartData;
      switch (time) {
      case 14 :
        pieChartData = _this.fundCont.fourteenProfitabilityBean;
        break;
      case 30 :
        pieChartData = _this.fundCont.thirtyProfitabilityBean;
        break;
      case 60 :
        pieChartData = _this.fundCont.sixtyProfitabilityBean;
        break;
      case 90 :
        pieChartData = _this.fundCont.ninetyProfitabilityBean;
        break;
      default :
        pieChartData = _this.fundCont.fourteenProfitabilityBean;
        break;
      }

      _this.pieChartData = pieChartData;
      _this.$set(_this.pieChartSeriesOptions, 0, {
        name: '盈利能力',
        data: [
          {
            value: parseFloat(pieChartData.deficitLow),
            name: '亏损0%-5%',
            itemStyle: {
              normal: {
                color: '#c1f8ff'
              }
            }
          },
          {
            value: parseFloat(pieChartData.deficitMid),
            name: '亏损5%-10%',
            itemStyle: {
              normal: {
                color: '#70efff'
              }
            }
          },
          {
            value: parseFloat(pieChartData.deficitHig),
            name: '亏损10%以上',
            itemStyle: {
              normal: {
                color: '#08d2eb'
              }
            }
          },
          {
            value: parseFloat(pieChartData.profitabilityHig),
            name: '盈利10%以上',
            itemStyle: {
              normal: {
                color: '#ff5353'
              }
            }
          },
          {
            value: parseFloat(pieChartData.profitabilityMid),
            name: '盈利5%-10%',
            itemStyle: {
              normal: {
                color: '#ff7878'
              }
            }
          },
          {
            value: parseFloat(pieChartData.profitabilityLow),
            name: '盈利0%-5%',
            itemStyle: {
              normal: {
                color: '#ffbebe'
              }
            }
          }
        ]
      });
    },
    // 诊断日期
    getDiagnoseDate (date) {
      let getDataDate = date ? new Date(date) : new Date();
      let diagnoseDate = '';
      diagnoseDate = diagnoseDate + getDataDate.getFullYear();
      diagnoseDate = diagnoseDate + '-' + (getDataDate.getMonth() + 1 < 10 ? '0' + (getDataDate.getMonth() + 1) : getDataDate.getMonth() + 1);
      diagnoseDate = diagnoseDate + '-' + (getDataDate.getDate() < 10 ? '0' + getDataDate.getDate() : getDataDate.getDate());

      return diagnoseDate;
    },
    // 去购买
    toBuy () {
      let _this = this;
      if (window.isApp) {
        let isOpenLogin = 0;
        // 获取token的回调
        window.mutual.getJsontext = function (jsontext) {
          if (jsontext.callbackName == 'account.login.status.get.resp') {
            let token = jsontext.parameter.token;
            let ranking = jsontext.parameter.memberId;
            // app 未登录
            if (token === null || token == '' || token == "''" || token == 'null' || typeof token === 'undefined') {
              isOpenLogin = 1;
              window.mutual.openLogin();
            } else {
              // 已登录
              window.localStorage.setItem('CUSTID', ranking);
              window.localStorage.setItem('TOKEN', token);
              if (!isOpenLogin) {
                window.mutual.openURL('leadbank://page.ld/product.fund.buy?id=' + _this.fundCont.fundCode);
              } else {
                isOpenLogin = 1;
              }
            }
          }
        };
        window.mutual.getToken();
      } else {
        /** 判断是否登录 未登录跳转登录 已登录跳转基金购买页 */
        checkLoginState({
          backHtml: window.location.href
        }).then(function (resp) {
          if (resp.data.userState == '1') {
            // 登录
            sessionStorage.setItem('FUNDID', _this.fundId);
            sessionStorage.setItem('FUNDTYPE', _this.fundType);
            _this.$router.push({path: 'buyFund', query: {fundId: _this.fundCont.fundCode}});
          } else if (resp.data.userState != '1') {
            // 未登录
            _this.$router.push({path: 'login'});
          }
        });
      }
    },
    // 解决安卓机中文字大小小于12px时产生的垂直居中误差
    saveVertical () {
      if (document.body.clientWidth < 500 && window.isAndroid) {
        this.lowerTwelve = 1;
      } else {
        this.lowerTwelve = 0;
      }
    },
    // 跳转排行榜
    targetRanking (codeType) {
      this.$router.push({path: 'fundRanking', query: {fundType: codeType}});
    },
    // 显示弹框
    showBoxs (id) {
      this.showBox = id;
    }
  }
};
</script>

<style lang="less" scoped>
  .diagnosisDetail {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 28/40rem;
    color: #fff;
    overflow: hidden;
    .diagnosisDetail-content-wrapper {
      padding-bottom: 120/40rem;
      position: relative;
      width: 100%;
      min-height: 100%;
      background-image: url("../img/diagnosis/fund-diagnose-bg.jpg");
      background-size: 100% auto;
      background-repeat: repeat-y;
      .decorate-bg {
        position: absolute;
        right: 0;
        top: 116/40rem;
        width: 105/40rem;
        height: 461/40rem;
        background-image: url("../img/diagnosis/decorate-bg1.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .content1-wrapper {
        padding-top: 46/40rem;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 224/40rem;
        background-image: url("../img/diagnosis/decorate-line1.png");
        background-size: auto 220/40rem;
        background-repeat: no-repeat;
        background-position: 25/40rem 4/40rem;
        .fundname-part {
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 650/40rem;
          height: 125/40rem;
          font-size: 28/40rem;
          color: #fff;
          text-align: center;
          background-image: url("../img/diagnosis/fund-name-bg.png");
          background-size: 100% auto;
          background-repeat: no-repeat;
        }
        .fundname-part:after {
          content: "";
          display: block;
          position: absolute;
          right: 38/40rem;
          top: 50%;
          transform: translateY(-50%);
          width: 21/40rem;
          height: 41/40rem;
          background-image: url("../img/diagnosis/triangle.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
      .content2-wrapper {
        margin-top: -15/40rem;
        width: 100%;
        background-image: url("../img/diagnosis/decorate-bg2.png");
        background-size: 107/40rem auto;
        background-repeat: no-repeat;
        background-position: 0 81/40rem;
        .report-part {
          font-size: 30/40rem;
          color: #fff;
          .report-content {
            padding-top: 28/40rem;
            padding-bottom: 48/40rem;
          }
          .report-explain {
            box-sizing: border-box;
            margin: 0 auto;
            padding: 21/40rem 32/40rem;
            width: 572/40rem;
            background-image: url("../img/diagnosis/report-bg.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
          .radarChart-part {
            width: 80%;
            margin: 0 auto;
            margin-top: 40/40rem;
            margin-bottom: 70/40rem;
            position: relative;
            .sQuestion{
              width: 0.8rem;
              height: 0.8rem;
              background: url('../img/diagnosis/mark-ico.png') no-repeat;
              background-size: 100% 100%;
              display: block;
              position: absolute;
              right: -0.6rem;
            }
            .radar-chart-wrapper {
              width: 100%;
              height: 325/40rem;
            }
            ul{
              padding-top: 1rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.525rem;
              li{
                background: url('../img/diagnosis/circle-2adef2-ico.png') left no-repeat;
                background-size: 0.5rem 0.5rem;
                padding-left: 0.75rem;
              }
              li:last-child{
                background: url('../img/diagnosis/circle-6e828f-ico.png') left no-repeat;
                background-size: 0.5rem 0.5rem;
                margin-left: 1.5rem;
              }
            }
          }
          .defeat-text {
            p {
              text-align: center;
            }
            p>span.gradual-line {
              display: inline-block;
            }
            p:last-child {
              margin-top: 18/40rem;
              font-size: 0;
            }
          }
        }
      }
      .content3-wrapper {
        margin-top: 40/40rem;
        padding-bottom: 40/40rem;
        width: 100%;
        min-height: 221/40rem;
        background-image: url("../img/diagnosis/decorate-line1.png");
        background-position: 25/40rem bottom;
        background-repeat: no-repeat;
        background-size: auto 220/40rem;
        .manger-msg-wrapper {
          box-sizing: border-box;
          padding: 0 30/40rem;
          padding-top: 25/40rem;
          padding-bottom: 36/40rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          overflow: hidden;
          .manger-msg-left  {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
          .manger-header-pic {
            margin-right: 30/40rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 110/40rem;
            height: 110/40rem;
            background-image: url("../img/diagnosis/manager-header-bg.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            img {
                display: block;
                margin: 0;
                width: 88/40rem;
                height: 88/40rem;
                border: 1px solid #4ef7fe;
                border-radius: 50%;
            }
          }
          .manger-msg {
            font-size: 30/40rem;
            color: #fefefe;
            .rate-return {
              color: #ff5251;
            }
            .color-green{
              color: #00fdff;
            }
            p:first-child {
              margin-bottom: 26/40rem;
            }
          }
          .manger-msg>p:last-child {
            font-size: 22/40rem;
          }
          .manger-rate {
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              display: block;
              height: 22/40rem;
            }
          }
        }
      }
      .content4-wrapper {
        margin-top: 3/40rem;
        width: 100%;
        background-image: url("../img/diagnosis/decorate-line2.png");
        background-repeat: no-repeat;
        background-size: auto 230/40rem;
        background-position: 25/40rem 11/40rem;
        .profit-wrapper {
          padding: 0 30/40rem;
          padding-bottom: 48/40rem;
          padding-top: 32/40rem;
          font-size: 22/40rem;
          color: #dce0e3;
          .profit-probability {
            margin-top: 40/40rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .probability-value {
              padding: 15/40rem 0;
            }
          }
          .pie-chart-wrapper {
            margin-top: 44/40rem;
            margin-bottom: 80/40rem;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            width: 100%;
            .pie-chart-left,
            .pie-chart-right {
              height: 100%;
              div {
                margin-bottom: 40/40rem;
                font-size: 18/40rem;
                p:first-child {
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                  color: #dee0e2;
                  span:first-child {
                    display: inline-block;
                    width: 20/40rem;
                    height: 20/40rem;
                    overflow: hidden;
                  }
                  span:last-child {
                    margin-left: 10/40rem;
                  }
                  span.lower-twelve-px {
                    padding-top: 1.5px;
                  }
                }
                p:last-child {
                  margin-left: 30/40rem;
                  margin-top: 6/40rem;
                  color: #fff;
                }
              }
              div:last-child {
                margin-bottom: 0;
              }
            }
            .pie-chart {
              width: 200/40rem;
              height: 200/40rem;
            }
          }
          .holdtime-tab-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 100%;
            span {
              box-sizing: border-box;
              flex: 1;
              display: block;
              height: 62/40rem;
              line-height: 62/40rem;
              text-align: center;
              border-top: 1px solid #0a8396;
              border-bottom: 1px solid #0a8396;
            }
            span:first-child {
              border-left: 1px solid #0a8396;
              border-radius: 3px 0 0 3px;
            }
            span:last-child {
              border-right: 1px solid #0a8396;
              border-radius: 0 3px 3px 0;
            }
            span.active {
              background-color: #00fcff;
              border-color: #00fcff;
              color: #224aa2;
            }
          }
        }
      }
      .diagnosis-date {
        padding: 47/40rem 0;
        font-size: 22/40rem;
        color: #b9b8bd;
        text-align: center;
      }
      .infor-common-wrapper {
        margin: 0 auto;
        width: 632/40rem;
        .infor-common-title {
            width: 100%;
            height: 78/40rem;
            font-size: 30/40rem;
            font-weight: bold;
            color: #4ef7fe;
            text-align: center;
            line-height: 78/40rem;
            background-image: url("../img/diagnosis/infor-header-bg.png");
            background-size: 100% auto;
            background-repeat: no-repeat;

        }
        .infor-common-cotent {
            width: 100%;
            background-image: url("../img/diagnosis/infor-border-bg.png");
            background-size: 100% auto;
            background-repeat: repeat-y;
          }
        .infor-common-bottom {
          width: 100%;
          height: 14/40rem;
          background-image: url("../img/diagnosis/infor-bottom-bg.png");
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-position: left bottom;
        }
      }
    }
    .button-wrapper {
      box-sizing: border-box;
      padding: 17/40rem 19/40rem;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 120/40rem;
      font-size: 34/40rem;
      color: #030d26;
      background-color: #0e2e45;
      border-top: 1px solid #2f93a2;
      .button-type1 {
        width: 100%;
        height: 100%;
        line-height: 86/40rem;
        background-color: #00fcff;
        text-align: center;
        border-radius: 3px;
      }
      .button-type2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        span {
          box-sizing: border-box;
          display: block;
          width: 345/40rem;
          height: 100%;
          line-height: 80/40rem;
          text-align: center;
        }
        .button-to-list {
          color: #00fcff;
          border: 1px solid #00fcff;
          border-radius: 3px;
        }
        .button-buy {
          background-color: #00fcff;
          border-radius: 3px;
        }
        .notBuy{
          background: #0795a3;
        }
      }
      .notBuy{
        background: #0795a3;
      }
    }
    // 渐变线条
    .gradual-line {
      width: 226/40rem;
      height: 3px;
      transform: scaleY(.5);
    }
    .gradual-line.right-left {
      background: linear-gradient(to left,#0b4256,#00f6f8);
    }
    .gradual-line.left-right {
      background: linear-gradient(to right,#0b4256,#00f6f8);
    }
  }

</style>
