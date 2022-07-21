<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="900"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="仓库编号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入仓库编号"
                autocomplete="off"
                :max-length="32"
                v-decorator="['stockCode', {rules: [{required: true, message: '请输入仓库编号'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="仓库名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入仓库名称"
                autocomplete="off"
                :max-length="64"
                v-decorator="['stockName', {rules: [{required: true, message: '请输入仓库名称'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="仓库管理员" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                mode="multiple"
                allowClear
                showArrow
                show-search
                change-on-select
                placeholder="请选择仓库管理员"
                :filterOption="filterOption"
                v-decorator="['managerIds']"
              >
                <a-select-option v-for="item in stockManagerList" :value="item.id" :key="item.id">
                  {{ item.realName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="用友编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入用友编码"
                autocomplete="off"
                :max-length="64"
                v-decorator="['thirdPartyCode', {rules: [{required: true, message: '请输入用友编码'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isActive',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否锁定" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                v-decorator="['isLocked',{ valuePropName: 'checked', initialValue: true }]"/>
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
                :max-length="500"
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
  import { defaultErrorMessage, filedIsNull, maxLenValidator, numberValidator } from '@/utils/common'
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
        form: this.$form.createForm(this),
        parentId: '',
        stockManagerList:[]
      }
    },
    created () {
      this.getStockManager()
    },
    methods: {
      maxLenValidator,
      numberValidator,
      add () {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.realName = ''
        this.visible = true
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.getStockManager(record)
        this.$get({
          url: this.$api.basicData.stock.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            // console.log(res)
            const data = { ...res }
            this.parentId = data.parentId
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.realName = data.realName
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      getStockManager() {
        const params = {
          currentPage: 0,
          pageSize: 0,
        }
        this.$post({
          url: this.$api.basicData.stock.getStockManager,
          data: params,
        }).then((res) => {
          this.stockManagerList = res
        })
      },
      filterOption(input, option) {
        return (

          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            this.$post({
              url: this.$api.basicData.stock.edit,
              data: values,
              needResponse: true,
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
        this.parentId = ''
        this.id = ''
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
