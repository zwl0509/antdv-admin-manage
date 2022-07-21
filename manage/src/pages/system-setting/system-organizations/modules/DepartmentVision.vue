<template>
  <a-modal
    title="权限管理"
    :width="700"
    :visible="visible"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-tree
        v-if="treeList.length"
        v-model="checkedKeys"
        checkable
        class="tree-scroll"
        :replaceFields="{children: 'children', title: 'name', key: 'id'}"
        :tree-data="treeList"
        :defaultExpandedKeys="['0-0']"/>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    data() {
      return {
        visible: false,
        checkedKeys: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        treeList: [],
        id: ''
      }
    },
    methods: {
      show(id) {
        this.visible = true
        this.id = id
        this.getMenuList()
        this.getDetail(id)
      },
      getMenuList() {
        this.confirmLoading = true
        this.$get({
          url: this.$api.organization.getTreeList,
        }).then(res => {
          const parentMenu = [
            {
              id: '0-0',
              name: '全部地区',
              expanded: true,
              children: res || []
            }
          ]
          this.treeList = parentMenu || []
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const data = {
          id: this.id,
          authorityIds: this.checkedKeys || [],
        }
        this.save(data)
      },
      // 保存
      save(data) {
        this.$post({
          url: this.$api.organization.authority,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.organization.getAuthority,
          params: { id }
        }).then(res => {
          const data = res || []
          this.checkedKeys = data
        })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleCancel() {
        this.visible = false
        this.id = ''
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