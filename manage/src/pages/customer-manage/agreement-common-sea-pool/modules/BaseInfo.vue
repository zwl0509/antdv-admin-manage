<template>
  <a-form :form="form" labelAlign="left">
    <a-row :grabbed="48" v-if="info">
      <a-col :md="6" :sm="24">
        <a-form-item label="客户阶段" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.typeName || '暂无' }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.infoShow ? info.customerName : info.customerNameHide }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.mobileNumber }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="客户来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.infoSourceName || '暂无' }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="房子户型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.roomTypeName || '暂无' }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="建筑面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.buildingArea || '暂无' }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="实用面积(m²)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.actualArea || '暂无' }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <ellipsis :length="16" tooltip>{{ info.finalAddress || '暂无' }}</ellipsis>
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
      <a-col :md="6" :sm="24">
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.isOpen2 || '暂无' }}
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import { Ellipsis } from '@/components'

  export default {
    name: 'BaseInfo',
    components: {
      Ellipsis
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
          sm: { span: 2 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 22 }
        },
        info: null,
      }
    },
    methods: {
      getData(data) {
        this.info = data
      },
      setData(data) {
        this.info = data
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>