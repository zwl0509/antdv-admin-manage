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
        <a-col :md="8" :sm="24">
          <a-form-item label="仓库编号">
            <a-input v-model="queryParam.stockCode" autocomplete="off" placeholder="请输入仓库编号" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="仓库名称">
            <a-input v-model="queryParam.stockName" autocomplete="off" placeholder="请输入仓库名称" :max-length="11"/>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="是否启用">
            <a-select placeholder="请选择是否启用" v-model="queryParam.isActive">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :xs="24">
          <a-form-item label="是否锁定">
            <a-select placeholder="请选择是否锁定" v-model="queryParam.isLocked">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()" v-if="actionAuth.includes('Warehouse.Create')">新建</a-button>
      </template>
      <template slot="isActive" slot-scope="text,record">
        <a-switch
          checked-children="是"
          un-checked-children="否"
          :checked="text"
          @change="isShowActive(record.id)"
        />
      </template>
      <template slot="isLocked" slot-scope="text,record">
        <a-switch
          checked-children="是"
          un-checked-children="否"
          :checked="text"
          @change="isShowLocked(record.id)"
        />
      </template>
      <template slot="ellipsis" slot-scope="text">
        <ellipsis tooltip :length="17">{{ text }}</ellipsis>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionAuth.includes('Warehouse.Modify')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider v-if="actionAuth.includes('Warehouse.Delete')" type="vertical"/>
        </template>
        <template v-if="actionAuth.includes('Warehouse.Delete')">
          <a-popconfirm title="是否要删除此行？" @confirm="handleSub(record)">
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
  import { STable,Ellipsis } from '@/components'
  import ActionModal from './modules/ActionModal'
  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import labels from '@/utils/labels'

  export default {
    name: 'TableList',
    components: {
      STable,
      ActionModal,
      ListPage,
      Ellipsis
    },

    data () {
      return {
        loading: false,
        requestUrl: this.$api.basicData.stock.getListPage,
        // 查询参数
        queryParam: {},
        // 表头
        columns:[
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' },
            dataIndex:'serial'
          },
          {
            title: '仓库编号',
            dataIndex: 'stockCode',
          },
          {
            title: '仓库名称',
            dataIndex: 'stockName',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '仓库管理员',
            dataIndex: 'stockManagerNames',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '用友编码',
            dataIndex: 'thirdPartyCode',
          },
          {
            title: '是否启用',
            dataIndex: 'isActive',
            scopedSlots: { customRender: 'isActive' },
          },
          {
            title: '是否锁定',
            dataIndex: 'isLocked',
            scopedSlots: { customRender: 'isLocked' },
          },
          {
            title: '备注',
            dataIndex: 'remark',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '编辑人',
            dataIndex: 'modifiedBy',
          },
          {
            title: '编辑时间',
            dataIndex: 'modifiedTime',
            customRender: txt => txt && moment(txt).format(dateFormatString) || '',
          },
          {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
            key:'action'
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
      handleEdit (record) {
        this.$refs.createModal.edit(record)
      },
      handleSub (record) {
        this.loading = true
        // data: [String,...]
        this.$post({
          url: this.$api.basicData.stock.delete,
          data: [record.id],
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
      isShowActive(id){
        this.disabled = true
        this.$get({
          url:this.$api.basicData.stock.isActive,
          params: {
            id,
          },
          needResponse: true,
        }).then(res=>{
          this.disabled = false
          this.handleOk()
        })
      },
      isShowLocked(id){
        this.disabled = true
        this.$get({
          url:this.$api.basicData.stock.isLocked,
          params: { id },
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
        }
      },
    }
  }
</script>
