<template>
  <a-modal
    class="to-do-action"
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-divider>客户基本信息</a-divider>
      <base-info ref="BaseInfo" :type="type"></base-info>
      <a-divider v-if="modal_type">{{ modal_title }}</a-divider>
      <!-- 通用审核 -->
      <a-form :form="form" v-if="modal_type && modal_type !== '1056-40'">
        <a-col :md="8" :xs="24">
          <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择审核状态" v-decorator="['status',{rules: [{required: true}],initialValue: '1010-20'}]">
              <a-select-option v-for="item in codeType.statusList" :key="item.value" :value="item.value">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :xs="24">
          <a-form-item label="审核内容" class="col-1-9">
            <a-textarea
              :rows="3"
              placeholder="请输入审核内容"
              autocomplete="off"
              :maxLength="500"
              v-decorator="['auditContent',{rules: [{required: true}]}]"/>
          </a-form-item>
        </a-col>
      </a-form>
      <!-- 客户阶段审核 -->
      <stage-apply v-if="modal_type && modal_type == '1056-40' && auditStatus == '1076-30'" ref="StageApply"></stage-apply>
      <!-- 问卷调查 -->
    </a-spin>
    <template slot="footer">
      <div>
        <a-tabs v-if="!modal_type" @tabClick="trackingProcess" type="card" :tabBarGutter="8" :style="{width: 'calc(100% - 90px)',display: 'inline-block'}">
          <a-tab-pane v-for="item in stageButtonList" :key="item.id" :tab="item.name" ></a-tab-pane>
        </a-tabs>
        <div :class="stageButtonList.length && !modal_type? 'tab-btn' : 'tab-apply' ">
          <a-button @click="handleCancel">取消</a-button>
          <a-button v-if="modal_type" type="primary" @click="handleSubmit">确认</a-button>
        </div>
      </div>
    </template>
    <!-- 派工表单 -->
    <dispatch-from ref="DispatchFrom" @ok="handleOk"></dispatch-from>
    <!-- 设计合同表单 -->
    <design-contract ref="DesignContract" @ok="handleOk"></design-contract>
    <!-- 上传附件表单 -->
    <upload-pic ref="UploadPic" @ok="handleOk"></upload-pic>
    <!-- 施工合同表单 -->
    <sign-contract-from ref="SignContractFrom" @ok="handleOk"></sign-contract-from>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import BaseInfo from '@/pages/customer-manage/high-sea-pool-customer/modules/BaseInfo.vue'
  import DispatchFrom from '@/pages/customer-manage/agreement-common-sea-pool/modules/DispatchFrom.vue'
  import DesignContract from '@/pages/customer-manage/agreement-common-sea-pool/modules/DesignContract.vue'
  import UploadPic from '@/pages/customer-manage/design-phase/modules/UploadPic.vue'
  import SignContractFrom from '@/pages/customer-manage/design-phase/modules/SignContractFrom.vue'
  import StageApply from './StageApply.vue'
  export default {
    components: { BaseInfo, DispatchFrom, DesignContract, StageApply, UploadPic, SignContractFrom},
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case '1056-10' :
            return '保留审核'
          case '1056-20' :
            return '期房审核'
          case '1056-30' :
            return '多房审核'
          case '1056-40' :
            return '客户阶段审核'
          case '1040-10' :
            return '飞单审核'
          case '1040-20' :
            return '逃单审核'
          default:
            return '跟踪流程'
        }
      }
    },
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    name: 'ActionModal',
    data () {
      return {
        type: 'detail',
        modal_type:'',
        confirmLoading: false,
        visible: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        labelCol01: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol01: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        id: '',
        applyRelationId: '',
        stageButtonList: [],
        auditStatus: '', // 移交后走流程阶段
      }
    },
    methods: {
      show (record) {
        this.visible = true
        this.id = record.applyId || ''
        this.auditStatus = record.auditStatus
        this.modal_type = record.applyType
        this.applyRelationId = record.applyRelationId || ''
        !record.isView && this.getStatus(record)
        this.$emit('getCodeList')
        this.getDetail(record)
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          record.applyType == '1056-40' && this.$refs.StageApply && this.$refs.StageApply.setData(record)
        })
      },
      getStatus(record){
        this.$get({
          url: this.$api.toDealWith.isView,
          params: { id: record.id },
          needResponse: true
        }).then(res => {
          this.$emit('ok')
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      getDetail(record){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.resourceCustomer.getDetail,
          params: { id: record.applyRelationId }
        }).then((res) =>{
          const data = { ...res }
          this.applyRelationId = data.id
          // 要办理的流程
          this.stageButtonList = data.customerWorkFlowInfo.currentWorkFlowInfos || []
          this.$refs.BaseInfo.setData(data.customerBaseInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      trackingProcess(id) {
        const item = this.stageButtonList?.find(item=> item.id === id)
        switch (item.workFlowRelationFormCode) {
          case '1059-10': // 派工表单
            this.$refs.DispatchFrom.show(this.applyRelationId, item)
            break
          case '1059-20': // 量房表单
            this.$refs.DispatchFrom.show(this.applyRelationId, item)
            break
          case '1059-30': // 设计表单
            this.$refs.DesignContract.show(this.applyRelationId, item)
            break
          case '1059-40': // 附件表单
            this.$refs.SignContractFrom.show(this.applyRelationId,item)
            break
          case '1059-50': // 附件表单
            this.$refs.UploadPic.show(this.applyRelationId, item)
            break
          default:
            this.$notification.warning({
              message: labels.HINT,
              description: '暂无此流程表单，请新增绑定流程表单!'
            })
            break
        }
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            values.type = this.modal_type
            values.ids = [this.id]
            if(this.modal_type == '1040-10' || this.modal_type == '1040-20') {
              this.applySave(values)
            } else if (this.modal_type == '1056-40' ) {
              this.$refs.StageApply.getData().then(res=> {
                return this.save(res)
              })
            }else {
              this.save(values)
            }
          }
        })
      },
      // 飞单逃单审核
      applySave(data) {
        this.$post({
          url: this.$api.customInfo.flyOrEvasionInfo.audit,
          data,
          needResponse: true
        })
          .then(res => {
            this.handleOk()
            this.$notification.success({
              message: labels.AUDIT_SUCCESS,
              description: res.message || ''
            })
          })
          .catch(err => defaultErrorMessage(err, labels.AUDIT_ERROR))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      save (data) {
        this.confirmLoading = true
        this.$post({
          url:this.$api.customInfo.customerCommon.audit,
          data,
          needResponse: true
        }).then(res=>{
          this.handleOk()
          this.$notification.success({
            message:labels.AUDIT_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err,labels.AUDIT_ERROR))
          .finally(() => {this.confirmLoading = false })
      },
      handleOk(){
        this.handleCancel()
        this.$emit('ok')
      },
      handleCancel() {
        this.visible = false
        this.tabKey = '1'
        this.activeKey = ['1']
        this.modal_type = ''
        this.id = ''
        this.applyRelationId = ''
        this.stageButtonList = []
        this.auditStatus = ''
        this.$refs.BaseInfo.clearInput()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .to-do-action {
    .tab-btn {
      display: inline-block;
      line-height: 3;
      overflow: hidden;
      margin-left: 20px;
    }

    .tab-apply {
      text-align: right;
    }

    ::v-deep .col-1-9 {
      .ant-form-item-label {
        width: 11.111111%;
        float: left;
        label{
          white-space: break-spaces;
        }
      }
      .ant-form-item-control-wrapper{
        width: 88.888888%;
        float: left;
      }
    }

    ::v-deep .ant-tabs-bar  {
      margin: 0;
      border-bottom: none;
    }

    ::v-deep .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
      background: #EEE;
    }

    ::v-deep .ant-tabs-nav .ant-tabs-tab-active {
      text-shadow: none;
    }

    ::v-deep .ant-modal-footer {
      text-align: left;
    }
  }
</style>