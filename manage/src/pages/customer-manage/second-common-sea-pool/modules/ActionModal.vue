<template>
  <!-- 资源客户新增 -->
  <a-modal
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
        <a-collapse-panel key="1" header="客户基本信息" forceRender>
          <base-info ref="BaseInfo" :type="modal_type"></base-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="客户扩展信息" forceRender>
          <extend-info ref="ExtendInfo" :type="modal_type"></extend-info>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="客户其他信息" forceRender>
          <other-info ref="OtherInfo" :type="modal_type"></other-info>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="客户深化信息" forceRender>
          <deepen-info ref="DeepenInfo" :type="modal_type"></deepen-info>
        </a-collapse-panel>
        <a-collapse-panel key="5" header="客户扩展其他信息" forceRender>
          <more-info ref="MoreInfo" :type="modal_type"></more-info>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import BaseInfo from '../../high-sea-pool-customer/modules/BaseInfo'
  import OtherInfo from '../../high-sea-pool-customer/modules/OtherInfo'
  import ExtendInfo from '../../high-sea-pool-customer/modules/ExtendInfo'
  import DeepenInfo from '../../high-sea-pool-customer/modules/DeepenInfo'
  import MoreInfo from '../../high-sea-pool-customer/modules/MoreInfo'

  export default {
    components:{
      BaseInfo,
      OtherInfo,
      ExtendInfo,
      DeepenInfo,
      MoreInfo
    },
    props: {
      codeType: {
        type: Object,
        default: null
      }
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'add' :
            return '新增二见公海池客户'
          case 'edit' :
            return '编辑二见公海池客户'
          case 'detail' :
            return '二见公海池客户详情'
          case 'apply' :
            return '多房申请'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: 'add',
        visible: false,
        confirmLoading: false,
        isError: false,
        errorMessage: '获取数据失败',
        activeKey: ['1'],
        baseInfo: null,
        id: ''
      }
    },
    methods: {
      add(status) {
        this.status = status
        this.modal_type = 'add'
        this.visible = true
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          this.$refs.OtherInfo.getCodeList(this.codeType)
          this.$refs.ExtendInfo.getCodeList(this.codeType)
          this.$refs.DeepenInfo.getCodeList(this.codeType)
          this.$refs.MoreInfo.getCodeList(this.codeType)
        })
      },
      edit(record , type, status) {
        this.status = status
        this.modal_type = type
        this.visible = true
        this.getDetail(record.id)
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType,record.areaNamePath)
          this.$refs.OtherInfo.getCodeList(this.codeType)
          this.$refs.ExtendInfo.getCodeList(this.codeType)
          this.$refs.DeepenInfo.getCodeList(this.codeType)
          this.$refs.MoreInfo.getCodeList(this.codeType)
        })
      },
      // 多房审核
      apply(record, type, status) {
        this.modal_type = type
        this.status = status
        this.visible = true
        this.$emit('getCodeList')
        this.getDetail(record.id)
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          this.$refs.OtherInfo.getCodeList(this.codeType)
        })
      },
      // 获取详情
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.resourceCustomer.getDetail,
          params: { 
            id,
            menuId: this.$route.meta.id
          }
        }).then((res) =>{
          const data = { ...res }
          this.id = data.id
          const applyData = {
            gender:data.customerBaseInfo.gender || '',
            customerName: data.customerBaseInfo.customerName || '',
            customerShowName:data.customerBaseInfo.customerShowName || '',
            mobileNumber: data.customerBaseInfo.mobileNumber || '',
            mobileNumberHide: data.customerBaseInfo.mobileNumberHide || '',
            storeId: data.customerBaseInfo.storeId || '',
            storeName: data.customerBaseInfo.storeName || ''
          }
          this.$refs.BaseInfo.setData(this.modal_type == 'apply' ? applyData : data.customerBaseInfo)
          this.$refs.OtherInfo.setData(this.modal_type == 'apply' ? null : data.customerExtendInfo)
          this.$refs.ExtendInfo.setData(this.modal_type == 'apply' ? null : data.customerSubsidiaryInfo)
          this.$refs.DeepenInfo.setData(this.modal_type == 'apply' ? null : data.customerDeepInfo)
          this.$refs.MoreInfo.setData(this.modal_type == 'apply' ? null : data.customerOthersInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const values = {
          customerBaseInfo: null,
          customerExtendInfo: null,
          customerSubsidiaryInfo: null,
          customerDeepInfo: null,
          customerOthersInfo: null,
        }
        this.$refs.BaseInfo.getData().then((res)=>{
          res.type = this.status
          values.customerBaseInfo = res
          values.isSelf = res.isSelf
          values.reason = res.reason || ''
          return this.$refs.OtherInfo.getData()
        }).then(res => {
          values.customerExtendInfo = res
          return this.$refs.ExtendInfo.getData()
        }).then(res => {
          values.customerSubsidiaryInfo = res
          return this.$refs.DeepenInfo.getData()
        }).then(res => {
          values.customerDeepInfo = res
          return this.$refs.MoreInfo.getData()
        }).then(res => {
          values.customerOthersInfo = res
          return  this.save(values)
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      save(data,isMultiHouse = false) {
        this.confirmLoading = true
        data.id = this.modal_type == 'apply'? '' : this.id
        data.isImport = false
        data.userId = this.$store.state.user.info.id
        data.isMultiHouse = this.modal_type == 'apply' || isMultiHouse ? true : false
        this.$post({
          url: this.$api.customInfo.resourceCustomer.edit,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => {
          if(err.message == '该手机号已经被录入！！！') {
            const that = this
            this.$confirm({
              title: '多房申请',
              content: (h) => <div style="color:red;">该客户的手机号已经被录入,是否申请多房?</div>,
              onOk() {
                that.save(data,true)
              },
              class: 'test',
            })
          } else {
            defaultErrorMessage(err, labels.SAVE_FAIL)
          }
        })
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.$refs.BaseInfo.clearInput()
        this.$refs.OtherInfo.clearInput()
        this.$refs.ExtendInfo.clearInput()
        this.$refs.DeepenInfo.clearInput()
        this.$refs.MoreInfo.clearInput()
        this.visible = false
        this.activeKey = ['1']
        this.isError = false
        this.id = ''
      }
    }
    
  }
</script>

<style lang="scss" scoped>

</style>