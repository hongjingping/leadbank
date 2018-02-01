<template>
  <div class="consultingRoom"
       id="consultingRoom">
    <scroll :isNeedLoading="0"
            ref="fullPageScroll"
            v-if="pageAlready"
            :data="fundCont">
      <div class="consultingRoom-content-wrapper">
        <!-- 装饰层 -->
        <div class="decorate-bg"></div>
        <!-- 装饰层end -->
        <!-- 头部搜索 -->
        <div class="content1-wrapper">
          <div class="search-input-part"
               :class="{'search-input-short': showSearch}">
            <span class="serach-button"></span>
            <input type="text"
                   class="search-input"
                   v-model="searchText"
                   placeholder="测一测你关注的基金怎么样？"
                   @input="searchFund"
                   @click="showHotFundList(1)"
                   :disabled="searchInputDisabled == 1">
          </div>
          <div class="search-input-cancer"
               v-if="showSearch"
               @click="showHotFundList(0)">取消</div>
        </div>
        <!-- 头部搜索end -->
        <!-- 诊断报告 -->
        <div class="currentShow">
          <div class="content2-wrapper">
            <div class="report-part infor-common-wrapper">
              <div class="report-title infor-common-title">
                <p>{{ fundCont.fundName }}</p>
                <p>{{ fundCont.fundCode }}</p>
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
                  <div class="targetDetail"
                       @click="toFundDetails(fundCont.fundCode)">
                    基金详情
                    <em class="serachTriangle"></em>
                  </div>
                </div>
              </div>
              <div class="report-bottom infor-common-bottom"></div>
            </div>
          </div>
          <!-- 诊断报告end -->
          <!-- 诊断日期 -->
          <div class="diagnosis-date">(诊断日期：{{ diagnoseDate }})</div>
          <!-- 诊断日期end -->
          <!-- 基诊室的故事 -->
          <div class="consulting-room-story"
               v-if="fundCont.diagnoseStory.length > 0 || advert.length > 0">
            <div class="consulting-story-wrapper">
              <p class="story-title">
                <span class="gradual-line"></span>
                <span>基诊室的故事</span>
                <span class="gradual-line"></span>
              </p>
              <div class="story-content"
                   v-if="fundCont.diagnoseStory.length > 0">
                <img v-for="(item,index) in fundCont.diagnoseStory"
                     :key="index"
                     :src="item">
              </div>
              <div class="story-content"
                   v-else>
                <img src="../../diagnosisImage/allAverage.png">
              </div>
              <div class="story-content advertising-banner-wrapper"
                   v-if="advert.length > 0">
                <img v-for="(item,index) in advert"
                     :key="index"
                     :src="item.src"
                     @click="storyImgLink(item.link)" >
              </div>
            </div>
          </div>
        </div>
        <!-- 基诊室的故事end -->
      </div>
    </scroll>

    <!-- 底部按钮 -->
    <div class="bottom-button-wrapper">
      <div class="button-type"
           @click="bottomButton">
        测测基金的盈利潜力
      </div>
    </div>
    <!-- 底部按钮end -->
    <!-- 什么是基金诊断弹框 -->
    <explainModel :explainModelShow="showBox"
                  :listenCloseModel="1"
                  @closeModel="showBoxs(0)"
                  :items="boxCont"/>
    <!-- 什么是基金诊断弹框end -->
    <!-- app下载弹窗 -->
    <div class="downloadModel-wrapper"
         v-show="downloadModelShowFlag"
         @touchmove="stopEvent">
      <div class="downloadModel-content">
        <p class="model-text">基金未来的盈利潜力仅在利得基金APP中开放，下载APP即可查看</p>
        <p class="model-buttons">
          <span @click="downloadModelButton(1)">取消</span><span class="button-line"></span><span @click="downloadModelButton(2)">下载</span>
        </p>
      </div>
    </div>
    <!-- app下载弹窗end -->
    <!-- 基金搜索开始 -->
    <div class="fSearchHot"
         :class="{'showSearchAnimation': showSearchAnimation}"
         v-show="showSearchFlag">
      <scroll :isNeedLoading="0"
              ref="searchModelScroll">
        <!-- 热搜基金开始 -->
        <div v-show="!showSearchList">
          <div class="hotTitle"><em class="hotIcon"></em>热搜基金</div>
          <ul>
            <li v-for="(item,index) in hotFundList"
                :key="index"
                @click="targetLink(item.fundcode)">
              <div>
                <label>{{ item.fundname }}</label>
                <p>
                  <span>{{ item.fundcode }}</span>
                  <em class="fs-20">{{ item.fundtypename }}</em>
                </p>
              </div>
              <em class="diagnosis">诊断</em>
            </li>
          </ul>
        </div>
        <!-- 热搜基金结束 -->
        <ul v-show="showSearchList">
          <li v-for="(item,index) in searchList"
              :key="index"
              @click="targetLink(item.fundcode)">
            <div>
              <label>{{ item.fundname }}</label>
              <p>
                <span>{{ item.fundcode }}</span>
                <em class="fs-20">{{ item.fundtypename }}</em>
              </p>
            </div>
            <em class="diagnosis">诊断</em>
          </li>
        </ul>
      </scroll>

    </div>
    <!-- 基金搜索结束 -->
  </div>
</template>

<script>
import scroll from 'components/subassembly/scroll.vue';
import radarChart from 'components/subassembly/radarChart.vue';
import explainModel from 'components/diagnosis/diagnosisExplainModel.vue';
import {openApp, toast} from 'js/api.js';
import {hotFund, searchFund, diagnosisDetail, advertising} from 'js/request.js';
import weChartApi from 'js/weChartApi.js';

export default {
  name: 'ConsultingRoom',
  components: {
    scroll,
    radarChart,
    explainModel
  },
  data () {
    return {
      pageAlready: 0,
      hotFundList: [],
      downloadModelShowFlag: 0,
      searchText: '',
      searchInputDisabled: 0,
      showSearch: 0,
      showSearchFlag: 0,
      showSearchAnimation: 0,
      showSearchList: 0,
      searchList: '',
      fundCont: {
        diagnoseStory: []
      },
      fundScoreBean: [],
      diagnoseDate: '',
      showBox: 0,
      boxCont: [],
      advert: []
    };
  },
  watch: {
    showSearch (n, o) {
      let _this = this;
      if (n == 0) {
        // 关闭搜索框之后让input失去焦点不可输入要可点击
        this.searchInputDisabled = 1;
        setTimeout(function () {
          _this.searchInputDisabled = 0;
        }, 50);

        // 开启详情页滚动
        _this.$refs.fullPageScroll.enable();

        // 搜索框关闭动画
        _this.showSearchAnimation = 0;
        setTimeout(function () {
          _this.showSearchFlag = 0;
        }, 500);
      } else {
        // 搜索框开启动画
        _this.showSearchFlag = 1;

        // 禁止详情整页滚动 防止弹出搜索框后 滑动顶部input框位置滚动详情层级页面
        _this.$refs.fullPageScroll.disable();

        _this.$nextTick(function () {
          // 搜索框开启动画
          _this.showSearchAnimation = 1;
          // 打开搜索弹框后 刷新scroll
          _this.$refs.searchModelScroll.refresh();
        });
      }
    }
  },
  mounted () {
    this.wxShare();
    this.fundDetails();
    this.advertising();
  },
  methods: {
    // 显示弹框
    showBoxs (id) {
      this.showBox = id;
    },
    // 微信分享
    wxShare () {
      let shareId = 'APP_JJZD_0118';
      if (window.isWechat) {
        weChartApi.wechatShare(shareId, window.location.href);
      }
    },
    // 底部按钮事件
    bottomButton () {
      this.downloadModelShowFlag = 1;
    },
    // 下载弹窗按钮事件
    downloadModelButton (flag) {
      this.downloadModelShowFlag = 0;
      if (flag === 2) {
        openApp();
      }
    },
    // 显示热搜基金
    showHotFundList (id) {
      this.showSearch = id;

      if (id == 1 && this.hotFundList && this.hotFundList.length <= 0) {
        this.hotFund();
      }
    },
    // 热搜基金
    hotFund () {
      let self = this;
      hotFund().then(function (resp) {
        if (resp.data.respCode == '000') {
          self.hotFundList = resp.data.data.hotSearchFundList;
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 跳转诊断链接
    targetLink (code) {
      this.fundDetails(code);
      this.showSearch = 0;
    },
    // 基金搜索内容输入
    searchFund () {
      let self = this;
      self.searchText = self.searchText.replace(/^ +| +$/g, '');

      if (self.searchText) {
        self.fundList();
        self.showSearchList = 1;
      }

      if (self.searchText == '') {
        self.showSearchList = 0;
      }
    },
    // 搜索的基金列表
    fundList () {
      let self = this;
      searchFund({
        fundkey: encodeURI(self.searchText)
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.searchList = resp.data.data.fundSearchList;
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    stopEvent (event) {
      event.stopPropagation();
      event.preventDefault();
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
    fundDetails (id) {
      let self = this;
      let fundId = id || self.$router.currentRoute.query.fundId;
      diagnosisDetail('', fundId).then(function (resp) {
        // 计算数据获取日期
        self.diagnoseDate = self.getDiagnoseDate(resp.headers.date);

        if (resp.data.respCode == '000') {
          self.fundCont = resp.data.data;
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

        // 页面加载完毕标志
        self.$nextTick(function () {
          self.pageAlready = 1;
        });
      });
    },
    // 跳转基金详情
    toFundDetails (id) {
      this.$router.push({path: 'productDetails', query: {fundId: id}});
    },
    // 广告
    advertising () {
      let self = this;
      advertising().then(function (resp) {
        if (resp.data.respCode == '000') {
          self.advert = resp.data.data.storeyList[0].advice_group1;
        }
      });
    },
    // 广告链接跳转
    storyImgLink (link) {
      window.location.href = link;
    }
  }
};
</script>

<style lang="less" scoped>
  .consultingRoom {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 28/40rem;
    color: #fff;
    overflow: hidden;
    .consultingRoom-content-wrapper {
      padding-bottom: 120/40rem;
      width: 100%;
      min-height: 100%;
      background-color: #030d26;
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
        .search-input-part {
          box-sizing: border-box;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 650/40rem;
          height: 125/40rem;
          font-size: 28/40rem;
          color: #fff;
          text-align: center;
          background-image: url("../img/diagnosis/fund-name-bg2.png");
          background-size: 100% 100%;
          background-color: transparent;
          .serach-button {
            position: absolute;
            left: 15%;
            top: 50%;
            transform: translateY(-50%);
            width: 36/40rem;
            height: 34/40rem;
            background-image: url("../img/diagnosis/fundward-icons.png");
            background-size: 61/40rem 34/40rem;
            background-repeat: no-repeat;
          }
          .search-input {
            box-sizing: border-box;
            padding-left: 24%;
            padding-right: 40/40rem;
            display: inline-block;
            width: 100%;
            height: 100%;
            font-size: 28/40rem;
            color: #fff;
            background-color: transparent;
          }
          input::-webkit-input-placeholder { /* WebKit browsers */
              color: #fff;
          }
          input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
              color: #fff;
          }
          input::-moz-placeholder { /* Mozilla Firefox 19+ */
              color: #fff;
          }
          input:-ms-input-placeholder { /* Internet Explorer 10+ */
              color: #fff;
          }
        }
        .search-input-short{
          width: 13.85rem;
        }
        .search-input-cancer{
          color: #4ff7ff;
          font-size: 0.75rem;
          line-height: 3.125rem;
          padding-left: 1.1rem;
        }
      }
      .content2-wrapper {
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
            .radar-chart-wrapper {
              width: 100%;
              height: 325/40rem;
            }
            .sQuestion{
              width: 0.8rem;
              height: 0.8rem;
              background: url('../img/diagnosis/mark-ico.png') no-repeat;
              background-size: 100% 100%;
              display: block;
              position: absolute;
              right: -0.6rem;
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
              margin-bottom: ;
              font-size: 0;
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
      .consulting-room-story {
        width: 100%;
        background-image: url("../img/diagnosis/fund-story-bg1.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
        .consulting-story-wrapper {
          padding-bottom: 140/40rem;
          width: 100%;
          background-image: url("../img/diagnosis/fundward-story-bg.png");
          background-size: 100% auto;
          background-repeat: no-repeat;
          .story-title {
            padding: 55/40rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 46/40rem;
            color: #4ff7ff;
            font-weight: bold;
            .gradual-line{
              width: 200/40rem;
              height: 23/40rem;
              background-image: url("../img/diagnosis/gradual-line.png");
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
            .gradual-line:last-child {
              transform: rotate(180deg);
            }
          }
          .story-content {
            margin: 0 auto;
            width: 640/40rem;
            img {
              padding-top: 1rem;
              display: block;
              width: 100%;
              height: auto;
            }
          }
          .story-content>img:first-child {
            padding-top: 0;
          }
          .story-content.advertising-banner-wrapper {
            padding-top: 1rem;
          }
        }
      }
      .infor-common-wrapper {
        margin: 0 auto;
        width: 632/40rem;
        .infor-common-title {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 132/40rem;
            font-size: 22/40rem;
            color: #4ef7fe;
            background-image: url("../img/diagnosis/infor-header-bg2.png");
            background-size: 100% 100%;
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
    .bottom-button-wrapper {
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
      .button-type {
        width: 100%;
        height: 100%;
        line-height: 86/40rem;
        background-color: #00fcff;
        text-align: center;
        border-radius: 3px;
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
    .downloadModel-wrapper {
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 30/40rem;
      color: #fff;
      background-color: rgba(0,0,0,.8);
      .downloadModel-content {
        box-sizing: border-box;
        width: 600/40rem;
        background-color: rgba(0,74,77,.9);
        border: 1px solid #4FF7FF;
        border-radius: 2px;
        .model-text {
          box-sizing: border-box;
          padding: 50/40rem 48/40rem;
          width: 100%;
          min-height: 196/40rem;
          text-align: center;
          border-bottom: 1px solid #4FF7FF;;
        }
        .model-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100/40rem;
          color: #4FF7FF;
          span {
            height: 100%;
          }
          span:first-child,
          span:last-child {
            flex: 1;
            text-align: center;
            line-height: 100/40rem;
          }
          span.button-line {
            width: 3/40rem;
            background-color: #4ff7ff;
          }
        }
      }
    }
  }
  .fSearchHot{
      padding: 0rem 0.75rem;
      position: absolute;
      left: 0;
      top: 200/40rem;
      right: 0;
      bottom: 0;
      background-color: #030d26;
      transform: translateY(100%);
      transition: all .5s;
      .hotTitle{
        display: flex;
        line-height: 2.75rem;
        border-bottom: 1px solid #4FF7FF;
        font-size: 0.75rem;
        color: #4FF7FF;
        align-items: center;
      }
      .hotIcon{
        width: 0.75rem;
        height: 0.75rem;
        display: inline-block;
        background: url("../img/hot-blue.png") no-repeat;
        background-size: 100% 100%;
        margin-right: 0.5rem;
      }
      ul li{
        padding: 1rem 0rem;
        border-bottom: 1px solid  #4FF7FF;
        font-size: 0.75rem;
        color: #FFFFFF;
        line-height: 0.75rem;
        display: flex;
        align-items: center;
        div{
          flex: 1;
          label{
            padding-bottom: 0.4rem;
            display: block;
          }
          p{
            font-size: 0.6rem;
            color: #fff;
            line-height: 0.6rem;
            display: flex;
            align-items: center;
            span{
              padding-right: 0.5rem;
            }
            em{
              border: 1px solid #DCDCDC;
              border-radius: 2px;
              padding: 0rem 0.25rem;
            }
          }
        }
        em.diagnosis{
          font-size: 0.6rem;
          color: #4FF7FF;
          line-height: 0.6rem;
          border: 1px solid #4FF7FF;
          border-radius: 2px;
          padding: 0.2rem 0.4rem;
        }
      }
      ul li:last-child {
        border-bottom: none;
      }
  }
  .fSearchHot.showSearchAnimation {
    transform: translateY(0);
  }
  .targetDetail{
    width: 5.55rem;
    height: 1.55rem;
    font-size:0.6rem;
    margin: 0 auto;
    border: 1px solid #2adef2;
    border-radius: 1rem;
    margin-top: 1.075rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4ff7ff;
  }
  .serachTriangle{
    width: 0.325rem;
    height: 0.7rem;
    display: inline-block;
    background-image: url("../img/diagnosis/fundward-icons.png");
    background-size: 61/40rem 34/40rem;
    background-repeat: no-repeat;
    background-position: -1.15rem 0rem;
    margin-left: 0.25rem;
    margin-top: 1px;
  }
</style>
