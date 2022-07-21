<template>
  <a-modal
    :title="modal_title"
    :width="800"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-alert v-if="isError" :message="errorMessage" type="error" show-icon closable></a-alert>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :grabbed="48">
          <a-col :md="12" :xs="24">
            <a-form-item label="节点名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入节点名称"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['name', { rules: [{ required: true },{ validator: (r, v, fun) => maxLenValidator(r, v, fun, 50) }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="流程顺序" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入流程顺序"
                autocomplete="off"
                :disabled="modal_type == 'detail'"
                v-decorator="['sequence', { rules: [{ required: true },{ validator: (r, v, fun) => regularCheck('int', v, fun) }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="前置条件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :disabled="modal_type == 'detail'"
                @change="changeRecord"
                v-decorator="['frontCondition',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否派工" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :disabled="modal_type == 'detail'"
                @change="changeDispatch"
                v-decorator="['isDispatch',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24" v-if="isRecord">
            <a-form-item label="前置条件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                mode="multiple"
                allowClear
                show-search
                change-on-select
                placeholder="请选择前置条件"
                :filterOption="filterOption"
                :disabled="modal_type == 'detail'"
                v-decorator="['workFlowFrontIds']">
                <a-select-option v-for="(item, index) in frontList" :value="item.fid" :key="index">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24" v-if="isDispatch">
            <a-form-item label="派工类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择派工类型" :disabled="modal_type == 'detail'" v-decorator="['dispatchType']">
                <a-select-option
                  v-for="(item, index) in dispatchType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="绑定表单" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select placeholder="请选择绑定表单" :disabled="modal_type == 'detail'" v-decorator="['workFlowRelationFormCode',{ rules: [{ required: true }]}]">
                <a-select-option
                  v-for="(item, index) in formType"
                  :key="index"
                  :value="item.value"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="原系统id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入原系统id"
                autocomplete="off"
                v-decorator="['oldId', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="原系统职位id" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                placeholder="请输入原系统职位id"
                autocomplete="off"
                v-decorator="['oldPostId', {rules: [{ validator: (r, v, fun) => regularCheck2(r, v,fun, 'int', 9, '请输入1到9位的数字') }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="派工岗位" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-select
                mode="multiple"
                allowClear
                show-search
                change-on-select
                placeholder="请选择派工岗位"
                :filterOption="filterOption"
                :disabled="modal_type == 'detail'"
                v-decorator="['workFlowDispatchPositionIds']">
                <template slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0" />
                  <div style="padding: 5px; cursor: pointer; float: right;margin-right: 30px;">
                    <a-button @click="selectDispatchAll" size="small">全选</a-button>
                    <a-button size="small" @click="clearDispatchAll" style="position: relative; left: 10px">清空</a-button>
                  </div>
                </template>
                <a-select-option
                  v-for="(item, index) in postList"
                  :key="index"
                  :value="item.id"
                >{{ item.positionName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :xs="24">
            <a-form-item label="操作岗位" :labelCol="labelCol1" :wrapperCol="wrapperCol1">
              <a-select
                mode="multiple"
                allowClear
                show-search
                change-on-select
                placeholder="请选择操作岗位"
                :filterOption="filterOption"
                :disabled="modal_type == 'detail'"
                v-decorator="['workFlowRelationPositionIds']">
                <template slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0" />
                  <div style="padding: 5px; cursor: pointer; float: right;margin-right: 30px;">
                    <a-button @click="selectAll" size="small">全选</a-button>
                    <a-button size="small" @click="clearAll" style="position: relative; left: 10px">清空</a-button>
                  </div>
                </template>
                <a-select-option
                  v-for="(item, index) in postList"
                  :key="index"
                  :value="item.id"
                >{{ item.positionName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :grabbed="48">
          <a-col :md="24" :xs="24">
            <a-form-item label="绑定菜单" :labelCol="labelCol1" :wrapperCol="wrapperCol1" >
              <a-tree-select
                placeholder="请选择绑定菜单"
                allowClear
                :multiple="true"
                :dropdownStyle="{maxHeight: '300px'}"
                :tree-data="menuList"
                tree-checkable
                :replaceFields="{ title: 'title', value: 'id' }"
                :disabled="modal_type == 'detail'"
                v-decorator="['workFlowRelationMenuIds']"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否忽略" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :disabled="modal_type == 'detail'"
                v-decorator="['canIgnore',{ valuePropName: 'checked', initialValue: false }]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="是否并行节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :disabled="modal_type == 'detail'"
                v-decorator="['canParallel',{ valuePropName: 'checked', initialValue: false }]"/>
              <span style="color: red;margin-left: 10px;">选中并行节点时需流程顺序相同！</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template slot="footer">
      <div v-if="modal_type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { maxLenValidator ,filedIsNull,regularCheck,regularCheck2} from '@/utils/common'
  export default {
    name: 'ProcessDetail',
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'add' :
            return '新增流程信息'
          case 'edit' :
            return '编辑流程信息'
          case 'detail':
            return '流程信息详情'
          default:
            return ''
        }
      }
    },
    data () {
      return {
        modal_type: '',
        visible: false,
        confirmLoading: false,
        isError: false,
        isRecord: false,
        isDispatch: false,
        errorMessage: '获取数据失败',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 },
        },
        form: this.$form.createForm(this),
        fid: '',
      }
    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    methods: {
      maxLenValidator,regularCheck,regularCheck2,
      add(list) {
        this.modal_type = 'add'
        this.visible = true
        this.frontList = list
        this.getCodeList()
        this.getMenuList()
        this.getPostList()
      },
      async edit(record, type, list, index) {
        this.modal_type = type
        this.visible = true
        this.frontList = list
        this.s_index = index
        await this.getCodeList()
        await this.getMenuList()
        await this.getPostList()
        await this.getDetail(record)
      },
      // 获取详情
      getDetail(record) {
        const data = { ...record }
        this.fid = record.fid
        for (const key in data) {
          if (filedIsNull(data[key])) {
            delete data[key]
          }
        }
        this.isRecord = data.frontCondition
        this.isDispatch = data.isDispatch
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(Object.assign({}, data), Object.keys(this.form.fieldsStore.fieldsMeta)))
        })
      },
      // 获取菜单数据
      getMenuList() {
        this.$get({
          url:this.$api.system.menu.getListPage
        }).then((res)=>{
          const list = res[0] && res[0].voList || []
          this.menuList = list
          list && list.forEach(item=>{
            if(item.children && item.children.length){
              item.children.forEach(info=>{
                this.menuChildrenList.push(info)
              })
            }
          })
        })
      },
      // 获取岗位数据
      getPostList() {
        this.$get({
          url:this.$api.system.position.getListPage,
          params: {
            isLocked: true,
            currentPage: 0,
            pageSize: 0
          }
        }).then((res)=>{
          this.postList = res.rows || []
        })
      },
      getCodeList(){
        // 派工类型
        const params = {
          typeList: ['1051','1059']
        }
        this.$getCodesList(params, res => {
          this.dispatchType = res['1051'] || []
          this.formType = res['1059'] || []
        })
      },
      // 是否显示前置条件
      changeRecord(e){
        if(e === true){
          this.isRecord = true
        }else {
          this.isRecord = false
        }
      },
      // 是否派工
      changeDispatch(e) {
        if(e === true){
          this.isDispatch = true
        }else {
          this.isDispatch = false
        }
      },
      // 下拉数据筛选
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      // 岗位全选
      selectAll () {
        const arr = []
        this.postList.forEach(item => {
          arr.push(item.id)
        })
        this.$nextTick(()=>{
          this.form.setFieldsValue({ workFlowRelationPositionIds: arr })
        })
      },
      // 岗位清空
      clearAll(){
        this.$nextTick(()=>{
          this.form.setFieldsValue({ workFlowRelationPositionIds: [] })
        })
      },
      // 派工岗位全选
      selectDispatchAll () {
        const arr = []
        this.postList.forEach(item => {
          arr.push(item.id)
        })
        this.$nextTick(()=>{
          this.form.setFieldsValue({ workFlowDispatchPositionIds: arr })
        })
      },
      // 派工岗位清空
      clearDispatchAll() {
        this.$nextTick(()=>{
          this.form.setFieldsValue({ workFlowDispatchPositionIds: [] })
        })
      },
      handleSubmit() {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if(!errors) {
            values.id = this.id
            values.dispatchTypeName = values.dispatchType && this.dispatchType.find(item=> item.value === values.dispatchType).name
            values.workFlowRelationFormCodeName = values.workFlowRelationFormCode && this.formType.find(item=> item.value === values.workFlowRelationFormCode).name
            // 岗位
            if(values.workFlowRelationPositionIds && values.workFlowRelationPositionIds.length) {
              const arrName = []
              values.workFlowRelationPositionIds.forEach(item=>{
                this.postList.forEach(info=>{
                  if (item == info.id ) {
                    arrName.push(info.positionName)
                  }
                })
              })
              values.workFlowRelationPositionNames = arrName
            } else {
              values.workFlowRelationPositionNames = []
            }
            // 派工岗位
            if(values.workFlowDispatchPositionIds && values.workFlowDispatchPositionIds.length) {
              const arrName = []
              values.workFlowDispatchPositionIds.forEach(item=>{
                this.postList.forEach(info=>{
                  if (item == info.id ) {
                    arrName.push(info.positionName)
                  }
                })
              })
              values.workFlowDispatchNames = arrName
            } else {
              values.workFlowDispatchNames = []
            }
            // 绑定菜单
            if(values.workFlowRelationMenuIds && values.workFlowRelationMenuIds.length) {
              const menuName = []
              values.workFlowRelationMenuIds.forEach(item=>{
                this.menuChildrenList.forEach(info=>{
                  if (item == info.id ) {
                    menuName.push(info.title)
                  }
                })
              })
              values.workFlowRelationMenuNames = menuName
            } else {
              values.workFlowRelationMenuNames = []
            }
            values.fid = this.fid || this.uuid()
            this.$emit('updataList',values,this.s_index)
            this.handleCancel()
          }
        })
      },
      handleCancel() {
        this.fid = ''
        this.visible = false
        this.isRecord = false
        this.isDispatch = false
        this.s_index = -1
        this.frontList = []
        this.menuChildrenList = []
        this.form.resetFields()
      },
      uuid() {
        const s = []
        const hexDigits = '0123456789abcdef'
        for (var i = 0; i < 32; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] ='4'
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
        const uuid = s.join('')
        return uuid
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>