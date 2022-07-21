<template>
  <a-table ref="table" rowKey="id" bordered :columns="columns" :data-source="dataList" :pagination="false">
    <span slot="page_title" slot-scope="text, record">
      <template>
        <span>{{ record.title }}</span>
        <div class="page_title">
          <a-checkbox :checked="record.isAuth ? true : false" @change="onCheckAllChange(record, 'type_index')"></a-checkbox>
        </div>
      </template>
    </span>
    <span slot="auth_manage" slot-scope="text, record, parentIndex">
      <template>
        <a-checkbox
          v-for="(item, index) in record.actionVOList"
          :checked="item.isAuth ? true : false"
          :key="index"
          @change="actionChange(record,item, parentIndex, 'type_index')">{{ item.name }}</a-checkbox>
      </template>
    </span>
  </a-table>
</template>

<script>
  export default {
    name: 'SystemAuth',
    data () {
      return {
        // 表头
        columns: [
          {
            title: '页面',
            width: 200,
            dataIndex: 'page_title',
            scopedSlots: { customRender: 'page_title' }
          },
          {
            title: '权限管理',
            dataIndex: 'auth_manage',
            scopedSlots: { customRender: 'auth_manage' }
          }
        ],
        dataList: [],
      }
    },
    methods: {
      show (list) {
        this.dataList = this.updataList(list)
      },
      updataList(list){
        if(list.length){
          list.forEach((item, index) => {
            if (item.children.length == 0) {
              delete item.children
            } else {
              this.updataList(item.children)
            }
          })
          return list 
        }
      },
      // 菜单选中
      onCheckAllChange (record, index) {
        record.isAuth = !record.isAuth
        if (record.parentId) {
          this.dataList.map(m => {
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
          this.dataList.map(m => {
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
              authorityTargetType: 'user',
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
                    authorityTargetType: 'user',
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
        const arr = this.checkList(this.dataList)
        return arr
      },
      clear() {
        this.dataList = []
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
