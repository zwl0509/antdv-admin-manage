<template>
  <a-modal
    :title="modal_title"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <div style="margin-bottom: 20px;" v-if="modal_type !== 'detail'" >
      <a-button type="primary" style="margin-left: 10px;" icon="plus" @click="$refs.ProcessDetail.add(newList)">新增</a-button>
    </div>
    <a-table rowKey="fid" size="small" :columns="columns" :data-source="dataList" :pagination="false" :scroll="{ x: 2000 }">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <template slot="switch" slot-scope="text">
        <template>
          <a-icon :type="!!text? 'check' : 'close'"/>
        </template>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="24" tooltip>{{ text && text.join(',') || '-' }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record, index">
        <span v-if="modal_type == 'detail'">
          <a @click="$refs.ProcessDetail.edit(record,'detail',newList)">详情</a>
        </span>
        <span v-else>
          <template>
            <a @click="$refs.ProcessDetail.edit(record,'edit',newList,index)">编辑</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a-popconfirm title="是否要删除此行？" @confirm="handleDel(index)">
              <a class="ant-btn-background-ghost ant-btn-danger">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </span>
    </a-table>
    <template slot="footer">
      <div v-if="modal_type == 'detail'">
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>
    <process-detail ref="ProcessDetail" @ok="refresh" @updataList="updataList"></process-detail>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import { defaultErrorMessage } from '@/utils/common'
  import Ellipsis from '@/components/Ellipsis/Ellipsis'
  import ProcessDetail from './ProcessDetail'
  export default {
    name: 'ProcessDetails',
    components: {
      ProcessDetail,
      Ellipsis
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        modal_type: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        queryParam: {},
        id: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '节点名称',
            align: 'center',
            dataIndex: 'name',
            width: 240,
          },
          {
            title: '流程顺序',
            align: 'center',
            dataIndex:'sequence',
          },
          {
            title: '是否忽略',
            align: 'center',
            dataIndex:'canIgnore',
            scopedSlots: { customRender: 'switch' }
          },
          {
            title: '是否并行节点',
            align: 'center',
            dataIndex:'canParallel',
            scopedSlots: { customRender: 'switch' }
          },
          {
            title: '是否派工',
            align: 'center',
            dataIndex:'isDispatch',
            scopedSlots: { customRender: 'switch' }
          },
          {
            title: '绑定表单',
            align: 'center',
            dataIndex: 'workFlowRelationFormCodeName'
          },
          {
            title: '派工类型',
            align: 'center',
            dataIndex:'dispatchTypeName',
          },
          {
            title: '派工岗位',
            align: 'center',
            width: 200,
            dataIndex:'workFlowDispatchNames',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '操作岗位',
            align: 'center',
            width: 200,
            dataIndex:'workFlowRelationPositionNames',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '前置条件',
            align: 'center',
            width: 200,
            dataIndex:'workFlowFrontNames',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '绑定菜单',
            align: 'center',
            width: 200,
            dataIndex:'workFlowRelationMenuNames',
            scopedSlots: { customRender: 'ellipsis' }
          },
          {
            title: '操作',
            align: 'center',
            width: 120,
            fixed: 'right',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
          },
        ],
        dataList: [],
        name: '',
        newList: [], // 前置条件
      }
    },
    computed: {
      modal_title() {
        switch (this.modal_type) {
          case 'add' :
            return '新增流程'
          case 'detail' :
            return '流程详情'
          case 'copy' :
            return '复制流程'
          default:
            return ''
        }
      }
    },
    methods: {
      add(record) {
        this.modal_type = 'add'
        this.visible = true
        this.id = record.id
        this.name = record.name
      },
      edit(record,type) {
        this.modal_type = type
        this.visible = true
        this.id = record.typeId
        this.name = record.name
        this.getDetailList(record.id)
      },
      copy(record,type) {
        this.modal_type = type
        this.visible = true
        this.id = record.typeId
        this.name = record.name
        this.getDetailList(record.id)
      },
      getNewList(list) {
        const arr = []
        list.forEach(item => {
          arr.push({
            fid: item.fid,
            name: item.name
          })
        })
        this.newList = arr
      },
      getDetailList(id) {
        this.$post({
          url: this.$api.workFlowTypeInfo.getDetailList,
          data: { id }
        }).then((res)=>{
          this.dataList = res || []
        })
      },
      handleDel(index) {
        this.dataList.splice(index,1)
      },
      // 新增数据并且更表格
      updataList(data,index) {
        if(this.dataList.length) {
          const item = this.dataList.find((info)=>  info.fid === data.fid)
          if (item) {
            this.dataList[index] = data
            this.$forceUpdate()
          }else {
            this.dataList.push(data)
          }
        }else {
          this.dataList.push(data)
        }
      },
      handleSubmit() {
        if (this.modal_type == 'copy') {
          this.dataList.forEach(ele=>{
            ele.id = null
          })
        }
        this.$post({
          url: this.$api.workFlowTypeInfo.editDetail,
          data: { 
            workFlowInfoNodeDetailDTOList: this.dataList,
            typeId : this.id,
            name : this.name
          },
          needResponse: true
        }).then(res => {
              this.handleCancel()
              this.$emit('ok')
              this.$notification.success({
                message: labels.SAVE_SUCCESS,
                description: res.message || ''
              })
            })
            .catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
            .finally(() => { this.confirmLoading = false })
      },
      handleCancel() {
        this.visible = false
        this.id = ''
        this.name = ''
        this.dataList = []
      },
      // 刷新
      refresh() {}
    },
    watch: {
      dataList: {
        handler(newList,oldList) {
          // this.$set(newList)
          if(newList && newList.length) {
            this.getNewList(newList)
          }else {
            this.newList = []
          }
        }
      },
      immediate: true
    }

  }
</script>

<style lang="scss" scoped>
  ::v-deep .table-style {
    .ant-card-body {
      padding: 0;
    }
    .ant-table-small > .ant-table-content > .ant-table-body {
      margin: 0;
    }
  }
  ::v-deep .ant-table-small .ant-table-thead th{
    background-color: #eaeaea !important;
  }
  ::v-deep .ant-table-small{
    border: none
  }
  ::v-deep .ant-table-tbody > tr.select-row td{
    background-color: $primaryColor;
    color: white;
  }
  ::v-deep .ant-table-tbody > tr.select-row:hover td,
  ::v-deep .select-row.ant-table-row-hover td{
    background-color: $primaryColor;
    color: white;
  }
  .top-select-show{
    margin-left: -8px;
  }
  ::v-deep .table-select{
    .ant-card:nth-child(2){
      margin-top: 0 !important;
      .ant-card-body{
        padding-top: 0;
      }
    }
  }
</style>