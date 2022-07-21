import ListSearchParams from '@/components/ListPage/ListSearchParams'
import ListOperateButtons from '@/components/ListPage/ListOperateButtons'
import TableItem from './TableItem'

import ListTable from '@/components/ListPage/ListTable'
import { Card } from 'ant-design-vue'
import common from '@/utils/common'
import { apiRequest, urlReplace } from '@/utils/http-service'

export default {
  name: 'ListPage',
  components: {
    ListSearchParams,
    ListOperateButtons,
    ListTable,
    TableItem,
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
      default: true
    },
    /**
     * 显示table上的按钮行，默认：true
     */
    showOperateButton: {
      type: Boolean,
      default: true
    },
    keepAlive: {
      type: Boolean,
      default: true
    },
    showRefresh: {
      type: Boolean,
      default: true
    },
    /**
     * 显示table上自定义列按钮，默认：false
     */
    showActionBtn: {
      type: Boolean,
      default: false 
    },
    /**
     * redis存储的key
     */
    columnsName: {
      type: String,
      default: ''
    },
    /**
     * 初始表头数据
     */
    initColumns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchSlots: {},
      operateSlots: {},
      tableSlots: {},
      isFirstEnter: true
    }
  },
  methods: {
    // updateSelect
    updateSelect(selectedRowKeys=[], selectedRows=[]) {
      this.$refs.table && this.$refs.table.updateSelect(selectedRowKeys, selectedRows)
    },
    // 刷新
    refresh (isReset = false) {
      this.$refs.table && this.$refs.table.refresh(isReset)
    },
    columnsModal() {
      const list = this.$refs.table.columns
      list.forEach(ele=>{
        ele.checked = true
      })
      this.$refs.TableItem && this.$refs.TableItem.show(list,this.initColumns|| [],this.columnsName)
    },
    // 重新加载数据
    loadData (...args) {
      this.$refs.table && this.$refs.table.loadData(args)
    },
    reset () {
      this.$refs.table && (this.$refs.table.localDataSource = [])
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
        params = Object.assign(parameter || {}, this.queryParams || {})
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
          requestParams[dataName] = parameter || {}
        }
      }
      return apiRequest(urlReplace(requestParams))
    },
    // 头部搜索区域
    renderSearchParams (slots) {
      const vnodeProps = {
        on: {
          queryData: () => this.loadData(),
          resetParams: () => {
            this.$emit('resetParams')
            this.loadData()
          }
        }
      }
      return (<ListSearchParams { ...vnodeProps }>
        {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
      </ListSearchParams>)
    },
    renderSearchCard () {
      return this.showSearch ? (<ACard bordered={false} { ...{ props: { bodyStyle: this.bodyStyle } } }>
        {this.pageTitle ? (<div class="page-title">{this.pageTitle}</div>) : null}
        {this.renderSearchParams(this.searchSlots)}
      </ACard>) : null
    },
    // 中间按钮区域
    renderOperate (slots) {
      const vnodeProps = {
        props: { 
          showRefresh: this.showRefresh,
          showActionBtn: this.showActionBtn
        },
        on: {
          refresh: this.refresh,
          columnsModal: this.columnsModal
        }
      }
      return (<ListOperateButtons { ...vnodeProps }>
        {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
      </ListOperateButtons>)
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
      return (<ListTable { ...vnodeProps }>
        {Object.keys(slots).map(name => (<template slot={name}>{slots[name]}</template>))}
      </ListTable>)
    },
    // 获取新表头
    getNewColumns(new_columns) {
      this.$refs.table && this.$refs.table.upDataColumns(new_columns)
    }
  },
  activated () {
    if (this.keepAlive) {
      if (this.isFirstEnter) {
        this.isFirstEnter = false
      } else {
        !this.disabledActive && this.$refs.table.refresh(true)
      }
    }
  },
  render () {
    const allSlot = Object.keys(this.$slots) || []
    allSlot.forEach(m => {
      // 表头搜索区域的slot
      if (m.startsWith('$search')) {
        this.searchSlots[m.substring(7) || 'default'] = this.$slots[m]
        // 表格上操作按钮行的slot
      } else if (m.startsWith('$operate')) {
        this.operateSlots[m.substring(8) || 'default'] = this.$slots[m]
      //  表格内的slot
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
        <ACard bordered={false} style={[{ marginTop: this.showSearch && this.showOperateButton ? '24px' : 0, padding: this.showSearch ? '' : '0px' }]} bodyStyle={{ padding: this.showSearch ? '' : '0px' }}>
          {this.showOperateButton ? this.renderOperate(this.operateSlots) : null}
          {this.renderTable(this.tableSlots)}
        </ACard>
        {this.showActionBtn?<TableItem ref="TableItem" on-getNewColumns={this.getNewColumns}></TableItem> : null}
      </div>
    )
  }
}
