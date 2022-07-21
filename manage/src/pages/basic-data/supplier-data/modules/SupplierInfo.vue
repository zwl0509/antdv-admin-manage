<template>
  <div>
    <a-form :form="form">
      <a-row :grabbed="48">
        <a-col :md="12" :xs="24">
          <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-cascader
              ref="refCascader"
              :options="treeList"
              :display-render="displayRender"
              change-on-select
              expand-trigger="hover"
              :fieldNames="{ label: 'supplyClassName', value: 'supplyClassCode', children: 'children' }"
              placeholder="请选择分类名称"
              v-decorator="['parentCodes']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="供应商编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入供应商编码"
              autocomplete="off"
              :maxLength="64"
              v-decorator="['supplyCode', {rules: [{required: true, message: '请输入供应商编码'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入供应商名称"
              autocomplete="off"
              :maxLength="500"
              v-decorator="['supplyName', {rules: [{required: true, message: '请输入供应商名称'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="供应商简称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input
              placeholder="请输入供应商简称"
              autocomplete="off"
              :maxLength="200"
              v-decorator="['supplyShortName', {rules: [{message: '请输入供应商简称'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="供应商助记码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入供应商助记码"
              autocomplete="off"
              :maxLength="300"
              v-decorator="[ 'help']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="特项编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入特项编码"
              autocomplete="off"
              :maxLength="32"
              v-decorator="[ 'specialCode']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :xs="24">
          <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              v-decorator="['isActive',{ valuePropName: 'checked', initialValue: true }]"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  import { maxLenValidator, numberValidator } from '@/utils/common'
  export default {
    name: 'SupplierInfo',
    props: {
      info: {
        type: Object,
        default: null,
      },
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        treeList: [],
      }
    },
    created(){
      this.getTreeList()
      if (!!this.info) {
        this.setFormData(this.info)
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      displayRender({ labels }) {
        return labels[labels.length - 1]
      },
      getTreeList() {
        this.$get({
          url: this.$api.basicsClass.supplyClass.getTreeList,
        }).then((res)=>{
          const data =  this.updataList(res)
          this.treeList = data
        })
      },
      updataList(list){
        if(list.length){
          list.forEach((item, index) => {
            if (item.children.length === 0) {
              delete item.children
            } else {
              this.updataList(item.children)
            }
          })
          return list
        }
      },
      setFormData (newInfo) {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(Object.assign({}, newInfo), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      }
    },
    watch: {
      info: {
        handler(newInfo) {
          !!newInfo && this.setFormData(newInfo)
        },
        immediate:true,
        deep :true
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>