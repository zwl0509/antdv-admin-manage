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
            <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-cascader
                :options="treeList"
                :display-render="displayRender"
                change-on-select
                expand-trigger="hover"
                :fieldNames="{ label: 'name', value: 'code', children: 'children' }"
                placeholder="请选择所属部门"
                v-decorator="['parentCodes',{rules: [{required : true , message: '请选择所属部门'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="登陆账号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入员工编码"
                autocomplete="off"
                :maxLength="20"
                v-decorator="['employeeCode', {rules: [{required: true, message: '请输入员工编码'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="员工名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入员工名称"
                autocomplete="off"
                :maxLength="40"
                v-decorator="['employeeName', {rules: [{required: false, message: '请输入员工名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="员工别名" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入员工别名"
                autocomplete="off"
                :maxLength="50"
                v-decorator="['employeeNoteEn', {rules: [{required: false}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入手机号码"
                autocomplete="off"
                v-decorator="['mobileNumber', {rules: [{required: true, message: '请输入手机号码'}, { validator: (r, v, fun) => regularCheck('mobilePhone', v, fun) }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" placeholder="请选择性别" v-decorator="['gender']">
                <a-select-option v-for="(item, index) in genderType" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="所在地区" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入所在地区"
                autocomplete="off"
                :maxLength="200"
                v-decorator="['region']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入详细地址"
                autocomplete="off"
                :maxLength="500"
                v-decorator="['address']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="出生日期" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-date-picker
                placeholder="请输入出生日期"
                v-decorator="['employeeBirth']"
                style="width: 100%"
              ></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否认证" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isAuth',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="职位" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
              <a-select
                mode="multiple"
                allowClear
                :getPopupContainer=" triggerNode => { return triggerNode.parentNode }"
                showArrow
                show-search
                :filterOption="filterOption"
                placeholder="请选择职位"
                v-decorator="['positionIds', {rules: [{required: true}]}]">
                <a-select-option v-for="item in positionList" :value="item.id" :key="item.id">
                  {{ item.positionName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="工作简述" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
              <a-textarea
                :rows="4"
                :maxLength="500"
                placeholder="请输入工作简述"
                autocomplete="off"
                v-decorator="['jobContent']"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
              <a-textarea
                :rows="4"
                :maxLength="500"
                placeholder="请输入备注"
                autocomplete="off"
                v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { dateFormatString, defaultErrorMessage, filedIsNull, maxLenValidator,regularCheck } from '@/utils/common'
  import labels from '@/utils/labels'
  export default {
    data () {
      return {
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
        organizationCode: '',
        form: this.$form.createForm(this),
        treeList: [],
        genderType: [],
        positionList: []
      }
    },
    created () {
      // 性别
      this.$getCodeList('1003', res => {
        this.genderType = res
      })
      this.getTreeList()
      this.getPosition()
    },
    methods: {
      maxLenValidator,regularCheck,
      add (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'add'
        this.id = ''
        this.visible = true
        this.organizationCode = record.menuId
        const data = {
          workerOrgName: record.menuTitle,
          parentCodes: [...record.orgIds].reverse()
        }
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.employeeManage.employeeInfo.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            this.parentId = data.parentId
            this.organizationCode = data.organizationCode
            data.isAuth = !!data.isAuth
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
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      // 获取职位
      getPosition() {
        const params= {
          currentPage: 0,
          pageSize : 0,
          isLocked : true
        }
        this.$get({
          url: this.$api.system.position.getListPage,
          params,
        }).then((res)=>{
          const data = res.rows
          this.positionList = data
        })
      },
      getTreeList () {
        this.$get({
          url: this.$api.organization.getTreeList,
        }).then(res => {
          const data = this.updataList(res)
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
            values.employeeBirth = moment(values.employeeBirth).format(dateFormatString) || ''
            if(values.parentCodes && values.parentCodes.length) {
              values.organizationCode = values.parentCodes[values.parentCodes.length - 1]
            } else {
              values.organizationCode = this.organizationCode
            }
            this.$post({
              url: this.$api.employeeManage.employeeInfo.edit,
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
            this.confirmLoading = false
          }
        })
      },

      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
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
    color: #585A62;
  }
</style>
