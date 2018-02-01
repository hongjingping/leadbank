<template>
  <div>
    <div class="step1 stepTop">
      <input-box :inputMessage="name"
                 type="text"
                 v-model="inputName"
                 @input="inputChange"
                 maxlength="32"
                 :inputType="nameNumber"/>
      <space-empty />
      <input-box :inputMessage="card"
                 type="text"
                 maxlength="18"
                 v-model="inputCard"
                 @input="inputChange"
                 :inputType="nameNumber"/>
      <space-empty />
      <div class="confirm">友情提示：基本资料信息填写完成后不可修改，请认真填写信息。</div>
      <space-empty/>
    </div>
    <space/>
    <div class="step1">
      <space-empty/>
      <base-button :styleObj="buttonObj"
                   @click.native="butNext"
                   :disabled="disabled">
        下一步
      </base-button>
    </div>
  </div>
</template>

<script>
import space from 'components/subassembly/space.vue';
import inputBox from 'components/subassembly/input.vue';
import spaceEmpty from 'components/subassembly/spaceEmpty.vue';
import baseButton from 'components/subassembly/BaseButton.vue';
import {toast} from 'js/api.js';
export default {
  components: {
    'input-box': inputBox,
    'space-empty': spaceEmpty,
    'base-button': baseButton,
    'space': space
  },
  data () {
    return {
      name: '姓名',
      card: '身份证',
      inputName: '',
      inputCard: '',
      buttonObj: {
        color: '#fff',
        backgroundColor: ''
      },
      disabled: true,
      nameNumber: 'name'
    };
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('UPDATE_HOWSTEP', to.meta.step);
    });
  },
  methods: {
    inputChange () {
      let self = this;
      if (self.inputName != '' && self.inputCard != '' && self.inputName != ' ' && self.inputCard != ' ') {
        self.disabled = false;
        self.buttonObj.backgroundColor = '#DC2828';
        self.$store.commit('UPDATE_NAME', self.inputName);
        self.$store.commit('UPDATE_CARD', self.inputCard);
      } else {
        self.disabled = true;
        self.buttonObj.backgroundColor = '#DCDCDC';
        self.$store.commit('UPDATE_NAME', '');
        self.$store.commit('UPDATE_CARD', '');
      }
    },
    butNext () {
      let self = this;
      let reg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/);
      sessionStorage.setItem('name', self.inputName);
      sessionStorage.setItem('card', self.inputCard);
      if (self.inputCard.length < 15) {
        toast('身份证位数不正确');
      } else if (reg.test(self.inputCard) == false) {
        toast('身份证输入不合法');
      } else {
        self.$router.push({path: '/openAccount/openAccountPassword'});
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .step1{
    padding: 0rem 0.75rem 0.5rem;
    .confirm{
      color: #96969B;
      font-size: .6rem
    }
  }
  .stepTop{
    padding: 0rem 0.75rem 0.25rem;
  }
</style>
