<template>
  <!-- 工人管理 -->
  <a-modal
    :visible="visible"
    :width="1200"
    title="工人管理"
    @cancel="handleCancel"
    @ok="handleOk"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-card :bordered="false" style="padding: 0" class="page">
      <a-row :gutter="0">
        <a-col :span="4" style="padding-right: 24px">
          <s-tree
            textName="materialClassName"
            :dataSource="jobsList"
            :openKeys.sync="openKeys"
            :search="false"
            :action="false"
            :actionAuth="actionAuth"
            :loading="leftLoading"
            :noDataText="treeLoadText"
            show-title="title"
            @click="handleClick">
          </s-tree>
        </a-col>
        <a-col class="borderLeft" :span="20" >
          <a-spin :spinning="loading">
            <div v-if="this.menuKey">
              <div style="margin-bottom: 10px;" v-if="this.dataList.length === 0 && actionAuth.includes('WorkerDispatch.Dispatch')">
                <a-button type="primary" icon="edit" style="margin-bottom: 8px;" @click="handleAdd(type)">派工</a-button>
              </div>
              <div style="margin-bottom: 10px;" v-else-if="actionAuth.includes('WorkerDispatch.AddDispatch')">
                <a-button type="primary" icon="edit" style="margin-bottom: 8px;" @click="handleAdd(type)">加派</a-button>
              </div>
            </div>
            <a-table
              rowKey="id"
              ref="Table"
              :columns="columns"
              :dataSource="dataList"
              :pagination="false"
              :scroll="{ y: 360 }">
              <template slot="serial" slot-scope="text,record,index">
                <span>{{ index + 1 }}</span>
              </template>
              <template slot="switch" slot-scope="text">
                <span>{{ !!text? '是' : '否' }}</span>
              </template>
            </a-table>
            <dispatch-detail ref="DispatchDetail" @ok="handleOk"></dispatch-detail>
          </a-spin>
        </a-col>
      </a-row>
    </a-card>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { dateFormatString, defaultErrorMessage, filedIsNull } from '@/utils/common'
  import STree from '@/components/MyTree'
  import ListPage from '@/components/ListPage'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import labels from '@/utils/labels'
  import DispatchDetail from '@/pages/customer-manage/worker-dispatch/modules/DispatchDetail'
  import pick from 'lodash.pick'
  export default {
    name: 'Dispatch',
    components: {
      DispatchDetail,
      STree,
      ListPage
    },
    data () {
      return {
        visible: false,
        loading: false,
        treeLoading: false,
        openKeys: ['key-01'],
        menuKey:'',
        menuTitle:'',
        leftLoading: false,
        treeLoadText: undefined,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '工人名称',
            align: 'center',
            dataIndex: 'workerName'
          },
          {
            title: '类型',
            align: 'center',
            dataIndex: 'typeName'
          },
          {
            title: '是否带班工人',
            align: 'center',
            dataIndex: 'isLeader',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '是否验证',
            align: 'center',
            dataIndex: 'statusName'
          },
        ],
        dataList:[],
        jobsList: [],
        actionAuth: [],
        customerId: '',
        type: '',
        workerName: '',
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
      this.$getCodeList('1011', res => {
        this.jobsList = res
      })
    },
    methods: {
      show (id) {
        this.customerId = id
        this.visible = true
        this.getList(id)
      },
      getList(customerId,type){
        this.loading = true
        this.$get({
          url: this.$api.customInfo.workerDispatchInfo.getList,
          params: { customerId,type },
          needResponse: true
        })
          .then(res => {
            const data = res.result
            this.dataList = data || []
          })
          .catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
          .finally(() => {
            this.loading = false
          })
      },
      findMenu (array, key) {
        let data = null
        array.forEach(m => {
          if ( m.id === key )  {
            data = m
          }
        })
        return data

      },
      handleClick (keys, e) {
        const id = keys[0]
        if (!id || id === 'top' || id === this.menuId) {
          return
        }
        const array = this.jobsList
        const data = this.findMenu(array, id)
        this.menuId = id
        if (data) {
          this.menuKey = data.id
          this.menuTitle = data.name
          this.type = data.value
        }
        this.getList(this.customerId,this.type)
      },
      handleAdd(){
        const type = this.type
        this.$refs.DispatchDetail.add(this.customerId,type)
      },
      handleEdit(){
        const type = this.type
        this.$refs.DispatchDetail.edit(this.customerId,type)
      },
      handleSub (record) {
        this.loading = true
        this.$delete({
          url: this.$api.customInfo.customerInspectionRecordInfo.delete,
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
      handleOk (data) {
        this.customerId = data.customerId
        this.type = data.type
        this.getList(data.customerId,data.type)
      },
      handleCancel(){
        this.visible= false
        this.loading= false
        this.dataList= []
        this.menuKey= ''
        this.menuTitle= ''
      },
      clearId () {
        this.targetId = null
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .ant-table-thead > tr > th {
    padding: 10px;
  }

  ::v-deep .ant-table-tbody > tr > td {
    padding: 10px;
  }

  ::v-deep .page .ant-card-body {
    padding: 0;
  }
</style>
