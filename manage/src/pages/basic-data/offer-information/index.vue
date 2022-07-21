<template>
  <a-card :bordered="false" class="driver" :body-style="{padding: 0}">
    <a-row :gutter="0" class="" >
      <a-col :span="8">
        <a-spin :spinning="leftLoading">
          <list-page
            ref="listPage"
            @resetParams="resetSearchForm"
            request-type="GET"
            :columns="columns"
            :request-url="requestUrl"
            :query-params="searchParams"
            :customRow="leftCustomRow"
            :loadAfterRender="afterLoad"
            :scroll="{ x: 1470 }"
            size="small"
          >
            <template slot="$search">
              <a-col :md="24" :sm="24" :xxl="12">
                <a-form-item label="优惠活动编码">
                  <a-input
                    v-model="queryParam.promotionCode"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入活动编码"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24" :xxl="12">
                <a-form-item label="优惠活动名称">
                  <a-input
                    v-model="queryParam.promotionName"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入活动名称"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24" :xxl="12">
                <a-form-item label="是否启用">
                  <a-select v-model="queryParam.isActive" placeholder="请选择是否启用">
                    <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <template slot="$operate">
              <a-button type="primary" icon="edit" style="margin-bottom: 8px;" v-if="actionAuth.includes('OfferInformation.Create')" @click="addLeftEntry">新建</a-button>
            </template>
            <template slot="materialCode" slot-scope="text">
              <ellipsis tooltip :length="12">{{ text }}</ellipsis>
            </template>
            <template slot="promotionName" slot-scope="text">
              <ellipsis tooltip :length="20">{{ text }}</ellipsis>
            </template>
            <template slot="storeName" slot-scope="text">
              <ellipsis tooltip :length="38">{{ text }}</ellipsis>
            </template>
            <template slot="isActive" slot-scope="text, record">
              <a-switch v-if="actionAuth.includes('OfferInformation.Modify')" checked-children="是" un-checked-children="否" :disabled="disabled" :value="text" @change="e => handleActive(e, record)"></a-switch>
              <a-icon v-else :type="text ? 'check' : 'close'"/>
            </template>
            <span slot="action" slot-scope="text, record">
              <template v-if="actionAuth.includes('OfferInformation.Modify')">
                <a @click.stop="editLeftEntry(record)">编辑</a>
                <a-divider type="vertical"/>
              </template>
              <template v-if="actionAuth.includes('OfferInformation.Delete')">
                <a-popconfirm title="是否要删除此行？" @confirm="removeLeftEntry(record)">
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
            :columns="columns2"
            :data="loadData"
            :query-params="searchParams2"
            :scroll="{ x: 2300 }"
            :show-refresh="!!queryParam2.id"
            :createdLoadData="false"
            size="small"
          >
            <template slot="$search">
              <a-col :sm="24" :md="12" :lg="12" :xl="12" :xxl="8">
                <a-form-item label="材料名称">
                  <a-input
                    v-model="queryParam2.materialName"
                    autocomplete="off"
                    style="width: 100%"
                    placeholder="请输入材料名称"
                    :max-length="30"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template slot="$operate">
              <a-button type="primary" class="upload" icon="upload" style="margin-bottom: 8px;" v-if="actionAuth.includes('OfferInformation.Upload') && !!queryParam2.id" @click="uploadData">上传材料数据</a-button>
              <a-button type="primary" class="download" icon="download" style="margin-bottom: 8px;" v-if="actionAuth.includes('OfferInformation.DownloadTemplate') && !!queryParam2.id" @click="downloadTemplate">下载材料模板</a-button>
              <a-button type="primary" class="download" icon="download" style="margin-bottom: 8px;" v-if="actionAuth.includes('OfferInformation.Download') && !!queryParam2.id" @click="downloadData">下载材料数据</a-button>
            </template>
            <template slot="materialName" slot-scope="text">
              <ellipsis tooltip :length="28">{{ text }}</ellipsis>
            </template>
            <template slot="ellipsis" slot-scope="text">
              <ellipsis tooltip :length="12">{{ text }}</ellipsis>
            </template>
            <template slot="ellipsis2" slot-scope="text">
              <ellipsis tooltip :length="14">{{ text }}</ellipsis>
            </template>
            <template slot="ellipsis3" slot-scope="text">
              <ellipsis tooltip :length="16">{{ text }}</ellipsis>
            </template>
            <span slot="action" slot-scope="text, record">
              <!--<template v-if="actionAuth.includes('OfferInformation.Modify')">-->
              <!--  <a @click.stop="editAction(record)">编辑</a>-->
              <!--  <a-divider type="vertical"/>-->
              <!--</template>-->
              <template v-if="actionAuth.includes('OfferInformation.Delete')">
                <a-popconfirm title="是否要删除此行？" @confirm="removeAction(record)">
                  <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
                </a-popconfirm>
              </template>
            </span>
          </list-page>
        </a-spin>
      </a-col>
    </a-row>
    <upload-modal ref="uploadModal" @ok="handleSaveOk()"></upload-modal>
    <promotion-action ref="promotionEntry" @ok="handleSaveOk()"></promotion-action>
  </a-card>
</template>

<script>
import STree from '@/components/MyTree'
import { STable, Ellipsis } from '@/components'
// import ActionModal from './modules/ActionModal'
import moment from 'moment'
import { dateFormatString, defaultErrorMessage } from '@/utils/common'
import { defaultTableColumns } from '@/components/ListPage/_utils'
import ListPage from '@/components/ListPage'
import labels from '@/utils/labels'
import PromotionAction from '@/pages/basic-data/offer-information/modules/PromotionAction'
import UploadModal from '@/pages/basic-data/offer-information/modules/UploadModal'
import { download } from '@/utils/util'

export default {
  name: 'TreeList',
  components: {
    Ellipsis,
    STable,
    STree,
    ListPage,
    PromotionAction,
    UploadModal
    // ActionModal
  },
  data () {
    return {
      leftLoading: false,
      loading: false,
      // 查询参数
      queryParam: {
      },
      queryParam2: {
        id:''
      },
      requestUrl: this.$api.basicData.promotionInfo.getList,
      requestUrl2: this.$api.basicData.promotionInfo.getDetailList,
      // 表头
      columns: [
        { ...defaultTableColumns.serial, width: 60 },
        {
          title: '优惠活动编码',
          dataIndex: 'promotionCode',
          width: 120,
          scopedSlots: {
            customRender: 'materialCode'
          }
        },
        {
          title: '优惠活动名称',
          dataIndex: 'promotionName',
          width: 200,
          scopedSlots: {
            customRender: 'promotionName'
          }
        },
        {
          title: '门店名称',
          dataIndex: 'storeName',
          width: 300,
          scopedSlots: {
            customRender: 'storeName'
          }
        },
        {
          title: '客户数上限',
          dataIndex: 'customerLimit',
          width: 120
        },
        {
          title: '开始时间',
          dataIndex: 'beginDate',
          width: 160
        },
        {
          title: '结束时间',
          dataIndex: 'endDate',
          width: 110
        },
        {
          title: '是否启用',
          dataIndex: 'isActive',
          width: 90,
          scopedSlots: {
            customRender: 'isActive'
          }
        },
        {
          title: '编辑人',
          dataIndex: 'modifiedBy',
          width: 90
        },
        {
          title: '编辑时间',
          dataIndex: 'modifiedTime',
          customRender: txt => txt && moment(txt).format(dateFormatString) || '',
          width: 110
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 90,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        defaultTableColumns.serial,
        {
          title: '材料编码',
          dataIndex: 'materialCode',
          width: 160,
          align: 'center',
          scopedSlots: {
            customRender: 'materialCode'
          },
        },
        {
          title: '材料名称',
          dataIndex: 'materialName',
          align: 'center',
          scopedSlots: {
            customRender: 'materialName'
          },
          width: 240
        },
        {
          title: '规格',
          dataIndex: 'spec',
          width: 180,
          align: 'center',
          scopedSlots: {
            customRender: 'ellipsis'
          },
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: 100
        },
        {
          title: '返点比例',
          dataIndex: 'rebateProportion',
          align: 'center',
          width: 140
        },
        {
          title: '市场价',
          dataIndex: 'price',
          align: 'center',
          width: 140
        },
        {
          title: '销售优惠价',
          dataIndex: 'salePrice',
          align: 'center',
          width: 140
        },
        {
          title: '采购优惠价',
          dataIndex: 'buyPrice',
          align: 'center',
          width: 140
        },
        {
          title: '颜色',
          dataIndex: 'color',
          width: 120,
          align: 'center',
          scopedSlots: {
            customRender: 'ellipsis'
          },
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          width: 160,
          align: 'center',
          scopedSlots: {
            customRender: 'ellipsis3'
          },
        },
        {
          title: '型号',
          dataIndex: 'materialType',
          width: 140,
          align: 'center',
          scopedSlots: {
            customRender: 'ellipsis2'
          },
        },
        {
          title: '材质',
          dataIndex: 'texture',
          width: 120,
          align: 'center',
          scopedSlots: {
            customRender: 'ellipsis'
          },
        },
        {
          title: '类别序号',
          dataIndex: 'typeSerial',
          width: 140,
          align: 'center',
          scopedSlots: {
            customRender: 'ellipsis2'
          },
        },
        {
          title: '编辑人',
          align: 'center',
          dataIndex: 'modifiedBy',
          width: 90
        },
        {
          title: '编辑时间',
          dataIndex: 'modifiedTime',
          align: 'center',
          customRender: txt => txt && moment(txt).format(dateFormatString) || '',
          width: 110
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 80,
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      isFirstEnter: true,
      disabled: false,
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
    afterLoad (res) {
      if (res && res.rows && res.rows.length) {
        this.queryParam2.id = res.rows[0].id
        this.$nextTick(() => {
          this.$refs.listPage2.refresh()
        })
      }
      return res
    },
    loadData (parameter) {
      if (!this.queryParam2.id) {
        return Promise.resolve({
          rows: [],
          total: 0
        })
      }
      return this.$get({
        url: this.$api.basicData.promotionInfo.getDetailList,
        params: { ...parameter, ...this.queryParam2 }
      })
    },
    leftCustomRow(record){
      return {
        on: { // 事件
          click: (event) => {
            this.queryParam2.id = record.id
            this.$nextTick(() => {
              this.$refs.listPage2.refresh(true)
            })
          }
        },
        class: { 'select-row': this.queryParam2.id === record.id }
      }
    },
    searchParams () {
      return { ...this.queryParam }
    },
    searchParams2 () {
      return { ...this.queryParam2 }
    },
    // 启用
    handleActive (e, record) {
      if (this.disabled) return
      this.disabled = true
      this.$put({
        url: this.$api.basicData.promotionInfo.activePromotion,
        params: { id: record.id }
      }).then(() => {
        this.refresh()
      }).finally(() => {
        this.disabled = false
      })
    },
    refresh () {
      this.handleSaveOk()
    },
    // 上传材料数据
    uploadData () {
      this.$refs.uploadModal.show(this.queryParam2.id)
    },
    // 下载数据
    downloadData () {
      // download({
      //   url: this.$api.basicData.promotionInfo.downloadMaterials + '?id=' + this.queryParam2.id,
      //   responseType: ''
      // })
      window.open(process.env.VUE_APP_API_BASE_URL + this.$api.basicData.promotionInfo.downloadMaterials +
        `?id=${this.queryParam2.id}&materialName=${this.queryParam2.materialName || ''}`,'_self')
    },
    // 下载模板
    downloadTemplate(){
      const url = process.env.VUE_APP_TEMPLATE_BASE_URL + 'activity-template.xlsx'
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute(
        'download',
        '优惠活动数据模版'
      )
      document.body.appendChild(link)
      link.click()
    },
    // 左边的操作
    addLeftEntry () {
      this.$refs.promotionEntry.add()
    },
    editLeftEntry (e) {
      this.$refs.promotionEntry.edit(e)
    },
    removeLeftEntry (e) {
      this.loading = true
      this.$delete({
        url: this.$api.basicData.promotionInfo.del,
        params: { id: e.id },
        needResponse: true
      }).then(res => {
        this.$notification.success({
          message: labels.DELETE_SUCCESS,
          description: res.message || ''
        })
        this.handleSaveOk()
      }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
        .finally(() => { this.loading = false })
    },
    // 右边的操作
    addAction (data) {
    },
    editAction (data) {
    },
    removeAction (record) {
      this.loading = true
      this.$post({
        url: this.$api.basicData.promotionInfo.delMaterials,
        data: [record.id],
        needResponse: true
      }).then(res => {
        this.$notification.success({
          message: labels.DELETE_SUCCESS,
          description: res.message || ''
        })
        this.handleSaveOk(1)
      }).catch(err => defaultErrorMessage(err, labels.DELETE_FAIL))
        .finally(() => { this.loading = false })
    },
    handleSaveOk (isRight) {
      if (isRight) {
        this.$refs.listPage2.refresh()
      } else {
        this.queryParam2.id = ''
        this.$refs.listPage.refresh()
      }
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    resetSearchForm2 () {
      this.queryParam2 = { id: this.queryParam2.id }
    }
  },
  activated () {
    // if (this.isFirstEnter) {
    //   this.isFirstEnter = false
    // } else {
    //   this.refresh()
    // }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .select-row td{
  background-color: #f8f8f8;
}

.borderLeft {
  border-left: solid 1px #eee;
  padding-left: 20px !important;
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
::v-deep .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th,
::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th{
  background-color: #E4EAEC;
}
::v-deep .ant-table-small{
  border: none
}
</style>
