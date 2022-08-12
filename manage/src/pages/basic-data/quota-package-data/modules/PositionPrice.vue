<template>
  <a-form :form="form">
    <a-row :grabbed="48" style="height: 52px">
      <a-col :md="8">
        <a-form-item
          :label="'铺装位置'+ (number)"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择铺装位置"
            allowClear
            showArrow
            v-decorator="['position']">
            <a-select-option v-for="(item, index) in positionList" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="8" :xs="24">
        <a-form-item :label="'价格'+ (number)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入价格"
            autocomplete="off"
            class="name"
            v-decorator="['price']"/>
        </a-form-item>
        <div class="icon">
          <a-icon type="minus-circle" class="dynamic-delete-button" @click="cancel" v-if="length >1"/>
          <a-icon type="plus-circle" class="dynamic-add-button" @click="add" v-if="number === length"/>
        </div>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import pick from 'lodash.pick'
  import { maxLenValidator, regularCheck } from '@/utils/common'
  export default {
    name:'PositionPrice',
    props: {
      number: {
        type: Number,
        default: 1
      },
      dataInfo: {
        type: Object,
        default: null
      },
      length: {
        type: Number,
        default: 1
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
          sm: { span: 9 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        form: this.$form.createForm(this, {
          name: this.number
        }),
        positionList:[],
      }
    },
    created() {
      // 铺装位置
      this.$getCodeList('1100', res => {
        this.positionList = res
      })
    },
    methods: {
      maxLenValidator,
      regularCheck,
      add() {
        this.$emit('add')
      },
      cancel() {
        this.$emit('delete')
      }
    },
    watch: {
      dataInfo: {
        handler(newInfo, oldInfo) {
          if (newInfo) {
            this.$nextTick(() => {
              const {
                form: { setFieldsValue },
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
  ::v-deep .question{
    margin-right: 20px;
  }
  ::v-deep .icon{
    width: 80px;
    position: absolute;
    bottom: 10px;
    left: 310px;
  }
  ::v-deep .dynamic-add-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #b80201;
    transition: all 0.3s;
  }
  .dynamic-add-button:hover {
    color: #b80201;
  }
  .dynamic-add-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  ::v-deep .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
    margin-right: 20px;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
