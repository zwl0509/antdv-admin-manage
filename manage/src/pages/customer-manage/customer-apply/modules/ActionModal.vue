<template>
  <!-- 客户公海池新增 -->
  <a-modal
    :title="modal_title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion>
        <a-collapse-panel key="1" header="客户基本信息" forceRender>
          <base-info ref="BaseInfo" :type="modal_type"></base-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="客户其他信息" forceRender>
          <other-info ref="OtherInfo" :type="modal_type"></other-info>
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
  import { defaultErrorMessage } from '@/utils/common'
  import BaseInfo from '../../high-sea-pool-customer/modules/BaseInfo'
  import OtherInfo from '../../high-sea-pool-customer/modules/OtherInfo'
  export default {
    components:{
      BaseInfo,
      OtherInfo,
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
        id: '',
      }
    },
    methods: {
      show(record ,type){
        this.modal_type = type
        this.visible = true
        this.getDetail(record.customerId)
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.BaseInfo.getCodeList(this.codeType)
          this.$refs.OtherInfo.getCodeList(this.codeType)
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
          const applyData = {
            customerName: data.customerBaseInfo.customerName || '',
            mobileNumber: data.customerBaseInfo.mobileNumber || '',
          }
          this.$refs.BaseInfo.setData(this.modal_type == 'apply' ? applyData : data.customerBaseInfo)
          this.$refs.OtherInfo.setData(data.customerExtendInfo)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.$refs.BaseInfo.clearInput()
        this.$refs.OtherInfo.clearInput()
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