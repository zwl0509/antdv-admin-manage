<template>
  <!-- 材料到场 -->
  <a-modal
    title="材料到场"
    :width="900"
    :centered="true"
    :visible="visible"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-table
        rowKey="uuid"
        ref="Table"
        class="small-table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        <span slot="IsMBPCanShip" slot-scope="text">
          {{ text ? '已发送货通知' : '未发送货通知' }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$refs.MaterialDetail.show(record)">材料明细</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a @click="$refs.MaterialTracking.show(record)">材料跟踪</a>
          </template>
        </span>
      </a-table>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleDeclare">主材申报情况</a-button>
    </template>
    <!--主材申请情况  -->
    <a-modal title="主材申请情况" :centered="true" :visible="declareVisible" @cancel="declareCancel">
      <div style="margin-left: 20px; font-size: 14px;" v-if="declareInfo">
        <div>主材占比: {{ declareInfo.JichuZhangBiOrJiChuZaojia.toFixed(2) * 100 }}%</div>
        <div>已收工程款: {{ declareInfo.ReceivedEngineerFunds.toFixed(2) }}</div>
        <div>最大可领金额: {{ declareInfo.MaxKeLingMoney.toFixed(2) }}</div>
        <div>已申请金额: {{ declareInfo.YiLingMoney.toFixed(2) }}</div>
        <div>已开单金额: {{ declareInfo.YiKaidanMoney.toFixed(2) }}</div>
        <div>可用金额: {{ declareInfo.KeyongMoney.toFixed(2) }}</div>
      </div>
      <template slot="footer">
        <a-button @click="declareCancel">取消</a-button>
      </template>
    </a-modal>
    <!-- 材料明细 -->
    <material-detail ref="MaterialDetail"></material-detail>
    <!-- 材料跟踪 -->
    <material-tracking ref="MaterialTracking" @ok="refresh"></material-tracking>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { v4 as uuid } from 'uuid'
  import { defaultErrorMessage } from '@/utils/common'
  import MaterialTracking from './MaterialTracking.vue'
  import MaterialDetail from './MaterialDetail.vue'
  export default {
  components: { MaterialTracking, MaterialDetail },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        declareVisible: false,
        id: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '材料品牌名称',
            align: 'center',
            dataIndex:'Brand',
          },
          {
            title: '单据号',
            align: 'center',
            dataIndex:'BillNo',
          },
          {
            title: '单据状态',
            align: 'center',
            dataIndex:'IsMBPCanShip',
            scopedSlots: { customRender: 'IsMBPCanShip' }
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataList: [],
        customerId: '',
        declareInfo: null,
      }
    },
    methods: {
      show(record) {
        this.customerId = record.id
        this.visible = true
        this.getDetail()
      },
      // 获取详情
      getDetail() {
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.materialConfirmInfo.getMaterialDetail,
          params: { customerId: '0' }
        }).then((res) =>{
          const list = [ ...res ]
          list.forEach(el=> {
            el.uuid = uuid()
          })
          this.dataList = list
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleDeclare() {
        this.declareVisible = true
        this.$get({
          url: this.$api.basicData.materialConfirmInfo.masterMaterialInfo,
          params: { customerId: '0' }
        }).then((res) =>{
          const data = { ...res }
          this.declareInfo = data
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
      },  
      declareCancel() {
        this.declareInfo = null
        this.declareVisible = false
      },
      refresh() {
        this.getDetail()
      },
      handleCancel() {
        this.id = ''
        this.visible = false
      }
    }

  }
</script>

<style lang="scss" scoped>
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
</style>