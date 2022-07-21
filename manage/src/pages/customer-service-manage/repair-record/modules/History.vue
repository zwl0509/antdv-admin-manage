<template>
  <a-modal
    :visible="visible"
    :width="1200"
    title="投诉历史纪录"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-tabs default-active-key="0" v-model="value" @change="changeTabs">
          <a-tab-pane v-for="(item, index) in stateList" :key="index" :tab="item.name" :value="item.id"></a-tab-pane>
        </a-tabs>
        <history-table ref="HistoryTable"></history-table>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>
<script>
  import HistoryTable from '@/pages/customer-service-manage/repair-record/modules/HistoryTable'
  import { Ellipsis } from '@/components'

  export default {
    name:'History',
    components: { Ellipsis,HistoryTable  },
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol2: {
          xs: { span: 24 },
          align: 'center',
          sm: { span: 21 }
        },
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        form: this.$form.createForm(this),
        codeList: [],
        expandedRowKeys: [],
        locale: {
          emptyText: this.$createElement('span', {},'暂无数据')
        },
        stateList:[
          {
            name:'历史投诉信息',key: 0
          },
          {
            name:'历史报修信息',key: 1
          },
          {
            name:'历史回访信息',key: 2
          }
        ],
        value: 0,
        customerId:'',
        codeType: {
          serviceType: [],
          complaintType: [],
          complaintSource: [],
        }
      }
    },
    methods: {
      show(record){
        this.customerId = record.customerId
        this.visible = true
      },
      getCodeList() {
        const params = {
          typeList: ['1071','1051','1044']
        }
        this.$getCodesList(params, res => {
          this.codeType.serviceType = res['1071'] || [] // 客服类型
          this.codeType.complaintType = res['1051'] || [] // 投诉类别
          this.codeType.complaintSource = res['1044'] || [] // 投诉来源
        })
      },
      changeTabs(value) {
        const id = this.customerId
        this.$refs.HistoryTable.show(id,value)
        this.value = value
        this.$forceUpdate()
      },
      handleCancel () {
        // 重置表单数据
        this.id = ''
        this.confirmLoading = false
        this.visible = false
        this.form.resetFields()
      },
    }
  }
</script>
<style scoped lang="scss">
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0;
    background: red !important;
    color: #585A62;
  }
  .remark{
    margin-bottom: 20px;
  }
</style>
