import MsGetTableDataMixins from './MsGetAsyncData'
import MsSearchForm from '@/components/MSTable/MsSearchForm'
import MsOperate from '@/components/MSTable/MsOperate'
import MsTableMixins from './MsTableMixins'

// eslint-disable-next-line no-unused-vars
const cardStyle = {
  marginTop: '24px',
  padding: ''
}
export default {
  name: 'MsTable',
  components: {
    MsOperate,
    MsSearchForm
  },
  mixins: [
    MsGetTableDataMixins,
    MsTableMixins
  ],
  props: {
    size: {
      type: String,
      default: 'default'
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    /**
     * 非异步请求函数数据，可返回值: { rows: [], total: 0 }, Array, Promise对象
     */
    data: {
      type: Function,
      default: null
    },
    /**
     * 请求的url,半路径或全路径
     */
    requestUrl: {
      type: String,
      default: ''
    },
    /**
     * 请求方式 GET POST...
     */
    requestType: {
      type: String,
      default: 'POST'
    },
    /**
     * 查询参数 可传：对象、函数对象、函数返回promise对象
     */
    queryParams: {
      type: [Object, Function],
      default: null
    },
    /**
     * 禁用route page再次打开时加载数据
     */
    disabledActive: {
      type: Boolean,
      default: false
    },
    pageTitle: {
      type: String,
      default: null
    },
    /**
     * 头部搜索card的body-style
     */
    searchCardStyle: {
      type: [String, Object],
      default: () => ({
        padding: '12px 24px'
      })
    },
    /**
     * 表格card的body-style
     */
    bodyStyle: {
      type: [String, Object],
      default: () => ({})
    },
    /**
     * 显示搜索card，默认：true
     */
    showSearch: {
      type: Boolean,
      default: true
    },
    /**
     * 显示table上的按钮行，默认：true
     */
    showOperateButton: {
      type: Boolean,
      default: true
    },
    /**
     * 显示刷新按钮
     */
    showRefresh: {
      type: Boolean,
      default: true
    },
    /**
     * 创建时加载异步数据
     */
    createdLoad: {
      type: Boolean,
      default: true
    },
    /**
     * 异步数据请求后处理数据
     */
    afterFilter: {
      type: Function,
      default: null
    },
    /**
     * 表单搜索后数据处理
     */
    searchFormFilter: {
      type: Function,
      default: null
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    /**
     * 开启表格外搜索框
     */
    outSearch: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    rowSelection: {
      deep: true,
      handler (val) {
        this.selectedRowKeys = val.selectedRowKeys
        this.selectedRows = val.selectedRows
      }
    },
    columns (v) {
      this.localColumns = v
    }
  },
  data () {
    return {
      isFirstEnter: true
    }
  },
  methods: {
  },
  activated() {
    if (this.isFirstEnter) {
      this.isFirstEnter = false
    } else {
      !this.disabledActive && this.refresh(true)
    }
  },
  render () {
    const allSlot = Object.keys(this.$slots) || []
    const searchSlots = [], operateSlots = [], tableSlots = []
    allSlot.forEach(m => {
      // 表头搜索区域的slot
      if (m.startsWith('$search')) {
        searchSlots[m.substring(7) || 'default'] = this.$slots[m]
        // 表格上操作按钮行的slot
      } else if (m.startsWith('$operate')) {
        operateSlots[m.substring(8) || 'default'] = this.$slots[m]
        //  表格内的slot
      } else {
        tableSlots[m] = this.$slots[m]
      }
    })
    if (!this.outSearch) cardStyle.marginTop = '0'
    return (<div className="content">
      {this.outSearch ? (<ms-search-form searchCardStyle={this.searchCardStyle} onReset={() => this.resetSearchData()} onQueryData={this.queryData}> {Object.keys(searchSlots).map(name => (<template slot={name}>{ searchSlots[name]}</template>))}</ms-search-form>) : null}
      <a-card bordered={false} style={cardStyle} bodyStyle={this.bodyStyle}>
        {this.showOperateButton ? <ms-operate show-refresh={this.showRefresh} onRefresh={() => this.tableChange()}>{Object.keys(operateSlots).map(name => (<template slot={name}>{ operateSlots[name]}</template>))}</ms-operate>: null}
        {this.renderTable(tableSlots)}
      </a-card>
    </div>)
  }
}