import { apiRequest, urlReplace } from '@/utils/http-service'
import labels from '@/utils/labels'

const defaultPageNum = 1,
  defaultPageSize = 20

export default {
  name: 'MsTableMixins',
  data () {
    return {
      searchFormData: {}
    }
  },
  methods: {
    refresh (reset = false) {
      if (reset) {
        this.localPagination.current = 1
        if (this.pagination) {
          this.$emit('update:pagination', this.localPagination)
        }
      }
      this.tableChange()
    },
    resetSearchData () {
      this.searchFormData = {}
      this.refresh()
    },
    queryData (values) {
      this.searchFormData = values
      if (this.searchFormFilter)
        this.searchFormData = this.searchFormFilter(values)
      this.tableChange()
    },
    getAsyncData (parameter) {
      const options = {
        method: this.requestType,
        url: this.requestUrl
      }
      let params = {}
      const dataName = this.requestType.toLowerCase() === 'get' ? 'params' : 'data'
      if (typeof this.queryParams === 'function') {
        const data = this.queryParams.call(this.$parent, this.searchFormData)
        if (data instanceof Promise) {
          return data.then(params => {
            options[dataName] = Object.assign({}, parameter, params || {})
            return apiRequest(urlReplace(options))
          })
        } else if (typeof data === 'object') {
          options[dataName] = Object.assign({}, parameter, data, this.searchFormData)
        } else {
          options[dataName] = Object.assign({}, parameter || {}, this.searchFormData)
        }
      } else if (typeof this.queryParams === 'object') {
        params = Object.assign(parameter || {}, this.queryParams || {}, this.searchFormData)
        options[dataName] = params
      }
        return apiRequest(urlReplace(options))
    },
    // 表格翻页、搜索、刷新
    tableChange (currPagin, filters, sorter) {
      this.localLoading = true
      this.localLocale = null
      const { localPagination } = this
      const parameter = localPagination !== null ? Object.assign({
        currentPage: (currPagin && currPagin.current) || localPagination.current || defaultPageNum,
        pageSize: (currPagin && currPagin.pageSize) || localPagination.pageSize || defaultPageSize
      },
        (sorter && sorter.field && {
          sortField: sorter.field
        }) || {},
        (sorter && sorter.order && {
          sortOrder: sorter.order
        }) || {}, {
        ...filters
      } || {}
      ) : {}

      const result = this.data ? typeof this.data === 'function' ? this.data(parameter) : this.data : this.getAsyncData(parameter)
      this._dealResultData(result, parameter)
    },
    _getDataFail (error) {
      this.localLocale = {
        emptyText: error && error.message || labels.RESPONSE_RESULT_EXCEPTION
      }
      this.localDataSource = [] // 返回结果中的数组数据
      if (this.localPagination) {
        this.localPagination.total = 0
        this.localPagination.current = 1
        if (this.pagination) {
          this.$emit('update:pagination', this.localPagination)
        }
      }
    },
    _dealResultData (result, parameter) {
      if (result instanceof Promise) {
        result.then(res => {
          return this._dealAsyncData({ result: res, parameter })
        }).catch(e => {
          this._getDataFail(e)
        }).finally(() => {
          this.localLoading = false
        })
      } else {
        this._dealSyncData(result, parameter)
        this.localLoading = false
      }
    },
    _setTableData (result, parameter) {
      if (this.localPagination) {
        this.localPagination.total = result.total || this.localDataSource.length
        this.localPagination.hideOnSinglePage = parameter.currentPage <= 1 && (result.total || this.localDataSource.length) < parameter.pageSize
      }
      if (result.rows && result.rows.length === 0 && this.localPagination.current > 1) {
        this.localPagination.current--
        if (this.pagination) {
          this.$emit('update:pagination', this.localPagination)
        }
        this.tableChange()
      }
      this.localDataSource = result.rows || []
    },
    _dealSyncData (result, parameter) {
      try {
        if (Array.isArray(result)) {
          this.localDataSource = result
          if (this.localPagination) {
            this.localPagination.hideOnSinglePage = true
          }
        } else {
          this._setTableData(result, parameter)
        }
      } catch (e) {
        this._getDataFail(e)
      }
    },
    _dealAsyncData ({ result, parameter }) {
      if (this.afterFilter) {
        const data = this.afterFilter(result, parameter)
        if (data instanceof Promise) {
          return data.then(res => {
            this._setTableData(res, parameter)

          })
        }
        this._dealSyncData(data, parameter)
        return
      }
      this._setTableData(result, parameter)
    }
  }
}