<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="POST"
      :query-params="queryParam"
    >
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="模板名称">
            <a-input v-model="queryParam.templateName" autocomplete="off" placeholder="请输入" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="是否启用">
            <a-select placeholder="请选择是否启用" v-model="queryParam.active">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('CollectionTemplate.Create')">新建</a-button>
      </template>
      <template slot="ellipsis2" slot-scope="text">
        <ellipsis tooltip :length="22">{{ text }}</ellipsis>
      </template>
      <template slot="ellipsis" slot-scope="text">
        <ellipsis tooltip :length="17">{{ text }}</ellipsis>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('CollectionTemplate.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('CollectionTemplate.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('CollectionTemplate.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
      <template slot="isActive" slot-scope="rows">
        <a-switch
          checked-children="是"
          un-checked-children="否"
          :checked="rows.isActive"
          :disabled="disabled"
          @change="isShowChecked(rows)"
        />
      </template>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"></action-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import labels from '@/utils/labels'
  import { defaultTableColumns } from '@/components/ListPage/_utils'

  export default {
    name: 'TableList',
    components: {
      STable,
      Ellipsis,
      ActionModal,
      ListPage
    },
    data () {
      return {
        loading: false,
        disabled:false,
        requestUrl: this.$api.basicData.receiptTemplate.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '模板名称',
            dataIndex: 'templateName',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '描述',
            dataIndex: 'description',
            scopedSlots: { customRender: 'ellipsis2' }
          },
          {
            title: '是否启用',
            scopedSlots: { customRender: 'isActive' },
            width: 100
          },
          {
            title: '编辑人',
            dataIndex: 'modifiedBy',
            width: 100
          },
          {
            title: '编辑时间',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || '',
            width: 110
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: []
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
      handleIsOpen (id ,active) {
        this.$post({
          url: this.$api.basicData.receiptTemplate.setActive,
          data: {
            id,
            active: !active
          },
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.handleOk()
          }).catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.basicData.receiptTemplate.delete,
          params: { id: record.id },
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
      isShowChecked(rows){
        if (this.disabled === true){
          return
        }
        this.disabled = true
        const active = rows.isActive
        const id = rows.id
        this.$post({
          url:this.$api.basicData.receiptTemplate.setActive,
          data: {
            id: id ,
            active: !active
          },
          needResponse: true,
        }).then(res=>{
          this.disabled = false
          this.handleOk()
        })
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {
          templateName: '',
          active: ''
        }
      },
    }
  }
</script>
