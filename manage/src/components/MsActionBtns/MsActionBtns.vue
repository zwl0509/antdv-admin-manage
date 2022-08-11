<template>
  <div class="flex col-grow flex-center">
    <slot name="prefix"/>
    <template v-for="(item, i) in showActions">
      <template v-if="item.key.indexOf('.Delete') > -1">
        <ms-confirm-btn
          :key="item.id || i"
          @confirm="$emit(item.eventName)"
          :text="item.name || undefined"
          :confirm-title="item.confirmTitle || undefined"
          :confirm-text="item.confirmText || undefined"
          :color="item.color || undefined"
        />
      </template>
      <template v-else>
        <a href="javascript:;" :key="item.id || i" @click="$emit(item.eventName)">{{ item.name || '' }}</a>
      </template>
      <a-divider :key="(item.id || i) + '-separator'" type="vertical" v-if="i !== showActions.length - 1"></a-divider>
    </template>
    <slot />
  </div>
</template>

<script>
import MsConfirmBtn from '@/components/MsConfirmBtn/MsConfirmBtn'
export default {
  name: 'MsActionBtns',
  components: {
    MsConfirmBtn
  },
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    /**
     * @property {Array} 对应数据action的key值
     * @description 显示action的key范围，不在当前数组值范围内的key不显示
     * */
    includeKeys: {
      type: Array,
      default: () => []
    },
    /**
     * @property {Array} 对应数据action的key值
     * @description 显示action的key范围，在当前数组值范围内的key不显示
     * */
    excludeKeys: {
      type: Array,
      default: () => []
    },
    /**
     * @description 扩展按钮
     * @property {Array}
     * @value: {Object} Object.key: String 对应数据项key 必传,
     *                  Object.color: String 对应quasar调色板的值, 显示按钮文字颜色 默认：green-9,
     *                  Object.confirmTitle: String 弹出框的标题
     *                  Object.eventName: String 对应向父级传递的事件名称 默认：key值中以.分割后最后一个字符串的第一个字符转小写的值
     *
     * */
    additions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showActions: []
    }
  },
  created () {
  },
  methods: {
    filterList (list) {
      let array = [...list]
      if (this.includeKeys && this.includeKeys.length) array = array.filter(m => m && this.includeKeys.includes(m.key))
      if (this.excludeKeys && this.excludeKeys.length) array = array.filter(m => m && !this.excludeKeys.includes(m.key))
      this.showActions = this.dealActions(array)
    },
    dealActions (actions) {
      if (this.additions && this.additions.length) {
        let item, m, index
        const keys = this.additions.map(m => m.key)
        for (let i = 0; i < actions.length; i++) {
          m = actions[i]
          index = keys.indexOf(m.key)
          item = index > -1 ? this.additions[index] : null
          if (item) {
            actions[i] = { ...m, ...item }
          }
        }
      }
      return actions.map(m => {
        if (!m.eventName) {
          m.eventName = m.key.split('.').reverse()[0]
          m.eventName = m.eventName[0].toLowerCase() + m.eventName.substring(1)
        }
        return { ...m }
      })
    }
  },
  computed: {},
  watch: {
    actions: {
      handler (v) {
        v && v.length ? this.filterList(v) : this.showActions = []
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
</style>
