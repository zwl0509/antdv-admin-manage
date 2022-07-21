<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="650"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false"
  >
    <a-alert type="error" style="margin-bottom: 12px" v-if="isError" :message="errorMessage"></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="所属地区"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['parentArea']" disabled/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="地区名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="请输入地区名称"
                autocomplete="off"
                :maxLength="256"
                v-decorator="['name', {rules: [{required: true, message: '请输入地区名称'}]}]"/>
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
        codeList: [],
        // 查询参数
        queryParam: {},
        currentPage: 1,
        pageSize: 6,
        totalPage: 1,
        selectLoading: false,
        errorMessage: '',
        isError: false,
        parentArea:'',
        parentId:'',
        parentIds:'',
        community: 0
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      add (row, community = 0) {
        const { form: { setFieldsValue } } = this
        this.community = community
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.visible = true
        this.parentId = row.parentId
        const data = {
          parentArea : row.menuTitle
        }
        // console.log(row)
        this.$nextTick(() => {
          setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      },
      edit (record, community = 0) {
        this.community = community
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.parentId = record.parentId
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.areaInfo.getDetail,
          params: {
            id: record.id,
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
            values.community = 0
            values.parentId = this.parentId ?  this.parentId : null
            values.level = this.parentId ? 2 : 1
            // console.log(values)
            this.$post({
              url: this.$api.basicData.areaInfo.edit,
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
      prev () {
        if (this.currentPage > 1) {
          this.currentPage--
          this.getCodeList()
        }
      },
      next () {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
          this.getCodeList()
        }
      },
      search (val) {
        this.queryParam.name = val
        this.getCodeList()
      }
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
