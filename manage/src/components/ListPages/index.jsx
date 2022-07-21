import ListSearchParams from '@/components/ListPages/ListSearchParams'
import ListOperateButtons from '@/components/ListPages/ListOperateButtons'
import ListTable from '@/components/ListPages/ListTable'
import { Card } from 'ant-design-vue'
import { apiRequest, urlReplace } from '@/utils/http-service'
import moment from 'moment'

export default {
  name: 'ListPages',
  components: {
    ListSearchParams,
    ListOperateButtons,
    ListTable,
    ACard: Card
  },
  props: {
    ...ListTable.props,
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
    // 查询参数 可传：对象、函数对象、函数返回promise对象
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
     * 头部card的body-style
     */
    bodyStyle: {
      type: [String, Object],
      default: () => { return {} }
    },
    /**
     * 显示搜索card，默认：true
     */
    showSearch: {
      type: Boolean,
      default: false
    },
    /**
     * 显示table上的按钮行，默认：true
     */
    showOperateButton: {
      type: Boolean,
      default: true
    },
    /**
     * 
    */
    showRefresh: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      localQueryParams: this.queryParams,
      searchSlots: {},
      operateSlots: {},
      otherInfoSlots: {},
      tableSlots: {},
      isFirstEnter: false
    }
  },
  watch: {
    queryParams: {
      handler (newParams, oldParams) {
        if (typeof this.queryParams === 'object') {
          this.localQueryParams = this.queryParams
        } else {
          this.localQueryParams = this.queryParams()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // updateSelect
    updateSelect (selectedRowKeys = [], selectedRows = []) {
      this.$refs.table && this.$refs.table.updateSelect(selectedRowKeys, selectedRows)
    },
    // 刷新
    refresh (isReset = false) {
      this.$refs.table && this.$refs.table.refresh(isReset)
    },
    // 重新加载数据
    loadData (...args) {
      this.$refs.table && this.$refs.table.loadData(args)
    },
    reset () {
      this.$refs.table && this.$refs.table.reset()
    },

    handleHeaderSearch (selectedKeys, dataIndex, type, dateFormat) {
      if (selectedKeys.length) {
        if (this.data) {
          this.$emit('headerSearch', selectedKeys, dataIndex)
        } else {
          if (typeof dataIndex == 'object' && type === 'date') {
            // this.localQueryParams[dataIndex[0]] = moment(selectedKeys?selectedKeys[0]: new Date()).format('YYYY-MM-DD') + ' 00:00:00'
            // this.localQueryParams[dataIndex[1]] = moment(selectedKeys?selectedKeys[1]: new Date()).format('YYYY-MM-DD') + ' 23:59:59'
            this.localQueryParams[dataIndex[0]] = dateFormat === 'basicDate' ? moment(selectedKeys ? selectedKeys[0] : new Date()).format('YYYY-MM-DD') : moment(selectedKeys ? selectedKeys[1] : new Date()).format('YYYY-MM-DD') + ' 00:00:00'
            this.localQueryParams[dataIndex[1]] = dateFormat === 'basicDate' ? moment(selectedKeys ? selectedKeys[1] : new Date()).format('YYYY-MM-DD') : moment(selectedKeys ? selectedKeys[1] : new Date()).format('YYYY-MM-DD') + ' 23:59:59'
          } else {
            this.localQueryParams[dataIndex] = selectedKeys[0]
          }
          this.refresh()
        }
      }
    },

    handleHeaderReset (dataIndex, type) {
      if (this.data) {
        this.$emit('headerReset', dataIndex)
      } else {
        if (typeof dataIndex == 'object' && type === 'date') {
          delete this.localQueryParams[dataIndex[0]]
          delete this.localQueryParams[dataIndex[1]]
        } else {
          delete this.localQueryParams[dataIndex]
        }
        this.refresh()
      }
    },

    // 获取远程数据
    requestData (parameter) {
      const requestParams = {
        method: this.requestType,
        url: this.requestUrl
      }
      let params = {}
      const dataName = this.requestType.toLowerCase() === 'get' ? 'params' : 'data'
      if (typeof this.queryParams === 'object') {
        params = Object.assign(parameter, this.queryParams)
        requestParams[dataName] = params
        // this.requestType.toLowerCase() === 'get' ? (requestParams.params = params) : (requestParams.data = params)
      } else if (typeof this.queryParams === 'function') {
        const data = this.queryParams.call(this.$parent)
        if (typeof data === 'object' && typeof data.then === 'function') {
          return data.then(params => {
            requestParams[dataName] = Object.assign({}, parameter, params)
            return apiRequest(urlReplace(requestParams))
          })
        } else if (typeof data === 'object') {
          requestParams[dataName] = Object.assign({}, parameter, data)
        } else {
          requestParams[dataName] = parameter
        }
      }
      return apiRequest(urlReplace(requestParams))
    },
    // 头部搜索区域
    renderSearchParams (slots) {
      const vnodeProps = {
        on: {
          queryData: () => this.loadData(),
          resetParams: () => this.$emit('resetParams')
        }
      }
      return (<ListSearchParams {...vnodeProps}>
        {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
      </ListSearchParams>)
    },
    renderSearchCard () {
      return this.showSearch ? (<ACard bordered={false} {...{ props: { bodyStyle: this.bodyStyle } }}>
        {this.pageTitle ? (<div class="page-title">{this.pageTitle}</div>) : null}
        {this.renderSearchParams(this.searchSlots)}
      </ACard>) : null
    },
    // 中间按钮区域
    renderOperate (slots) {
      const vnodeProps = {
        on: {
          refresh: this.refresh
        },
        props: {
          showRefresh: this.showRefresh
        }
      }
      return (<ListOperateButtons {...vnodeProps}>
        {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
      </ListOperateButtons>)
    },

    // 表格顶部其他信息
    renderOtherInfo (slots) {
      return (<ACard bordered={false} bodyStyle={{ padding: 0 }}>
        {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
      </ACard>)
    },

    // 表格区域
    renderTable (slots) {
      const { bodyStyle, pageTitle, requestUrl, requestType, queryParams, disabledActive, showOperateButton, ...tableProps } = this.$props
      const vnodeProps = {
        ref: 'table',
        scopedSlots: this.$scopedSlots,
        props: { ...tableProps, size: this.size || 'middle', data: this.data || this.requestData },
        on: {
          expand: (expanded, record) => {
            this.$emit('expand', expanded, record)
          }
        }
      }
      return (<ListTable {...vnodeProps} onHandleHeaderSearch={this.handleHeaderSearch} onHandleHeaderReset={this.handleHeaderReset}>
        {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
      </ListTable>)
    }
  },
  activated () {
    if (this.isFirstEnter) {
      this.isFirstEnter = false
    } else {
      !this.disabledActive && this.$refs.table.refresh(true)
    }
  },
  render () {
    const allSlot = Object.keys(this.$slots) || []
    allSlot.forEach(m => {
      if (m.startsWith('$search')) {
        this.searchSlots[m.substring(7) || 'default'] = this.$slots[m]
      } else if (m.startsWith('$operate')) {
        this.operateSlots[m.substring(8) || 'default'] = this.$slots[m]
      } else if (m.startsWith('$otherInfo')) {
        this.otherInfoSlots[m.substring(10) || 'default'] = this.$slots[m]
      } else {
        this.tableSlots[m] = this.$slots[m]
      }
    })
    // eslint-disable-next-line no-unused-vars
    const props = {
      class: ''
    }
    return (
      <div class="content" >
        {this.renderSearchCard()}
        <ACard bordered={false} style={[{ marginTop: this.showSearch && this.showOperateButton ? '24px' : 0, padding: this.showSearch ? '' : '0px' }]} {...{ props: { bodyStyle: this.bodyStyle } }}>
          {this.showOperateButton ? this.renderOperate(this.operateSlots) : null}
          {this.renderOtherInfo(this.otherInfoSlots)}
          {this.renderTable(this.tableSlots)}
        </ACard>
      </div>
    )
  }
}
