<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="queryParam"
      :scroll="{ x: 1800 }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="分类名称">
            <a-input v-model="queryParam.materialClassName" autocomplete="off" placeholder="请输入分类名称" :max-length="20"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="分类编码">
            <a-input v-model="queryParam.materialClassCode" autocomplete="off" placeholder="请输入分类编码" :max-length="20"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="分类类别">
            <a-select placeholder="请选择分类类别" v-model="queryParam.materialClassType">
              <a-select-option v-for="(item, index) in classType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否启用">
            <a-select placeholder="是否启用" v-model="queryParam.isActive">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('Material.Create')">新建</a-button>
      </template>
      <template slot="materialClassType" slot-scope="text">
        {{ classType[text].name }}
      </template>
      <template slot="isActive" slot-scope="text, record">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="text" 
          :disabled="isCheck"
          @change="handleIsOpen(record.id, 0)"/>
      </template>
      <template slot="isSpecial" slot-scope="text, record">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="text" 
          :disabled="isCheck"
          @change="handleIsOpen(record.id, 1)"/>
      </template>
      <template slot="isShareMaterial" slot-scope="text, record">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="text" 
          :disabled="isCheck"
          @change="handleIsOpen(record.id, 2)"/>
      </template>
      <template slot="isCulture" slot-scope="text, record">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="text" 
          :disabled="isCheck"
          @change="handleIsOpen(record.id, 3)"/>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('Material.Create')">
          <a @click="$refs.createModal.add(record,true)">新增</a>
          <a-divider v-if="actionAuth.includes('Material.Modify')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('Material.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('Material.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('Material.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record.id)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"></action-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString , defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'

  export default {
    name: 'TableList',
    components: {
      STable,
      ActionModal,
      ListPage
    },
    data () {
      return {
        loading: false,
        isCheck: false,
        requestUrl: this.$api.basicsClass.materialClass.getListPage,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        // 查询参数
        queryParam: {},
        // 分类类别
        classType: [
          {
            value : 0,
            name : '主材'
          },
          {
            value : 1,
            name : '辅材'
          },
          {
            value : 2,
            name : '人工'
          },
          {
            value : 3,
            name : '机械'
          },
        ],
        // 表头
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '分类名称',
            width: 200,
            dataIndex: 'materialClassName'
          },
          {
            title: '分类编码',
            dataIndex: 'materialClassCode'
          },

          {
            title: '特项代码',
            dataIndex: 'specialCode'
          },
          {
            title: '编码前缀',
            dataIndex: 'materialProCode'
          },
          {
            title: '分类类别',
            dataIndex: 'materialClassType',
            scopedSlots: { customRender: 'materialClassType'}
          },
          {
            title: '物料数量',
            dataIndex: 'maxNumber'
          },
          {
            title: '特殊材料',
            dataIndex: 'isSpecial',
            scopedSlots: { customRender: 'isSpecial' }

          },
          {
            title: '共享材料',
            dataIndex: 'isShareMaterial',
            scopedSlots: { customRender: 'isShareMaterial' }
          },
          {
            title: '文明施工',
            dataIndex: 'isCulture',
            scopedSlots: { customRender: 'isCulture' }
          },
          {
            title: '是否启用',
            dataIndex: 'isActive',
            scopedSlots: { customRender: 'isActive' }
          },
          {
            title: '编辑人',
            dataIndex: 'modifiedBy'
          },
          {
            title: '编辑时间',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 160,
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: [],
      }
    },
    created () {
      this.$store.dispatch('GetActionAuth').then(res => {
        const arr = []
        res.forEach(item => {
          arr.push(item.key)
        })
        this.actionAuth = arr
      })
    },
    methods: {
      delEmptyChildren (node) {
        node.forEach(item => {
          if (!item.children.length) {
            delete item.children
          } else {
            this.delEmptyChildren(item.children)
          }
        })
        return null
      },
      handleEdit (record) {
        this.$refs.createModal.edit(record)
      },
      handleIsOpen (id ,switchType) {
        this.loading = this.isCheck = true
        this.$post({
          url: this.$api.basicsClass.materialClass.isOpen,
          data: { 
            id,
            switchType
          },
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.handleOk()
          })
          .catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.loading = this.isCheck = false })

      },
      handleSub (id) {
        this.loading = true
        this.$delete({
          url: this.$api.basicsClass.materialClass.delete,
          params: {id},
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.DELETE_SUCCESS,
              description: res.message || ''
            })
            this.handleOk()
          }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {}
      },
    }
  }
</script>
