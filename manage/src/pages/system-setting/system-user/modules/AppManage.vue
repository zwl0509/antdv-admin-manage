<template>
  <a-modal
    title="用户app权限"
    ref="modal"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <div>
      <authority-manage ref="AuthorityManage2" :type="'user'"></authority-manage>
    </div>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import AuthorityManage from './AuthorityManage'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    components: {
      AuthorityManage
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        id: '',
        activeKey: '1',
        departmentList: [],
        userVision: []
      }
    },
    methods: {
      show(id) {
        this.visible = true
        this.id = id
        this.$nextTick(()=> {
          this.getDetail(id)
          this.$refs.AuthorityManage2.show(id ,0)
        })
      },
      getDetail(id) {
        this.$get({
          url: this.$api.auth.getView,
          params:{ id},
          needResponse: true
        }).then((res)=>{
          this.departmentList = res.result.organizationView || []
          this.userVision = res.result.userView || []
        })
      },
      handleSubmit() {
        const data = {
          sitemapActionAuthorityEditAppDTO: this.$refs.AuthorityManage2.getData(),
          targetId: this.id
        }
        this.save(data)
      },
      // 保存
      save(data) {
        this.$post({
          url: this.$api.auth.menuAuthEdit,
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
      handleCancel() {
        this.visible = false
        this.activeKey = '1'
        this.id = ''

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>