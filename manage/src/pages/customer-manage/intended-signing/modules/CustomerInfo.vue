<template>
  <!-- 客户信息 -->
  <div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.customerCode || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.customerName || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.mobileNumber }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="房子户型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>   
        <a-col :md="6" :sm="24">
          <a-form-item label="建筑面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>   
        <a-col :md="6" :sm="24">
          <a-form-item label="实用面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>   
        <a-col :md="6" :sm="24">
          <a-form-item label="营销部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>   
        <a-col :md="12" :sm="24">
          <a-form-item label="装修地址" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>   
        <a-col :md="6" :sm="24">
          <a-form-item label="合同开工日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>   
        <a-col :md="6" :sm="24">
          <a-form-item label="合同完工日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>   
        <a-col :md="6" :sm="24">
          <a-form-item label="签合同施工日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>      
        <a-col :md="6" :sm="24">
          <a-form-item label="施工合同金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="主材合同金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="已确认材料数" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="施工状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="财务状况" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="业务状况" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="档案编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
        <a-col :md="18" :sm="24">
          <a-form-item label="备注" class="col-1-9">
            {{ info.isOpen2 || '暂无' }}
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 业务信息 -->
      <a-row :grabbed="48">
        <a-col :md="24" :sm="24">
          <a-form-item label="派单用户" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
            <div v-if="employeeName" class="dispatch-user">{{ employeeName || '' }}</div>
            <a-button type="primary" @click="selectUser">选择用户</a-button>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="派单理由" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
            <a-textarea
              :rows="3"
              v-model="reason"
              placeholder="请输入派单理由"
              autocomplete="off" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="特殊派单理由" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
            <a-textarea
              :rows="3"
              v-model="specialReason"
              placeholder="请输入特殊派单理由"
              autocomplete="off" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 逃单信息 -->
    <a-divider style="margin-top: 10px">项目成员</a-divider>
    <a-table
      rowKey="id"
      ref="Table"
      :columns="columns"
      :pagination="false"
      :dataSource="dataList">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
    </a-table>
    <dispatch-personnel ref="DispatchPersonnel" @ok="handleOk"></dispatch-personnel>
  </div>
</template>

<script>
  import DispatchPersonnel from './DispatchPersonnel'
  export default {
    name: 'CustomerInfo',
    components: { 
      DispatchPersonnel 
    },
    props: {
      modalTitle: {
        type: String,
        default: ''
      },
      positionIds: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 2 }
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 22 }
        },
        info: {},
        employeeId: '',
        employeeName: '',
        reason: '',
        specialReason: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '岗位名称',
            align: 'center',
            dataIndex:'positionName',
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex:'employeeName',
          },
          {
            title: '部门',
            align: 'center',
            dataIndex:'organizationName',
          },
          {
            title: '手机号',
            align: 'center',
            dataIndex:'mobileNumber',
          },
        ],
        dataList: []
      }
    },
    methods: {
      setData(data) {
        this.info = data
        data.employeeList?.forEach((item,index) =>{
          item.id = index
        })
        this.dataList = data.employeeList || []
      },
      getData() {
        const data = {
          employeeId: this.employeeId,
          reason: this.reason,
          specialReason: this.specialReason
        }
        return data
      },
      handleChange() {
        this.$refs.DispatchPersonnel.show(this.modalTitle,this.positionIds)
      },
      selectUser() {
        this.$refs.DispatchPersonnel.show(this.modalTitle,this.positionIds)
      },
      handleOk(data) {
        this.employeeName = data.employeeName
        this.employeeId = data.employeeId
      },
      clearInput(){
        this.employeeId = ''
        this.employeeName = ''
        this.reason = ''
        this.specialReason = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
::v-deep .col-1-9{
  .ant-form-item-label{
    width: 11.111111%;
    float: left;
  }
  .ant-form-item-control-wrapper{
    width: 88.888888%;
    float: left;
  }

}
.dispatch-user {
  display: inline-block;
  background-color: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  padding: 0 10px; 
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
}
</style>