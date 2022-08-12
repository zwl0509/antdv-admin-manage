<template>
  <a-modal
    title="整改列表"
    :width="900"
    :visible="visible"
    :centered="true"
    :mask-closable="false"
    @cancel="handleCancel">
    <a-table
      rowKey="id"
      :columns="columns"
      :pagination="false"
      :dataSource="dataList">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <template slot="attachInfos" slot-scope="text, record">
        <img v-if="record.sysAttachInfoVOS.length" :src="record.sysAttachInfoVOS[0].path" class="imgs" @click="openImgs(record.sysAttachInfoVOS[0].path)">
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="12" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="actionChildAuth.includes('RectifyDetail')">
          <a @click="$refs.Rectification.show(record,'detail')">详情</a>
        </template>
      </span>
    </a-table>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <a-modal :centered="true" :visible="previewVisible" :footer="null" @cancel="cancelImage">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
    <rectification ref="Rectification"></rectification>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { deepClone } from '@/utils/util'
  import { defaultErrorMessage } from '@/utils/common'
  import Rectification from './Rectification'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  export default {
    name: 'RectifyTable',
    components: { Rectification ,Ellipsis,  },
    props: {
      actionChildAuth:{
        type: Array,
        default: ()=> []
      }
    },
    data() {
      return {
        visible: false,
        previewImage: '',
        previewVisible: false,
        columns: [
          {
            title: '序号',
            width: 60,
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '标题',
            align: 'center',
            dataIndex: 'title',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '整改负责人',
            align: 'center',
            dataIndex: 'chargePersonName'
          },
          {
            title: '整改抄送人',
            align: 'center',
            dataIndex: 'notifyNames',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '描述',
            align: 'center',
            dataIndex: 'content',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '不合格图片',
            align: 'center',
            scopedSlots: { customRender: 'attachInfos' }
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataList: [],
        tableIndex: -1,
        taskId: ''
      }
    },
    methods: {
      show (record) {
        this.getDetail(record.id)
        this.visible = true
      },
      getDetail(inspectionId) {
        this.$get({
          url: this.$api.customInfo.customerInspectionRecordInfo.getRectificationList,
          params: { inspectionId },
        }).then(res=> {
          this.dataList = res
        })
      },
      openImgs(path){
        if(path){
          this.previewImage = path
          this.previewVisible = true
        }
      },
      cancelImage( ) {
        this.previewVisible = false
      },
      // 更新数组
      updateShowTable() {
        this.$forceUpdate()
      },
      handleCancel() {
        this.dataList = []
        this.visible = false
        this.tableIndex = -1
        this.taskId = ''
      }
    },
  }
</script>

<style lang="scss" scoped>
  .imgs {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px dashed #c9c9c9;
    object-fit: contain;
  }
  .left-content {
    margin: 10px 0;
    font-size: 16px;
  }
  .dispatch-user {
    display: inline-block;
    background-color: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 0 10px;
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
  }
</style>