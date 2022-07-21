<template>
  <a-modal
    :title="modal_title"
    :width="800"
    :centered="true"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-row>
        <a-col :md="12" :sm="24">
          <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ queryParam.customerName }}
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ queryParam.mobileNumber }}
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <ellipsis :length="20" tooltip>{{ queryParam.finalAddress }}</ellipsis>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-item label="飞单分类" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
            <a-select placeholder="请选择飞单分类" style="width: 280px;" v-model="classification" allowClear>
              <a-select-option v-for="(item, index) in codeType.EvasionClassify" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="逃单备注信息" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
            <a-textarea
              :rows="4"
              v-model="remark"
              placeholder="请输入逃单备注信息"
              autocomplete="off" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <a-table
            class="log-table"
            :bordered="false"
            size="small"
            rowKey="id"
            ref="Table"
            :columns="columns"
            :pagination="false"
            :dataSource="dataList">
            <!--            <template slot="serial" slot-scope="t, record, i">{{ i }}</template>-->
            <template v-slot:serial="type,record,i">{{ i+1 }}</template>
          </a-table>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import { defaultErrorMessage } from '@/utils/common'
  import { Ellipsis } from '@/components'

  import labels from '@/utils/labels'

  export default {
    name: 'FlyResurrectionApply',
    components: {
      Ellipsis
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 1 :
            return '飞单复活申请'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        id: '',
        modal_type: 0,
        form: this.$form.createForm(this),
        queryParam: {
        },
        columns:[
          {
            title: '序号',
            align:'center',
            dataIndex: 'serial',
            scopedSlots: {
              customRender: 'serial'
            }
          },
          {
            title: '姓名',
            align:'center',
            dataIndex: 'applicantName'
          },
          {
            title: '申请类型',
            align:'center',
            dataIndex: 'typeName'
          },
          {
            title: '申请时间',
            align:'center',
            dataIndex: 'applicationDate'
          },
          // {
          //   title: '是否复活申请',
          //   align:'center',
          //   dataIndex: 'isReborn'
          // },
          {
            title: '备注',
            align:'center',
            dataIndex: 'remark'
          }
        ],
        classification: undefined,
        remark:'',
        dataList:[],
        codeType: {
          EvasionClassify:[]
        },
        customerId:''
      }
    },
    methods: {
      show (record, type) {
        this.id = record.id
        this.customerId = record.customerId
        this.visible = true
        this.modal_type = type
        this.getDetail(record.id)
        this.getCodeList()
        this.remark = ''
        // this.customerId = record.id
      },
      getCodeList(){
        // 逃单分类
        this.$getCodeList('1041', res => {
          this.codeType.EvasionClassify = res
        })
      },
      getDetail(id) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.flyOrEvasionInfo.getDetail,
          params: { id }
        }).then((res) =>{
          const data = { ...res }
          this.id = data.id
          this.customerId= data.customerId
          this.queryParam = data
          data.orderList?.forEach((item,index) =>{
            item.id = index
          })
          this.dataList = data.orderList
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit () {
        const data = {
          customerIds : [this.customerId],
          type : '1040-10',
          isReborn : true,
          classification : this.classification,
          remark : this.remark
        }
        this.loading = true
        this.$post({
          url: this.$api.customInfo.flyOrEvasionInfo.application,
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
          .finally(() => { this.loading = false })
      },
      handleCancel() {
        this.id = ''
        this.visible = false
        this.classification =  undefined
        this.customerId = ''
        this.type = ''
        this.remark = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .log-table {
    .ant-table{
      border: 0;
    }
    .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th{
      background-color: #E4EAEC;
    }
  }
</style>