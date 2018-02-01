<template>
  <div id="appPage">
    <commonTitle />
    <div class="content-wrapper"
         :class="{'noTitle' : !titleShow}">
      <keep-alive :include="['productDetails','dealRule','netWorth','informationResult']">
        <router-view/>
      </keep-alive>
    </div>
    <keep-alive>
      <component :is="loadingName"/>
    </keep-alive>
  </div>
</template>
<script>
import commonTitle from 'components/subassembly/commonTitle.vue';
import loading from 'components/subassembly/loading.vue';
import diagnosisLoad from 'components/diagnosis/diagnosisLoad.vue';

export default {
  name: 'AppPage',
  components: {
    commonTitle,
    loading,
    diagnosisLoad
  },
  data () {
    return {

    };
  },
  computed: {
    titleShow () {
      return this.$store.getters.titleShowFlag;
    },
    loadingName () {
      return this.$store.getters.loadingName;
    }
  },
  methods: {

  }
};
</script>
<style lang="less" scoped>
#appPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content-wrapper {
    box-sizing: border-box;
    flex: 1;
    position: relative;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
  }
  .content-wrapper>div {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .noTitle {
    padding-top: 0;
  }
}
</style>
