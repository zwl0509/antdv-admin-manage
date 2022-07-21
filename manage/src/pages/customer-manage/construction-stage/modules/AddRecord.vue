<template>
  <!-- 新增巡检 -->
  <a-modal
    :title="modal_title"
    :width="1000"
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
            <a-form-item label="巡检名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入巡检名称"
                autocomplete="off"
                :maxLength="32"
                :disabled="modal_type == 'detail'"
                v-decorator="['title', {rules: [{required: true, message: '请输入巡检名称'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="巡检类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择巡检类型" v-decorator="['type',{ rules: [{ required: true, message: '请选择巡检类型!' }] }]">
                <a-select-option
                  v-for="(item, index) in patrolType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="巡检内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入巡检内容"
                autocomplete="off"
                :maxLength="32"
                :disabled="modal_type == 'detail'"
                v-decorator="['content', {rules: [{message: '请输入巡检内容'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 情况说明 -->
        <a-row :grabbed="48">
          <a-button v-if="modal_type !== 'detail'" type="primary" icon="plus" style="margin-bottom: 10px" @click="handleAdd">新增情况说明</a-button>
          <contact-item
            v-for="(item, index) in descriptionList"
            :key="item.index"
            ref="ContactItem"
            :data-info="item"
            :number="index+ 1"
            :type="modal_type"
            :show="descriptionList.length > 1"
            @delete="handleDelete(index)"
          ></contact-item>
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
  import ContactItem from './ContactItem'
  import moment from 'moment'

  export default {
    name: 'AddRecord',
    components: { ContactItem },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'add' :
            return '新增巡检记录'
          case 'edit' :
            return '编辑巡检记录'
          case 'detail' :
            return '巡检记录详情'
          default:
            return ''
        }
      }
    },
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
        modal_type: 'add',
        confirmLoading: false,
        id: '',
        customerId:'',
        form: this.$form.createForm(this),
        patrolType:[],
        constructionTaskId:'',
        descriptionList:[]
      }
    },
    methods: {
      maxLenValidator: maxLenValidator,
      numberValidator: numberValidator,
      regularCheck2: regularCheck2,
      getCodeList(){
        const params = {
          typeList: ['1082']
        }
        this.$getCodesList(params, res => {
          this.patrolType = res['1082'] || [] // 任务关系
        })
      },
      add (customerId) {
        this.descriptionList = [{
          unqualifiedType: '',
          unqualifiedContent: '',
          attachIds: [],
          index: 0,
          id: '',
        }]
        this.customerId = customerId
        this.form.resetFields()
        this.modal_type = 'add'
        this.id = ''
        this.visible = true
        this.getCodeList()
      },
      edit (record,type,customerId) {
        this.modal_type = type
        this.id = record.id
        this.customerId = customerId
        this.visible = true
        this.getDetail(record.id,this.customerId)
        this.getCodeList()
      },
      // 新增指定人员
      handleAdd() {
        this.descriptionList.push({
          unqualifiedType: '',
          unqualifiedContent: '',
          attachIds: [],
          index: this.descriptionList.length,
          id: '',
        })
      },
      // 删除指定人员
      handleDelete(index) {
        this.descriptionList.splice(index, 1)
      },
      getDetail(id,customerId){
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.customerInspectionRecordInfo.getDetail,
          params: {
            id,
            customerId
          }
        }).then((res) =>{
          const data = { ...res }
          if(data) {
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            const { form: { setFieldsValue } } = this
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
          }
          this.descriptionList = data.unqualifiedInfoVOS || []
        }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.customerId = this.customerId
            const unqualifiedInfoDTOS = []
            const all = []
            for (const index in this.descriptionList) {
              all.push(this.$refs.ContactItem[index].getData())
            }
            Promise.all(all).then(array => {
              array.forEach(result => {
                unqualifiedInfoDTOS.push(result)
              })
              values.unqualifiedInfoDTOS = unqualifiedInfoDTOS
              this.save(values)
            }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          }else {
            this.confirmLoading = false
          }
        })
      },
      save(data){
        this.$post({
          url: this.$api.customInfo.customerInspectionRecordInfo.edit,
          data,
          needResponse: true
        }).then(res => {
            this.handleCancel()
            this.$emit('ok')
            this.$notification.success({
              message: labels.SAVE_SUCCESS,
              description: res.message || ''
            })
          })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleCancel () {
        // 重置表单数据
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
        this.descriptionList = []
        this.attachIds = []
        this.fileList = []
        this.file_info_list = []
      }
    }
  }
</script>