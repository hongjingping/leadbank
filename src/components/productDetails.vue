<template>
  <div id="productDetails"
       v-if="pageReady">
    <scroll :isNeedLoading="0">
      <!-- 基金基础信息部分 -->
      <div class="fundBaseData-part">
        <div class="fundBaseData-fundName">
          <div class="DFirst">
            <p class="fs-30 fc-19191E line-height1">{{ fundDetails.fundName }}</p>
            <p class="fs-24 fc-96969B line-height1">({{ fundDetails.fundCode }})</p>
          </div>
          <img src="../img/xinfajijin.png"
               alt="新发基金"
               v-if="fundDetails.xfFundFlg == '00'">
          <div class="diagnosis"
               @click="targetLink(fundDetails.fundCode)"
               v-else>
            诊断
          </div>
        </div>
        <div class="fundBaseData-fundEarnings">
          <div class="fundEarnings-left">
            <!-- 1207 fundType 04货币 98短期理财 -->
            <div v-if=" fundDetails.fundType != '98' && fundDetails.fundType != '04' ">
              <p class="fc-dc2828 fs-24"
                 :class="{'green': parseFloat(fundDetails.rose) < 0, 'red': parseFloat(fundDetails.rose) >= 0 }"
                 v-if="fundDetails.fundCurState == '00' || fundDetails.fundCurState == '02'">
                <span class="fs-60">{{ fundDetails.rose }}</span>%
              </p>
              <p class="fc-dc2828 fs-60"
                 v-if="fundDetails.fundCurState == '01'">
                --
              </p>
              <p class="fs-24 fc-96969B">日涨幅</p>
            </div>
            <div v-if=" fundDetails.fundType == '98' || fundDetails.fundType == '04' ">
              <p class="fc-dc2828 fs-24"
                 v-if="fundDetails.fundCurState == '02'">
                <span class="fs-60">{{ fundDetails.yearlyroe }}</span>%
              </p>
              <p class="fc-dc2828 fs-60"
                 v-if="fundDetails.fundCurState == '00' || fundDetails.fundCurState == '01'">
                --
              </p>
              <p class="fs-24 fc-96969B">七日年化<span class="unit">(%)</span></p>
            </div>
          </div>
          <div class="segmentation-line"></div>
          <div class="fundEarnings-right">
            <div v-if=" fundDetails.fundType != '98' && fundDetails.fundType != '04' ">
              <p class="fc-19191E fs-36"
                 v-if="fundDetails.fundCurState == '00' || fundDetails.fundCurState == '02'">
                {{ fundDetails.nav }}
              </p>
              <p class="fc-19191E fs-60"
                 v-if="fundDetails.fundCurState == '01'">
                --
              </p>
              <p class="fc-96969B fs-24">净值<span v-if="fundDetails.fundCurState == '02'">({{ fundDetails.navDate }})</span><span v-else>(元)</span></p>
            </div>
            <div v-if=" fundDetails.fundType == '98' || fundDetails.fundType == '04' ">
              <p class="fc-19191E fs-36"
                 v-if="fundDetails.fundCurState == '02'">
                {{ fundDetails.unityield }}
              </p>
              <p class="fc-19191E fs-60"
                 v-if="fundDetails.fundCurState == '00' || fundDetails.fundCurState == '01'">
                --
              </p>
              <p class="fc-96969B fs-24">万分收益<span v-if="fundDetails.fundCurState == '02'">({{ fundDetails.navDate }})</span><span v-else>(元)</span></p>
            </div>
          </div>
          <img src="../img/enter.png"
               alt="查看收益列表"
               @click="goNetValue">
        </div>
        <div class="fundBaseData-fundtype fs-24 fc-19191E">
          <img src="../img/coin-ico.png"
               alt="">
          <span>{{ fundDetails.fundTypeName }}</span>
          <img src="../img/coin-ico.png"
               alt=""
               class="mr-left">
          <span>{{ fundDetails.fundSectorName }}</span>
        </div>
        <!-- R5风险提示1220 -->
        <div v-if="fundDetails.fundSectorName === 'R5(高风险)'">
          <div class="high-tips">
            {{ riskInstruction }}
          </div>
          <div class="textMore"
               :class="{ 'textMoreDown': moreTextIcon == 0 }"
               v-if=" riskInstructionLength > 90"
               @click="moreText">
            <span class="more-text"
                  v-if="moreTextIcon == 0" >了解更多</span>
            <span class="more-text"
                  v-if="moreTextIcon == 1" >收起</span>
            <em class="moreTextIcon"
                :class="{'moreTextDown': moreTextIcon == 0, 'moreTextUp': moreTextIcon == 1 }">
            </em>
          </div>
        </div>
      </div>
      <!-- 基金基础信息部分end -->
      <!-- 交易规则 -->
      <div class="dealRule-part"
           v-if="fundDetails.isSalesAgent == '1'">
        <div class="part-header">
          <p>
            <span>交易规则</span>
            <img src="../img/enter.png"
                 alt=""
                 @click="goDealRulePage">
          </p>
        </div>
        <!-- 存续期 -->
        <div class="dealRule-content"
             v-if="fundDetails.fundCurState == '02'">
          <div class="c-part">
            <p>{{ fundDetails.minvalue }}元</p>
            <p>起购金额</p>
          </div>
          <div class="segmentation-line"></div>
          <div class="c-part">
            <p>{{ fundDetails.sgTime }}</p>
            <p>申购确认时间</p>
          </div>
          <div class="segmentation-line"></div>
          <div class="c-part"
               v-if="fundType == '98'">
            <p>{{ fundDetails.operationPeriod }}天</p>
            <p>理财期限</p>
          </div>
          <div class="c-part"
               v-if="fundType != '98'">
            <p>{{ fundDetails.shTime }}</p>
            <p>赎回到账日期</p>
          </div>
        </div>
        <!-- 封闭期、募集期 -->
        <div class="dealRule-content"
             v-if="fundDetails.fundCurState != '02'">
          <div class="c-part">
            <p>{{ fundDetails.minvalue }}元</p>
            <p>起购金额</p>
          </div>
          <div class="segmentation-line"></div>
          <div class="c-part">
            <p>{{ fundDetails.mjStartTime }}</p>
            <p>募集开始日</p>
          </div>
          <div class="segmentation-line"></div>
          <div class="c-part">
            <p>{{ fundDetails.mjEndTime }}</p>
            <p>募集结束日</p>
          </div>
        </div>
        <div class="dealRule-part-explain explain"
             v-if="fundDetails.fundCurState != '02'">
          <div class="ico-circle"></div>
          <div>
            <p class="fs-24 fc-bfbfbf"
               v-if="fundDetails.fundCurState == '01'">
              基金处于封闭期，期限中您将无法购买该基金产品，具体以本基金管理人公告为准。
            </p>
            <p class="fs-24 fc-bfbfbf"
               v-if="fundDetails.fundCurState == '00'">基金处于募集期，募集期限届满后，满足募集要求的基金将进入封闭期进行建仓，建仓结束后，每个交易日会更新净值。
            </p>
          </div>
        </div>
      </div>
      <!-- 交易规则end -->

      <!-- 累计收益曲线start -->
      <div class="earningsChart-part"
           v-if=" fundDetails.fundType != '98' && fundDetails.fundType != '04' && fundDetails.fundCurState == '02' ">
        <div class="part-header">
          <p><span>累计收益曲线</span></p>
        </div>
        <div class="earningsChart-content">
          <!-- 估值图表 -->
          <div class="legend-box"
               v-show="!chartState">
            <span>净值估算：
              <span v-text="valLegData[0]"
                    :class="[ valLegData[0]>=0 ? 'fc-dc2828' : 'green']"
                    v-if="valLegData.length==2">
              </span>
              <span v-if="!valLegData.length">———</span>
            </span>
            <span>估算涨幅：
              <span v-text="valLegData[1]"
                    :class="[ valLegData[1]>=0 ? 'fc-dc2828' : 'green']"
                    v-if="valLegData.length==2">
              </span>
              <span v-if="!valLegData.length">———</span>
            </span>
          </div>
          <valChart
            :fundId="fundId"
            :chartData="valchartData"
            ref="valChart"
            v-show="!chartState"
            @valChartTooltip="valChartTooltip"/>

          <!-- 收益率图表 -->
          <div class="legend-box"
               v-show="chartState">
            <span><i class="dot"></i>本基金：
              <span v-text="rateLegData[0]+'%'"
                    :class="[ rateLegData[0]>=0 ? 'fc-dc2828' : 'green']"
                    v-if="rateLegData[0]"></span>
              <span v-if="!rateLegData[0]">———</span>
            </span>
            <span><i class="dot"></i>沪深300：
              <span v-text="rateLegData[1]+'%'"
                    :class="[ rateLegData[1]>=0 ? 'fc-dc2828' : 'green']"
                    v-if="rateLegData[1]"></span>
              <span v-if="!rateLegData[1]">———</span>
            </span>
          </div>
          <rateChart
            :fundId="fundId"
            :chartData="ratechartData"
            v-show="chartState"
            ref="rateChart"
            @rateChartTooltip="rateChartTooltip"/>

          <ul class="chart-tab-list">
            <li :class="{'active' : chartTabActIndex==0}"
                @click="changeChart(0,0)">估值</li>
            <li :class="{'active' : chartTabActIndex==1}"
                @click="changeChart(1,3)">一月</li>
            <li :class="{'active' : chartTabActIndex==2}"
                @click="changeChart(1,4)">一季度</li>
            <li :class="{'active' : chartTabActIndex==3}"
                @click="changeChart(1,5)">半年</li>
            <li :class="{'active' : chartTabActIndex==4}"
                @click="changeChart(1,6)">一年</li>
          </ul>
        </div>
      </div>
      <!-- 累计收益曲线end -->

      <!-- 历史业绩 -->
      <div class="pastReturn-part"
           v-if="fundDetails.fundCurState == '02'">
        <div class="part-header">
          <p><span>历史业绩</span></p>
        </div>
        <div class="pastReturn-content">
          <div class="c-top">
            <div>
              <p class="date">近一月</p>
              <performance :levelFlag="fundDetails.jdzfMonth" />
            </div>
            <div>
              <p class="date">近三月</p>
              <performance :levelFlag="fundDetails.jdzfQuarter" />
            </div>
            <div>
              <p class="date">近半年</p>
              <performance :levelFlag="fundDetails.jdzfHalfyear" />
            </div>
            <div>
              <p class="date">近一年</p>
              <performance :levelFlag="fundDetails.jdzfyear" />
            </div>
          </div>
          <div class="c-bottom">
            <p><span>前25%</span></p>
            <p><span>25-50%</span></p>
            <p><span>50-70%</span></p>
            <p><span>75-100%</span></p>
          </div>
        </div>
      </div>
      <!-- 历史业绩end -->
      <!-- 投资组合 -->
      <div class="portfolio-part"
           v-if="fundDetails.fundCurState == '02' && (pieChartData.stockpercent > 0 || pieChartData.debtpercent > 0 || pieChartData.cashpercent > 0)">
        <div class="part-header">
          <p><span>投资组合</span><span class="fs-24 fc-96969B">{{ fundDetails.zcTitle }}</span></p>
        </div>
        <!-- 资产配置 -->
        <div class="portfolio-content">
          <div class="fs-30 fc-19191E chart-title">资产配置</div>
          <div class="chart-part">
            <div class="chart-lenged">
              <p>
                <span></span>
                <span>股票占净比</span>
                <span>({{ parseFloat(pieChartData.stockpercent).toFixed(2) }}%)</span>
              </p>
              <p>
                <span></span>
                <span>债券占净比</span>
                <span>({{ parseFloat(pieChartData.debtpercent).toFixed(2) }}%)</span>
              </p>
              <p>
                <span></span>
                <span>其他占净比</span>
                <span>({{ parseFloat(pieChartData.cashpercent).toFixed(2) }}%)</span>
              </p>
            </div>
            <div class="chart-wrapper">
              <pieChart :pieChartTitleOptions="pieChartTitleOptions"
                        :pieChartSeriesOptions="pieChartSeriesOptions" />
            </div>
          </div>
          <div class="chart-part-noContent"
               v-if="pieChartData.stockpercent == 0 && pieChartData.debtpercent == 0 && pieChartData.cashpercent == 0 ">
            <p>暂无数据</p>
          </div>
        </div>
        <!-- 资产配置end -->
        <!-- 行业配置 -->
        <div class="portfolio-content portfolio-contentNew portfolio-contentNewTwo"
             v-if=" fundDetails.fundType != '98' && fundDetails.fundType != '04' && industryInfoAll !== null && industryInfoAll != ''" >
          <div class="fs-30 fc-19191E chart-title">行业配置</div>
          <div class="contentNew">
            <div class="industryName">
              <div class="nameNew Left">行业</div>
              <div class="nameNew Right">占比</div>
            </div>
            <div class="industryList">
              <ul :class="{'pad': industryInfoAll.length <= 5}">
                <li v-for="(item,index) in industryInfo"
                    :key="index">
                  <div class="list listName">{{ item.industry }}</div>
                  <div class="list listRate">{{ item.accounted }}</div>
                </li>
              </ul>
            </div>
            <div class="more"
                 v-if="industryInfoAll.length > 5"
                 @click="moreContent">
              <span v-if=" downIcon == 0">更多</span>
              <span v-if="downIcon == 1">收起</span>&nbsp;
              <em class="moreIcon"
                  :class="{'moreDown': downIcon == 0, 'moreUp': downIcon == 1 }"></em>
            </div>
          </div>
        </div>
        <!-- 行业配置end -->
        <!-- 重仓股明细 -->
        <div class="portfolio-content portfolio-contentNew"
             v-if=" fundDetails.fundType != '98' && fundDetails.fundType != '04' && fundDetails.stockinvList !== null && fundDetails.stockinvList != ''">
          <div class="fs-30 fc-19191E chart-title chart-titleNew">
            <span class="titleNewLeft">重仓股明细</span>
            <span class="titleNewRight">{{ fundDetails.stockinvDate }}</span>
          </div>
          <div class="contentNew">
            <div class="industryName">
              <div class="nameNew nameTwo Left">重仓(前十名)</div>
              <div class="nameNew center">占比</div>
              <div class="nameNew Right">日涨幅</div>
            </div>
            <div class="industryList">
              <ul>
                <li v-for="(item,index) in fundDetails.stockinvList"
                    :key="index">
                  <div class="list listTwo listName">{{ item.stockName }}</div>
                  <div class="list listRateNew">{{ item.newPercent }}%</div>
                  <div class="list listRate"
                       v-if="item.stockChangePercent != ''"
                       :class="{'green': item.stockChangePercent != '' && item.stockChangePercent >= 0, 'red': item.stockChangePercent != '' && item.stockChangePercent < 0}">{{ item.stockChangePercent }}</div>
                  <div class="list listRate"
                       v-if="item.stockChangePercent == ''" >--</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 重仓股明细end -->
        <!-- 重仓债明细 -->
        <div class="portfolio-content portfolio-contentNew"
             v-if=" fundDetails.fundType != '98' && fundDetails.fundType != '04' && fundDetails.heavyDebtInfo !== null && fundDetails.heavyDebtInfo != '' " >
          <div class="fs-30 fc-19191E chart-title">重仓债明细</div>
          <div class="contentNew">
            <div class="industryName">
              <div class="nameNew Left">行业</div>
              <div class="nameNew Right">占比</div>
            </div>
            <div class="industryList">
              <ul>
                <li v-for="(item,index) in fundDetails.heavyDebtInfo"
                    :key="index">
                  <div class="list listName">{{ item.industry }}</div>
                  <div class="list listRate">{{ item.accounted }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 重仓债明细end -->
      </div>
      <!-- 投资组合end -->
      <!-- 基金档案 -->
      <div class="fundRecord-part">
        <div class="part-header">
          <p><span>基金档案</span></p>
        </div>
        <div class="fundRecord-content">
          <div class="secondLevel-header">
            <p>基金概况</p>
          </div>
          <div class="fundSituation-c">
            <p>
              <span>基金规模</span>
              <span v-if="fundDetails.fundCurState == '02'">
                {{ fundDetails.share }}亿元
                <span v-if="fundDetails.shareIncFlg != '02'">
                  (<img src="../img/down-green.png"
                        alt="下降"
                        v-if="fundDetails.shareIncFlg == '00'">
                  <img src="../img/up-red.png"
                       alt="上升"
                       v-if="fundDetails.shareIncFlg == '01'">
                  {{ fundDetails.lastShare }}亿元)
                </span>
              </span>
              <span v-else>--</span>
            </p>
            <p>
              <span>成立时间</span>
              <span v-if="fundDetails.fundCurState == '02'">{{ fundDetails.fundDate }}</span>
              <span v-else>--</span>
            </p>
            <p><span>基金公司</span><span>{{ fundDetails.compName }}</span></p>
          </div>
          <div class="secondLevel-header">
            <p>基金经理</p>
            <p></p>
          </div>
          <div class="fundManager-c"
               v-for="(item,index) in fundDetails.managerLst"
               :key="index">
            <img :src="item.headUrl"
                 :onerror="logo"
                 alt="基金经理"
                 v-if="item.headUrl">
            <img src="../img/fundmanager.png"
                 alt="基金经理"
                 v-else>
            <div class="manager-msg">
              <p><span>{{ item.managername }}</span><span>任期回报率：<em class="fc-dc2828">{{ item.redound }}%</em></span></p>
              <p>从业时间：{{ item.assumedate }}&nbsp;至今</p>
            </div>
          </div>
          <div class="secondLevel-header">
            <p>基金公告</p>
            <p>
              <img src="../img/enter.png"
                   alt="进入"
                   @click="toAnnouncementPage"></p>
          </div>
          <div class="fundNotice-c">
            <div>
              <p class="fs-30 fc-19191E annotitle">{{ fundDetails.annotitle }}</p>
              <p class="fs-24 fc-96969B">{{ fundDetails.annodate }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 基金档案end -->
      <!-- 公司声明 -->
      <div class="statement-part">
        <p>
          <img src="../img/icon1.png"
               alt="">
          <span class="fc-19191E">基金销售服务由上海利得基金销售有限公司提供</span>
        </p>
        <p class="fc-96969B">本页面非任何法律文件，投资前请认证阅读基金合同、招募说明书及其更新。基金过往业绩不预示其未来表现，市场有风险，投资需谨慎。</p>
      </div>
      <!-- 公司声明end -->
    </scroll>
    <!-- 购买按钮 -->
    <div class="buyButton-part">
      <baseButton @click.native="toBuy"
                  :styleObj="buttonStyle"
                  :disabled="buttonDisabledFlg">
        {{ buttonText }}
      </baseButton>
    </div>
  </div>
</template>

<script>
import rateChart from 'components/subassembly/rateChart.vue';
import valChart from 'components/subassembly/valuationChart.vue';
import pieChart from 'components/subassembly/pieChart.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import performance from 'components/productModule/performance.vue';
import scroll from 'components/subassembly/scroll.vue';
import {toast} from 'js/api.js';
import {getFundDetails, checkLoginState, queryActuTimeAssess, qryFundTraChart} from 'js/request.js';

export default {
  name: 'ProductDetails',
  components: {
    pieChart,
    baseButton,
    performance,
    rateChart,
    valChart,
    scroll
  },
  data () {
    return {
      logo: 'this.src="' + require('../img/fundmanager.png') + '";this.onerror = null;',
      fundId: this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID'),
      buttonStyle: {
        backgroundColor: '#DC2828',
        fontSize: '0.9rem',
        color: '#fff'
      },
      buttonDisabledFlg: false,
      buttonText: '立即购买',
      fundDetails: '',
      pieChartData: {
        stockpercent: 0,
        debtpercent: 0,
        cashpercent: 0
      },
      pieChartTitleOptions: {
        show: true,
        text: '资产配置'
      },
      pieChartSeriesOptions: [],
      industryInfo: '',
      fundType: '',
      pageReady: 0,
      downIcon: 0,
      chartState: 0, // 图表是否显示 0：估值 1：收益率
      chartTabActIndex: 0,
      valchartData: {}, // 实时估值图表数据
      ratechartData: {}, // 收益率图表数据
      valLegData: [], // 实时估值图例展示数据
      rateLegData: [], // 收益曲线图例展示数据
      // 1220start
      riskInstruction: '', // R5风险提示说明
      riskInstructionAll: '',
      moreTextIcon: 0,
      riskInstructionLength: 0
      // 1220end
    };
  },
  activated () {
    let fundId = this.$router.currentRoute.query.fundId || sessionStorage.getItem('FUNDID');
    if (fundId != this.fundId) {
      this.fundId = fundId;
      this.getFundDetails();
    }
  },
  mounted () {
    this.getFundDetails();
    this.queryActuTimeAssess();
  },
  methods: {
    // 查看历史净值和分红
    goNetValue () {
      this.$router.push({path: '/netValue', query: {fundId: this.fundId, fundType: this.fundType}});
    },
    // 查看交易规则
    goDealRulePage () {
      this.$router.push({path: '/dealRule', query: {fundId: this.fundId}});
    },
    // 查看公告
    toAnnouncementPage () {
      this.$router.push({path: '/announcement', query: {fundId: this.fundId}});
    },
    /** 从接口获取数据 */
    getFundDetails () {
      let _this = this;
      getFundDetails({
        proId: _this.fundId
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.fundDetails = resp.data.data;
          _this.fundType = resp.data.data.fundType;
          if (resp.data.data.riskInstruction != '' && resp.data.data.riskInstruction !== null) {
            _this.riskInstructionLength = resp.data.data.riskInstruction.replace(/[\u0391-\uFFE5]/g, 'aa').length;
            _this.riskInstruction = resp.data.data.riskInstruction.substring(1, 48);
            _this.riskInstructionAll = resp.data.data.riskInstruction;
          }
          _this.industryInfo = resp.data.data.industryInfo.slice(0, 5);
          _this.industryInfoAll = resp.data.data.industryInfo;
          _this.pieChartData.stockpercent = resp.data.data.stockpercent;
          _this.pieChartData.debtpercent = resp.data.data.debtpercent;
          _this.pieChartData.cashpercent = resp.data.data.cashpercent;

          _this.setPieChartData(_this.pieChartData);

          if (
            resp.data.data.fundCurState == '01' ||
            resp.data.data.isSalesAgent != '1'
          ) {
            _this.buttonStyle.backgroundColor = '#dcdcdc';
            _this.buttonDisabledFlg = true;
            if (resp.data.data.isSalesAgent != '1') {
              _this.buttonText = '暂不开放  敬请期待';
            }
          }
          _this.$nextTick(function () {
            _this.pageReady = 1;
          });
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 设置饼图配置信息
    setPieChartData (data) {
      let _this = this;
      // 设置饼图配置信息
      _this.$set(_this.pieChartSeriesOptions, 0, {
        name: '资产配置',
        data: [
          {
            value: data.stockpercent,
            name: '股票',
            itemStyle: {
              normal: {
                color: 'rgba(220,40,40,.6)'
              }
            }
          },
          {
            value: data.debtpercent,
            name: '债券',
            itemStyle: {
              normal: {
                color: 'rgba(255,160,65,.6)'
              }
            }
          },
          {
            value: data.cashpercent,
            name: '其他',
            itemStyle: {
              normal: {
                color: 'rgba(50,150,255,.6)'
              }
            }
          }
        ]});
    },
    // 点击更多
    moreContent () {
      let _this = this;
      if (_this.industryInfo.length == _this.fundDetails.industryInfo.slice(0, 5).length) {
        _this.industryInfo = _this.industryInfoAll;
        _this.downIcon = 1;
      } else {
        _this.industryInfo = _this.fundDetails.industryInfo.slice(0, 5);
        _this.downIcon = 0;
      }
    },
    // 了解更多-1220
    moreText () {
      let _this = this;
      if (_this.riskInstruction.replace(/[\u0391-\uFFE5]/g, 'aa').length == _this.riskInstruction.substring(0, 48).replace(/[\u0391-\uFFE5]/g, 'aa').length) {
        _this.riskInstruction = _this.riskInstructionAll;
        _this.moreTextIcon = 1;
      } else {
        _this.riskInstruction = _this.riskInstruction.substring(0, 48);
        _this.moreTextIcon = 0;
      }
    },
    toBuy () {
      let _this = this;
      /** 判断是否登录 未登录跳转登录 已登录跳转基金购买页 */
      checkLoginState({
        backHtml: window.location.href
      }).then(function (resp) {
        if (resp.data.userState == '1') {
          // 已登录
          sessionStorage.setItem('FUNDID', _this.fundId);
          sessionStorage.setItem('FUNDTYPE', _this.fundType);
          _this.$router.push({path: 'buyFund', query: {fundId: _this.fundId, fundType: _this.fundType}});
        } else if (resp.data.userState != '1') {
          // 未登录
          _this.$router.push({path: 'login'});
        }
      });
    },
    // 收益曲线切换
    changeChart (i, type) {
      if (+i) {
        this.chartState = 1;
        this.qryFundTraChart(type);
      } else {
        this.chartState = 0;
        this.queryActuTimeAssess();
      }
      this.chartTabActIndex = type ? type - 2 : 0;
    },
    // 获取实时估值图表数据
    queryActuTimeAssess () {
      var _this = this;
      queryActuTimeAssess({
        fundCode: _this.fundId
      }).then(function (resp) {
        if (resp.data.respCode == '000000') {
          _this.valchartData = resp.data.data;
        }
      });
    },
    // 获取估值图表tooltip显示数据
    valChartTooltip (data) {
      this.valLegData = data;
    },
    // 获取收益图表tooltip显示数据
    rateChartTooltip (data) {
      this.rateLegData = data;
    },
    // 获取收益曲线图表数据
    qryFundTraChart (type) {
      var _this = this;
      qryFundTraChart({
        proId: _this.fundId,
        dateType: type || 3
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.ratechartData = resp.data.data;
        }
      });
    },
    // 跳转诊断链接
    targetLink (code) {
      this.$router.push({path: 'fundConsultingRoom', query: {fundId: code}});
    }
  }
};
</script>

<style lang="less" scoped>
#productDetails {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
  .fundBaseData-part {
    .fundBaseData-fundName {
      position: relative;
      padding: 1rem 0.75rem 1.25rem 0.75rem;
      border-bottom: 1px solid #dcdcdc;
      display: flex;
      align-items: center;
      div.DFirst{
        flex: 1;
      }
      p:first-child {
        margin-bottom: 0.5rem;
      }
      img {
        display: inline-block;
        position: absolute;
        top: 0;
        right: 0.75rem;
        width: 2rem;
        height: auto;
      }
    }
    .fundBaseData-fundEarnings {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      padding: 1rem 0.75rem 1.25rem 0.75rem;
      .fundEarnings-left,
      .fundEarnings-right {
        text-align: center;
      }
      div:last-child {
        text-align: center;
      }
      .unit {
        margin-left: 0.25rem;
      }
      img {
        display: inline-block;
        position: absolute;
        right: 0.75rem;
        top: 50%;
        width: 1rem;
        height: auto;
        transform: translateY(-50%);
      }
    }
    .fundBaseData-fundtype {
      box-sizing: border-box;
      padding: 0.625rem;
      width: 100%;
      background-color: rgba(220, 220, 220, 0.1);
      img {
        display: inline-block;
        margin-right: 0.4rem;
        width: 0.7rem;
        height: auto;
        vertical-align: middle;
      }
      img.mr-left {
        margin-left: 0.9rem;
      }
    }
    // 1220start
    .high-tips {
      margin-top: .5rem;
      padding: 1rem 0.75rem;
      font-size: .75rem;
      color: #19191E;
    }
    .textMore {
      font-size: .6rem;
      color: #96969B;
      padding: 0 0 0.9rem;
      text-align: center;
      position: relative;
      .more-text {

      }
      .moreTextIcon {
        display: inline-block;
        width: .8rem;
        height: .8rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        margin-left: .25rem;
      }
      .moreTextUp {
        background-image: url('../img/up.png')
      }
      .moreTextDown {
        background-image: url('../img/down.png')
      }
    }
    .textMoreDown{
      position: relative;
    }
    .textMoreDown::before {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      top: -2.5rem;
      width: 100%;
      height: 1.75rem;
      background-image: linear-gradient(0deg, #FFFFFF 0%, rgba(255,255,255,0.00) 100%);
    }
    // 1220end
  }
  // 交易规则
  .dealRule-part {
    .part-header {
      p {
        background-image: url("../img/goumaifeilv.png");
      }
    }
    .dealRule-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-top: 1rem;
      padding-bottom: 1.25rem;
      div {
        text-align: center;
        p:first-child {
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          color: #19191e;
        }
        p:last-child {
          font-size: 0.6rem;
          color: #96969b;
        }
      }
      .c-part {
        flex-grow: 1;
      }
      .segmentation-line {
        align-self: flex-start;
      }
    }
    .dealRule-part-explain {
      padding: 0 30/40rem 50/40rem 30/40rem;
    }
  }
  // 收益曲线
  .earningsChart-part{
    .part-header {
      p {
        background-image: url("../img/quxiantu.png");
      }
    }
  }
  .earningsChart-content{
    padding: 1rem .75rem 2.5/2rem;
    .legend-box{
      text-align: center;
      font-size: .6rem;
      color: #19191e;
      >span{
        .dot{
          display: inline-block;
          width: .6rem;
          height: .6rem;
          border-radius: 50%;
          background-color: #dc2828;
          margin-right: .25rem;
          vertical-align: baseline;
        }
        &:nth-child(2) >.dot{
          background-color: #84c0ff;
        }
      }
      >span:not(:last-child){
        display: inline-block;
        margin-right: 1.5rem;
      }
    }
  }
  .chart-tab-list{
    display: flex;
    margin: 0 .25rem;
    border: solid 1px #dc2828;
    border-radius: 2px;
    > li{
      flex: 1;
      text-align: center;
      font-size: .6rem;
      padding: .45rem 0;
      &.active{
        background-color: #dc2828;
        color: #fff;
      }
    }
  }
  // 历史业绩
  .pastReturn-part {
    .part-header {
      p {
        background-image: url("../img/lishiyeji.png");
      }
    }
    .pastReturn-content {
      padding: 1rem 1.02rem;
      .c-top {
        .date {
          margin-bottom: 30/40rem;
        }
      }
      .c-bottom {
        margin-top: 0.75rem;
        p {
          padding-left: 0.75rem;
          background-repeat: no-repeat;
          background-size: 0.6rem auto;
          background-position: left center;
        }
        p:first-child {
          background-image: url("../img/you-ico.png");
        }
        p:nth-child(2) {
          background-image: url("../img/liang-ico.png");
        }
        p:nth-child(3) {
          background-image: url("../img/zhong-ico.png");
        }
        p:last-child {
          background-image: url("../img/cha-ico.png");
        }
      }
    }
    .pastReturn-content > div {
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      font-size: 0.6rem;
      color: #96969b;
    }
  }
  // 投资组合
  .portfolio-part {
    .part-header {
      p {
        background-image: url("../img/touzizuhe.png");
      }
    }
    .portfolio-content {
      padding: 1rem 0;
      div.chart-title {
        padding-left: 0.75rem;
      }
      div.chart-titleNew {
        padding-right: 0.75rem;
        display: flex;
        span {
          flex: 1;
        }
        .titleNewLeft {
          text-align: left;
        }
        .titleNewRight {
          text-align: right;
          font-size: .6rem;
          color: #96969B;
        }
      }
      div.chart-part {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.25rem;
        margin-top: 1rem;
        .chart-lenged {
          font-size: 0.6rem;
          color: #96969b;
          p {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 0.75rem;
            span {
              margin-right: 0.5rem;
            }
            span:first-child {
              display: block;
              width: 0.6rem;
              height: 0.6rem;
            }
            span:last-child {
              margin-right: 0;
            }
          }
          p:first-child {
            span:first-child {
              background-color: rgba(220,40,40,0.6);
            }
          }
          p:nth-child(2) {
            span:first-child {
              background-color: rgba(255,160,65,0.6);
            }
          }
          p:last-child {
            margin-bottom: 0;
            span:first-child {
              background-color: rgba(50,150,255,0.6);
            }
          }
        }
        .chart-wrapper {
          width: 7.5rem;
          height: 7.5rem;
        }
      }
      div.chart-part-noContent {
        font-size: .75rem;
        height: 3rem;
        line-height: 3rem;
        color: #96969B;
        text-align: center;
        margin-bottom: -1rem;
      }
    }
    // 1207
    .portfolio-contentNew {
      position: relative;
      .contentNew {
        padding: 0 .75rem;
        margin-top: 1rem;
        .industryName {
          width: 100%;
          height: 2rem;
          line-height: 2rem;
          border-radius: 2px;
          background: #F5F5F5;
          display: flex;
          font-size: .6rem;
          color: #96969B;
          .nameNew {
            flex: 1;
          }
          .nameTwo {
            flex: 2;
          }
          .Left {
            padding-left: .75rem;
            text-align: left;
          }
          .center {
            text-align: center;
          }
          .Right {
            padding-right: .75rem;
            text-align: right;
          }
        }
        .industryList {
          margin-top: .5rem;
          .pad {
            padding-bottom: 1rem;
          }
          ul {
            li {
              display: flex;
              height: 1.6rem;
              line-height: 1.6rem;
              .list {
                flex: 1;
                font-size: .6rem;
                color: #19191E;
              }
              .listTwo {
                flex: 2;
              }
              .listName {
                flex: 2;
                text-align: left;
                padding-left: .75rem;
              }
              .listRateNew {
                text-align: center;
              }
              .listRate {
                flex: 1;
                text-align: right;
                padding-right: .75rem;
              }
            }
          }

        }
        .more {
          position: relative;
          text-align: center;
          font-size: 0.6rem;
          color: #96969B;
          height: 1.75rem;
          line-height: 1.75rem;
          margin-top: .75rem;
          .moreIcon {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 20%;
          }
          .moreUp {
            background-image: url('../img/up.png')
          }
          .moreDown {
            background-image: url('../img/down.png')
          }
        }
        .more::after {
          content: " ";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background-image: linear-gradient(0deg,  #DCDCDC 50%,  #DCDCDC 50%);
        }
      }
    }
    .portfolio-contentNew::before {
      content: " ";
      position: absolute;
      left: .75rem;
      right: .75rem;
      top: 0;
      height: 1px;
      background-image: linear-gradient(0deg,  #DCDCDC 50%,  #DCDCDC 50%);
    }
    .portfolio-contentNewTwo {
      padding-bottom: 0;
    }
  }
  // 基金档案
  .fundRecord-part {
    margin-bottom: 0;
    .part-header {
      p {
        background-image: url("../img/jijindangan.png");
      }
    }
    .fundRecord-content {
      box-sizing: border-box;
      padding: 0 0.75rem;
      width: 100%;
      .fundSituation-c {
        padding: 1rem 0 1.25rem 0;
        p {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          span {
            font-size: 0.75rem;
          }
          span:first-child {
            color: #96969b;
          }
          span:last-child {
            color: #19191e;
          }
          span.underline {
            color: #dc2828;
          }
        }
        p:first-child {
          span > img {
            display: inline-block;
            width: 0.75rem;
            height: auto;
            vertical-align: middle;
          }
        }
        p:last-child {
          margin-bottom: 0;
        }
      }
      .fundManager-c {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.825rem 0 1.075rem 0;
        img {
          display: block;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 50%;
        }
        div {
          width: 14.3rem;
          p {
            margin-bottom: 0.5rem;
            font-size: 0.6rem;
            color: #96969b;
          }
          p:first-child {
            display: flex;
            align-items: center;
            justify-content: space-between;
            span:first-child {
              font-size: 0.75rem;
              color: #19191e;
            }
          }
          p:last-child {
            margin-bottom: 0;
          }
        }
      }
      .fundNotice-c {
        div {
          padding: 1rem 0;
          p:first-child {
            word-break: break-all;
          }
          p:last-child {
            text-align: right;
          }
          .annotitle {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    .secondLevel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 2.75rem;
      border-bottom: 1px solid #dcdcdc;
      p {
        min-width: 1rem;
        min-height: 1px;
        img {
          display: block;
          width: 1rem;
          height: auto;
        }
      }

      p:first-child {
        font-size: 0.75rem;
        color: #19191e;
      }
    }
    .fundRecord-content > div {
      border-bottom: 1px solid #dcdcdc;
    }
    .fundRecord-content > div:last-child {
      border-bottom: none;
    }
  }
  // 公司声明
  .statement-part {
    box-sizing: border-box;
    padding: 1.25rem 0.875rem;
    padding-bottom: 4.25rem;
    width: 100%;
    background-color: #f5f5f5;
    p {
      font-size: 0.6rem;
      img {
        display: inline-block;
        margin-right: 0.25rem;
        width: 0.55rem;
        height: auto;
        vertical-align: middle;
      }
    }
    p:first-child {
      margin-bottom: 0.5rem;
      text-align: center;
    }
  }
  // 购买按钮
  .buyButton-part {
    box-sizing: border-box;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #dcdcdc;
    div {
      margin-bottom: 0;
    }
  }
  // 分割线
  .segmentation-line {
    width: 1px;
    height: 1.5rem;
    background-color: #dcdcdc;
  }
  // 公共头部
  .part-header {
    box-sizing: border-box;
    padding: 0.875rem 0.75rem;
    width: 100%;
    font-size: 0.75rem;
    color: #19191e;
    border-bottom: 1px solid #dcdcdc;
    p {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-size: 0.75rem;
      background-repeat: no-repeat;
      background-position: left center;
      span {
        margin-left: 1.25rem;
      }
      img {
        display: inline-block;
        width: 1rem;
        height: auto;
      }
    }
  }
}
#productDetails .fundBaseData-part,
#productDetails .dealRule-part,
#productDetails .pastReturn-part,
#productDetails .portfolio-part,
#productDetails .fundRecord-part {
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  width: 100%;
  background-color: #fff;
}
.diagnosis{
  font-size: 0.6rem;
  color: #DC2828;
  line-height: 0.6rem;
  border: 1px solid #DC2828;
  border-radius: 2px;
  padding: 0.2rem 0.4rem;
}
</style>
