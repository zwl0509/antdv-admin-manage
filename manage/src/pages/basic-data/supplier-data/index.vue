<template>
  <a-card :bordered="false">
    <a-row :gutter="0">
      <a-col :span="5" style="padding-right: 24px">
        <s-tree
          textName="supplyClassName"
          :dataSource="orgTree"
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
      <a-col class="borderLeft" :span="19" >
        <a-spin :spinning="loading">
          <list-page
            ref="listPage"
            @resetParams="resetSearchForm"
            request-type="get"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :bodyStyle="{ padding: '0' }"
            :scroll="{ x: 5000 }">
            <template slot="$search">
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商编码">
                  <a-input
                    v-model="queryParam.supplyCode"
                    autocomplete="off"
                    placeholder="请输入供应商编码"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商名称">
                  <a-input
                    v-model="queryParam.supplyName"
                    autocomplete="off"
                    placeholder="请输入供应商名称"
                    :max-length="30"/>
                </a-form-item>
              </a-col>
            </template>
            <template slot="$operate">
              <a-button type="primary" icon="edit" style="margin-bottom: 8px;" v-if="menuId !== 'menuTop'" @click="addAction">新建</a-button>
            </template>
            <template slot="workerInTypeList" slot-scope="text">
              <span v-for="(item,index) in text" :key="index">
                <a-tag v-if="item" color="#b80201">
                  {{ item }}
                </a-tag>
              </span>
            </template>
            <template slot="isActive" slot-scope="text, record">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :checked="text"
                :disabled="isCheck"
                @change="handleIsOpen(record.id,record.isActive)"/>
            </template>
            <template slot="workerLevel" slot-scope="text">
              <a-rate :default-value="text" disabled />
            </template>
            <template slot="ellipsis" slot-scope="text">
              <ellipsis tooltip :length="17">{{ text }}</ellipsis>
            </template>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="editAction(record)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <template>
                <a-popconfirm title="是否要删除此行？" @confirm="removeAction(record)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
    <action-modal ref="add_action" :priceList="priceList" :statusList="statusList" @ok="handleSaveOk"/>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import { STable,Ellipsis } from '@/components'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import { dateFormatString, defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  export default {
    name: 'TreeList',
    components: {
      STable,
      STree,
      ListPage,
      ActionModal,
      Ellipsis
    },
    data () {
      return {
        leftLoading: false,
        treeLoadText: undefined,
        loading: false,
        openKeys: ['key-01'],
        menuKey: '',
        menuId: 'menuTop',
        menuTitle: null,
        // 查询参数
        queryParam: {
        },
        isCheck: false,
        requestUrl: this.$api.basicData.supplyInfo.getListPage,
        // 表头
        columns:[
          {
            title: '序号',
            width:'80px',
            scopedSlots: { customRender: 'serial' },
            dataIndex:'serial',
          },
          {
            title: '分类名称',
            dataIndex:'supplyClassName',
          },
          {
            title: '供应商编码',
            dataIndex:'supplyCode',
          },
          {
            title: '供应商名称',
            dataIndex:'supplyName',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '供应商简称',
            dataIndex:'supplyShortName'
          },
          {
            title: '供应商地址',
            dataIndex:'address',
            customRender: txt => txt || '-'
          },
          {
            title: '供应商助记码',
            dataIndex:'help'
          },
          {
            title: '分类编码',
            dataIndex:'supplyClassCode'
          },
          {
            title: '邮编',
            dataIndex:'postcode',
            customRender: txt => txt || '-'
          },
          {
            title: '默认价格',
            dataIndex:'defaultPrice',
             customRender: txt => txt || '-'
          },
          {
            title: '电话',
            dataIndex:'phone',
             customRender: txt => txt || '-'
          },
          {
            title: '传真',
            dataIndex:'fax',
             customRender: txt => txt || '-'
          },
          {
            title: '邮箱',
            dataIndex:'email',
             customRender: txt => txt || '-'
          },
          {
            title: '负责人',
            dataIndex:'headPerson',
             customRender: txt => txt || '-'
          },
          {
            title: '负责人电话',
            dataIndex:'headPersonPhone',
             customRender: txt => txt || '-'
          },
          {
            title: '联系人',
            dataIndex:'linkPerson',
             customRender: txt => txt || '-'
          },
          {
            title: '联系人电话',
            dataIndex:'linkPersonPhone',
             customRender: txt => txt || '-'
          },
          {
            title: '特项编码',
            dataIndex:'specialCode',
          },

          {
            title: '银行账号',
            dataIndex:'supplyAccount',
             customRender: txt => txt || '-'
          },
          {
            title: '经营范围',
            dataIndex:'businessCope',
             customRender: txt => txt || '-'
          },
          {
            title: '供应商交易金额',
            dataIndex:'supplyMoney',
            customRender: txt => txt || '-'
          },
          {
            title: '供应商支付金额',
            dataIndex:'supplyPayMoney',
            customRender: txt => txt || '-'
          },

          {
            title: '开户行',
            dataIndex:'bankAccount',
            customRender: txt => txt || '-'
          },
          {
            title: '开户名',
            dataIndex:'bankUsername',
            customRender: txt => txt || '-'
          },
          {
            title: '测量拆单状态',
            dataIndex:'measureStatusName'
          },
          {
            title: '税率',
            dataIndex:'taxRate'
          },
          {
            title: '是否启用',
            dataIndex:'isActive',
            scopedSlots: { customRender: 'isActive' },
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
        actionAuth: [],
        isFirstEnter: true,
        priceList:[],
        statusList:[],
        orgTree: [],
        parentCodes: []
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
      this.getMenuList()
    },

    methods: {
      searchParams () {
        return { ...this.queryParam }
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      getMenuList () {
        this.leftLoading = true
        this.treeLoadText = undefined
        this.$get({
          url: this.$api.basicsClass.supplyClass.getTreeList,
        })
          .then(res => {
            const parentMenu = []
            const data = res
            data.forEach(item=>{
              const obj = {
                id: item.id,
                parentId: item.parentId,
                supplyClassName: item.supplyClassName,
                key: item.id,
                expanded: true,
                children: item.children,
                supplyClassCode: item.supplyClassCode,
                parentCodes: item.parentCodes
              }
              parentMenu.push(obj)
            })
            this.orgTree = parentMenu
          })
          .catch(err => {
            this.treeLoadText = err && err.message || '菜单树加载失败'
          })
          .finally(() => {
            this.leftLoading = false
          })
      },
      findMenu (array, key) {
        let data = null
        array.forEach(m => {
          if ( m.id === key )  {
            data = m
          }
          if (!data && m.children && m.children.length) {
            const v = this.findMenu(m.children, key)
            data = v || data
          }
        })
        return data
      },
      handleClick (keys, e) {
        const id = keys[0]
        if (!id || id === 'menuTop' || id === this.menuId) {
          return
        }
        const array = this.orgTree
        const data = this.findMenu(array, id)
        this.menuId = id
        if (data) {
          this.menuKey = data.id
          this.menuTitle = data.supplyClassName
          this.queryParam.supplyClassCode = data.supplyClassCode
          this.parentCodes = data.parentCodes
        } else {
          this.menuKey = ''
          this.menuTitle = ''
          this.queryParam.supplyClassCode = null
        }
        this.refresh()
      },

      // Action Event
      addAction () {
        const row = { menuId: this.menuKey, menuTitle: this.menuTitle, parentCodes: this.parentCodes,supplyClassCode: this.queryParam.supplyClassCode }
        this.$refs.add_action.add(row)
        this.refresh()
      },
      editAction (data) {
        data.menuId = this.menuKey
        data.menuTitle = this.menuTitle
        this.$refs.add_action.edit(data)
      },
      removeAction (record) {
        this.loading = true
        this.$delete({
          url: this.$api.basicData.supplyInfo.delete,
          params:{id : record.id},
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.DELETE_SUCCESS,
              description: res.message || ''
            })
            this.refresh()
          })
          .catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleSaveOk () {
        this.refresh()
      },
      resetSearchForm () {
        this.queryParam = {
          orgCode: this.queryParam.orgCode
        }
      },
      // 是否禁用
      handleIsOpen (id ,active) {
        this.isCheck = this.loading = true
        this.$put({
          url: this.$api.basicData.supplyInfo.isOpen,
          params: { id },
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.OPERATE_SUCCESS,
              description: res.message || ''
            })
            this.refresh(true)
          })
          .catch(err => defaultErrorMessage(err, labels.OPERATE_FAIL))
          .finally(() => { this.loading = this.isCheck = false })
      },
    },
    activated () {
    }
  }
</script>

<style lang="scss">
  .custom-tree {
    ::v-deep .ant-tree-node-content-wrapper {
      display: inline-block;
      width: calc(100% - 24px);
    }

    ::v-deep .ant-tree-title {
      display: flex;
      justify-content: space-between;
    }
  }

  .borderLeft {
    border-left: solid 1px #eee;
    padding-left: 20px !important;
  }
</style>
