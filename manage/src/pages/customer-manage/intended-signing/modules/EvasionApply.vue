<template>
  <a-modal 
    title="逃单申请"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-card>
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
          <a-col :md="6" :sm="24">
            <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ info.isOpen2 || '暂无' }}
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="合同开工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ info.isOpen2 || '暂无' }}
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="合同完工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ info.isOpen2 || '暂无' }}
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="签合同施工日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
            <a-form-item label="已确认材料数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
          <a-col :md="6" :sm="24">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ info.isOpen2 || '暂无' }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24">
            <a-form-item label="逃单分类" class="col-1-9">
              <a-select placeholder="请选择逃单分类" style="width: 280px;" v-model="classification" allowClear>
                <a-select-option v-for="(item, index) in EvasionClassify" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item label="逃单备注信息" class="col-1-9">
              <a-textarea
                :rows="3"
                v-model="remark"
                placeholder="请输入逃单备注信息"
                autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-table
        rowKey="id"
        ref="Table"
        :columns="columns"
        :pagination="false"
        :dataSource="dataList">
        <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      </a-table>
    </a-form>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
  components: {},
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
        classification: undefined,
        remark: '',
        EvasionClassify: [],
        info: {},
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
      show (id){
        this.visible = true
        this.id = id
        this.getDetail(id)
        this.getCodeList()
      },
      getCodeList(){
        // 逃单分类
        this.$getCodeList('1041', res => {
          this.EvasionClassify = res
        })
      },

      // 获取详情
      getDetail(customerId) {
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.intendedCustomInfo.getEvasionDetail,
          params: { customerId }
        }).then((res) =>{
          const data = { ...res }
          this.setData(data)
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      setData(data) {
        this.info = data
        data.employeeList?.forEach((item,index) =>{
          item.id = index
        })
        this.dataList = data.employeeList || []
      },
      handleSubmit () {
        this.loading = true
        const data = {
          customerId : this.id,
          type : '1040-20',
          isReborn : false,
          classification : this.classification,
          remark : this.remark
        }
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
        this.visible = false
        this.id = ''
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
</style>