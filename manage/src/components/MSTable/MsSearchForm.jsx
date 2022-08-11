
export default {
  name: 'MsSearchForm',
  props: {
    /**
     * 头部搜索card的body-style
     */
    searchCardStyle: {
      type: [String, Object],
      default: () => ({})
    },
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    reset () {
      this.form.resetFields()
      this.$emit('reset')
    },
    submit () {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.$emit('queryData', values)
        } else {
          console.log(errors)
        }
      })
    }
  },
  render () {
    return (<a-card bordered={false} bodyStyle={this.searchCardStyle}>
      <div class="table-page-search-wrapper table-search-wrapper">
        <a-form layout="inline" form={this.form}>
          <a-row gutter={48}>
            {Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>))}
            <a-col md={6} sm={24} style="float: right;">
              <span class="table-page-search-submitButtons table-search-btns" style={{ float: 'right', overflow: 'hidden' }}>
                <a-button type="primary" icon="search" onClick={ () => this.submit()}>查询</a-button>
                <a-button style="margin-left: 8px" icon="redo" onClick={() => this.reset()}>重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>)
  }
}
