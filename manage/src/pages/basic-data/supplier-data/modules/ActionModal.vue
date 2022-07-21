<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-collapse v-model="activeKey" expand-icon-position="right" accordion >
        <a-collapse-panel key="1" header="供应商信息" forceRender>
          <supplier-info ref="SupplierInfo" :info="baseInfo" :type="modalType"></supplier-info>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="联系方式" forceRender>
          <contact-info ref="ContactInfo" :info="baseInfo" :type="modalType"></contact-info>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="款项" forceRender>
          <payment ref="Payment" :info="baseInfo" :type="modalType" :priceList="priceList"></payment>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="其他信息" forceRender>
          <other-info ref="OtherInfo" :info="baseInfo" :type="modalType"></other-info>
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { checkErrors, defaultErrorMessage, filedIsNull, maxLenValidator, numberValidator } from '@/utils/common'
  import labels from '@/utils/labels'
  import SupplierInfo from './SupplierInfo'
  import ContactInfo from './ContactInfo'
  import Payment from './Payment'
  import OtherInfo from './OtherInfo'

  export default {
    components:{
      SupplierInfo,
      ContactInfo,
      Payment,
      OtherInfo
    },
    data () {
      return {
        baseInfo: null,
        visible: false,
        isError: false,
        activeKey: ['1'],
        confirmLoading: false,
        errorMessage:'获取数据失败',
        modalType: 'add',
        priceList:[],
        statusList:[],
        form: this.$form.createForm(this),
      }
    },
    methods: {
      maxLenValidator,
      numberValidator,
      add (record) {
        this.modalType = 'add'
        this.visible = true
        this.id = ''
        const data = {
          supplyClassName: record.menuTitle,
          supplyClassCode: record.supplyClassCode,
          parentId: record.parentId,
          supplyCode: record.supplyCode,
          parentCodes: [...record.parentCodes].reverse()
        }
        this.baseInfo = data
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.supplyInfo.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            this.supplyClassCode = data.supplyClassCode
            this.parentId = data.parentId
            this.baseInfo = data
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
        this.confirmLoading = true
        this.$refs.SupplierInfo.form.validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            if(values.parentCodes && values.parentCodes.length) {
              values.supplyClassCode = values.parentCodes[values.parentCodes.length - 1]
            } else {
              values.supplyClassCode = this.supplyClassCode
            }
            if (this.$refs.ContactInfo) {
              this.$refs.ContactInfo.form.validateFields((errors1, values1) => {
                values = Object.assign(values,values1)
              })
            }
            if (this.$refs.Payment) {
              this.$refs.Payment.form.validateFields((errors2, values2) => {
                values = Object.assign(values,values2)
              })
            }
            if (this.$refs.OtherInfo) {
              this.$refs.OtherInfo.form.validateFields((errors3, values3) => {
                values = Object.assign(values,values3)
              })
            }
            this.save(values)
          } else {
            const keys=['businessCope']
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
            this.confirmLoading = false
          }
        })
      },
      save(values){

        this.$post({
          url: this.$api.basicData.supplyInfo.edit,
          data: { ...values },
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
      },
      handleCancel () {
        // 重置表单数据
        this.parentId = ''
        this.activeKey = ['1']
        this.baseInfo = null
        this.confirmLoading = false
        this.$refs.SupplierInfo.form.resetFields()
        this.$refs.ContactInfo.form.resetFields()
        this.$refs.Payment.form.resetFields()
        this.$refs.OtherInfo.form.resetFields()
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
