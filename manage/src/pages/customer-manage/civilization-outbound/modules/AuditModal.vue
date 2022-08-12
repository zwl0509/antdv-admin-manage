<template>
  <a-modal
    title="文明出库审核"
    :width="1200"

    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-table
        ref="listPage"
        row-key="id"
        :columns="columns"
        :data-source="dataList"
        :scroll="{ x: 3000,y:300 }">
        <template #serial="t, record, index">
          <span>
            <span style="margin-left: 8px">{{ index + 1 }}</span>
          </span>
        </template>
      </a-table>
      <a-form :form="form">
        <a-row>
          <a-col :md="6" :xs="24">
            <a-radio-group v-model="value">
              <a-radio :value="true">
                通过审核
              </a-radio>
              <a-radio :value="false">
                不通过审核
              </a-radio>
            </a-radio-group>
          </a-col>
          <a-col :md="24" :xs="24" >
            <a-form-item label="申请备注" >
              <a-textarea
                :rows="3"
                placeholder="请输入备注内容"
                autocomplete="off"
                v-decorator="['remark', { rules:[{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 500) }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import labels from '@/utils/labels'
import { checkErrors, defaultErrorMessage } from '@/utils/common'
import { maxLenValidator } from '@/utils/common'
import moment from 'moment'

export default {
  props:{
    codeType:{
      type:Array,
      default:null,
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      id: '',
      value:true,
      dataList:[],
      columns:[
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
      ],
    }
  },
  methods: {
    maxLenValidator,
    show (id) {
      this.id = id
      this.visible = true
      this.getDataList(id)
    },
    getDataList(id) {
      this.confirmLoading = true
      this.$get({
        url: this.$api.customInfo.civilizedDeliveryInfo.getDetail,
        params: { id: id }
      }).then(res => {
        this.dataList = res.materials
      }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
        .finally(() => {this.confirmLoading = false })
    },
    getStatus () {
      const { form: { validateFields } } = this
      return new Promise((resolve,reject)=> {
        validateFields((errors, values) => {
          if(!errors) {
            resolve(values)
          } else {
            const keys = ['knownInfo','focusOn']
            reject(checkErrors(keys, errors))
          }
        })
      })
    },
    getDto() {
      const dto = {}
      const status = this.value?this.codeType[0].value:this.codeType[1].value
      this.getStatus().then(res => {
       res.remark?dto.auditContent =res.remark:''
      })
      dto.id = this.id
      dto.applyStatus = status
      return dto
    },
    handleSubmit () {
      const dto = this.getDto()

      this.$post({
        url:this.$api.customInfo.civilizedDeliveryInfo.audit,
        data: dto
      }).then((res)=>{
        this.handleCancel()
        this.$emit('ok')
        this.$notification.success({
          message:labels.AUDIT_SUCCESS,
          description: res?.message || ''
        })
      }).catch(err => defaultErrorMessage(err,labels.AUDIT_ERROR))
        .finally(() => {this.confirmLoading = false })
    },
    handleCancel () {
      this.visible = false
    },
  },
}
</script>

<style scoped>

</style>