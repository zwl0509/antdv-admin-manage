<template>
  <a-modal
    :title="title"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-table
        ref="listPage"
        row-key="id"
        :columns="columns"
        :data-source="dataList"
        :scroll="{ x: 3000,y:460 }">
        <template #serial="t, record, index">
          <span>
            <span style="margin-left: 8px">{{ index + 1 }}</span>
          </span>
        </template>
        <template #applyNum="t, record, index" v-if="!id">
          <div style="padding: 4px 0">
            <a-input
              style="width: 80%"
              placeholder="请输入材料数量"
              autocomplete="off"
              v-model="record.applyNum"
              v-decorator="['applyNum', { rules: [{ required: true, message: '请输入材料数量!'}, { validator: (r, v, fun) => numberValidator(r, v, fun, 'int') }] }]">
            </a-input>
          </div>
        </template>
      </a-table>
    </a-spin>
    <template slot="footer" v-if="id">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
const applyColumns =  [
  {
    title: ['序号'],
    width: 80,
    dataIndex: 'serial',
    scopedSlots: {
      customRender: 'serial',
    }
  },
  {
    title: '数量',
    dataIndex: 'applyNum',
    width: 200,
    scopedSlots: { customRender: 'applyNum' }
  },
  {
    title: '材料编码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '材料名称',
    dataIndex: 'materialName',
    width: 200,
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '品牌',
    dataIndex: 'brand'
  },
  {
    title: '型号',
    dataIndex: 'materialType'
  },
  {
    title: '规格',
    dataIndex: 'spec',
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '采购价格',
    dataIndex: 'buyPrice'
  },
  {
    title: '返点比例',
    dataIndex: 'rebateProportion'
  },
  {
    title: '销售价格',
    dataIndex: 'salePrice'
  },
  {
    title: '承包价',
    dataIndex: 'contractPrice'
  },
  {
    title: '加盟价',
    dataIndex: 'joinPrice'
  },
  {
    title: '结算方式',
    dataIndex: 'clearingType'
  },
  {
    title: '特项编码',
    dataIndex: 'specialCode'
  },
  {
    title: '材料条码',
    dataIndex: 'barcode'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplyName',
    width: 200,
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '仓库名称',
    dataIndex: 'stockName',
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '库存数量',
    dataIndex: 'stockNum'
  },
  {
    title: '库存金额',
    dataIndex: 'stockMoney'
  },
]
const recordColumns =  [
  {
    title: ['序号'],
    width: 80,
    dataIndex: 'serial',
    scopedSlots: {
      customRender: 'serial',
    }
  },
  {
    title: '数量',
    dataIndex: 'applyNum',
    width: 200,
    scopedSlots: { customRender: 'applyNum' }
  },
  {
    title: '材料编码',
    dataIndex: 'materialCode',
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '材料名称',
    dataIndex: 'materialName',
    width: 200,
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '品牌',
    dataIndex: 'materialBrand'
  },
  {
    title: '型号',
    dataIndex: 'materialType'
  },
  {
    title: '规格',
    dataIndex: 'spec',
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '结算方式',
    dataIndex: 'clearingType'
  },
  {
    title: '特项编码',
    dataIndex: 'specialCode'
  },
  {
    title: '材料条码',
    dataIndex: 'barcode'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplyName',
    width: 200,
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '仓库名称',
    dataIndex: 'stockName',
    scopedSlots: { customRender:'ellipsis'}
  },
  {
    title: '库存数量',
    dataIndex: 'stockNum'
  },
  {
    title: '库存金额',
    dataIndex: 'stockMoney'
  },
]

import { defaultErrorMessage, numberValidator } from '@/utils/common'
import labels from '@/utils/labels'

export default {

  data () {
    return {
      columns:[],
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      isError: false,
      errorMessage: '获取数据失败',
      dataList:[],
      id:'',
      recordColumns,
      applyColumns,
      pagination:{
        pageSize: 10,
        current: 1,
      },
      title:'',
    }
  },
  methods: {
    numberValidator,
    show (data) {
      this.visible = true
      if(typeof data === 'string') {
        this.id = data
        this.getDetail()
      } else {
        data.forEach(item => {
          item.applyNum?item.applyNum = '': null
        })
        this.dataList = data
      }
      this.title = this.id ? '申请记录详情':'文明出库申请'
      this.columns = this.id? recordColumns:applyColumns
    },
    getDetail () {
      this.confirmLoading = true
      this.$get({
        url: this.$api.customInfo.civilizedDeliveryInfo.getDetail,
        params: { id: this.id }
      }).then(res => {
        this.dataList = res.materials
      }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
        .finally(() => {this.confirmLoading = false })
    },
    getData() {
      const dto = []
      let msg
      this.dataList.map(m => {
        const obj = {}
        m.applyNum?obj.applyNum = m.applyNum: msg = '数量不能为空'
        obj.materialId =  m.id
        dto.push(obj)
      })

      return msg?msg:dto
    },
    handleSubmit () {

      this.confirmLoading = true

      const materials = this.getData()
      if(typeof materials === 'string') {
        this.$notification.warning({
          message:labels.OPERATE_FAIL,
          description: materials
        })
        this.confirmLoading = false
      } else {
        this.$post({
          url: this.$api.customInfo.civilizedDeliveryInfo.application,
          data: { materials }
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message:labels.APPLY_SUCCESS,
            description: res?.message || ''
          })
        }).catch(err => defaultErrorMessage(err,labels.APPLY_ERROR))
          .finally(() => {this.confirmLoading = false })
      }

    },
    handleCancel () {
      this.visible = false
      this.isError = false
      this.dataList = []
    },
  },
}
</script>

<style scoped>

</style>