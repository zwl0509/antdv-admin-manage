<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      request-type="GET"
      :request-url="requestUrl"
      :query-params="searchParams">
      <template slot="$search">
        <a-col :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
          <a-form-item label="机构编码">
            <a-input v-model="queryParam.code" autocomplete="off" placeholder="请输入机构编码" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
          <a-form-item label="机构名称">
            <a-input v-model="queryParam.name" autocomplete="off" placeholder="请输入机构名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="8" :lg="6" :xl="6" :xxl="4">
          <a-form-item label="是否独立机构">
            <a-select :getPopupContainer=" triggerNode => { return triggerNode.parentNode }" v-model="queryParam.isSeparate" autocomplete="off" placeholder="请选择是否是独立机构" :max-length="30">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :value="item.value" :key="index">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="8" :lg="6" :xl="6" :xxl="4">
          <a-form-item label="是否部门">
            <a-select v-model="queryParam.isDepartment" autocomplete="off" placeholder="请选择是否是部门" :max-length="30">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :value="item.value" :key="index">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="8" :lg="6" :xl="6" :xxl="4">
          <a-form-item label="是否集团">
            <a-select v-model="queryParam.isGroup" autocomplete="off" placeholder="请选择是否是集团" :max-length="30">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :value="item.value" :key="index">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="8" :lg="6" :xl="6" :xxl="4">
          <a-form-item label="是否门店">
            <a-select v-model="queryParam.isStore" autocomplete="off" placeholder="请选择是否是门店" :max-length="30">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :value="item.value" :key="index">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="8" :xxl="6">
          <a-form-item label="创建日期">
            <a-range-picker v-model="queryParam.date" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('Depart.Create')">新建</a-button>
      </template>
      <!--<span slot="isLocked" slot-scope="bool, record">-->
      <!--  <template>-->
      <!--    <a-icon :type="record.isLocked?'check':'close'"/>-->
      <!--  </template>-->
      <!--</span>-->
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('Depart.Authority')">
          <a @click="handleAuth(record)">权限管理</a>
          <a-divider v-if="actionAuth.includes('Depart.Modify')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('Depart.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('Depart.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('Depart.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <department-vision ref="DepartmentVision" @ok="handleOk"></department-vision>
    <action-modal ref="createModal" @ok="handleOk"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import DepartmentVision from './modules/DepartmentVision'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
 
  export default {
    name: 'TableList',
    components: {
      ActionModal,
      DepartmentVision,
      ListPage
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.organization.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '序号',
            width: 100,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '机构编码',
            dataIndex: 'code'
          },
          {
            title: '机构名称',
            dataIndex: 'name'
          },
          {
            title: '是否独立机构',
            dataIndex: 'isSeparate',
            customRender: t => <a-icon type={t?'check':'close'}/>
          },
          {
            title: '是否部门',
            dataIndex: 'isDepartment',
            customRender: t => <a-icon type={t?'check':'close'}/>
          },
          {
            title: '是否集团',
            dataIndex: 'isGroup',
            customRender: t => <a-icon type={t?'check':'close'}/>
          },
          {
            title: '是否门店',
            dataIndex: 'isStore',
            customRender: t => <a-icon type={t?'check':'close'}/>
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
      searchParams () {
        if (this.queryParam.date) {
          this.queryParam.startTime = moment(this.queryParam.date[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.endTime = moment(this.queryParam.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
        delete this.queryParam.date
        return this.queryParam
      },
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
      handleAuth (record) {
        this.$refs.DepartmentVision.show(record.id)
      },
      handleEdit (record) {
        this.$refs.createModal.edit(record)
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.organization.delete,
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
      handleOk () {
        this.$refs.listPage.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      resetSearchForm () {
        this.queryParam = {
          date: null // moment(new Date())
        }
      }
    },
  }
</script>
