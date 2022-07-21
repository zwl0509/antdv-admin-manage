<template>
  <a-modal
    :visible="visible"
    :width="500"
    :title="modal_title"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="confirmLoading">
    <a-form :form="form">
      <a-row v-if="modal_type === '1040-10' ||modal_type === '1040-20'">
        <a-form-item label="飞单分类" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="modal_type === '1040-10'">
          <a-select placeholder="请选择飞单分类" style="width: 280px;" v-model="classification" allowClear>
            <a-select-option v-for="(item, index) in codeType.EvasionClassify" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="逃单分类" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="modal_type === '1040-20'">
          <a-select placeholder="请选择逃单分类" style="width: 280px;" v-model="classification" allowClear>
            <a-select-option v-for="(item, index) in codeType.EvasionClassify" :key="index" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :rows="4"
            v-model="remark"
            placeholder="请输入备注"
            :max-length="500"
            autocomplete="off" />
        </a-form-item>
      </a-row>
      <a-row v-else>
        <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select placeholder="请选择审核状态" v-decorator="['status',{rules: [{required: true}],initialValue: '1010-20'}]">
            <a-select-option v-for="item in statusList" :key="item.value" :value="item.value">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="审批内容"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            placeholder="请输入审批内容"
            :rows="4"
            v-decorator="['auditContent',{rules: [{required: true}]}]"
            :max-length="500"></a-textarea>
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'

  export default {
    name :'Review',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 1 :
            return '飞单审核'
          case 2 :
            return '逃单审核'
          case 3 :
            return '复活审核'
          case 4 :
            return '批量飞单审核'
          case 5 :
            return '批量逃单审核'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        remark:'',
        classification:'',
        modal_type: 0,
        statusList:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        queryParam: {
        },
        ids: [],
        customerId:'',
        form: this.$form.createForm(this),
        codeType: {
          EvasionClassify:[]
        },
      }
    },
    methods: {
      show(ids,type) {
        this.visible = true
        this.ids = ids
        this.modal_type = type
        this.getCodeList()
      },
      getCodeList(){
        // 逃单分类
        this.$getCodeList('1041', res => {
          this.codeType.EvasionClassify = res
        })
        const params = {
          typeList: ['1033','1010']
        }
        this.$getCodesList(params, res => {
          this.customerTypeList = res['1033'] || []  // 记录类型
          this.statusList = res['1010'] || []
          this.statusList.forEach((el,index)=> {
            if(el.value == '1010-10' || el.value == '1010-40') {
              this.statusList.splice(index,1)
            }
          })
        })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.ids = this.ids
            this.$post({
              url: this.$api.customInfo.flyOrEvasionInfo.audit,
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
      handleCancel() {
        this.form.resetFields()
        this.visible = false
        this.confirmLoading = false
        this.id = ''
        this.classification =  undefined
        this.type = ''
        this.remark = ''

      },
      refresh() {
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>