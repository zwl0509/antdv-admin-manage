<template>
  <a-modal
    :title="modal_title"
    :width="700"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="上级机构" :labelCol="labelCol01" :wrapperCol="wrapperCol01" >
              <a-tree-select
                placeholder="请选择上级机构"
                allowClear
                showArrow
                :multiple="true"
                :dropdownStyle="{maxHeight: '300px'}"
                :tree-data="menuList"
                tree-checkable
                :replaceFields="{ label: 'name', value: 'id', children: 'children' }"
                :disabled="modal_type == 'detail'"
                v-decorator="['departmentIds']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="区域名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入区域名称"
                autocomplete="off"
                :maxLength="32"
                :disabled="modal_type == 'detail'"
                v-decorator="['groupName', {rules: [{required: true, message: '请输入区域名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="客户提成" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入客户提成"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['customerCommission', { rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [5,2], '客户提成校验失败') }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入排序值"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['sequence', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 4 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 20 }}">
              <a-textarea
                placeholder="请输入备注"
                :max-length="32"
                :disabled="modal_type == 'detail'"
                v-decorator="['remark']"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {
    defaultErrorMessage,
    regularCheck2,
    filedIsNull,
    maxLenValidator,
    numberValidator,
    checkErrors
  } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'add' :
            return '新增区域属性'
          case 'edit' :
            return '编辑区域属性'
          case 'detail' :
            return '区域属性详情'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        labelCol01: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol01: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        visible: false,
        modal_type: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        organizationsId: '',
        menuTitle: '',
        positionCode:'',
        menuList: [],
        menuChildrenList: []
      }
    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    methods: {
      maxLenValidator: maxLenValidator,
      numberValidator: numberValidator,
      regularCheck2: regularCheck2,
      // 获取菜单数据
      getMenuList() {
        this.$get({
          url:this.$api.organization.getTreeList
        }).then((res)=>{
          const list = res || []
          this.menuList = list
          list && list.forEach(item=>{
            if(item.children && item.children.length){
              item.children.forEach(info=>{
                this.menuChildrenList.push(info)
              })
            }
          })
        })
      },
      add () {
        this.form.resetFields()
        this.modal_type = 'add'
        this.id = ''
        this.visible = true
        this.getMenuList()
      },
      edit (record,type) {
        this.modal_type = type
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.getDetail(record.id)
        this.getMenuList()
      },
      getDetail(id){
        const { form: { setFieldsValue } } = this
        this.$get({
          url: this.$api.system.organizationGroup.getDetail,
          params: {
            id
          }
        })
          .then(res => {
            const data = { ...res }
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            this.$post({
              url: this.$api.system.organizationGroup.edit,
              data: values,
              needResponse: true
            })
              .then(res => {
                this.handleCancel()
                this.$emit('ok', values)
                this.$notification.success({
                  message: labels.SAVE_SUCCESS,
                  description: res.message || ''
                })
              })
              .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
              .finally(() => {
                this.confirmLoading = false
              })
          } else {
            const keys=['sequence']
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
      }
    }
  }
</script>
