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
        <a-col :md="6" :sm="24">
          <a-form-item label="app名称">
            <a-input v-model="queryParam.appName" autocomplete="off" placeholder="请输入app名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="应用类型">
            <a-select placeholder="请选择应用类型" v-model="queryParam.appType" allowClear>
              <a-select-option v-for="(item, index) in appTypeList" :key="index" :value="item.value">{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="发布平台">
            <a-select placeholder="请选择发布平台" v-model="queryParam.publishPlatform" allowClear>
              <a-select-option v-for="(item, index) in platformList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <tempalte slot="$searchFold">
        <a-col :md="6" :sm="24">
          <a-form-item label="版本号">
            <a-input v-model="queryParam.versionNumber" autocomplete="off" placeholder="请输入版本号" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="创建日期">
            <a-range-picker v-model="queryParam.date" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </tempalte>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('Application.Create')">新建</a-button>
      </template>
      <span slot="isNeedUpdate" slot-scope="bool, record">
        <template>
          <a-icon :type="record.isNeedUpdate?'check':'close'"/>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('Application.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('Application.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('Application.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
            <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import ActionModal from './modules/ActionModal'
  import {  dateFormatString, defaultErrorMessage } from '@/utils/common'
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
        // 查询参数
        queryParam: {},

        requestUrl: this.$api.system.appVersion.getListPage,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: 'app名称',
            dataIndex: 'appName'
          },
          {
            title: '应用类型',
            dataIndex: 'appTypeName'
          },
          // {
          //   title: '是否可用',
          //   dataIndex: 'isDeleted',
          //   scopedSlots: { customRender: 'isDeleted' }
          // },
          {
            title: '是否需要更新',
            dataIndex: 'isNeedUpdate',
            scopedSlots: { customRender: 'isNeedUpdate' }
          },
          {
            title: '发布平台',
            dataIndex: 'publishPlatformName'
          },
          {
            title: '版本号',
            dataIndex: 'versionNumber'
          },
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
            width: '120px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        platformList: [],
        actionAuth: [],
        appTypeList: []
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
      this.$getCodeList('1006', res => {
        this.platformList = res
      })
      this.$getCodeList('1005', res => {
        this.appTypeList = res
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
      handleEdit (record) {
        this.$refs.createModal.edit(record)
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.system.appVersion.delete,
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
      resetSearchForm () {
        this.queryParam = {
          date: null // moment(new Date())
        }
      }
    }
  }
</script>
