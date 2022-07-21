<template>
  <a-form :form="form" labelAlign="left">
    <a-row :grabbed="48" v-if="info">
      <a-col :md="6" :sm="24">
        <a-form-item label="工人工资" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.typeName || '暂无' }}
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <a-form-item label="项目经理费用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{ info.infoShow || '暂无' }}
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import { Ellipsis } from '@/components'

  export default {
    name: 'PayInfo',
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