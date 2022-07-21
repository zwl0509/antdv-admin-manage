<template>
  <!-- 施工计划模板 -->
  <div>
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        @resetParams="resetSearchForm"
        :columns="columns"
        :request-url="requestUrl"
        request-type="POST"
        :query-params="searchParams">
        <template slot="$search">
          <a-col :md="6" :sm="24">
            <a-form-item label="模板名字">
              <a-input v-model="queryParam.templateName" autocomplete="off" placeholder="请输入模板名字" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="适用装修地址最小面积">
              <a-input type="number" v-model="queryParam.minArea" autocomplete="off" placeholder="请输入适用装修地址最小面积" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="适用装修地址最大面积">
              <a-input type="number" v-model="queryParam.maxArea" autocomplete="off" placeholder="请输入适用装修地址最大面积" :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="是否启用">
              <a-select placeholder="是否启用" v-model="queryParam.isUse">
                <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </template>
        <template slot="$operate">
          <a-button
            type="primary"
            icon="plus"
            style="margin-bottom: 8px;"
            @click="$refs.ActionModal.add()"
            v-if="actionAuth.includes('ConstructionFormwork.Create')">新建</a-button>
          <a-button
            type="primary"
            icon="plus"
            style="margin-bottom: 8px;"
            @click="$refs.ConstructionTasks.show()"
            v-if="actionAuth.includes('ConstructionFormwork.Create')">施工任务</a-button>
        </template>
        <template slot="switch" slot-scope="text">
          <span>{{ !!text? '是' : '否' }}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <template v-if="actionAuth.includes('ConstructionFormwork.Modify')">
            <a @click="$refs.ActionModal.edit(record,'edit')">编辑</a>
            <a-divider type="vertical" v-if="actionAuth.includes('ConstructionFormwork.Delete')"/>
          </template>
          <template v-if="actionAuth.includes('ConstructionFormwork.Delete')">
            <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </list-page>
    </a-spin>
    <action-modal ref="ActionModal" @ok="handleOk" @close="handleSaveClose"/>
    <construction-tasks ref="ConstructionTasks" @ok="handleOk"></construction-tasks>
  </div>
</template>

<script>
  import moment from 'moment'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'
  import ConstructionTasks from '@/pages/business-configuration/construction-formwork/modules/ConstructionTasks'

  export default {
    name: 'TreeList',
    components: {
      ConstructionTasks,
      ActionModal,
      ListPage
    },
    data () {
      return {
        treeLoading: false,
        loadingErrorText: undefined,
        loading: false,
        type: 'position',
        targetId: '',
        // 高级搜索 展开/关闭
        advanced: false,
        openKeys: ['key-01'],

        orgTree: [],
        menuKey: null,
        menuId: 0,
        menuTitle: null,
        requestUrl: this.$api.construction.basicConstructionTemplateInfo.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '模板名字',
            dataIndex: 'templateName'
          },
          {
            title: '是否启用',
            dataIndex: 'isUse',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '适用装修地址最小面积',
            width: 200,
            dataIndex: 'minArea'
          },
          {
            title: '适用装修地址最大面积',
            width: 200,
            dataIndex: 'maxArea'
          },
          {
            title: '排序值',
            dataIndex: 'sequence'
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
            width: '140px',
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
      // this.getOrgTreeData()
    },
    methods: {
      searchParams () {
        if (this.queryParam.data) {
          this.queryParam.startTime = moment(this.queryParam.data[0]).format('YYYY-MM-DD')
          this.queryParam.endTime = moment(this.queryParam.data[1]).format('YYYY-MM-DD')
        }
        delete this.queryParam.data
        return this.queryParam
      },
      handleSub (record) {
        this.loading = true
        this.$put({
          url: this.$api.construction.basicConstructionTemplateInfo.delete,
          params: {id : record.id} ,
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
        this.$refs.listPage.refresh(true)
      },
      handleSaveClose () {

      },
      resetSearchForm () {
        this.queryParam = {
          date: null
        }
      },
      clearId () {
        this.targetId = null
      }
    }
  }
</script>

<style lang="scss">
</style>
