<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="登录名称">
            <a-input v-model="queryParam.loginName" placeholder="请输入登录名称" autocomplete="off" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="真实姓名">
            <a-input v-model="queryParam.realName" placeholder="请输入真实姓名" autocomplete="off" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="手机号码">
            <a-input v-model="queryParam.phoneNumber" style="width: 100%" placeholder="请输入手机号码" autocomplete="off" :max-length="11"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="性别">
            <a-select placeholder="请选择性别" v-model="queryParam.gender">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="(item, index) in genderList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="职位">
            <a-select
              allowClear
              :getPopupContainer=" triggerNode => { return triggerNode.parentNode }"
              show-search
              :filterOption="filterOption"
              placeholder="请选择职位"
              v-model="queryParam.positionId">
              <a-select-option v-for="item in positionList" :value="item.id" :key="item.id">
                {{ item.positionName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="编辑时间">
            <a-range-picker v-model="queryParam.date" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否锁定">
            <a-select placeholder="请选择是否锁定" v-model="queryParam.isLocked" default-value="">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('User.Create')">新建</a-button>
        <a-button type="primary" @click="handleAuth('','2',false,selectedRowKeys)" v-if="selectedRowKeys.length && actionAuth.includes('User.Authority')">app权限</a-button>
        <a-button type="primary" @click="handleAuth('','1',false,selectedRowKeys)" v-if="selectedRowKeys.length && actionAuth.includes('User.Authority')">后台权限</a-button>
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
        <a-icon :type="record.isLocked?'check':'close'"/>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="record.isDefault !== 1">
          <template v-if="actionAuth.includes('User.Authority') && record.id !== $store.state.user.info.id">
            <a @click="handleAuth(record.id,'1',true,[])">用户管理</a>
            <a-divider
              v-if="actionAuth.includes('User.Modify') || actionAuth.includes('User.Delete') || actionAuth.includes('User.ResetPwd')"
              type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('User.Modify') && record.id !== $store.state.user.info.id">
            <a @click="handleEdit(record)">编辑</a>
            <a-divider v-if="actionAuth.includes('User.ResetPwd') && record.id !== $store.state.user.info.id" type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('User.ResetPwd') && record.id !== $store.state.user.info.id">
            <a-popconfirm title="是否要重置此用户登录密码？" @confirm="handleResetPwd(record)">
              <a>重置密码</a>
            </a-popconfirm>
            <a-divider v-if="actionAuth.includes('User.Delete')" type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('User.Delete') && record.id !== $store.state.user.info.id">
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"/>
    <auth-modal ref="authModal" @ok="handleOk"></auth-modal>
  </div>
</template>

<script>
import moment from 'moment'
import labels from '@/utils/labels'
import ListPage from '@/components/ListPage'
import AuthModal from './modules/AuthModal'
import ActionModal from './modules/ActionModal'
import { defaultTableColumns } from '@/components/ListPage/_utils'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'

export default {
  name: 'SystemUser',
  components: {
    ActionModal,
    ListPage,
    AuthModal,
  },
  data () {
    return {
      loading: false,
      requestUrl: this.$api.system.user.getListPage,
      // 查询参数
      queryParam: {},
              options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
              this.selectedRows = []
            },
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
          },
        },
        selectedRowKeys: [],
        selectedRows: [],
      // 表头
      columns: [
        defaultTableColumns.serial,
        {
          title: '登录名称',
          dataIndex: 'loginName',
        },
        {
          title: '真实姓名',
          dataIndex: 'realName'
        },
        {
          title: '性别',
          dataIndex: 'genderName',
        },
        {
          title: '电话',
          dataIndex: 'phoneNumber',
        },
        {
          title: '所属角色',
          dataIndex: 'roleNameJoin',
          width: 160
        },
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
          width: 260,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      genderList: [],
      actionAuth: [],
      positionList:[]
    }
  },
  created () {
    this.initPageData()
    this.getPosition()
  },
  methods: {
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
    searchParams () {
      if (this.queryParam.date) {
        this.queryParam.startTime = moment(this.queryParam.date[0]).format('YYYY-MM-DD') + ' 00:00:00'
        this.queryParam.endTime = moment(this.queryParam.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      delete this.queryParam.date
      return this.queryParam
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 获取职位
    getPosition() {
      const params= {
        currentPage: 0,
        pageSize : 0,
        isLocked : true
      }
      this.$get({
        url: this.$api.system.position.getListPage,
        params,
      }).then((res)=>{
        const data = res.rows
        this.positionList = data
      })
    },
    initPageData () {
      // 按钮级权限获取
      this.$store.dispatch('GetActionAuth').then(res => {
        const arr = []
        res.forEach(item => {
          arr.push(item.key)
        })
        this.actionAuth = arr
      })
      this.$getCodeList('1003', res => {
        this.genderList = res
      })
    },
    handleAuth (id,index,batch,targetIds) {
      this.$refs.authModal.show(id, index, batch, targetIds)
    },
    handleEdit (record) {
      this.$refs.createModal.edit(record)
    },
    handleResetPwd (record) {
      const data = {
        loginName: record.loginName,
        resetOrUpdate: 0
      }
      this.$post({
        url: this.$api.auth.resetPwd,
        data
      }).then(() => {
        this.$notification.success({
          message: labels.OPERATE_SUCCESS,
          description: labels.RESET_PASSWORD_SUCCESS
        })
      }).catch(defaultErrorMessage)
    },
    handleSub (record) {
      this.loading = true
      this.$delete({
        url: this.$api.system.user.delete,
        params: { id: record.id },
        needResponse: true
      })
        .then(res => {
          this.$notification.success({
            message: labels.DELETE_SUCCESS,
            description: res.message || ''
          })
          this.handleOk()
        })
        .catch(e => defaultErrorMessage(e, labels.DELETE_FAIL))
        .finally(() => {
          this.loading = false
        })
    },
    handleOk () {
      this.$refs.listPage.refresh()
    },
    resetSearchForm () {
      this.queryParam = {
        date: null // moment(new Date())
      }
    },
  }
}
</script>
