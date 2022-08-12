<template>
  <a-card :bordered="false">
    <a-row :gutter="0">
      <a-col :span="5" style="padding-right: 24px">
        <s-tree
          textName="materialClassName"
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
            request-type="GET"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :bodyStyle="{ padding: '0' }"
            :scroll="{ x: 3800 }">
            <template slot="$search">
              <a-col :md="6" :sm="24">
                <a-form-item label="材料名称">
                  <a-input
                    v-model="queryParam.materialName"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入材料名称"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="材料编码">
                  <a-input v-model="queryParam.materialCode" autocomplete="off" placeholder="请输入材料编码" :max-length="30"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="规格">
                  <a-input v-model="queryParam.spec" autocomplete="off" placeholder="请输入材料编码" :max-length="30"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="是否启用">
                  <a-select placeholder="是否启用" v-model="queryParam.isActive">
                    <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6" :sm="24">
                <a-form-item label="结算方式">
                  <a-select placeholder="请选择结算方式" v-model="queryParam.clearingType">
                    <a-select-option v-for="(item, index) in clearingList" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
            </template>
            
            <template slot="$operate">
              <a-button v-if="menuKey" type="primary" icon="edit" style="margin-bottom: 8px;" @click="addAction">新建</a-button>
              <a-button type="primary" class="upload" icon="upload" style="margin-bottom: 8px;" v-if="actionAuth.includes('MaterialQuotaData.Upload')" @click="uploadData">导入材料数据</a-button>
              <a-button type="primary" class="download" icon="download" style="margin-bottom: 8px;" v-if="actionAuth.includes('MaterialQuotaData.DownloadTemplate')" @click="downloadTemplate">下载材料数据模板</a-button>
              <a-button type="primary" class="download" icon="download" style="margin-bottom: 8px;" v-if="actionAuth.includes('MaterialQuotaData.Download')" @click="downloadData">导出材料数据</a-button>
            </template>
            <span slot="ellipsis" slot-scope="text">
              <ellipsis :length="24" tooltip>{{ text }}</ellipsis>
            </span>
            <template slot="isCheck" slot-scope="text">
              <a-icon :type="text ? 'check' : 'close'"/>
            </template>
            <template slot="isActive" slot-scope="text, record">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                :checked="text" 
                :disabled="isCheck"
                @change="handleIsOpen(record.id, 0)"/>
            </template>
            <template slot="isNeedInstall" slot-scope="text, record">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                :checked="text" 
                :disabled="isCheck"
                @change="handleIsOpen(record.id, 1)"/>
            </template>
            <template slot="isCustomize" slot-scope="text, record">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                :checked="text" 
                :disabled="isCheck"
                @change="handleIsOpen(record.id, 2)"/>
            </template>
            <template slot="isStock" slot-scope="text, record">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                :checked="text" 
                :disabled="isCheck"
                @change="handleIsOpen(record.id, 3)"/>
            </template>
            <template slot="isCanEdit" slot-scope="text, record">
              <a-switch 
                checked-children="是" 
                un-checked-children="否"
                :checked="text" 
                :disabled="isCheck"
                @change="handleIsOpen(record.id, 4)"/>
            </template>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="editAction(record)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <template>
                <a-popconfirm title="是否要删除此行？" @confirm="removeAction(record.id)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
    <!-- workerPrincipalIsDeleted 项目经理是否被删除 -->
    <action-modal ref="add_action" @ok="handleSaveOk"/>
    <upload-modal ref="uploadModal" @ok="handleSaveOk()"></upload-modal>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import { STable } from '@/components'
  import ListPage from '@/components/ListPage'
  import ActionModal from './modules/ActionModal'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import UploadModal from '@/pages/basic-data/material-quota-data/modules/UploadModal'
  import { defaultErrorMessage } from '@/utils/common'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import { download } from '@/utils/util'
  export default {
    name: 'TreeList',
    components: {
      STable,
      STree,
      ListPage,
      ActionModal,
      Ellipsis,
      UploadModal
    },
    data () {
      return {
        leftLoading: false,
        treeLoadText: undefined,
        loading: false,
        openKeys: ['key-01'],
        menuKey: '',
        menuId: null,
        menuTitle: null,
        // 查询参数
        queryParam: {},
        isCheck: false,
        requestUrl: this.$api.basicData.materialInfo.getListPage,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '材料编码',
            dataIndex: 'materialCode',
            scopedSlots: { customRender:'ellipsis'}
          },
          {
            title: '材料名称',
            dataIndex: 'materialName',
            width: 200,
            scopedSlots: { customRender:'ellipsis'}
          },
          {
            title: '品牌',
            dataIndex: 'brand'
          },
          {
            title: '型号',
            dataIndex: 'materialType'
          },
          {
            title: '规格',
            dataIndex: 'spec',
          },          
          {
            title: '单位',
            dataIndex: 'unit'
          },
          {
            title: '采购价格',
            dataIndex: 'buyPrice'
          },
          {
            title: '返点比例',
            dataIndex: 'rebateProportion'
          },
          {
            title: '销售价格',
            dataIndex: 'salePrice'
          },
          {
            title: '承包价',
            dataIndex: 'contractPrice'
          },
          {
            title: '加盟价',
            dataIndex: 'joinPrice'
          },
          {
            title: '结算方式',
            dataIndex: 'clearingType'
          },
          {
            title: '特项编码',
            dataIndex: 'specialCode'
          },
          {
            title: '材料条码',
            dataIndex: 'barcode'
          },
          {
            title: '供应商名称',
            dataIndex: 'supplyName',
            width: 200,
            scopedSlots: { customRender:'ellipsis'}
          },
          {
            title: '仓库名称',
            dataIndex: 'stockName',
            scopedSlots: { customRender:'ellipsis'}
          },
          {
            title: '库存数量',
            dataIndex: 'stockNum'
          },
          {
            title: '库存金额',
            dataIndex: 'stockMoney'
          },
          {
            title: '是否需要安装',
            dataIndex: 'isNeedInstall',
            scopedSlots: { customRender:'isNeedInstall'}
          },
          {
            title: '是否定制品',
            dataIndex: 'isCustomize',
            scopedSlots: { customRender:'isCustomize'}
          },
          {
            title: '是否库存记账',
            dataIndex: 'isStock',
            scopedSlots: { customRender:'isStock'}
          },
          {
            title: '是否允许修改',
            dataIndex: 'isCanEdit',
            scopedSlots: { customRender:'isCanEdit'}
          },
          {
            title: '是否启用',
            dataIndex: 'isActive',
            scopedSlots: { customRender:'isActive'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 120,
            scopedSlots: { customRender: 'action' }
          }
        ],
        orgTree: [],
        actionAuth: [],
        isFirstEnter: true,
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
          url: this.$api.basicsClass.materialClass.getTreeList,
        })
          .then(res => {
            const parentMenu = []
            const data = res.rows
            data.forEach(item=>{
              const obj = {
                id: item.id,
                parentId: 'top',
                name: item.materialClassName,
                icon: 'bars',
                code: item.materialClassCode,
                expanded: true,
                children: item.children
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
      // 上传材料数据
      uploadData () {
        this.$refs.uploadModal.show()
      },
      // 下载数据
      downloadData () {
        window.open(process.env.VUE_APP_API_BASE_URL +  this.$api.basicData.materialInfo.export+
          `?materialClassId=${this.queryParam.materialClassId}&materialName=${this.queryParam.materialName || ''}&materialCode=${this.queryParam.materialCode || ''}&spec=${this.queryParam.spec || ''}&active=${this.queryParam.isActive === undefined ? '': this.queryParam.isActive}`, '_self')
      },
      // 下载模板
      downloadTemplate(){
        const url = process.env.VUE_APP_TEMPLATE_BASE_URL + 'material-template.xlsx'
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          '材料数据模版'
        )
        document.body.appendChild(link)
        link.click()
      },
      handleClick (keys, e) {
        const id = keys[0]
        if (!id || id === 'top' || id === this.menuId) {
          return
        }
        const array = this.orgTree
        const data = this.findMenu(array, id)
        this.menuId = id
        if (data) {
          this.menuKey = data.id
          this.menuTitle = data.materialClassName || data.name
          this.queryParam.materialClassId = id
        } else {
          this.menuKey = ''
          this.menuTitle = ''
          this.queryParam.materialClassId = ''
        }
        this.refresh()
      },

      // Action Event
      addAction () {
        const row = { menuId: this.menuKey,menuTitle:this.menuTitle}
        this.$refs.add_action.add(row)
      },
      editAction (data) {
        data.menuId = this.menuKey
        this.$refs.add_action.edit(data)
      },
      removeAction (id) {
        this.loading = true
        this.$delete({
          url: this.$api.basicData.materialInfo.delete,
          params: {id},
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
      handleSaveOk () {
        this.refresh()
      },
      resetSearchForm () {
        this.queryParam = {
          workerName: '',
          workerPrincipal: ''
        }
      },
      // 是否禁用
      handleIsOpen (id ,switchType) {
        this.loading = this.isCheck = true
        this.$post({
          url: this.$api.basicData.materialInfo.isOpen,
          data: { 
            id,
            switchType
          },
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
      if (this.isFirstEnter) {
        this.isFirstEnter = false
      } else {
        this.refresh()
      }
    }
  }
</script>

<style lang="scss" scoped>
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
