<template>
  <a-modal 
    title="收款查看"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <!-- <a-tooltip title="全屏显示" style="fontSize:20px;position: absolute;right: 60px;top: 12px;" >
      <a-icon type="fullscreen" @click="fullscreen" style="color: rgba(0,0,0,0.45)"/>
    </a-tooltip> -->
    <!-- <div id="fullscreenId" className="fullscreen"> -->
    <list-page
      ref="listPage"
      size="small"
      class="table-style"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :bodyStyle="{ padding: '0' }"
      :showRefresh="false"
      :query-params="searchParams"
      :pageSize="50"
      :pagination="{pageSize: 50, pageSizeOptions: ['50','100','150','200']}"
      :scroll="{y: scrollY }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ dataInfo.isOpen1 }}
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ dataInfo.isOpen2 }}
          </a-form-item>
        </a-col>   
        <a-col :md="6" :sm="24">
          <a-form-item label="收款模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择收款模板" v-model="dataInfo.isOpen3">
              <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$searchFold">
        <a-col :md="6" :sm="24">
          <a-form-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-model="dataInfo.customerName" autocomplete="off" placeholder="请输入项目名称" :max-length="30"/>
          </a-form-item>
        </a-col> 
      </template>
      <template slot="switch" slot-scope="text">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="!!text" />
      </template>
    </list-page>
    <!-- </div> -->
  </a-modal>
</template>

<script>
  import ListPage from '@/components/ListPage'
  import { dateFormatString } from '@/utils/common'
  export default {
    name: 'CollectionDetails',
    components: {
      ListPage,
    },
    data () {
      return {
        visible: false,
        scrollY: 300,
        confirmLoading: false,
        requestUrl: this.$api.mock.getPageList,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        queryParam: {},
        dataInfo: {
          isOpen1: 'A-C0-20220509',
          isOpen2: '何林海三单元',
          isOpen3: 0,
        },
        typeList: [
          { value: 0, name: '收款模板1' },
          { value: 1, name: '收款模板2' },
        ],
        id: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex:'text17',
          },
          {
            title: '特项编码',
            align: 'center',
            dataIndex:'code7',
          },
          {
            title: '款项类别',
            align: 'center',
            dataIndex:'code1',
          },
          {
            title: '应收计算公式',
            align: 'center',
            dataIndex:'text11',
          },
          {
            title: '应收金额',
            align: 'center',
            dataIndex:'number21',
          },
          {
            title: '已收金额',
            align: 'center',
            dataIndex:'number17',
          },
          {
            title: '未受金额',
            align: 'center',
            dataIndex:'number18',
          },
          {
            title: '是否收款项',
            align: 'center',
            dataIndex:'boolean1',
            customRender: t => <a-icon type = { t ? 'close' : 'check' } />         
          },
        ],
        dataList: [],
      }
    },
    // mounted() {
    //   const that = this
    //   document.documentElement.addEventListener('keyup',(e)=>{
    //     if(e.keyCode == 27){
    //       that.scrollY =  350
    //       that.exitFullscreen()  //事件名
    //     }
    //   })
    // },
    methods: {
      fullscreen (){
        const element = document.querySelector('#fullscreenId')
        window.onresize = (e)=>{
          this.scrollY = e.target.innerHeight - 256
        }
        this.launchFullscreen(element)
      },
      launchFullscreen(ele){
        const element = ele || document.documentElement
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen()
        }
      },
      exitFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      },
      searchParams() {
        return this.queryParam
      },
      show() {
        this.visible = true
      },
      handleSubmit() {
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
        this.scrollY = 300
      },
      exportData() {

      },
      // 刷新
      refresh() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .table-style {
    background-color:#F0F2F5;
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