<template>
  <a-card :bordered="false" class="driver" :body-style="{padding: 0}">
    <a-row :gutter="0">
      <a-col :span="8" >
        <a-spin :spinning="loading">
          <list-page
            ref="listPage"
            @resetParams="resetSearchForm"
            request-type="GET"
            :columns="columns_left"
            :request-url="requestUrl_m"
            :query-params="searchParams"
            :customRow="customRow"
            :loadAfterRender="afterLoad"
            size="small"
            :scroll="{ x: 850 }">
            <template slot="$search">
              <a-col :md="24" :sm="24" :xxl="12">
                <a-form-item label="名称">
                  <a-input
                    v-model="queryParam.name"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入"
                    :max-length="30"/>
                </a-form-item>
              </a-col>
            </template>
            <template slot="isActive" slot-scope="rows">
              <div @click.stop>
                <a-switch
                  checked-children="是"
                  un-checked-children="否"
                  :checked="rows.isActive"
                  @change="isShowChecked(rows)"/>
              </div>
            </template>
            <template slot="$operate">
              <a-button type="primary" icon="edit" style="margin-bottom: 8px;" v-if="actionAuth.includes('QuotaPackageData.Create')" @click="addAction">新建</a-button>
            </template>
            <span slot="action" slot-scope="text, record" @click.stop>
              <template>
                <a @click.stop="editAction(record)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <template>
                <a-popconfirm title="是否要删除此行？" @confirm="handleDel(record.id)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
      <a-col :span="16" >
        <a-spin :spinning="loading">
          <list-page
            ref="listPage2"
            @resetParams="resetSearchForm2"
            :data="loadData"
            :columns="columns_right"
            :query-params="searchParams2"
            :scroll="{ x: 1400 | true, y: 500 }"
            :createdLoadData="false"
            :show-refresh="!!queryParam2.packageId"
            size="small">
            <template slot="$search">
              <a-col :sm="24" :md="12" :lg="12" :xl="12" :xxl="8">
                <a-form-item label="名称">
                  <a-input
                    v-model="queryParam2.sourceName"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入名称"
                    :max-length="30"/>
                </a-form-item>
              </a-col>
            </template>
            <template slot="detailType" slot-scope="rows">
              <a-dropdown>
                <a class="ant-dropdown-link">{{ rows.detailType }}</a>
                <a-menu slot="overlay">
                  <a-menu-item v-for="(val,index) in typelist" :key="index" @click="editSlave(rows,index)">
                    <a href="javascript:;">{{ val.name }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
            <template slot="$operate">
              <a-button type="primary" icon="edit" style="margin-bottom: 8px;" v-if="actionAuth.includes('QuotaPackageData.Create') && queryParam2.packageId" @click="addAction2">新建</a-button>
            </template>
            <template slot="isFixed" slot-scope="rows">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :checked="rows.isFixed"
                @change="changeSwitch('isFixed',rows)"
              />
            </template>
            <template slot="isDisabled" slot-scope="rows">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :checked="rows.isDisabled"
                @change="changeSwitch('isDisabled',rows)"
              />
            </template>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click.stop="handleSlaveEdit(record.id)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <template>
                <a-popconfirm title="是否要删除此行？" @confirm="handleSlaveDel(record.id)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
    <action-modal ref="add_action" @ok="refresh"/>
    <slave-modal ref="add_slave" @ok="refresh"/>
  </a-card>
</template>

<script>
import labels from '@/utils/labels'
import ListPage from '@/components/ListPage'
import ActionModal from './modules/ActionModal'
import SlaveModal from './modules/SlaveModal'
import { defaultErrorMessage } from '@/utils/common'
import { defaultTableColumns } from '@/components/ListPage/_utils'

export default {
  name: 'TreeList',
  components: {
    ListPage,
    ActionModal,
    SlaveModal
  },
  data () {
    return {
      leftLoading: false,
      treeLoadText: undefined,
      loading: false,
      openKeys: ['key-01'],
      menuKey: null,
      menuId: null,
      menuTitle: null,
      parentTitle: null,
      // 查询参数
      queryParam: {
        currentPage:1,
        pageSize:10,
        name:''
      },
      queryParam2: {
        packageId:'',
        sourceName:''
      },
      requestUrl_m: this.$api.basicData.packageInfo.getMasterList,
      requestUrl_s: this.$api.basicData.packageInfo.getSlaveList,
      // 表头
      columns_left: [
        { ...defaultTableColumns.serial, width: 60 },
        {
          title: '定额包名称',
          dataIndex: 'name',
          width: 100
        },
        {
          title: '单价',
          dataIndex: 'price',
          width: 50
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 50
        },

        {
          title: '特项代码',
          dataIndex: 'specialCode',
          width: 100
        },
        {
          title: '开始时间',
          dataIndex: 'beginDate',
          width: 100
        },
        {
          title: '结束时间',
          dataIndex: 'endDate',
          width: 100
        },
        {
          title: '是否可用',
          scopedSlots: { customRender: 'isActive' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 90,
          fixed:'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns_right: [
        defaultTableColumns.serial,
        {
          title: '类型',
          width: 50,
          scopedSlots: { customRender: 'detailType' }
        },
        {
          title: '编号',
          width: 200,
          dataIndex: 'sourceCode'
        },
        {
          title: '名称',
          dataIndex: 'sourceName',
          width: 200
        },
        {
          title: '规格',
          dataIndex: 'sourceSpec',
          width: 100
        },
        {
          title: '销售单位',
          dataIndex: 'sourceUnit',
          width: 100
        },
        {
          title: '特项编码',
          dataIndex: 'specialCode',
          width: 100
        },
        {
          title: '数量',
          width: 100,
          align:'center',
          dataIndex: 'budNum'
        },
        {
          title: '采购价',
          dataIndex: 'costPrice'
        },
        {
          title: '是否固定数量',
          scopedSlots: { customRender: 'isFixed' }
        },
        {
          title: '备注',
          width: 100,
          dataIndex: 'remark'
        },{
          title: '是否禁用',
          scopedSlots: { customRender: 'isDisabled' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      orgTree: [],
      actionAuth:[],
      isFirstEnter: true,
      typelist:[],
      currentPackageId:''
    }
  },
  created () {
    this.$getCodeList('1015', res => {
      this.typelist=res
    })
    // this.refresh()
    this.$store.dispatch('GetActionAuth').then(res => {
      const arr = []
      res.forEach(item => {
        arr.push(item.key)
      })
      this.actionAuth = arr
    })
  },
  methods: {
    selectType () {
      // console.log()
    },
    afterLoad (res) {
      if (res && res.rows && res.rows.length) {
        this.queryParam2.packageId = res.rows[0].id
        this.currentPackageId=res.rows[0].id
        this.$nextTick(() => {
          this.$refs.listPage2.refresh()
        })
      }
      return res
    },
    loadData (parameter) {
      if (!this.queryParam2.packageId) {
        return Promise.resolve({
          rows: [],
          total: 0
        })
      }
      return this.$get({
        url: this.requestUrl_s,
        params: { ...parameter, ...this.queryParam2 }
      })
    },
    changeSwitch (switchType, row) {
      this.$post({
        url: this.$api.basicData.packageInfo.updateSlaveSwitch,
        data: { id: row.id, switchType: switchType == 'isFixed' ? 0 : 1 }
      }).then(res => {
        row[switchType] = !row[switchType]
      })
    },
    editSlave (row, index) {
      if (index !== undefined) {
        row.detailType = index
      }

      this.$post({
        url: this.$api.basicData.packageInfo.editSlave,
        data: {
          budNum: row.budNum,
          costPrice: row.costPrice,
          detailType: row.detailType,
          id: row.id,
          isDisabled: row.isDisabled,
          isFixed: row.isFixed,
          packageId: row.packageId,
          remark: row.remark,
          sequence: row.sequence,
          sourceCode: row.sourceCode,
          sourceMaterialId: row.sourceMaterialId,
          sourceName: row.sourceName,
          sourceSpec: row.sourceSpec,
          sourceUnit: row.sourceUnit,
          specialCode: row.specialCode
        }
      }).then(res => {
      })
    },
    isShowChecked (row) {
      this.$put({
        url: this.$api.basicData.packageInfo.isActive,
        params: { id: row.id }
      }).then(res => {
        row.isActive = !row.isActive
      })
    },
    customRow (record) {
      return {
        on: { // 事件
          click: (event) => {
            this.queryParam2.packageId=record.id
            this.currentPackageId=record.id
            this.$refs.listPage2.refresh(true)
          },       // 点击行
        },
        class:{'select-row':this.queryParam2.packageId===record.id}
      }
    },
    searchParams () {
      return { ...this.queryParam }
    },
    searchParams2 () {
      return { ...this.queryParam2 }
    },
    addAction () {
      const row = { menuId: this.menuId, menuTitle: this.menuTitle, parentArea: this.parentArea }
      this.$refs.add_action.add(row, 1)
    },
    addAction2 () {
      const row = { menuId: this.menuId, menuTitle: this.menuTitle, parentArea: this.parentArea }
      this.$refs.add_slave.add(row, 1)
    },
    // 定额包编辑
    handleEdit() {

    },
    // 定额包删除
    handleDel(id) {
      this.loading = true
      this.$delete({
        url: this.$api.basicData.packageInfo.deleteMaster,
        params: { id },
        needResponse: true
      }).then(res => {
          this.$notification.success({
            message: labels.DELETE_SUCCESS,
            description: res.message || ''
          })
          this.refresh()
        }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
    },
    editAction (data) {
      this.$refs.add_action.edit(data, 1)
    },
    // 定额包详情
    handleSlaveEdit(id) {
      this.$refs.add_slave.edit(id, 1)
    },
    // 删除定额包明细
    handleSlaveDel(id) {
      this.$delete({
        url: this.$api.basicData.packageInfo.deleteSlave,
        params: {id},
        needResponse: true
      }).then(res => {
        this.$notification.success({
          message: labels.DELETE_SUCCESS,
          description: res.message || ''
        })
        this.$refs.listPage2.refresh()
      }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
        .finally(() => { this.loading = false })
    },
    refresh () {
      this.$refs.listPage.refresh()
      this.slaveRefresh()
    },
    slaveRefresh () {
      this.$refs.listPage2.refresh()
    },
    resetSearchForm () {
      this.queryParam = {
        name: '',
        title: ''
      }
    },
    resetSearchForm2 () {
      this.queryParam2 = {
        sourceName: '',
        title: '',
        packageId:this.currentPackageId
      }
    },
  },
  activated () {
    if (this.isFirstEnter) {
      this.isFirstEnter = false
    } else {
      this.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.borderLeft {
  border-left: solid 1px #eee;
  //padding-left: 20px !important;
}
::v-deep .select-row td{
  background-color: #f8f8f8;
}
.driver{
  &:before{
    content: '';
    position: absolute;
    left: 33.33%;
    top: 16px;
    bottom: 16px;
    width: 1px;
    background-color: #eee;
    pointer-events: none;
    z-index: 11;
  }
}
::v-deep .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-thead > tr > th,
::v-deep .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th,
::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-header > table > .ant-table-thead > tr > th,
::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th{
  background-color: #E4EAEC;
}
::v-deep .ant-table-small{
  border: none
}
.driver{
  &:before{
    content: '';
    position: absolute;
    left: 33.33%;
    top: 16px;
    bottom: 16px;
    width: 1px;
    background-color: #eee;
    pointer-events: none;
    z-index: 11;
  }
}
</style>
