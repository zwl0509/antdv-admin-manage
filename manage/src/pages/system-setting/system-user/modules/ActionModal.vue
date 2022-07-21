<template>
  <a-modal
    :title="modalType === 'add'?'新增用户': '编辑用户'"
    :width="700"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-alert v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="登录名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入登录名称"
                autocomplete="off"
                v-decorator="['loginName', {rules: [{required: true}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="真实姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入真实姓名"
                autocomplete="off"
                v-decorator="['realName', {rules: [{required: true}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入手机号码"
                autocomplete="off"
                v-decorator="['phoneNumber', {rules: [{required: true}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}, { pattern: /^1[3456789]\d{9}$/, message: ''}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择性别" v-decorator="['gender', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in genderList" :key="index" :value="item.value">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="角色" :labelCol="labelCol01" :wrapperCol="wrapperCol01">
              <a-select :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" mode="multiple" showArrow placeholder="请选择角色" v-decorator="['roleIds', {rules: [{required: true}]}]">
                <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.id">{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-row :grabbed="48">
          <a-form-item label="职位" :labelCol="labelCol01" :wrapperCol="wrapperCol01">
            <a-select
              mode="multiple"
              :getPopupContainer=" triggerNode => { return triggerNode.parentNode }"
              allowClear
              showArrow
              placeholder="请选择职位"
              v-decorator="['positionIds']">
              <a-select-option v-for="item in positionList" :value="item.id" :key="item.id">
                {{ item.positionName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-row> -->
        <a-row :grabbed="48">
          <a-form-item label="备注" :labelCol="labelCol01" :wrapperCol="wrapperCol01" >
            <a-textarea style="height: 100px" placeholder="请输入备注" v-decorator="['remark',{ rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 500)}]}]" :max-length="300"></a-textarea>
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { defaultErrorMessage, filedIsNull, maxLenValidator } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {
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
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        roleList: [],
        genderList: [],
        treeDate: [],
        positionValue: [],
        positionList: [],
        isError: false,
        errorMessage: ''
      }
    },
    methods: {
      maxLenValidator: maxLenValidator,
      async add () {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
        await this.getCodeList()
        await this.getUserInfo()
        await this.getPosition()
      },
      async edit (record) {
        this.visible = true
        this.modalType = 'edit'
        this.id = record.id
        await this.getCodeList()
        await this.getUserInfo()
        await this.getPosition()
        await this.getDetail(record.id)
      },
      getDetail(id) {
        const { form: { setFieldsValue } } = this
        this.confirmLoading = true
        this.$get({
          url: this.$api.system.user.getDetail,
          params: { id }
        }).then(res => {
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
      getCodeList() {
        // 性别
        this.$getCodeList('1003', res => {
          this.genderList = res
        })
      },
      // 角色信息
      getUserInfo() {
        this.$get({
          url: this.$api.system.role.getListPage
        }).then(res => {
          this.roleList = res.rows
        }).catch(err => defaultErrorMessage(err, '获取角色数据失败'))
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
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            this.$post({
              url: this.$api.system.user.edit,
              data: values,
              needResponse: true
            })
              .then(res => {
                this.handleCancel()
                this.$emit('ok', values)
                this.$notification.success({
                  message: labels.SAVE_SUCCESS,
                  description: res.message
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
