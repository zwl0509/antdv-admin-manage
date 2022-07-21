<template>
  <div class="card-list" ref="content">
    <a-list
      rowKey="id"
      :grid="{gutter: 24, lg: 4, md: 3, sm: 2, xs: 1}"
      :dataSource="dataSource"
    >
      <a-list-item slot="renderItem" slot-scope="item" v-if="(!item || item.id === undefined) && actionAuth.includes('Banner.Create')">
        <template>
          <a-button class="new-btn" type="dashed" @click="$refs.createModal.add()">
            <a-icon type="plus"/>
            新增Banner
          </a-button>
        </template>
      </a-list-item>
      <a-list-item slot="renderItem" slot-scope="item" v-else-if="item && item.id">
        <a-spin :spinning="deleteLoading.includes(item.id)">
          <a-card :hoverable="true">
            <a-card-meta>
              <img class="banner-img" slot="description" v-if="item.attachInfoVOS.length" :src="item.attachInfoVOS[0].path" alt="">
              <img class="banner-img" slot="description" v-else :src="require('../../../assets/logo.png')" alt="">
            </a-card-meta>
            <div></div>
            <template class="ant-card-actions" slot="actions">
              <a @click="handleEdit(item)" v-if="actionAuth.includes('Banner.Modify')">编辑</a>
              <a-popconfirm title="是否要删除此Banner？" @confirm="handleSub(item)" v-if="actionAuth.includes('Banner.Delete')">
                <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
              </a-popconfirm>
            </template>
          </a-card>
        </a-spin>
      </a-list-item>
    </a-list>
    <a-pagination
      v-model="current"
      size="small"
      :total="total"
      :page-size="pageSize"
      @change="changePage"
      v-if="total>pageSize"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
        <span v-if="props.value === '50'">全部</span>
      </template>
    </a-pagination>

    <action-modal ref="createModal" @ok="handleOk"/>
  </div>
</template>

<script>
  import ActionModal from './modules/ActionModal'
  import { defaultErrorMessage } from '@/utils/common'
  import labels from '@/utils/labels'

  export default {
    name: 'CardList',
    components: {
      ActionModal
    },
    data () {
      return {
        dataSource: [{}],
        current: 1,
        pageSize: 11,
        total: 0,
        actionAuth: [],
        isFirstEnter: true,
        deleteLoading: []
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
      this.getBannerList()
    },
    mounted () {

    },
    methods: {
      getBannerList () {
        const data = {
          currentPage: this.current,
          pageSize: this.pageSize
        }
        this.$get({
          url: this.$api.system.banner.getListPage,
          params: data
        }).then(res => {
          const list = [{}]
          this.dataSource = list.concat(res.rows)
          this.total = res.total
        }).catch(err => defaultErrorMessage(err, '获取banner数据失败'))
        // banner_list(data).then(res => {
        //   if (res.code === 200) {
        //     let list = [{}]
        //     this.dataSource = list.concat(res.result.rows)
        //     this.total = res.result.total
        //   } else {
        //     this.$notification.error({
        //       message: 'Error',
        //       description: res.message
        //     })
        //   }
        // })
      },
      handleSub (record) {
        // 删除banner
        this.deleteLoading.push(record.id)
        this.$delete({
          url: this.$api.system.banner.delete,
          params: { id: record.id },
          needResponse: true
        })
          .then(res => {
            this.$notification.success({
              message: labels.DELETE_SUCCESS,
              description: res.message || ''
            })
            this.handleOk()
          }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
          .finally(() => { this.deleteLoading.splice(this.deleteLoading.indexOf(record.id), 1) })
      },
      handleEdit (record) {
        // 编辑banner
        this.$refs.createModal.edit(record)
      },
      handleOk () {
        if (this.dataSource.length === 2) {
          this.current = 1
        }
        this.getBannerList()
      },
      changePage (current) {
        this.current = current
        this.getBannerList()
      }
    },
    activated () {
      if (this.isFirstEnter) {
        this.isFirstEnter = false
      } else {
        this.getBannerList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-list {
    position: relative;
    padding-bottom: 20px;

    ::v-deep .ant-card-body {
      padding: 0;
    }

    ::v-deep .ant-card-body:hover {
      .ant-card-meta-title > a {
        color: $primaryColor;
      }
    }
  }

  .banner-img {
    width: 100%;
    height: 190px;
    object-fit: cover;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;

        &:hover {
          color: $primaryColor;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 230px;
  }

  ::v-deep .ant-pagination {
    position: absolute;
    bottom: -30px;
    right: 0;
  }

</style>
