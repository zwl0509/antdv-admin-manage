<template>
  <a-spin :spinning="confirmLoading">
    <a-tree
      v-model="checkedKeys"
      checkable
      class="tree-scroll"
      :replaceFields="{children: 'children', title: 'materialClassName', key: 'id'}"
      :tree-data="treeData"
    />
  </a-spin>
</template>

<script>
  import { defaultErrorMessage } from '@/utils/common'
  import labels from '@/utils/labels'
  export default {
    name:'MaterialClassify',
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
          url: this.$api.basicsClass.materialClass.getTreeList,
        }).then(res => {
          this.treeData = res.rows || []
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      getData() {
        return this.checkedKeys || []
      },
      setData(list) {
        this.checkedKeys = list[0]?.authoritiesId || []
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