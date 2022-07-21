<template>
  <a-modal
    :title="modalType === 'add' ? '新增优惠活动' : '编辑优惠活动'"
    :width="1100"
    :visible="visible"
    height="80%"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-alert v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="优惠活动编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入优惠活动编码"
                autocomplete="off"
                :max-length="64"
                v-decorator="['promotionCode', {rules: [{required: true, message: '请输入活动编码'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="优惠活动名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入优惠活动名称"
                autocomplete="off"
                :max-length="128"
                v-decorator="['promotionName', {rules: [{required: true, message: '请输入活动名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="活动门店" :labelCol="labelCol01" :wrapperCol="wrapperCol01">
              <a-tree-select
                placeholder="请选择活动门店"
                :multiple="true"
                :treeData="orgList"
                :replaceFields="{ title: 'name', value: 'code' }"
                allowClear
                dropdownMatchSelectWidth
                :dropdownStyle="{maxHeight: '300px'}"
                v-decorator="['codeList', {rules: [{required: true, message: '请选择活动门店'}]}]">
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="开始日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker show-time placeholder="请选择开始日期" style="width: 100%" v-decorator="['beginDate', { rules: [{required: true, message: '请选择开始日期'}] }]"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="结束日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker placeholder="请选择结束日期" style="width: 100%" v-decorator="['endDate', { rules: [{required: true, message: '请选择结束日期'}] }]"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="客户数上限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                placeholder="请输入客户数上限"
                autocomplete="off"
                style="width: 100%"
                type="number"
                v-decorator="['customerLimit', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch un-checked-children="否" checked-children="是" v-decorator="['isActive', { initialValue: true, valuePropName: 'checked' }]"></a-switch>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 4 } }" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 } }">
              <a-textarea
                auto-size
                placeholder="请输入备注"
                style="height: 80px"
                :max-length="500"
                v-decorator="['remark',{rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <list-page
              ref="listPage"
              :columns="columns"
              :data="loadData"
              :scroll="{ x: 1740 }"
              size="small"
              :rowKey="e => e.id || e.key"
              :locale="locale"
              :customRow="customRow"
              :show-search="false"
              :show-refresh="false"
              :createdLoadData="false"
              :rowSelection="{ fixed: false, columnWidth: 40, type: 'checkbox', selectedRowKeys: checkedRowIds, onChange: rowChange }"
            >
              <div slot="title" class="table-title">
                <span>已标记删除数：<span class="table-selected-total">{{ checkedRowIds.length }}</span></span>
                <span style="margin-left: 16px" v-if="!!checkedRowIds.length"><a @click="() => {checkedRowIds = []}"> 清空</a></span>
              </div>
              <template slot="$operate">
                <a-button type="primary" icon="plus" @click="addRow">新增材料</a-button>
              </template>
              <template slot="materialName" slot-scope="text">
                <ellipsis tooltip :length="28">{{ text }}</ellipsis>
              </template>
              <template slot="ellipsis" slot-scope="text">
                <ellipsis tooltip :length="10">{{ text }}</ellipsis>
              </template>
              <template slot="ellipsis2" slot-scope="text">
                <ellipsis tooltip :length="17">{{ text }}</ellipsis>
              </template>
              <template slot="rebateProportion" slot-scope="text, record">
                <a-input-number v-model="record.rebateProportion" :max="99999999999" auto-size/>
              </template>
              <template slot="price" slot-scope="text, record">
                <a-input-number v-model="record.price" :max="99999999999" auto-size/>
              </template>
              <template slot="salePrice" slot-scope="text, record">
                <a-input-number v-model="record.salePrice" :max="99999999999" auto-size/>
              </template>
              <template slot="buyPrice" slot-scope="text, record">
                <a-input-number v-model="record.buyPrice" :max="99999999999" auto-size/>
              </template>
              <template slot="color" slot-scope="text, record">
                <a-input v-model="record.color" auto-size/>
              </template>
              <template slot="brand" slot-scope="text, record">
                <a-input v-model="record.brand" auto-size/>
              </template>
              <template slot="materialType" slot-scope="text, record">
                <a-input v-model="record.materialType" auto-size/>
              </template>
              <template slot="texture" slot-scope="text, record">
                <a-input v-model="record.texture" auto-size/>
              </template>
              <template slot="typeSerial" slot-scope="text, record">
                <a-input v-model="record.typeSerial" auto-size/>
              </template>
              <template slot="remark" slot-scope="text, record">
                <a-textarea v-model="record.remark" auto-size/>
              </template>
            </list-page>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <select-material ref="selectMaterial" @ok="handleSelected"></select-material>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {
    defaultErrorMessage,
    regularCheck2,
    filedIsNull,
    maxLenValidator,
    numberValidator,
    zhStringLength,
    checkErrors
  } from '@/utils/common'
  import labels from '@/utils/labels'
  import { v4 as uuid } from 'uuid'
  import { Ellipsis } from '@/components'
  import SelectMaterial from '@/pages/basic-data/offer-information/modules/SelectMaterial'
  import moment from 'moment'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'

  export default {
    components: {
      Ellipsis,
      ListPage,
      SelectMaterial
    },
    data () {
      return {
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
          sm: { span: 4 }
        },
        wrapperCol01: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        orgList: [], // 门店tree
        errorMessage: '',
        isError: false,
        columns: [
          { ...defaultTableColumns.serial, width: 60 },
          {
            title: '材料编码',
            dataIndex: 'materialCode',
            width: 160,
            align: 'center',
            scopedSlots: {
              customRender: 'ellipsis2'
            }
          },
          {
            title: '材料名称',
            dataIndex: 'materialName',
            align: 'center',
            width: 240,
            scopedSlots: {
              customRender: 'materialName'
            }
          },
          {
            title: '规格',
            dataIndex: 'spec',
            align: 'center',
            width: 160,
            scopedSlots: {
              customRender: 'ellipsis2'
            }
          },
          {
            title: '单位',
            dataIndex: 'unit',
            align: 'center',
            width: 120,
            scopedSlots: {
              customRender: 'ellipsis'
            }
          },
          {
            title: '返点比例',
            dataIndex: 'rebateProportion',
            align: 'center',
            width: 120,
            scopedSlots: {
              customRender: 'rebateProportion'
            }
          },
          {
            title: '市场价',
            align: 'center',
            dataIndex: 'price',
            width: 120,
            scopedSlots: {
              customRender: 'price'
            }
          },
          {
            title: '销售优惠价',
            dataIndex: 'salePrice',
            align: 'center',
            width: 120,
            scopedSlots: {
              customRender: 'salePrice'
            }
          },
          {
            title: '采购优惠价',
            dataIndex: 'buyPrice',
            align: 'center',
            scopedSlots: {
              customRender: 'buyPrice'
            },
            width: 120
          },
          {
            title: '颜色',
            dataIndex: 'color',
            align: 'center',
            width: 160,
            scopedSlots: {
              customRender: 'color'
            }
          },
          {
            title: '品牌',
            dataIndex: 'brand',
            align: 'center',
            width: 180,
            scopedSlots: {
              customRender: 'brand'
            }
          },
          {
            title: '型号',
            dataIndex: 'materialType',
            align: 'center',
            width: 240,
            scopedSlots: {
              customRender: 'materialType'
            }
          },
          {
            title: '材质',
            dataIndex: 'texture',
            align: 'center',
            width: 160,
            scopedSlots: {
              customRender: 'texture'
            }
          },
          {
            title: '类别序号',
            dataIndex: 'typeSerial',
            align: 'center',
            width: 160,
            scopedSlots: {
              customRender: 'typeSerial'
            }
          },
          {
            title: '销售优惠价备注',
            dataIndex: 'remark',
            align: 'center',
            width: 280,
            scopedSlots: {
              customRender: 'remark'
            }
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align: 'center',
          //   width: 80,
          //   fixed: 'right',
          //   scopedSlots: { customRender: 'action' }
          // }
        ],
        locale: {
          emptyText: this.$createElement('span', {}, ['暂无数据'])
        },
        materialList: [], // 展示的材料
        detailList: [], // 编辑获取原数据的材料
        selectList: [], // 新选择的材料
        checkedRowIds: [], // 编辑删除的ids
      }
    },
    created () {
      // console.log(this.columns.map(m => m.width || 0).reduce((a,b) => a+b))
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck2,
      loadData (pagination) {
        return new Promise(resolve => {
          resolve({
            rows: this.materialList,
            total: this.materialList.length
          })
        })
      },
      rowChange (ids, rows) {
        this.checkedRowIds = ids
      },
      customRow (r) {
        return {
          style: { minHeight: '54px' },
          on: {
            click: () => {
              // this.checkedRowIds.includes(r.id) ? this.checkedRowIds.splice(this.checkedRowIds.indexOf(r.id), 1) : this.checkedRowIds.push(r.id)
            }
          },
          class: { 'select-row': false }
        }
      },
      // 门店数据
      getOrgList () {
        const data = {
          currentPage: 1,
          pageSize: 1000
        }
        this.isError = false
        this.$get({
          url: this.$api.organization.getTreeList,
          params: data
        }).then(res => {
          this.orgList = res
        }).catch(err => {
          this.isError = true
          this.errorMessage = err && err.message || '获取机构数据失败'
        })
      },
      // 添加材料
      addRow () {
        this.$refs.selectMaterial.show(
          this.id,
          this.selectList.map(m => m.materialRelationId),
          this.selectList
        )
      },
      // 确认选择材料
      handleSelected (e) {
        // console.log(e)
        if (e) {
          this.checkedRowIds = []
          this.selectList = e.map(m => {
            const item = { ...m }
            item.materialRelationId = item.id
            item.id = ''
            item.relationId = this.id
            item.key = uuid()
            return item
          })
          this.materialList = [...this.selectList, ...this.detailList]
          this.$nextTick(() => {
            this.$refs.listPage.refresh()
          })
        }
      },
      // 新增
      add () {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
        this.getOrgList()
      },
      // 编辑
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.getOrgList()
        this.$get({
          url: this.$api.basicData.promotionInfo.getDetail,
          params: { id: record.id }
        })
          .then(res => {

            const data = { ...res }
            this.id = res.id
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.detailList = res.details
            this.materialList = [...this.detailList]
            data.codeList = res.stores?.map(m => m.storeOrgCode) || []
            data.beginDate = res.beginDate ? moment(res.beginDate, 'YYYY-MM-DD HH:mm:ss') : null
            data.endDate = res.endDate ? moment(res.endDate, 'YYYY-MM-DD') : null
            this.$nextTick(() => {
              this.$refs.listPage.refresh()
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      deepArr (node, value) {
        for (let i = 0; i < node.length; i++) {
          if (node[i].id === value) {
            return node[i].code
          } else if (node[i].children && node[i].children.length) {
            const val = this.deepArr(node[i].children, value)
            if (val) {
              return val
            }
          } else {
            return null
          }
        }
      },
      // 校验材料数据
      verifyData (list) {
        let msg = '', item
        const priceReg = /^(\d{0, 18})|(\d{0,16}(\.\d{0,1})?)|(\d{0,15}(\.\d{0,2})?)|(\d{0,14}(\.\d{0,3})?)|(\d{0,13}(\.\d{0,4})?)$/
        for (let i = 0; i < list.length; i++) {
          item = list[i]
          msg = item.rebateProportion && !priceReg.test(Number(item.rebateProportion)) && `第${i+1}行，返点比例超出最大值`
            || item.price && !priceReg.test(Number(item.price)) && `第${i+1}行，市场价超出最大值`
            || item.salePrice && !priceReg.test(Number(item.salePrice)) && `第${i+1}行，销售优惠价超出最大值`
            || item.buyPrice && !priceReg.test(Number(item.buyPrice)) && `第${i+1}行，采购优惠价超出最大值`
            || item.color && zhStringLength(item.color) > 50 && `第${i+1}行，颜色超出长度`
            // || item.brand && zhStringLength(item.brand) > 50 && `第${i+1}行，品牌超出长度`
            // || item.materialType && zhStringLength(item.materialType) > 50 && `第${i+1}行，型号超出长度`
            // || item.texture && zhStringLength(item.texture) > 50 && `第${i+1}行，材质超出长度`
            || item.typeSerial && zhStringLength(item.typeSerial) > 200 && `第${i+1}行，类别序号超出长度`
            || item.remark && zhStringLength(item.remark) > 200 && `第${i+1}行，销售优惠价备注超出长度`
          if (msg) return msg
        }
        return null
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            let list = this.materialList
            // console.log(values)
            if (values.beginDate?.isAfter(values.endDate)) {
              this.$notification.error({
                message: '保存失败',
                description: '开始时间不能大于结束日期'
              })
              this.confirmLoading = false
              return
            }
            if (this.checkedRowIds.length) {
              list = list.filter(m => !this.checkedRowIds.includes(m.id || m.materialRelationId))
            }
            values.promotionDetailList = list
            const msg = this.verifyData(list)
            if (msg) {
              this.$notification.warning({
                message: labels.HINT,
                description: msg
              })
              this.confirmLoading = false
              return
            }
            values.beginDate = values.beginDate.format('YYYY-MM-DD HH:mm:ss')
            values.endDate = values.endDate.format('YYYY-MM-DD')
            this.$post({
              url: this.$api.basicData.promotionInfo.edit,
              data: values,
              needResponse: true
            })
              .then(res => {
                this.handleCancel()
                this.$emit('ok', values)
                this.$notification.success({
                  message: labels.SAVE_SUCCESS,
                  description: res.message || ''
                })
              })
              .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
              .finally(() => {
                this.confirmLoading = false
              })
            this.confirmLoading = false
          } else {
            const keys=['customerLimit']
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.materialList = []
        this.$refs.listPage.reset()
        this.confirmLoading = false
        this.visible = false
        this.id = ''
        this.selectList = []
        this.checkedRowIds = []
        this.detailList = []
      }
    }
  }
</script>
<style scoped lang="scss">
  .select-item{
    color: #999;
    line-height: 32px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    box-sizing: border-box;
    .icon{
      float: right;
      margin-top: 9px;
      margin-right: 8px;
    }
  }
  ::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th{
    background-color: #E4EAEC;
  }
  .ant-table-row-hover .select-item:hover{
    border-color: $primaryColor;
  }
  .table-title{
    margin-left: -8px;
  }

</style>