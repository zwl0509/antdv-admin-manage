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
          ref="refTree"
          @click="handleClick">
        </s-tree>
      </a-col>
      <a-col class="borderLeft" :span="19">
        <a-spin :spinning="loading">
          <list-page
            ref="listPage"
            @resetParams="resetSearchForm"
            request-type="POST"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :bodyStyle="{ padding: '0' }"
            :scroll="{ x: 2200 }">
            <template slot="$search">
              <a-col :md="6" :sm="24">
                <a-form-item label="员工名称">
                  <a-input
                    v-model="queryParam.employeeName"
                    autocomplete="off"
                    placeholder="请输入员工名称"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="员工编码">
                  <a-input
                    v-model="queryParam.employeeCode"
                    autocomplete="off"
                    placeholder="请输入员工编码"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template slot="$operate">
              <a-button
                v-if="actionAuth.includes('EmployeeInfo.Create')"
                type="primary"
                icon="edit"
                style="margin-bottom: 8px"
                @click="addAction">新建</a-button>
              <a-button
                type="primary"
                class="upload"
                icon="upload"
                style="margin-bottom: 8px"
                v-if="actionAuth.includes('EmployeeInfo.Upload')"
                @click="uploadData">导入员工数据</a-button>
              <a-button
                type="primary"
                class="download"
                icon="download"
                style="margin-bottom: 8px"
                v-if="actionAuth.includes('EmployeeInfo.DownloadTemplate')"
                @click="downloadTemplate" >下载员工数据模板</a-button>
              <a-button
                type="primary"
                class="download"
                icon="download"
                style="margin-bottom: 8px"
                v-if="actionAuth.includes('EmployeeInfo.Download')"
                @click="downloadData">导出员工数据</a-button>
            </template>
            <template slot="positionNames" slot-scope="text">
              <span v-for="(item, index) in text" :key="index">
                <a-tag v-if="item" color="#b80201">
                  {{ item }}
                </a-tag>
              </span>
            </template>
            <template slot="ellipsis" slot-scope="text">
              <ellipsis tooltip :length="20">{{ (text.length && text.join(',')) || '' }}</ellipsis>
            </template>
            <template slot="workerLevel" slot-scope="text">
              <a-rate :default-value="text" disabled />
            </template>
            <span slot="action" slot-scope="text, record">
              <template v-if="actionAuth.includes('EmployeeInfo.Modify')">
                <a @click="editAction(record)">编辑</a>
                <a-divider v-if="actionAuth.includes('EmployeeInfo.Delete')" type="vertical" />
              </template>
              <template v-if="actionAuth.includes('EmployeeInfo.Delete')">
                <a-popconfirm title="是否要删除此行？" @confirm="removeAction(record.id)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
    <action-modal ref="add_action" @ok="handleSaveOk" />
    <upload-modal ref="uploadModal" @ok="handleSaveOk()"></upload-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import labels from '@/utils/labels'
import STree from '@/components/MyTree'
import ListPage from '@/components/ListPage'
import ActionModal from './modules/ActionModal'
import Ellipsis from '@/components/Ellipsis/Ellipsis'
import uploadModal from './modules/UploadModal'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'
import { defaultTableColumns } from '@/components/ListPage/_utils'
export default {
  name: 'TreeList',
  components: {
    STree,
    ListPage,
    ActionModal,
    Ellipsis,
    uploadModal,
  },
  data() {
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
        // organizationId : null
      },
      isCheck: false,
      requestUrl: this.$api.employeeManage.employeeInfo.getListPage,
      // 表头
      columns: [
        defaultTableColumns.serial,
        {
          title: '机构',
          dataIndex: 'organizationName',
        },
        {
          title: '登陆账号',
          dataIndex: 'employeeCode',
        },
        {
          title: '员工名称',
          dataIndex: 'employeeName',
        },
        {
          title: '职位',
          dataIndex: 'positionNames',
          width: 200,
          scopedSlots: { customRender: 'ellipsis' },
        },
        {
          title: '性别',
          dataIndex: 'genderName',
        },
        {
          title: '手机号码',
          dataIndex: 'mobileNumber',
        },
        {
          title: '详细地址',
          dataIndex: 'address',
        },
        {
          title: '出生日期',
          dataIndex: 'employeeBirth',
        },
        {
          title: '证件号码',
          width: 200,
          dataIndex: 'certificateNumber',
        },
        {
          title: '编辑人',
          dataIndex: 'modifiedBy',
        },
        {
          title: '编辑时间',
          dataIndex: 'modifiedTime',
          customRender: (txt) => (txt && moment(txt).format(dateFormatString)) || '',
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' },
        },
      ],
      orgTree: [],
      actionAuth: [],
      isFirstEnter: true,
      parentCodes: [],
    }
  },
  created() {
    this.$store.dispatch('GetActionAuth').then((res) => {
      const arr = []
      res.forEach((item) => {
        arr.push(item.key)
      })
      this.actionAuth = arr
    })
    this.getMenuList()
  },
  methods: {
    searchParams() {
      return { ...this.queryParam }
    },
    refresh() {
      this.$refs.listPage.refresh(true)
    },
    getMenuList() {
      this.leftLoading = true
      this.treeLoadText = undefined
      this.$get({
        url: this.$api.organization.getTreeList,
      })
        .then((res) => {
          const parentMenu = []
          const data = res
          data.forEach((item) => {
            const obj = {
              id: item.id,
              parentId: 'top',
              name: item.name,
              icon: 'bars',
              code: item.code,
              key: item.type,
              expanded: true,
              children: item.children,
              parentCodes: item.parentCodes,
            }
            parentMenu.push(obj)
          })
          this.orgTree = parentMenu
        })
        .catch((err) => {
          this.treeLoadText = (err && err.message) || '菜单树加载失败'
        })
        .finally(() => {
          this.leftLoading = false
        })
    },
    findMenu(array, key) {
      let data = null
      array.forEach((m) => {
        if (m.id === key) {
          data = m
        }
        if (!data && m.children && m.children.length) {
          const v = this.findMenu(m.children, key)
          data = v || data
        }
      })
      return data
    },
    handleClick(keys, e) {
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
        this.queryParam.organizationCode = data.code
        this.parentCodes = data.parentCodes
      } else {
        this.menuKey = ''
        this.menuTitle = ''
        this.queryParam.organizationCode = null
      }
      this.refresh()
    },
    // 上传材料数据
    uploadData() {
      this.$refs.uploadModal.show()
    },
    // 下载数据
    downloadData() {
      window.open(
        process.env.VUE_APP_API_BASE_URL +
          this.$api.employeeManage.employeeInfo.export +
          `?employeeName=${this.queryParam.employeeName || ''}&employeeCode=${
            this.queryParam.employeeCode || ''
          }&organizationCode=${this.queryParam.organizationCode || ''}`,
        '_self'
      )
    },
    // 下载模板
    downloadTemplate() {
      // this.$notification.warning({
      //   message: labels.HINT,
      //   description: '暂未开放'
      // })
      window.open(process.env.VUE_APP_TEMPLATE_BASE_URL + 'employee-template.xlsx', '_self')
    },
    // Action Event
    addAction() {
      const row = { menuId: this.menuKey, menuTitle: this.menuTitle, orgIds: this.parentCodes }
      this.$refs.add_action.add(row)
    },
    editAction(data) {
      data.menuId = this.menuKey
      data.menuTitle = this.menuTitle
      this.$refs.add_action.edit(data)
    },
    removeAction(id) {
      this.loading = true
      this.$delete({
        url: this.$api.employeeManage.employeeInfo.delete,
        params: { id },
        needResponse: true,
      })
        .then((res) => {
          this.$notification.success({
            message: labels.DELETE_SUCCESS,
            description: res.message || '',
          })
          this.refresh()
        })
        .catch((err) => defaultErrorMessage(err, labels.DELETE_FAIL))
        .finally(() => {
          this.loading = false
        })
    },
    handleSaveOk() {
      this.refresh()
    },
    resetSearchForm() {
      // this.getMenuList()
      // this.menuId = ''
      // this.menuKey = []
      // this.menuTitle = null
      // this.parentCodes = []
      this.$refs.refTree.$refs.refTree.selectedKeys = []
      this.queryParam = {
        // organizationCode: this.queryParam.organizationCode
      }
    },
    // 是否禁用
    handleIsOpen(id, active) {
      this.isCheck = this.loading = true
      this.$post({
        url: this.$api.basicData.worker.isOpen,
        data: {
          id,
          active: !active,
        },
        needResponse: true,
      })
        .then((res) => {
          this.$notification.success({
            message: labels.OPERATE_SUCCESS,
            description: res.message || '',
          })
          this.refresh(true)
        })
        .catch((err) => defaultErrorMessage(err, labels.OPERATE_FAIL))
        .finally(() => {
          this.loading = this.isCheck = false
        })
    },
  },
  activated() {
    if (this.isFirstEnter) {
      this.isFirstEnter = false
    } else {
      this.refresh()
    }
    this.getMenuList()
  },
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
