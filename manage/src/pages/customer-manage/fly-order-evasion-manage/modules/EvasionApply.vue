<template>
  <a-modal
    title="逃单详情"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="tabKey">
        <a-tab-pane key="1" tab="客户信息">
          <!-- 基础信息 -->
          <base-info ref="BaseInfo"></base-info>
          <a-form labelAlign="left">
            <a-col :md="24" :sm="24">
              <a-form-item label="逃单分类" :labelCol="{ xs: { span: 24 }, sm: { span: 2 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 22 }}">
                <a-select placeholder="请选择逃单分类" style="width: 280px;" v-model="queryParam.classification" allowClear disabled>
                  <a-select-option v-for="(item, index) in codeType.EvasionClassify" :key="index" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="项目成员" forceRender>
          <project-menber ref="ProjectMenber"></project-menber>
        </a-tab-pane>
        <a-tab-pane key="3" tab="逃单信息" forceRender>
          <a-table
            class="log-table"
            :bordered="false"
            size="small"
            rowKey="id"
            ref="Table"
            :columns="columns"
            :pagination="false"
            :dataSource="dataList">
            <template v-slot:serial="type,record,i">{{ i+1 }}</template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
  import CustomerInfo from '@/pages/customer-manage/intended-signing/modules/CustomerInfo'
  import BaseInfo from '../../agreement-common-sea-pool/modules/BaseInfo'
  import ProjectMenber from '../../agreement-common-sea-pool/modules/ProjectMenber'
  import { defaultErrorMessage } from '@/utils/common'
  import labels from '@/utils/labels'
  export default {
    components: {
      CustomerInfo,
      BaseInfo,
      ProjectMenber
    },
    name: 'EvasionApply',
    data () {
      return {
        form: this.$form.createForm(this),
        visible: false,
        confirmLoading: false,
        activeKey:['1'],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        id: '',
        tabKey: '1',
        modal_type: 0,
        classification: undefined,
        remark:'',
        info: {},
        queryParam:[],
        typeList:[ ],
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
            title: '审核状态',
            align:'center',
            dataIndex: 'statusName'
          },
          {
            title: '申请时间',
            align:'center',
            dataIndex: 'applicationDate'
          },
          {
            title: '备注',
            align:'center',
            dataIndex: 'remark'
          }
        ],
        dataList:[],
        codeType: {
          EvasionClassify:[]
        },
      }
    },
    methods: {
      show (id,type){
        this.id = id
        this.modal_type = type
        this.visible = true
        this.getDetail(id)
        this.getCodeList()
      },
      getCodeList(){
        // 逃单分类
        this.$getCodeList('1041', res => {
          this.codeType.EvasionClassify = res
        })
      },
      setData(data) {
        this.info = data
        this.dataList = data.orderList || []
        this.dataList1 = data.employeeList || []
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
          console.log(this.queryParam)
          this.dataList = data.orderList || []
          this.$refs.BaseInfo.setData(data)
          this.$refs.ProjectMenber.setData(data.employeeList)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit () {
        const data = {
          customerId : this.customerId,
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
        this.tabKey = '1'
      }
    }

  }
</script>
<style lang="scss" scoped>
  ::v-deep .col-1-9{
    .ant-form-item-label{
      width: 11.111111%;
      float: left;
      line-height: 20px;
      label{
        white-space: break-spaces;
      }
    }
    .ant-form-item-control-wrapper{
      width: 88.888888%;
      float: left;
    }
  }
  ::v-deep .log-table {
    .ant-table{
      border: 0;
    }
    .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th{
      background-color: #E4EAEC;

    }
  }
</style>