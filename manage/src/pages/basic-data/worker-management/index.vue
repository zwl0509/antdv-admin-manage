<template>
  <a-card :bordered="false">
    <a-row :gutter="0">
      <a-col :span="5" style="padding-right: 24px">
        <s-tree
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
            request-type="POST"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :bodyStyle="{ padding: '0' }"
            :scroll="{ x: 1500 }">
            <template slot="$search">
              <a-col :md="6" :sm="24">
                <a-form-item label="工人名称">
                  <a-input
                    v-model="queryParam.workerName"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入工人名称"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="项目经理">
                  <a-input v-model="queryParam.workerPrincipal" autocomplete="off" placeholder="请输入项目经理" :max-length="30"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="工种类型">
                  <a-select placeholder="请选择工种类型" v-model="queryParam.workerType">
                    <a-select-option v-for="(item, index) in jobsList" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="是否启用">
                  <a-select placeholder="是否启用" v-model="queryParam.active">
                    <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <template slot="$operate">
              <a-button type="primary" icon="edit" style="margin-bottom: 8px;" @click="addAction">新建</a-button>
              <a-button type="primary" class="upload" icon="upload" style="margin-bottom: 8px;" v-if="actionAuth.includes('Worker.Upload')" @click="uploadData">导入工人数据</a-button>
              <a-button type="primary" class="download" icon="download" style="margin-bottom: 8px;" v-if="actionAuth.includes('Worker.DownloadTemplate')" @click="downloadTemplate">下载材工人数据模板</a-button>
              <a-button type="primary" class="download" icon="download" style="margin-bottom: 8px;" v-if="actionAuth.includes('Worker.Download')" @click="downloadData">导出工人数据</a-button>
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
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="editAction(record)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <template>
                <a-popconfirm title="是否要删除此行？" @confirm="removeAction([record.id])">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
    <action-modal ref="add_action" :jobsList="jobsList" @ok="handleSaveOk"/>
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
  import UploadModal from '@/pages/basic-data/worker-management/modules/UploadModal'
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
        queryParam: {
          orgCode : null
        },
        isCheck: false,
        requestUrl: this.$api.basicData.worker.getListPage,
        // 表头
        columns: [
          defaultTableColumns.serial,
          {
            title: '机构',
            dataIndex: 'workerOrgName'
          },
          {
            title: '工人名称',
            dataIndex: 'workerName'
          },
          {
            title: '工种',
            dataIndex: 'workerInTypeList',
            scopedSlots: { customRender: 'workerInTypeList'}
          },
          {
            title: '项目经理',
            dataIndex: 'workerPrincipal'
          },
          {
            title: '电话号码',
            dataIndex: 'telPhone'
          },
          {
            title: '工人等级',
            dataIndex: 'workerLevel',
            scopedSlots: { customRender: 'workerLevel'}
          },
          {
            title: '是否启用',
            dataIndex: 'isActive',
            scopedSlots: { customRender: 'isActive' }
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
        jobsList: [],
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
      this.$getCodeList('1011', res => {
        this.jobsList = res
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
          url: this.$api.organization.getTreeList,
        })
          .then(res => {
            const parentMenu = []
            const data = res
            data.forEach(item=>{
              const obj = {
                id: item.id,
                parentId: 'top',
                name: item.name,
                icon: 'bars',
                code: item.code,
                key: item.type,
                expanded: true,
                children: item.children,
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
      // 上传材料数据
      uploadData () {
        this.$refs.uploadModal.show()
      },
      // 下载数据
      downloadData () {
        window.open(process.env.VUE_APP_API_BASE_URL + this.$api.basicData.worker.export +
          `?orgCode=${this.queryParam.orgCode || ''}&workerType=${this.queryParam.workerType || ''}&workerName=${this.queryParam.workerName || ''}&workerPrincipal=${this.queryParam.workerPrincipal || ''}&active=${this.queryParam.active === undefined ? '': this.queryParam.active}`, '_self')
      },
      // 下载模板
      downloadTemplate(){
        const url = process.env.VUE_APP_TEMPLATE_BASE_URL + 'worker-template.xlsx'
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          '工人数据模版'
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
          this.menuKey = data.code
          this.menuTitle = data.name
          this.queryParam.orgCode = data.code
          this.parentCodes = data.parentCodes
        } else {
          this.menuKey = ''
          this.menuTitle = ''
          this.queryParam.orgCode = null
        }
        this.refresh()
      },

      // Action Event
      addAction () {
        const row = { menuId: this.menuKey, menuTitle: this.menuTitle, orgIds: this.parentCodes }
        this.$refs.add_action.add(row)
      },
      editAction (data) {
        data.menuId = this.menuKey
        data.menuTitle = this.menuTitle
        this.$refs.add_action.edit(data)
      },
      removeAction (id) {
        this.loading = true
        this.$post({
          url: this.$api.basicData.worker.delete,
          data: id,
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
        this.$post({
          url: this.$api.basicData.worker.isOpen,
          data: { 
            id,
            active: !active 
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
