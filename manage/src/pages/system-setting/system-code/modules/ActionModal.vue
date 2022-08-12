<template>
  <a-modal
    :title="modalType === 'add' ? '新增数据字典' : '编辑数据字典'"
    :width="700"
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
              label="父级"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >

              <a-select
                placeholder="请选择父级"
                showSearch
                @search="search"
                :filter-option="false"
                :not-found-content="selectLoading ? undefined : null"
                v-decorator="['type']"
              >
                <a-spin v-if="selectLoading" slot="notFoundContent" size="small">
                </a-spin>
                <a-select-option v-for="(item, index) in codeList" :key="index" :value="item.code">{{ item.name }}
                </a-select-option>
                <a-select-option v-if="totalPage > 1" value="0" disabled class="select-page">
                  <template>
                    <a-row :grabbed="48">
                      <a-col
                        :md="12"
                        :xs="24"
                        style="text-align: center"
                        @click="prev"
                        :style="[{ cursor: (currentPage>1?'pointer':'not-allowed')},{color: (currentPage>1?'#585A62':'')}]">
                        上一页
                      </a-col>
                      <a-col
                        :md="12"
                        :xs="24"
                        style="text-align: center"
                        @click="next"
                        :style="[{ cursor: (currentPage<totalPage?'pointer':'not-allowed')},{color: (currentPage<totalPage?'#585A62':'')}]">
                        下一页
                      </a-col>
                    </a-row>
                  </template>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="编号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="请输入编号"
                autocomplete="off"
                v-decorator="['code', {rules: [{required: true, message: '请输入编号'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item
              label="名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="请输入名称"
                autocomplete="off"
                v-decorator="['name', {rules: [{required: true, message: '请输入名称'}, { validator:(r, v, fun)=> maxLenValidator(r, v, fun, 50)}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item
              label="排序"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number placeholder="请输入排序值" autocomplete="off" style="width: 100%" v-decorator="['sequence', {rules: [{required: true, message: '请输入排序值'}, { validator: (r, v, fun)=> numberValidator(r, v, fun, 'int')}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import debounce from 'lodash.debounce'
  import { defaultErrorMessage, filedIsNull, maxLenValidator, numberValidator } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {

    data () {
      this.search = debounce(this.search, 800)
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
        isError: false
      }
    },
    methods: {
      maxLenValidator: maxLenValidator,
      numberValidator: numberValidator,
      getCodeList () {
        this.selectLoading = true
        this.codeList = []
        const data = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        this.isError = false
        this.$get({
          url: this.$api.system.code.getListPage,
          params: Object.assign(data, this.queryParam)
        }).then(res => {
          this.selectLoading = false
          this.codeList = res.rows
          this.totalPage = Math.ceil(res.total / this.pageSize)
        }).catch(err => {
          this.isError = true
          this.errorMessage = err && err.message || '获取父级code数据失败'
        })
      },
      add () {
        this.form.resetFields()
        this.modalType = 'add'
        this.id = ''
        this.getCodeList()
        this.visible = true
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.getCodeList()
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.system.code.getDetail,
          params: { id: record.id }
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
            values.value = values.type !== undefined ? values.type + '-' + values.code : values.code
            this.$post({
              url: this.$api.system.code.edit,
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
