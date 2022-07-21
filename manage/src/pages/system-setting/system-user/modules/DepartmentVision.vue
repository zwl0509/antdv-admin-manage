<template>
  <a-spin :spinning="confirmLoading">
    <a-tree
      v-model="checkedKeys"
      checkable
      class="tree-scroll"
      :replaceFields="{children: 'children', title: 'name', key: 'id'}"
      :tree-data="treeData"
    />
  </a-spin>
</template>

<script>
  import { defaultErrorMessage } from '@/utils/common'
  import labels from '@/utils/labels'
  export default {
    data() {
      return {
        checkedKeys: [],
        treeData: [],
        confirmLoading: false,
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      show(list) {
        this.checkedKeys = list
      },
      getMenuList() {
        this.confirmLoading = true
        this.$get({
          url: this.$api.organization.getTreeList,
        }).then(res => {
          this.treeData = res || []
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      getData() {
        return this.checkedKeys || []
      },
      setData(list) {
        this.checkedKeys = list
      },
      clear() {
        this.checkedKeys = []
      }
    }
  }
</script>

<style lang="scss" scoped>
.tree-scroll {
  max-height: 520px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>