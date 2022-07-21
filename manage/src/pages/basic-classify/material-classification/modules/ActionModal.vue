<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="900"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="上级分类" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-cascader
                :options="treeList"
                :display-render="displayRender"
                change-on-select
                expand-trigger="hover"
                :fieldNames="{ label: 'materialClassName', value: 'id', children: 'children' }"
                placeholder="请选择上级分类"
                v-decorator="['parentIds']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="分类类别" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select placeholder="请选择分类类别" v-decorator="['materialClassType',{rules: [{required: true, message: '请选择分类类别'}]}]">
                <a-select-option
                  v-for="(item, index) in classType"
                  :key="index"
                  :value="item.index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入分类名称"
                autocomplete="off"
                :max-length="100"
                v-decorator="['materialClassName', {rules: [{required: true, message: '请输入分类名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="分类编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入分类编码"
                autocomplete="off"
                :max-length="100"
                v-decorator="['materialClassCode', {rules: [{required: true, message: '请输入分类编码'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="特项代码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入特项编码"
                autocomplete="off"
                :max-length="32"
                v-decorator="['specialCode', {rules: [{required: true, message: '请输入特项编码'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="编码前缀" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入编码前缀"
                autocomplete="off"
                :max-length="32"
                v-decorator="['materialProCode', {rules: [{required: true, message: '请输入编码前缀'}]}]"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :xs="24">
            <a-form-item label="物料数量" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                style="width: 100%"
                placeholder="请输入物料数量"
                autocomplete="off"
                v-decorator="['maxNumber', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                style="width: 100%"
                placeholder="请输入排序"
                autocomplete="off"
                v-decorator="['sequence',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的顺序') }]}]"/>
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
          <a-col :md="12" :xs="24">
            <a-form-item label="是否文明施工" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isCulture',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否共享材料" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isShareMaterial',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否特殊材料" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isSpecial',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}" >
              <a-textarea
                :rows="4"
                placeholder="请输入备注"
                autocomplete="off"
                :max-length="160"
                v-decorator="['remark', {rules: [{message: '请输入备注'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 160)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { defaultErrorMessage, checkErrors, filedIsNull, maxLenValidator, numberValidator,regularCheck2 } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {
    data () {
      return {
        classType: [
          {
            index : 0,
            name : '主材'
          },
          {
            index : 1,
            name : '辅材'
          },
          {
            index : 2,
            name : '人工'
          },
          {
            index : 3,
            name : '机械'
          },
        ],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        parentId: '',
        treeList: [], // 上级org
      }
    },
    created() {
      this.getTreeList()
    },
    methods: {
      maxLenValidator,
      numberValidator,
      regularCheck2,
      add (record,isDetail) {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.parentId = record && record.id
        this.visible = true
        if(isDetail) {
          this.getDetail(record.id, true)
        }
      },
      edit (record) {
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.getDetail(record.id)
      },
      getDetail(id,isDetail){
        this.confirmLoading = true
        const { form: { setFieldsValue } } = this
        this.$get({
          url: this.$api.basicsClass.materialClass.getDetail,
          params: { id }
        })
          .then(res => {
            const data = { ...res }
            this.parentId = data.parentId
            if(isDetail) {
              data.parentIds.push(data.id)
              this.$nextTick(() => {
                setFieldsValue({
                  'parentIds': data.parentIds
                })
              })
            } else {
              for (const key in data) { 
                if (filedIsNull(data[key])) {
                  delete data[key]
                }
              }
              this.$nextTick(() => {
                setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
              })
            }

          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      // 获取树状
      getTreeList() {
        this.$get({
          url: this.$api.basicsClass.materialClass.getTreeList,
        }).then((res)=>{
          const data =  this.updataList(res.rows)
          this.treeList = data
        })
      },
      updataList(list){
        if(list.length){
          list.forEach((item, index) => {
            if (item.children.length == 0) {
              delete item.children
            } else {
              this.updataList(item.children)
            }
          })
          return list 
        }
      },
      displayRender({ labels }) {
        return labels[labels.length - 1]
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            if(values.parentIds && values.parentIds.length) {
              values.parentId = values.parentIds[values.parentIds.length - 1]
            }else {
              values.parentId = this.parentId
            }
            this.$post({
              url: this.$api.basicsClass.materialClass.edit,
              data: values,
              needResponse: true
            })
              .then(res => {
                this.handleCancel()
                this.$emit('ok', values)
                this.getTreeList()
                this.$notification.success({
                  message: labels.SAVE_SUCCESS,
                  description: res.message || ''
                })
              })
              .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
              .finally(() => {
                this.confirmLoading = false
              })
          }else {
            const keys=['sequence','maxNumber']
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
            this.confirmLoading = false
          }
        })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.parentId = ''
        this.confirmLoading = false
        this.visible = false
      },
    }
  }
</script>
<style scoped lang="scss">
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0;
    background: red !important;
    color: #585A62;
  }
</style>
