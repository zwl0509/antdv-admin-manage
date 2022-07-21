<template>
  <a-modal
    :title="modal_title"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="tabKey" v-if="modal_type === 2">
        <a-tab-pane key="1" tab="客户信息">
          <!-- 基础信息 -->
          <base-info ref="BaseInfo"></base-info>
          <!-- 其他信息 -->
          <other-info ref="OtherInfo" :type="type"></other-info>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目成员" forceRender>
          <project-menber ref="ProjectMenber"></project-menber>
        </a-tab-pane>
      </a-tabs>
      <other-info ref="OtherInfo" :type="type" v-if="modal_type === 1"></other-info>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import BaseInfo from './BaseInfo'
  import OtherInfo from './OtherInfo'
  import ProjectMenber from './ProjectMenber'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    components: {
      BaseInfo,
      ProjectMenber,
      OtherInfo
    },
    name: 'EvasionApply',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 1 :
            return '批量逃单'
          case 2 :
            return '逃单申请'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: 0,
        form: this.$form.createForm(this),
        visible: false,
        confirmLoading: false,
        tabKey: '1',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        ids: [],
        classification: undefined,
        remark: '',
        EvasionClassify: [],
        dataList: [],
        type: '',
        positionIds: []
      }
    },
    methods: {
      show (ids, type){
        this.visible = true
        this.modal_type = type
        this.ids = ids
        this.getDetail(ids)
      },
      shows (ids,type){
        this.visible = true
        this.modal_type = type
        this.ids = ids
        this.$nextTick(() => {
          this.$refs.OtherInfo.setData({ evasionApply: true })
        })
      },

      // 获取详情
      getDetail(customerId) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.intendedCustomInfo.getEvasionDetail,
          params: { customerId }
        }).then((res) =>{
          const data = { ...res }
          this.$refs.BaseInfo.setData(data)
          this.$refs.ProjectMenber.setData(data.employeeList)
          this.$refs.OtherInfo.setData({ evasionApply: true })
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit () {
        this.loading = true
        this.$refs.OtherInfo.getData().then(res=>{
          const data = {
            customerIds : this.ids,
            type : '1040-20',
            isReborn : false,
            classification: res.classification,
            remark : res.remark
          }
          this.save(data)
        })
      },
      save(data) {
        this.$post({
          url: this.$api.customInfo.flyOrEvasionInfo.application,
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
          .finally(() => { this.loading = false })
      },
      handleCancel() {
        this.visible = false
        this.id = ''
        this.tabKey = '1'
        this.type = ''
        this.$refs.OtherInfo.clearInput()
      }
    }

  }
</script>
<style lang="scss" scoped>
  ::v-deep .col-1-9{
    .ant-form-item-label{
      width: 11.111111%;
      float: left;
      line-height: 20px;
      label{
        white-space: break-spaces;
      }
    }
    .ant-form-item-control-wrapper{
      width: 88.888888%;
      float: left;
    }
  }
</style>