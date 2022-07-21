<template>
  <a-modal
    :title="modalType === 'add' ? '新增' : '编辑'"
    :width="1200"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask-closable="false">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-divider style="margin-top: 0">基础信息</a-divider>
        <a-row :grabbed="48">
          <a-col :md="8" :xs="24">
            <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入分类名称"
                autocomplete="off"
                disabled
                :max-length="64"
                v-decorator="['materialClassName']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="材料编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入材料编码"
                autocomplete="off"
                :max-length="64"
                v-decorator="['materialCode',{ rules: [{ required: true, message: '请输入材料编码!'}] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="材料名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入材料名称"
                autocomplete="off"
                :max-length="100"
                v-decorator="['materialName',{ rules: [{ required: true, message: '请输入材料名称!'}] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="助记码1" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入助记码1"
                autocomplete="off"
                :max-length="64"
                v-decorator="['help']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="助记码2" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入助记码2"
                autocomplete="off"
                :max-length="64"
                v-decorator="['tradeHelp']"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :xs="24">
            <a-form-item label="品牌" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入品牌"
                autocomplete="off"
                :max-length="500"
                v-decorator="['brand']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="型号" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入型号"
                autocomplete="off"
                :max-length="500"
                v-decorator="['materialType',{ rules: [{ required: true, message: '请输入型号!' }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="颜色" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入颜色"
                autocomplete="off"
                :max-length="50"
                v-decorator="['color']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="材质" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入材质"
                autocomplete="off"
                :max-length="500"
                v-decorator="['texture']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="规格" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入规格"
                autocomplete="off"
                :max-length="100"
                v-decorator="['spec']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="产地" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入产地"
                autocomplete="off"
                :max-length="500"
                v-decorator="['origin']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select placeholder="请选择单位" v-decorator="['unit',{ rules: [{ required: true, message: '请选择单位!' }] }]">
                <a-select-option
                  v-for="(item, index) in unitTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="品类名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入品类名称"
                autocomplete="off"
                :max-length="100"
                v-decorator="['materialBrand']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="采购价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入采购价"
                autocomplete="off"
                v-decorator="['buyPrice',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '采购价格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="返点比例" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入返点比例"
                autocomplete="off"
                v-decorator="['rebateProportion',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '返点比例格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="销售价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入销售价"
                autocomplete="off"
                v-decorator="['salePrice',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '销售价格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="承包价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入承包价"
                autocomplete="off"
                v-decorator="['contractPrice',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '承包价格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="加盟价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入加盟价"
                autocomplete="off"
                v-decorator="['joinPrice',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '加盟价格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="结算方式" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                placeholder="请选择结算方式"
                v-decorator="['clearingTypeCode']">
                <a-select-option
                  v-for="(item, index) in settlementTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="库存上限" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入库存上限"
                autocomplete="off"
                v-decorator="['stockHigh',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的库存上限') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="库存下限" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入库存下限"
                autocomplete="off"
                v-decorator="['stockLow',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的库存下限') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入库存数量"
                autocomplete="off"
                v-decorator="['stockNum',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '库存数量格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="库存金额" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入库存金额"
                autocomplete="off"
                v-decorator="['stockMoney',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '库存金额格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="库存均价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入库存均价"
                autocomplete="off"
                v-decorator="['stockPrice',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '库存均价格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="特项编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入特项编码"
                autocomplete="off"
                :max-length="32"
                v-decorator="['specialCode',{ rules: [{ required: true, message: '请输入特项编码!'}] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="材料条码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入材料条码"
                autocomplete="off"
                :max-length="64"
                v-decorator="['barcode']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select allowClear placeholder="请选择仓库" v-decorator="['stockId']">
                <a-select-option
                  v-for="(item, index) in stockList"
                  :key="index"
                  :value="item.id"
                >{{ item.stockName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="16" :xs="24">
            <a-form-item label="供应商" :labelCol="labelCol1" :wrapperCol="wrapperCol1" >
              <a-input
                placeholder="请输入供应商"
                autocomplete="off"
                disabled
                :max-length="100"
                v-decorator="['supplyName']">
                <span slot="suffix" @click="selectSupply">····</span>
              </a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :xs="24">
            <a-form-item label="禁用分公司" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入禁用分公司"
                autocomplete="off"
                v-decorator="['disableOrgName']"/>
            </a-form-item>
          </a-col> -->
          <a-col :md="8" :xs="24">
            <a-form-item label="采购转库存系数" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入采购转库存系数"
                autocomplete="off"
                :max-length="64"
                v-decorator="['buyToStockRate',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '采购转库存系数格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="采购单位" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                placeholder="请选择采购单位"
                v-decorator="['buyUnit']">
                <a-select-option
                  v-for="(item, index) in unitTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="销售转库存系数" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入销售转库存系数"
                autocomplete="off"
                v-decorator="['saleToStockRate',{ rules: [{ validator: (r,v,f) => regularCheck2(r, v, f, 'number', [18,4], '销售转库存系数格式校验失败') }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="销售单位" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                placeholder="请选择销售单位"
                v-decorator="['saleUnit']">
                <a-select-option
                  v-for="(item, index) in unitTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="采购周期(天)" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入采购周期(天)"
                autocomplete="off"
                v-decorator="['purchaseCycle',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的采购周期(天)') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="质保期(月)" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入质保期(月)"
                autocomplete="off"
                v-decorator="['repairedPeriod',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的质保期(月)') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="工人工种" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                placeholder="请选择工人工种"
                v-decorator="['workerType',{rules: [{ validator:(r, v, fun)=> maxLenValidator(r, v, fun, 20)}]}]">
                <a-select-option
                  v-for="(item, index) in workerTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="16" :xs="24">
            <a-form-item label="所属仓库" :labelCol="labelCol1" :wrapperCol="wrapperCol1" >
              <a-select mode="multiple" allowClear placeholder="请选择所属仓库" v-decorator="['stockIds']">
                <a-select-option
                  v-for="(item, index) in stockList"
                  :key="index"
                  :value="item.id"
                >{{ item.stockName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :md="8" :xs="24">
            <a-form-item label="类别系列" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入类别系列"
                autocomplete="off"
                :max-length="200"
                v-decorator="['typeSerial']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="价格类型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-select
                placeholder="请选择价格类型"
                v-decorator="['priceTypeCode']">
                <a-select-option
                  v-for="(item, index) in priceTypeList"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="高度" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入高度"
                autocomplete="off"
                :max-length="50"
                v-decorator="['high']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="长度" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入长度"
                autocomplete="off"
                :max-length="50"
                v-decorator="['length']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="体积" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入体积"
                autocomplete="off"
                :max-length="50"
                v-decorator="['volume']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="重量" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入重量"
                autocomplete="off"
                :max-length="50"
                v-decorator="['weight']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="宽度" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入宽度"
                autocomplete="off"
                :max-length="50"
                v-decorator="['width']"/>
            </a-form-item>
          </a-col>
          <!-- code -->
          <a-col :md="8" :xs="24">
            <a-form-item label="产品图片" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入宽度"
                autocomplete="off"
                :max-length="256"
                v-decorator="['materialPicture']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="质量标准" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入质量标准"
                autocomplete="off"
                :max-length="50"
                v-decorator="['standard']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="商业名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入商业名称"
                autocomplete="off"
                :max-length="100"
                v-decorator="['tradeName']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="用友编码" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                placeholder="请输入用友编码"
                autocomplete="off"
                :max-length="200"
                v-decorator="['hmyMaterialCode']"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input
                type="number"
                placeholder="请输入排序"
                autocomplete="off"
                v-decorator="['sequence',{rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的顺序') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isActive',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="是否允许修改" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isCanEdit',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="是否定制品" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isCustomize',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="是否测量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isMeasure',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="是否需要安装" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isNeedInstall',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :xs="24">
            <a-form-item label="是否库存记账" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                v-decorator="['isStock',{ valuePropName: 'checked', initialValue: true }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="备注" :labelCol="{ xs: { span: 24 }, sm: { span: 2 }}" :wrapperCol="{ xs: { span: 24 }, sm: { span: 22 }}" >
              <a-textarea
                :rows="4"
                placeholder="请输入备注"
                autocomplete="off"
                :max-length="500"
                v-decorator="['supplyProCode']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <select-supply ref="SelectSupply" @ok="handeOk"></select-supply>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { defaultErrorMessage, checkErrors, filedIsNull, maxLenValidator,regularCheck,regularCheck2 } from '@/utils/common'
  import labels from '@/utils/labels'
  import SelectSupply from './SelectSupply'

  export default {
    components: { 
      SelectSupply 
    },
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
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        materialClassId: '', // 分类id
        form: this.$form.createForm(this),
        unitTypeList: [],
        priceTypeList: [],
        settlementTypeList: [],
        workerTypeList: [],
        stockList: [] , // 仓库列表
        supplyId: '', // 供应商ID
      }
    },
    created() {
      // 工人工种
      this.$getCodeList('1011', res => {
        this.workerTypeList = res
      })
      // 单位类型
      this.$getCodeList('1016', res => {
        this.unitTypeList = res
      })
      // 价格类型
      this.$getCodeList('1017', res => {
        this.priceTypeList = res
      })
      // 结算方式
      this.$getCodeList('1018', res => {
        this.settlementTypeList = res
      })
     
    },
    methods: {
      maxLenValidator,regularCheck,regularCheck2,
      add (row) {
        this.modalType = 'add'
        this.id = ''
        this.materialClassId = row.menuId
        // console.log(row)
        this.visible = true
        this.getStock() // 获取仓库
        this.$nextTick(() => {
          this.form.setFieldsValue({
            materialClassName: row.menuTitle
          })
        })
      },
      edit (record) {
        const { form: { setFieldsValue } } = this
        this.modalType = 'edit'
        this.id = record.id
        this.visible = true
        this.confirmLoading = true
        this.$get({
          url: this.$api.basicData.materialInfo.getDetail,
          params: { id: record.id }
        })
          .then(res => {
            const data = { ...res }
            this.supplyId = data.supplyId
            this.materialClassId = data.materialClassId
            for (const key in data) {
              if (filedIsNull(data[key])) {
                delete data[key]
              }
            }
            this.$nextTick(() => {
              setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
            })
            this.getStock() // 获取仓库
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.confirmLoading = false
          })
      },
      getStock() {
        const data = {
          currentPage: 0,
          pageSize: 0,
          // stockName: '' //模糊查询仓库名称
        }
        this.$post({
          url: this.$api.basicData.stock.getStock,
          data,
        }).then((res)=>{
          this.stockList = res
        })
      },
      selectSupply() {
        this.$refs.SelectSupply.show()
      },
      handeOk(data) {
        if(data){
          this.supplyId = data.id
          this.form.setFieldsValue({
            supplyName: data.supplyName
          })
        }else {
          this.supplyId= ''
        }
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            values.materialClassId = this.materialClassId
            values.supplyId = this.supplyId
            this.$post({
              url: this.$api.basicData.materialInfo.edit,
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
            const keys=['sequence']
            defaultErrorMessage(checkErrors(keys,errors),labels.RULES_ERROR)
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
    background: red !important;
    color: #585A62;
  }
</style>
