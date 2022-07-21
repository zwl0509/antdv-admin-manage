export default {
  data () {
    return {
      fold: false
    }
  },
  methods: {
    foldChange () {
      this.fold = !this.fold
    },
    change (name) {
      this.$emit(name)
    },
    renderFoldSlots (slots) {
      return this.fold ? slots : []
    }
  },
  render () {
    const formSlots = []
    const foldSlots = []
    const slots = Object.keys(this.$slots)
    slots.forEach(m => {
      if (!m.toString().toLowerCase().startsWith('fold')) {
        formSlots.push(this.$slots[m])
      } else {
        foldSlots.push(this.$slots[m])
      }
    })
    return (<div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row gutter={48}>
          {formSlots || null}
          {this.fold ? foldSlots : []}
          <a-col md={6} sm={24} style="float: right;">
            <span class="table-page-search-submitButtons" style={{ float: 'right', overflow: 'hidden' }}>
              <a-button type="primary" icon="search" onClick={ () => this.change('queryData')}>查询</a-button>
              <a-button style="margin-left: 8px" icon="redo" onClick={() => this.change('resetParams')}>重置</a-button>
              {foldSlots.length ? (<a onClick={this.foldChange} style="margin-left: 8px">
                {this.fold ? '收起' : '展开'}
                <a-icon type={this.fold ? 'up' : 'down'}/>
              </a>) : null}
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>)
  }
}
