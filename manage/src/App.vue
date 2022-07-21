<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>

import '@/utils/initFontSize'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
// import moment from 'moment'
// import 'moment/locale/zh-cn'
import { AppDeviceEnquire } from '@/utils/mixin'

// moment.locale('zh-cn')
export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss">
</style>