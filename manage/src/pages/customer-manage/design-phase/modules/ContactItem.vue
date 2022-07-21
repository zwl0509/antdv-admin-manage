<template>
  <a-card style="margin-bottom: 10px">
    <div slot="title" style="display: flex;justify-content: space-between;align-items: center">
      <span>{{ '指定人员' + index }}</span>
      <a-button type="primary" @click="handleDelete" v-if="show && type !== 'detail'">删除联系人</a-button>
    </div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="8">
          <a-form-item label="指定人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入指定人"
              :max-length="36"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['appointorName', { rules: [{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="身份证" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入身份证"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="[ 'appointorIdCard', {rules: [{ validator: (r, v, fun) => regularCheck('identity', v, fun) }]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="签署方关系" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入签署方关系"
              :max-length="36"
              autocomplete="off"
              :disabled="type == 'detail'"
              v-decorator="['appointorRelationship']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { maxLenValidator, regularCheck } from '@/utils/common'
export default {
  props: {
    index: {
      type: Number,
      default: 1
    },
    dataInfo: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this, {
        name: this.index
      })
    }
  },
  methods: {
    maxLenValidator,
    regularCheck,
    handleDelete() {
      this.$emit('delete')
    }
  },
  watch: {
    dataInfo: {
      handler(newInfo, oldInfo) {
        if (newInfo) {
          this.$nextTick(() => {
            const {
              form: { setFieldsValue }
            } = this
            setFieldsValue(pick(Object.assign({}, newInfo), Object.keys(this.form.fieldsStore.fieldsMeta)))
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ant-form-item {
  margin-bottom: 0;
}
::v-deep .ant-card-head {
  height: 40px;
  min-height: 0;
  .ant-card-head-title {
    padding: 0;
    line-height: 40px;
  }
}
</style>
