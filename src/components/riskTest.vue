<template>
  <div id="riskTest"
       v-if="pageReady">
    <scroll :isNeedLoading="0"
            :data="subjectList">
      <div>
        <div class="subject-wrapper"
             v-for="(item,index) in subjectList"
             :key="index"
             :ref="'list'+index">
          <p class="subject-title"><span>{{ index + 1 }}、</span><span>{{ item.question }}</span></p>
          <p class="subject-list"
             v-for="(listItem, listId) in item.questionItems"
             :key="listId"
             @click="choice(index,listItem.orderByCode)">
            <span :class="{'active' : answerList[index] == listItem.orderByCode}"></span><span>{{ listItem.itemName }}</span>
          </p>
        </div>
      </div>
    </scroll>
    <div class="submitButton">
      <baseButton :styleObj="styleObj"
                  @click.native="submitAnswer">
        提交
      </baseButton>
    </div>
  </div>
</template>
<script>
import scroll from 'components/subassembly/scroll.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import {toast} from 'js/api.js';
import {riskQstnAnsECreate, qryTestQuestions} from 'js/request.js';

export default {
  name: 'RiskTest',
  components: {
    scroll,
    baseButton
  },
  data () {
    return {
      pageReady: 0,
      subjectList: [],
      answerList: [],
      styleObj: {
        backgroundColor: '',
        color: '#fff'
      }
    };
  },
  mounted () {
    this.riskQuestion();
  },
  activated () {
    let _this = this;
    if (JSON.stringify(this.answerList) != '{}') {
      _this.answerList = {};
    }
    _this.$nextTick(function () {
      _this.pageReady = 1;
    });
  },
  methods: {
    // 风险测评题目
    riskQuestion () {
      let self = this;
      qryTestQuestions({
        'questionType': '2'
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          self.subjectList = resp.data.data.questionsList;
          self.$nextTick(function () {
            self.pageReady = 1;
          });
        }
      });
    },
    choice (index, orderByCode) {
      this.$set(this.answerList, index, orderByCode);
      if (this.checkIsTestAll()) {
        this.styleObj.backgroundColor = '#DC2828';
      } else {
        this.styleObj.backgroundColor = '#dcdcdc';
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
      if (this.answerList.length < this.subjectList.length || !isHaveChoseAll) {
        return false;
      } else {
        return true;
      }
    },
    submitAnswer () {
      let _this = this;
      if (!_this.checkIsTestAll()) {
        toast('请做完测试题');
        return;
      }
      riskQstnAnsECreate({
        answer: _this.answerList.join(','),
        qstnCategateId: _this.subjectList[0].qstnCategateId,
        qstnVersion: _this.subjectList[0].qstnVersion,
        questionType: '2'
      }).then(function (resp) {
        if (resp.data.respCode == '000') {
          _this.$router.replace({path: 'riskResult', query: {isH5: true}});
        } else {
          toast(resp.data.respMessage);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#riskTest {
  box-sizing: border-box;
  padding: 0 30/40rem;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 60/20rem;
  div {
    .subject-wrapper {
      padding: 1rem 0rem 1.25rem;
      font-size: 0.75rem;
      border-bottom: 1px solid #dcdcdc;
      p {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        line-height: 1.2;
        span:first-child {
          flex-shrink : 0;
        }
      }
      .subject-list {
        margin-top: 1.25rem;
      }
      p:first-child {
        padding-top: 0;
        padding-bottom: 0.125rem;
      }
      p.subject-list {
        span:first-child {
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
    }
    .subject-wrapper:last-child {
      border-bottom: none;
    }
  }
  .submitButton {
    box-sizing: border-box;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #dcdcdc;
  }
}
</style>
