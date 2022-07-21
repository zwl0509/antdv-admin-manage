<template>
  <!-- 客户公海池新增 -->
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
        <a-collapse-panel key="1" header="基础信息" forceRender>
          <base-info ref="BaseInfo" :type="modal_type"></base-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="合同信息" forceRender>
          <contract-info ref="ContractInfo" :type="modal_type"></contract-info>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="付款信息" forceRender>
          <pay-info ref="PayInfo" :type="modal_type"></pay-info>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="材料信息" forceRender>
          <material-info ref="MaterialInfo" :type="modal_type"></material-info>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
    <template slot="footer">
      <div v-if="modal_type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import BaseInfo from '../../high-sea-pool-customer/modules/BaseInfo'
  import ContractInfo from './ContractInfo'
  import { defaultErrorMessage } from '@/utils/common'
  import PayInfo from '@/pages/customer-manage/worker-dispatch/modules/PayInfo'
  import MaterialInfo from '@/pages/customer-manage/worker-dispatch/modules/MaterialInfo'
  export default {
    components:{
      MaterialInfo,
      PayInfo,
      BaseInfo,
      ContractInfo,
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
          case 'detail' :
            return '客户详情'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: 'detail',
        visible: false,
        confirmLoading: false,
        isError: false,
        errorMessage: '获取数据失败',
        activeKey: ['1'],
        id: ''
      }
    },
    methods: {
      show(type) {
        this.modal_type = type
        this.visible = true
        // this.getDetail(record.id)
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          this.$refs.ContractInfo.getCodeList(this.codeType)
        })
      },
      // 获取详情
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.highSeaPoolCustomer.getDetail,
          params: { id }
        }).then((res) =>{
          const data = { ...res }
          this.id = data.id
          this.$refs.BaseInfo.setData(data.customerBaseInfo)
          this.$refs.ContractInfo.setData(data.customerExtendInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {
        const values = {
          customerBaseInfo: null,
          customerExtendInfo: null
        }
        this.$refs.BaseInfo.getData().then((res)=>{
          res.type = '1033-10'
          values.customerBaseInfo = res
          return this.$refs.ContractInfo.getData()
        }).then(res => {
          values.customerExtendInfo = res
          return this.save(values)
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
      },
      save(data) {
        this.confirmLoading = true
        data.id = this.id
        this.$post({
          url: this.$api.customInfo.highSeaPoolCustomer.edit,
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
        this.$refs.BaseInfo.clearInput()
        this.$refs.ContractInfo.clearInput()
        this.$refs.ContractInfo.clearInput()
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