<template>
  <a-spin :spinning="confirmLoading">
    <s-table
      ref="table"
      rowKey="id"
      bordered
      :columns="columns"
      :data="() => formatData()"
      :showPagination="false">
      <span slot="page_title" slot-scope="text, record">
        <template>
          <span>{{ record.title }}</span>
          <div class="page_title">
            <a-checkbox :checked="record.isAuth ? true : false" :disabled="type == 'user' && record.authorityTargetType == 'roles'" @change="onCheckAllChange(record, 'type_index')"></a-checkbox>
          </div>
        </template>
      </span>
      <span slot="auth_manage" slot-scope="text, record, parentIndex">
        <template>
          <a-checkbox
            v-for="(item, index) in record.actionVOList"
            :checked="item.isAuth ? true : false"
            :disabled="type == 'user' && item.authorityTargetType == 'roles'"
            :key="index"
            @change="actionChange(record,item, parentIndex, 'type_index')">{{ item.name }}</a-checkbox>
        </template>
      </span>
    </s-table>
  </a-spin>
</template>

<script>
  import { STable } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {
    name: 'AuthModal',
    props: {
      type: {
        type: String,
        default: ''
      },
      targetId: {
        type: String,
        default: ''
      }
    },
    components: {
      STable
    },
    data () {
      return {
        openKeys: ['key-01'],
        activeKey: '',
        stage:1,
        authData: [],
        // 表头
        columns: [
          {
            title: '页面',
            width: '200px',
            dataIndex: 'page_title',
            scopedSlots: { customRender: 'page_title' }
          },
          {
            title: '权限管理',
            dataIndex: 'auth_manage',
            scopedSlots: { customRender: 'auth_manage' }
          }
        ],

        visible: false,
        confirmLoading: false,
        dataList: null,
        currentTargetId: ''
      }
    },
    methods: {
      show (id,stage) {
        this.dataList = null
        this.currentTargetId = id
        if(stage||stage==0){
          this.stage=stage
        }
        this.loadData()
      },
      loadData () {
        this.confirmLoading = true
        this.$get({
          url: this.$api.auth.getAuthChooseList,
          params: {
            type: this.type,
            targetId: this.currentTargetId || this.targetId,
            stage:this.stage
          }
        }).then(res => {
          this.authData = res
          this.activeKey = res[0]?.type || ''
          this.$nextTick(() => { this.$refs.table.refresh()})
        }).finally(() => { this.confirmLoading = false })
      },
      formatData (type) {
        return new Promise((resolve) => {
          const rows = this.authData[0]?.voList || []
          if (rows && rows.length){
            rows.forEach(m => {
              m.children && !m.children.length && (delete m.children)
              m.children && m.children.length && (m.children.forEach(m => {
                m.children && !m.children.length && (delete m.children)
              }))
            })
          }
          resolve({ rows })
        })
      },
      // 菜单选中
      onCheckAllChange (record, index) {
        record.isAuth = !record.isAuth
        if (record.parentId) {
          this.$refs.table.localDataSource.map(m => {
            if (m.id === record.parentId) {
              if (!record.isAuth) {
                const checkedLength = m.children.filter(m2 => m2.isAuth).length
                if (!checkedLength) {
                  m.isAuth = false
                }
              } else {
                m.isAuth = true
              }
            }
          })
        }
        if (record.children && record.children.length) {
          record.children.forEach(parentItem => {
            parentItem.isAuth = record.isAuth
            if (parentItem.actionVOList) {
              parentItem.actionVOList.forEach(actionItem => {
                actionItem.isAuth = record.isAuth
              })
            }
          })
        } else {
          if (record.actionVOList) {
            record.actionVOList.forEach(actionItem => {
              actionItem.isAuth = record.isAuth
            })
          }
        }
      },
      // 按钮级权限按钮选中
      actionChange (record, actionItem, parentIndex, type_index) {
        actionItem.isAuth = !actionItem.isAuth
        if (actionItem.isAuth) {
          record.isAuth = actionItem.isAuth
        }
        if (record.parentId && actionItem.isAuth) {
          this.$refs.table.localDataSource.map(m => {
            if (m.id === record.parentId) {
              m.isAuth = actionItem.isAuth
            }
          })
        }
      },
      // 筛选已选数据
      checkList (arr) {
        const newList = []
        arr.forEach(item => {
          if (item.isAuth) {
            const obj = {
              authorityTargetType: this.type,
              authorityType: 'sitemap',
              isAuthorised: item.isAuth ? 1 : 0,
              sitemapActionId: item.id,
              siteMapsMateDTOS: [],
              actionMateDTOs: []
            }
            if (item.actionVOList) {
              item.actionVOList.forEach(action => {
                if (action.isAuth) {
                  obj.actionMateDTOs.push({
                    authorityTargetType: this.type,
                    authorityType: 'action',
                    isAuthorised: action.isAuth ? 1 : 0,
                    sitemapActionId: action.id
                  })
                }
              })
            }

            if (item.children) {
              obj.siteMapsMateDTOS = this.checkList(item.children)
            }
            newList.push(obj)
          }
        })
        return newList
      },
      getData() {
        const arr = this.checkList(this.$refs.table.localDataSource)
        return arr
      },
      handleOk () {
        this.confirmLoading = true
        const arr = this.checkList(this.$refs.table.localDataSource)
        // this.authData.forEach((item, index)=>{
        //   arr = arr.concat(this.checkList(this.$refs.table[index].localDataSource))
        // })
        const data = {
          sitemapActionAuthorityEditDTOS: arr,
          targetId: this.currentTargetId
        }
        this.$post({
          url: this.$api.auth.menuAuthEdit,
          data
        }).then(res => {
            this.$notification.success({
              message: labels.SAVE_SUCCESS,
              description: '授权成功'
            })
            this.$emit('clearId')
            this.handleCancel()
          })
          .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false})
      },
      handleCancel () {
        this.$refs.table.localDataSource = []
        this.visible = false
        this.confirmLoading = false
      }
    },
  }
</script>
<style lang="scss" scoped>
  .page_title {
    float: right;
  }

  ::v-deep .ant-modal-content {
    max-height: 1000px;
  }
  ::v-deep .ant-checkbox-wrapper{
    margin-left: 0px;
    margin-right: 8px;
  }
</style>
