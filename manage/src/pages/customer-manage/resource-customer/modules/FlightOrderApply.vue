<template>
  <a-modal
    :title="modal_title"
    :width="800"
    :centered="true"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-row>
        <!-- <a-col :md="12" :sm="24" v-if="modal_type === 2">
          <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ queryParam.customerName }}
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" v-if="modal_type === 2">
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ queryParam.mobileNumber }}
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <ellipsis :length="20" tooltip>{{ queryParam.finalAddress }}</ellipsis>
          </a-form-item>
        </a-col> -->
        <a-col :md="24" :sm="24">
          <a-form-item label="飞单分类" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
            <a-select placeholder="请选择飞单分类" style="width: 280px;" v-model="classification" allowClear>
              <a-select-option v-for="(item, index) in codeType.EvasionClassify" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="飞单备注信息" :labelCol="{ xs: { span: 24 }, sm: { span: 3 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 21 }}">
            <a-textarea
              :rows="4"
              :maxLenth="500"
              placeholder="请输入飞单备注信息"
              autocomplete="off"
              v-model="remark"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {
    components: {
      Ellipsis
    },
    name: 'FlightOrderApply',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 1 :
            return '批量飞单'
          case 2 :
            return '飞单申请'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        visible: false,
        modal_type: 0,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        id: '',
        form: this.$form.createForm(this),
        queryParam: {},
        classification: undefined,
        remark:'',
        customerIds:[],
        codeType: {
          EvasionClassify:[]
        }
      }
    },
    methods: {
      show (record,ids,type) {
        this.queryParam = record
        this.modal_type = type
        this.visible = true
        this.getCodeList()
        this.customerIds = ids
        this.type = ''
        this.remark = ''
      },
      shows (ids,type){
        this.modal_type = type
        this.visible = true
        this.getCodeList()
        this.customerIds = ids
        this.type = ''
        this.remark = ''
      },
      getCodeList(){
        // 逃单分类
        this.$getCodeList('1041', res => {
          this.codeType.EvasionClassify = res
        })
      },

      handleSubmit () {
        const data = {
          customerIds : this.customerIds,
          type : '1040-10',
          isReborn : false,
          classification : this.classification,
          remark : this.remark
        }
        this.loading = true
        this.$post({
          url: this.$api.customInfo.flyOrEvasionInfo.application,
          data,
          needResponse: true
        }).then((res)=>{
          this.handleCancel()
          this.$emit('ok')
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleCancel() {
        this.id = ''
        this.visible = false
        this.classification =  undefined
        this.customerIds = ''
        this.type = ''
        this.remark = ''
      }
    }
  }
</script>