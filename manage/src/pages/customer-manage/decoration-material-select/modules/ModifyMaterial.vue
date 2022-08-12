<template>
  <a-modal
    title="材料修改"
    :visible="visible"
    :width="800"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="材料名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入材料名称" autocomplete="off" disabled v-decorator="['materialName']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="所属区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                mode="multiple"
                placeholder="请选择所属区域"
                allowClear
                disabled
                showArrow
                v-decorator="['area']">
                <a-select-option v-for="(item, index) in areaList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="铺装位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                placeholder="请选择铺装位置"
                allowClear
                v-if="this.addType === '1087-40'"
                showArrow
                v-decorator="['pavingLocation']">
                <a-select-option v-for="(item, index) in pavements" :key="index" :value="item.position">
                  {{ item.positionName }}
                </a-select-option>
              </a-select>
              <a-select
                placeholder="请选择铺装位置"
                allowClear
                v-else
                showArrow
                v-decorator="['pavingLocation']">
                <a-select-option v-for="(item, index) in positionList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                placeholder="请选择颜色"
                allowClear
                showArrow
                v-decorator="['color']">
                <a-select-option v-for="(item, index) in colorList" :key="index" :value="item.attributeName">
                  {{ item.attributeName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="预估量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入预估量" autocomplete="off" v-decorator="['forecast']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否测量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch checked-children="是" un-checked-children="否" v-decorator="['isMeasure',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="材料规格" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入材料规格" autocomplete="off" disabled v-decorator="['spec']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="材料单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入材料单位" autocomplete="off" disabled v-decorator="['unit']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="价格标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请选择价格标识" autocomplete="off" disabled v-decorator="['priceSignName']"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :xs="24">
            <a-form-item label="材料价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入材料价格" autocomplete="off" disabled v-decorator="['salePrice']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="品牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入品牌" autocomplete="off" disabled v-decorator="['brand']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="材质" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入材质" autocomplete="off" disabled v-decorator="['texture']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入型号" autocomplete="off" disabled v-decorator="['materialType']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="类别系列" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入类别系列" autocomplete="off" disabled v-decorator="['typeSerial']"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="选材备注" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-textarea :rows="3" placeholder="请输入选材备注" autocomplete="off" v-decorator="['remark']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>

  </a-modal>
</template>

<script>
  import { checkErrors, defaultErrorMessage, filedIsNull } from '@/utils/common'
  import pick from 'lodash.pick'
  import labels from '@/utils/labels'

  export default {
    name: 'ModifyMaterial',
    data () {
      return {
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        areaList: [],
        positionList:[],
        pavements:[],
        colorList:[],
        id:'',
        customerId:'',
        materialId:'',
        addType:'',
      }
    },
    methods: {
      show(record) {
        this.materialId = record.materialId
        this.id= record.id
        this.addType = record.addType
        this.customerId= record.customerId
        this.visible = true
        this.getDetail(record.id)
        this.getCode()
      },
      getCode() {
        const params = {
          typeList: ['1086','1100']
        }
        this.$getCodesList(params, res => {
          this.areaList = res['1086'] || [] // 所属区域
          this.positionList = res['1100'] || [] // 铺装位置
        })
      },
      getDetail(id){
        const { form: { setFieldsValue } } = this
        this.confirmLoading = true
        this.$get({
          url: this.$api.customInfo.chooseMaterialInfo.getDetail,
          params: { id }
        })
          .then(res => {
            console.log(res)
            const data = res
            this.materialId = data.materialId
            this.pavements = data.pavements
            this.colorList = data.attributes
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
      handleSubmit() {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.customerId = this.customerId
            values.materialId = this.materialId
            this.save(values)
          }
        })
      },
      save(data){
        this.$post({
          url: this.$api.customInfo.chooseMaterialInfo.edit,
          data: [data],
          needResponse: true
        })
          .then(res => {
            this.handleCancel()
            this.$emit('ok')
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
      handleCancel() {
        this.form.resetFields()
        this.confirmLoading = false
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>