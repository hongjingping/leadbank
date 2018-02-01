<template>
  <div id="resume" v-if="pageReady">
    <scroll :isNeedLoading="0">
      <p>welcome to sh~</p>
    </scroll>
  </div>
</template>

<script>
import scroll from 'components/subassembly/scroll.vue';

export default {
  name: 'resume',
  components: {
    scroll
  },
  data () {
    return {
      pageReady: 0
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    getDetail: function () {
      let _this = this;
      _this.$nextTick(function () {
        _this.pageReady = 1;
      })
    }
  }
}
</script>

<style>

</style>
