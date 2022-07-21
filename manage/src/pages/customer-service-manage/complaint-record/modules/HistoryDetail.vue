<template>
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
        <a-collapse-panel key="1" header="投诉信息" forceRender>
          <complaint-info ref="ComplaintInfo" :type="type"></complaint-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="工单列表" forceRender>
          <work-order-list ref="WorkOrderList" :type="type"></work-order-list>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
    <template slot="footer">
      <div v-if="type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import ComplaintInfo from './ComplaintInfo'
  import WorkOrderList from './WorkOrderList'
  export default {
    name:'HistoryDetail',
    components:{
      ComplaintInfo,
      WorkOrderList
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
          case 0 :
            return '历史投诉记录详情'
          case 1 :
            return '历史报修记录详情'
          case 2 :
            return '历史回访记录详情'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: 1,
        status: '',
        visible: false,
        confirmLoading: false,
        isError: false,
        errorMessage: '获取数据失败',
        activeKey: ['1'],
        id: '',
        type:'detail',
        expandedRowKeys: [],
      }
    },
    methods: {
      edit(record,value ) {
        this.modal_type = value
        this.visible = true
        this.getDetail(record.id)
        this.$emit('getCodeList')
        this.$nextTick(() => {
          this.$refs.ComplaintInfo.getCodeList(this.codeType)
          this.$refs.WorkOrderList.getCodeList(this.codeType)
        })
      },
      // 获取详情
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customerServiceInfo.getDetail,
          params: { id }
        }).then((res) =>{
          const data = { ...res }
          const recordType = []
          data.recordTypes.forEach(item =>{
            recordType.push(item.type)
          })
          data.recordType = recordType
          this.id = data.id
          this.$refs.ComplaintInfo.setData(data)
          this.$refs.WorkOrderList.setData(data.dispatchInfos)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit() {},
      handleCancel() {
        this.visible = false
        this.activeKey = ['1']
        this.isError = false
        this.id = ''
        this.$refs.WorkOrderList.clearInput()
        this.$refs.ComplaintInfo.clearInput()
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>