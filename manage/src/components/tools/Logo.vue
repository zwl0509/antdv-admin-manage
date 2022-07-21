<template>
  <div class="logo">
    <router-link :to="{ name }">
      <!--      <LogoSvg alt="logo" />-->
      <a-tooltip :title="title">
        <img class="logo-img" :src="require('../../assets/logo.png')" alt="">
        <h1 v-if="showTitle">{{ title || '' }}</h1>
      </a-tooltip>
    </router-link>
  </div>
</template>

<script>
// import LogoSvg from '@/assets/logo.svg?inline'
import { domTitle } from '@/utils/dom-util'
import { mapGetters } from 'vuex'

export default {
  name: 'Logo',
  components: {
    // LogoSvg
  },
  props: {
    title: {
      type: String,
      default: domTitle
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['addRouters']),
    name () {
      return this.addRouters[0].name
    }
  }
}
</script>
<style scoped lang="scss">

.logo-img {
  border-radius: 5px;
}
</style>
