<template>
  <div id="information"
       v-if="pageReady">
    <scroll :isNeedLoading="0"
            :data="questionsList"
            @scroll="pageScroll">
      <div class="subject-wrapper"
           v-for="(item,index) in questionsList"
           :key="index">
        <div class="subject-title"><span>{{ item.orderBy }}、</span><span>{{ item.question }}：</span></div>
        <div class="subject-list"
             :class="{'haveInput' : answerItem.inputFlag == 'Y'}"
             v-for="(answerItem,answerIndex) in item.questionItems"
             :key="answerIndex"
             @click="selectAnswer(item.orderBy,answerItem.orderByCode,answerItem.inputFlag,item.qstnCode)">
          <p class="list-choiceButton">
            <span :class="{'active' : answerList[item.orderBy - 1] == answerItem.orderByCode}"></span>
          </p>
          <p class="list-answers">
            <span>{{ answerItem.itemName }}</span>
            <input type="text"
                   :class="{'force-redraw' : inputRedrawFlag}"
                   v-if="answerItem.inputFlag == 'Y'"
                   :disabled="answerList[item.orderBy - 1] != answerItem.orderByCode"
                   v-model="answerInfo[item.qstnCode]"
                   @input="inputChange"
                   maxlength="30">
          </p>
        </div>
      </div>
    </scroll>
    <!-- 下一步按钮 -->
    <div class="buyButton-part">
      <baseButton @click.native="nextStep"
                  :styleObj="buttonStyle">
        下一步
      </baseButton>
    </div>
  </div>
</template>
<script>
import scroll from 'components/subassembly/scroll.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import {toast} from 'js/api.js';
import {qryTestQuestions, riskQstnAnsECreate, queryRiskRecord} from 'js/request.js';

export default {
  name: 'Information',
  components: {
    scroll,
    baseButton
  },
  data () {
    return {
      pageReady: 0,
      active: 0,
      buttonStyle: {
        backgroundColor: '#dcdcdc',
        fontSize: '0.9rem',
        color: '#fff'
      },
      questionsList: [],
      answerList: [],
      answerInfo: {},
      isNeedInput: {},
      inputRedrawFlag: 0
    };
  },
  mounted () {
    this.getTestList();
  },
  methods: {
    // 获取题库列表
    getTestList () {
      let _this = this;
      qryTestQuestions({
        questionType: 1
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.questionsList = resp.data.data.questionsList;
          _this.qstnCategateId = resp.data.data.questionsList[0].qstnCategateId;
          _this.qstnVersion = resp.data.data.questionsList[0].qstnVersion;
          _this.$nextTick(function () {
            _this.pageReady = 1;
          });
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 选择答案
    selectAnswer (testId, answer, isHaveInput, qstnCode) {
      this.$set(this.answerList, testId - 1, answer);

      if (isHaveInput == 'Y') {
        this.$set(this.isNeedInput, testId - 1, qstnCode);
      } else {
        this.$set(this.answerInfo, qstnCode, '');
        this.$set(this.isNeedInput, testId - 1, 0);
      }

      // 根据是否选择完全部试题改变button的颜色
      if (this.checkIsTestAll()) {
        this.buttonStyle.backgroundColor = '#DC2828';
      } else {
        this.buttonStyle.backgroundColor = '#dcdcdc';
      }
    },
    // input输入时检测是否点亮按钮
    inputChange () {
      // 根据是否选择完全部试题改变button的颜色
      if (this.checkIsTestAll()) {
        this.buttonStyle.backgroundColor = '#DC2828';
      } else {
        this.buttonStyle.backgroundColor = '#dcdcdc';
      }
    },
    // 判断是否做完试题
    checkIsTestAll () {
      // 是否选择了全部试题
      let isHaveChoseAll = true;
      for (var i = 0; i < this.answerList.length; i++) {
        if (!this.answerList[i]) {
          isHaveChoseAll = false;
          break;
        }
      }

      // 已选择需要输入的内容的答案是否输入了内容
      let isInputHaveValue = true;
      for (var j in this.isNeedInput) {
        if (this.isNeedInput[j]) {
          if (!this.answerInfo[this.isNeedInput[j]]) {
            isInputHaveValue = false;
            break;
          }
        }
      }

      if (this.answerList.length < this.questionsList.length || !isHaveChoseAll || !isInputHaveValue) {
        return false;
      } else {
        return true;
      }
    },
    // 下一步按钮
    nextStep () {
      let _this = this;

      if (_this.checkIsTestAll()) {
        // 获取input框中的输入值
        let answerInfos = {};
        for (let k in this.answerInfo) {
          if (this.answerInfo[k]) {
            answerInfos[k] = encodeURI(this.answerInfo[k]);
          }
        }

        riskQstnAnsECreate({
          answer: _this.answerList.join(','),
          answerInfo: JSON.stringify(answerInfos),
          questionType: '1',
          qstnCategateId: _this.qstnCategateId,
          qstnVersion: _this.qstnVersion
        }).then(function (resp) {
          if (resp.data.respCode == '000') {
            _this.isRiskTest();
          } else {
            toast(resp.data.respMessage);
          }
        });
      } else {
        toast('请完成全部试题');
      }
    },
    // 是否做过测评
    isRiskTest () {
      let _this = this;
      queryRiskRecord().then(function (resp) {
        if (resp.data.respCode == '000') {
          if (resp.data.data.riskReviewFlag == 'Y') {
            _this.$router.replace({path: '/riskTest'});
          } else {
            _this.$router.replace({path: '/informationResult'});
          }
        } else {
          toast(resp.data.respMessage);
        }
      });
    },
    // 滚动时强制重绘input框 解决滚动时光标不随页面滚动
    pageScroll () {
      if (this.inputRedrawFlag == 1) {
        this.inputRedrawFlag = 0;
      } else {
        this.inputRedrawFlag = 1;
      }
    }
  }
};
</script>
  <style lang="less" scoped>
  /**滚动时强制重绘input框 解决滚动时光标不随页面滚动*/
  input {
    text-shadow: rgba(0,0,0,0) 0px 0px 0px;
  }
  input.force-redraw {
    text-shadow: none;
  }
  #information {
    box-sizing: border-box;
    position: relative;
    padding: 0 30/40rem;
    padding-bottom: 60/20rem;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    .subject-wrapper {
      padding: 20/20rem 0;
      font-size: 30/40rem;
      border-bottom: 1px solid #dcdcdc;
      div.subject-title {
        display: flex;
        align-items: baseline;
        justify-content: flex-start;
        margin-bottom: 50/40rem;
        span:first-child {
          flex-shrink : 0;
        }
      }
      div.subject-list {
        padding-left: 30/40rem;
        margin-bottom: 40/40rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        p.list-choiceButton {
          flex-shrink:0;
          span {
            box-sizing: border-box;
            display: block;
            margin-right: 15/20rem;
            width: 40/40rem;
            height: 40/40rem;
            opacity: 0.5;
            background-image: url("../img/select2.png");
            background-size: 100% 100%;
          }
          span.active {
            background-image: url("../img/my-radio-select.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: 0 0;
            border:none;
            opacity: 1;
          }
        }
        p.list-answers {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          span {
            line-height: 1.2;
          }
          input {
            padding-left: 40/40rem;
            margin-left: 40/40rem;
            display: inline-block;
            height: 80/40rem;
            font-size: 30/40rem;
            color: #19191e;
            background-color: #fff;
            border: 1px solid #DCDCDC;
            border-radius: 4px;
          }
          input[disabled] {
            background-color: #f0f0f0;
          }
        }
      }
      div.subject-list.haveInput {
        align-items: center;
        p.list-answers {
          display: inline-block;
        }
      }
      div.subject-list:last-child {
        margin-bottom: 0;
      }
    }
    .subject-wrapper:last-child {
      border: none;
    }
    // 下一步按钮
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
  }
  </style>
