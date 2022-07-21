<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
    >
      <template slot="$search">
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.code" autocomplete="off" placeholder="请输入编号" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" autocomplete="off" placeholder="请输入名称" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select placeholder="请选择类型" v-model="queryParam.type" allowClear>
                <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('Role.Create')">新建</a-button>
      </template>
      <span slot="isDefault" slot-scope="bool, record">
        <template>
          <a-icon :type="record.isDefault?'check':'close'"/>
        </template>
      </span>
      <span slot="isDeleted" slot-scope="bool, record">
        <template>
          <a-icon :type="record.isDeleted?'check':'close'"/>
        </template>
      </span>
      <span slot="isLocked" slot-scope="bool, record">
        <template>
          <a-icon :type="record.isLocked?'check':'close'"/>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('Role.Authority')">
          <a @click="handleAuth(record,'1',true,'')">权限管理</a>
          <a-divider v-if="(actionAuth.includes('Role.Modify') || actionAuth.includes('Role.Delete')) && !record.isPreinstall" type="vertical"/>
        </template>
        <template v-if="!record.isPreinstall">
          <template v-if="actionAuth.includes('Role.Modify')">
            <a @click="handleEdit(record)">编辑</a>
            <a-divider v-if="actionAuth.includes('Role.Delete')" type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('Role.Delete')">
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"/>
    <auth-modal ref="authModal" :targetId="targetId" :type="type" @clickId="clearId"></auth-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import ActionModal from './modules/ActionModal'
// import AuthModal from '@/components/AuthModal'
import AuthModal from './modules/AuthModal'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'
import ListPage from '@/components/ListPage'
import { defaultTableColumns } from '@/components/ListPage/_utils'
import labels from '@/utils/labels'

export default {
  name: 'TableList',
  components: {
    STable,
    ActionModal,
    AuthModal,
    ListPage
  },
  data () {
    return {
      loading: false,
      type: 'roles',
      targetId: '',
      requestUrl: this.$api.system.role.getListPage,
      // 查询参数
      queryParam: {},
      searchParams: () => {
        return this.queryParam
      },
      // 表头
      columns: [
        defaultTableColumns.serial,
        {
          title: '类型',
          dataIndex: 'typeName'
        },
        {
          title: '编号',
          dataIndex: 'code'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        // {
        //   title: '是否默认',
        //   dataIndex: 'isDefault',
        //   scopedSlots: { customRender: 'isDefault' }
        // },
        // {
        //   title: '是否可用',
        //   dataIndex: 'isDeleted',
        //   scopedSlots: { customRender: 'isDeleted' }
        // },
        // {
        //   title: '是否锁定',
        //   dataIndex: 'isLocked',
        //   scopedSlots: { customRender: 'isLocked' }
        // },
        {
          title: '创建人',
          dataIndex: 'createdBy'
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
          customRender: txt => txt && moment(txt).format(dateFormatString) || ''
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
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      typeList: [],
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
    this.$getCodeList('1001', res => {
      this.typeList = res
    })
  },
  methods: {
    handleAuth (record,index,batch,targetId) {
      this.$refs.authModal.show(record,index,batch,targetId)
    },
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleSub (record) {
      this.loading = true
      this.$delete({
        url: this.$api.system.role.delete,
        params: { id: record.id },
        needResponse: true
      }).then(res => {
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
      this.queryParam = {
        name: '',
        code: '',
        type: ''
      }
    },
    clearId () {
      this.targetId = null
    }
  }
}
</script>
