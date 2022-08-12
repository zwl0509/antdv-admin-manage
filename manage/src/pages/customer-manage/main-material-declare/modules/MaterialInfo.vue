<template>
  <!-- 辅材材料添加申报 -->
  <a-modal
    title="材料申报"
    :width="1000"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="提醒人" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-tooltip v-if="reminderName">
                <ellipsis v-if="reminderName" :class="modal_type === 'detail' ? 'reminder-name-detail': 'reminder-name'" :length="60" tooltip>{{ reminderName || '' }}</ellipsis>
              </a-tooltip>
              <a-button type="primary" @click="selectReminder">选择客户名称</a-button>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="统一到场时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker
                placeholder="请选择统一到场时间"
                style="width: 100%;"
                v-decorator="['unifiedArrivedTime']"
              ></a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 添加材料 -->
        <a-row :grabbed="48">
          <a-table
            rowKey="id"
            class="checked-table"
            :columns="columns"
            :data-source="dataList"
            :pagination="false"
            :scroll="{x: 2500, y: 520 }">
            <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
            <template slot="applyNum" slot-scope="text, record">
              <a-input v-model="record.applyNum" placeholder="请输入申请数量(套)" @change="update" :max-length="30"/>
            </template>
            <template slot="transNum" slot-scope="text, record">
              <a-input v-model="record.transNum" placeholder="请输入换算量" @change="update" :max-length="30"/>
            </template>
            <template slot="deliveryMethod" slot-scope="text,record">
              <a-select
                style="width: 180px"
                placeholder="请选择配送方式"
                allowClear
                v-model="record.deliveryMethod"
                @change="update">
                <a-select-option v-for="(item, index) in deliveryList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </template>
            <template slot="arriveTime" slot-scope="text, record">
              <a-date-picker
                placeholder="请选择到场时间"
                style="width: 100%;"
                v-model="record.arriveTime"
              ></a-date-picker>
            </template>
            <template slot="remark" slot-scope="text, record">
              <a-textarea auto-size v-model="record.remark" placeholder="请输入备注" @change="update" :max-length="30"/>
            </template>
            <span slot="ellipsis" slot-scope="text">
              <ellipsis :length="22" tooltip>{{ text }}</ellipsis>
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </a-table>
        </a-row>
      </a-form>
    </a-spin>
    <!--选择提醒人-->
    <reminder-select ref="ReminderSelect" @getReminders="getReminders"></reminder-select>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { defaultErrorMessage, } from '@/utils/common'
  import { Ellipsis } from '@/components'
  import labels from '@/utils/labels'
  import ReminderSelect from '@/pages/customer-service-manage/complaint-record/modules/ReminderSelect'
  import { deepClone } from '@/utils/util'
  import moment from 'moment'

  export default {
    name: 'MaterialInfo',
    components: {  ReminderSelect, Ellipsis },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'edit' :
            return '编辑单据明细'
          case 'detail' :
            return '查看单据明细'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        visible: false,
        modal_type: '',
        confirmLoading: false,
        columns:[
          {
            title: '序号',
            width: 60,
            align:'center',
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '材料名称',
            dataIndex:'materialName',
            align:'center',
            width: 200,
            scopedSlots: { customRender: 'ellipsis' },
          },
          {
            title: '申请数量(套)',
            align:'center',
            width: 200,
            scopedSlots: { customRender: 'applyNum' },
          },
          {
            title: '换算量',
            align:'center',
            width: 200,
            scopedSlots: { customRender: 'transNum' },
          },
          {
            title: '配送方式',
            align:'center',
            width: 200,
            scopedSlots: { customRender: 'deliveryMethod' },
          },
          {
            title: '到场时间',
            align:'center',
            width: 200,
            scopedSlots: { customRender: 'arriveTime' },
          },
          {
            title: '材料标识',
            align:'center',
            width: 200,
            scopedSlots: { customRender: 'priceSigns' },
          },
          {
            title: '备注',
            align:'center',
            width: 200,
            dataIndex: 'remark',
            scopedSlots: { customRender: 'remark' }
          },
          {
            title: '已申请',
            dataIndex:'salePrice1',
            align:'center',
          },
          {
            title: '已开单',
            align:'center',
          },
          {
            title: '材料规格',
            dataIndex:'spec',
            align:'center',
          },
          {
            title: '材料价格',
            dataIndex:'salePrice',
            align:'center',
          },
          {
            title: '所属工种',
            dataIndex:'workerType',
            align:'center',
          },
          {
            title: '型号',
            dataIndex:'materialType',
            align:'center',
          },
          {
            title: '颜色',
            dataIndex: 'color',
            align:'center',
          },
          {
            title: '品牌',
            dataIndex:'brand',
            align:'center',
          },
          {
            title: '类别系列',
            dataIndex:'typeSerial',
            align:'center',
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   width: 80,
          //   align:'center',
          //   fixed: 'right',
          //   scopedSlots: { customRender: 'action' }
          // }
        ],
        dataList:[],
        id: '',
        customerId:'',
        reminders: [],
        reminderName: undefined,
        remindersList:[],
        form: this.$form.createForm(this),
        materialList:[],
        deliveryList:[]
      }
    },
    methods: {
      getCodeList(){
        this.$getCodeList('1096', res => {
          this.deliveryList = res
        })
      },
      add(info,customerId){
        this.customerId = customerId
        this.dataList = deepClone(info)
        this.visible = true
        this.getCodeList()
      },
      getReminders(data){
        const list = []
        data.remindersList?.forEach(i =>{
          list.push(i.employeeName)
          i.relationId = i.id
        })
        this.remindersList = deepClone(data.remindersList)
        this.reminderName = list
      },
      // 选择提醒人
      selectReminder() {
        this.$refs.ReminderSelect.add()
      },
      update() {
        this.$forceUpdate()
      },
      getDetail(id,customerId){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerInspectionRecordInfo.getDetail,
          params: {
            id,
            customerId
          }
        }).then((res) =>{
          const data = { ...res }
          if(data) {
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            const { form: { setFieldsValue } } = this
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          }
          this.materialList = data.unqualifiedInfoVOS || []
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.customerId = this.customerId
            values.reminders = this.remindersList
            values.unifiedArrivedTime = values.unifiedArrivedTime.format('YYYY-MM-DD')
            this.dataList.forEach(i=>{
              i.arriveTime = i.arriveTime.format('YYYY-MM-DD')
              i.name = i.materialName
            })
            values.detailDTOS = deepClone(this.dataList)
            values.type = '1095-10'
            values.status = '1097-10'
            this.save(values)
          }else {
            this.confirmLoading = false
          }
        })
      },
      save(data){
        console.log(data)
        this.$post({
          url: this.$api.materialDeclare.auxiliaryMaterialsInfo.edit,
          data,
          needResponse: true
        }).then(res => {
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSub (record) {
        this.$notification.warning({
          message: labels.HINT,
          description: '暂未开发'
        })
        // this.loading = true
        // this.$delete({
        //   url: this.$api.allocation.CommissionInfo.delete,
        //   params: { id: record.id },
        //   needResponse: true
        // }).then(res => {
        //   this.$notification.success({
        //     message: labels.DELETE_SUCCESS,
        //     description: res.message || ''
        //   })
        //   this.handleOk()
        // }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
        //   .finally(() => { this.loading = false })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
        this.reminderName = undefined
        this.materialList = []
      }
    }
  }
</script>
<style lang="scss" scoped>
  .reminder-name{
    display: inline-block;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    width: 245px;
    height: 32px;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
    margin-right: 10px;
  }
  .reminder-name-detail{
    display: inline-block;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    background-color: #f5f5f5;
    color: #b8b8b8;
    padding: 0 10px;
    width: 245px;
    height: 32px;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align:middle;
    margin-right: 10px;
  }
</style>