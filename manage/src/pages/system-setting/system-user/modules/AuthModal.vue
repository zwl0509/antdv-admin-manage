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
        <a-tab-pane key="3" tab="用户视野" forceRender v-if="batch || activeKey == '3'">
          <user-vision ref="UserVision" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="部门视野" forceRender v-if="batch || activeKey == '4'">
          <department-vision ref="DepartmentVision" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import labels from '@/utils/labels'
import AppAuth from './AppAuth'
import SystemAuth from './SystemAuth'
import DepartmentVision from './DepartmentVision'
import UserVision from './UserVision'
import { defaultErrorMessage } from '@/utils/common'
export default {
  components: {
    DepartmentVision,
    UserVision,
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
      targetIds: [],
    }
  },
  methods: {
    change(e) {
      console.log(e)
    },
    show(id, index, batch, targetIds) {
      this.targetIds = targetIds
      this.activeKey = index
      this.batch = batch
      this.visible = true
      this.id = id
      const arr = [this.getSiteMapAuth(id), this.getVision(id)]
      Promise.all(arr)
        .catch((err) => defaultErrorMessage(err, labels.GET_DATA_FAIL))
        .finally(() => {
          this.confirmLoading = false
        })
    },
    // 获取 app 和 manage 用户权限
    getSiteMapAuth(targetId) {
      this.confirmLoading = true
      const params = {
        type: 'user',
        targetId,
      }
      return this.$get({
        url: this.$api.auth.getSiteMapAuth,
        params,
      }).then((res) => {
        this.$refs.AppAuth && this.$refs.AppAuth.show(res?.appAuthList || [])
        this.$refs.SystemAuth && this.$refs.SystemAuth.show(res?.systemAuthList || [])
      })
    },
    // 部门视野 / 用户视野
    getVision(id) {
      this.confirmLoading = true
      return this.$get({
        url: this.$api.auth.getView,
        params: { id },
        needResponse: true,
      }).then((res) => {
        this.$refs.UserVision && this.$refs.UserVision.setData(res?.result.userView || [])
        this.$refs.DepartmentVision && this.$refs.DepartmentVision.setData(res?.result.organizationView || [])
      })
    },
    handleSubmit() {
      let data = {}
      if (this.batch) {
        data = {
          organizationAuthorityDTO: {
            id: this.id,
            ids: this.$refs.DepartmentVision.getData(),
            type: '1052-20',
          },
          userAuthorityDTO: {
            id: this.id,
            ids: this.$refs.UserVision.getData(),
            type: '1052-10',
          },
          sitemapActionAuthorityEditDTOS: this.$refs.SystemAuth.getData(),
          sitemapActionAuthorityEditAppDTO: this.$refs.AppAuth.getData(),
          targetId: this.id,
        }
      } else {
        if (this.activeKey == '1') {
          data = {
            sitemapActionAuthorityEditAppDTO: null,
            sitemapActionAuthorityEditDTOS: this.$refs.SystemAuth.getData(),
            targetIds: this.targetIds,
          }
        }
        if (this.activeKey == '2') {
          data = {
            sitemapActionAuthorityEditAppDTO: this.$refs.AppAuth.getData(),
            sitemapActionAuthorityEditDTOS:null,
            targetIds: this.targetIds,
          }
        }
      }
      this.save(data)
    },
    // 保存
    save(data) {
      this.$post({
        url: this.batch ? this.$api.auth.menuAuthEdit : this.$api.auth.siteMapActionAuthorityBatch,
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
      this.$refs.DepartmentVision && this.$refs.DepartmentVision.clear()
      this.$refs.UserVision && this.$refs.UserVision.clear()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>