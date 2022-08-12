<template>
  <!-- 材料跟踪 -->
  <a-modal
    title="材料跟踪"
    :width="700"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-timeline v-if="info">
        <a-timeline-item color="#CBCBCB">
          <a-icon v-if="info.isShowIcon" slot="dot" type="check-circle" style="font-size: 18px; color: #6CAAE7" />
          <div>{{ info.PlaceDate }}</div>
          <div>{{ PlaceStatusList[info.PlaceStatus].name }}</div>
        </a-timeline-item>
        
        <a-timeline-item color="#CBCBCB">
          <a-icon v-if="info.isShowIcon" slot="dot" type="check-circle" style="font-size: 18px; color: #6CAAE7" />
          <div>{{ info.MBPAcceptDate }}</div>
          <div>{{ MBPAcceptStatusList[info.MBPAcceptStatus].name }}</div>
        </a-timeline-item>
        
        <a-timeline-item color="#CBCBCB">
          <a-icon v-if="info.isShowIcon" slot="dot" type="check-circle" style="font-size: 18px; color: #6CAAE7" />
          <div>{{ info.MBPDeliverDate }}</div>
          <div>{{ MBPDeliverStatusList[info.MBPDeliverStatus].name }}</div>
        </a-timeline-item>

        <a-timeline-item color="#CBCBCB">
          <a-icon v-if="info.isShowIcon" slot="dot" type="check-circle" style="font-size: 18px; color: #6CAAE7" />
          <div>{{ info.ConfirmDate }}</div>
          <div>{{ WorkerCheckedStatusList[info.WorkerCheckedStatus].name }}</div>
        </a-timeline-item>

        <a-timeline-item color="#CBCBCB">
          <a-icon v-if="info.isShowIcon" slot="dot" type="check-circle" style="font-size: 18px; color: #6CAAE7" />
          <div>{{ info.MBPInstallDate }}</div>
          <div>{{ MBPInstallStatusList[info.MBPInstallStatus].name }}</div>
        </a-timeline-item>

        <a-timeline-item color="#CBCBCB">
          <a-icon v-if="info.isShowIcon" slot="dot" type="check-circle" style="font-size: 18px; color: #6CAAE7" />
          <div>{{ info.NotReceiveDate }}</div>
          <div>{{ IsNotReceiveList[info.IsNotReceive].name }}</div>
        </a-timeline-item>
      </a-timeline>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="$refs.TrackingModal.show('10', billMasterId)">送货通知</a-button>
      <a-button type="primary" @click="$refs.TrackingModal.show('20', billMasterId)">特权送货</a-button>
      <a-button type="primary" @click="handleSubmit">收货不属实</a-button>
      <a-button type="primary" @click="$refs.MaterialConfirm.show(billMasterId)">到场确认</a-button>
    </template>
    <!-- 送货通知 -->
    <tracking-modal ref="TrackingModal" @ok="handleOk"></tracking-modal>
    <!-- 到场材料确认 -->
    <material-confirm ref="MaterialConfirm"></material-confirm>
  </a-modal>
</template>

<script>
  const PlaceStatusList = [
    { value: 0, name: '未下订单', isShowIcon: false },
    { value: 1, name: '已下订单', isShowIcon: true },
  ]
  const MBPAcceptStatusList = [
    { value: 0, name: '材料商未确认', isShowIcon: false },
    { value: 1, name: '材料商部分确认', isShowIcon: true },
    { value: 2, name: '材料商已确认', isShowIcon: true },
  ]
  const MBPDeliverStatusList = [
    { value: 0, name: '未发货', isShowIcon: false },
    { value: 1, name: '已发货', isShowIcon: true },
  ] 
  const WorkerCheckedStatusList = [
    { value: 0, name: '工长未确认', isShowIcon: false },
    { value: 1, name: '工长部分确认', isShowIcon: true },
    { value: 2, name: '工长已确认', isShowIcon: true },
  ]
  const MBPInstallStatusList = [
    { value: 0, name: '未安装', isShowIcon: false },
    { value: 1, name: '部分安装', isShowIcon: true },
    { value: 2, name: '已安装', isShowIcon: true },
  ]
  const IsNotReceiveList = [
    { value: 0, name: '收货不属实', isShowIcon: false },
    { value: 1, name: '收货属实', isShowIcon: true },
  ]

  import moment from 'moment'
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import TrackingModal from './TrackingModal.vue'
  import MaterialConfirm from './MaterialConfirm.vue'
  export default {
  components: { TrackingModal, MaterialConfirm },
    name: 'MaterialTracking',
    data () {
      return {
        PlaceStatusList,
        MBPAcceptStatusList,
        MBPDeliverStatusList,
        WorkerCheckedStatusList,
        MBPInstallStatusList,
        IsNotReceiveList,
        visible: false,
        confirmLoading: false,
        info: null,
        billMasterId: ''
      }
    },
    methods: {
      show(record) {
        this.visible = true
        this.billMasterId = record.BillMasterID
        this.getDetail(record)
      },
      getDetail(record) {
        const data = {
          PlaceStatus: record.PlaceStatus || 0,
          PlaceDate: record.PlaceDate ? moment(record.PlaceDate).format('YYYY-MM-DD') : null ,
          MBPAcceptStatus: record.MBPAcceptStatus || 0,
          MBPAcceptDate: record.MBPAcceptDate ? moment(record.MBPAcceptDate).format('YYYY-MM-DD') : null ,
          MBPDeliverStatus: record.MBPDeliverStatus || 0,
          MBPDeliverDate: record.MBPDeliverDate ? moment(record.MBPDeliverDate).format('YYYY-MM-DD') : null ,
          WorkerCheckedStatus: record.WorkerCheckedStatus || 0,
          ConfirmDate: record.ConfirmDate ? moment(record.ConfirmDate).format('YYYY-MM-DD') : null ,
          MBPInstallStatus: record.MBPInstallStatus || 0,
          MBPInstallDate: record.MBPInstallDate ? moment(record.MBPInstallDate).format('YYYY-MM-DD') : null ,
          IsNotReceive: record.IsNotReceive || 0,
          NotReceiveDate: record.NotReceiveDate ? moment(record.NotReceiveDate).format('YYYY-MM-DD') : null ,
        }
        this.info = data
      },
      handleSubmit() {
        this.handleCancel()
      },
      handleOk(){
        this.$emit('ok')
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
        this.info = null
        this.billMasterId = ''
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>