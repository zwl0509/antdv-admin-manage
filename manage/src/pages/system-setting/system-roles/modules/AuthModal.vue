<template>
  <a-modal
    title="权限管理"
    ref="modal"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-tabs type="card" :tabBarGutter="10" v-model="activeKey" @change="change(activeKey)">
        <a-tab-pane key="1" tab="用户后台权限" forceRender v-if="batch || activeKey == '1'">
          <system-auth ref="SystemAuth" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="用户app权限" forceRender v-if="batch || activeKey == '2'">
          <app-auth ref="AppAuth" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import labels from '@/utils/labels'
import AppAuth from './AppAuth'
import SystemAuth from './SystemAuth'
import { defaultErrorMessage } from '@/utils/common'
export default {
  components: {
    SystemAuth,
    AppAuth,
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      loading: false,
      id: '',
      activeKey: '1',
      batch: true, //不批量时为true
      targetId: '',
    }
  },
  methods: {
    change(e) {
      console.log(e)
    },
    show(record, index, batch, targetId) {
      console.log(record.id, index, batch, targetId)
      this.targetId = targetId
      this.activeKey = index
      this.batch = batch
      this.visible = true
      this.id = record.id
      const arr = [this.getSiteMapAuth()]
      Promise.all(arr)
        .catch((err) => defaultErrorMessage(err, labels.GET_DATA_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })
    },
    // 获取 app 和 manage 用户权限
    getSiteMapAuth() {
      this.confirmLoading = true
      return this.$get({
        url: this.$api.auth.getAuthChooseList,
        params: {
          type: 'roles',
          targetId: this.id,
        }
      }).then((res) => {
        this.$refs.AppAuth && this.$refs.AppAuth.show(res?.appAuthList || [])
        this.$refs.SystemAuth && this.$refs.SystemAuth.show(res?.systemAuthList || [])
      })
    },
    handleSubmit() {
      let data = {}
      if (this.batch) {
        data = {
          sitemapActionAuthorityEditDTOS: this.$refs.SystemAuth.getData(),
          sitemapActionAuthorityEditAppDTO: this.$refs.AppAuth.getData(),
          targetId: this.id,
        }
      } else {
        if (this.activeKey == '1') {
          data = {
            sitemapActionAuthorityEditAppDTO: null,
            sitemapActionAuthorityEditDTOS: this.$refs.SystemAuth.getData(),
            targetId: this.targetId,
          }
        }
        if (this.activeKey == '2') {
          data = {
            sitemapActionAuthorityEditAppDTO: this.$refs.AppAuth.getData(),
            sitemapActionAuthorityEditDTOS:null,
            targetId: this.targetId,
          }
        }
      }
      this.save(data)
    },
    // 保存
    save(data) {
      this.$post({
        url: this.$api.auth.menuAuthEdit,
        data,
        needResponse: true,
      })
        .then((res) => {
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || '',
          })
        })
        .catch((err) => defaultErrorMessage(err, labels.SAVE_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleCancel() {
      this.visible = false
      this.activeKey = '1'
      this.id = ''
      this.$refs.AppAuth && this.$refs.AppAuth.clear()
      this.$refs.SystemAuth && this.$refs.SystemAuth.clear()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>