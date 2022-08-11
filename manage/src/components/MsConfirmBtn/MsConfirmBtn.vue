<template>
  <a-popconfirm :title="confirmTitle" @confirm="$emit('confirm')">
    <a href="javascript:;" :class="['ant-btn-background-ghost', 'ant-btn-danger']" :style="{ color }">{{ text }}</a>
  </a-popconfirm>
</template>

<script>
export default {
  name: 'MsConfirmBtn',
  components: {},
  props: {
    text: {
      type: String,
      default: '删除'
    },
    confirmTitle: {
      type: String,
      default: '确认删除吗？'
    },
    color: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  created () {
  },
  methods: {},
  computed: {},
  watch: {}
}
</script>

<style scoped>
</style>
