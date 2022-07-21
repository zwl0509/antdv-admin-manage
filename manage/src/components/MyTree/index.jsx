import { Empty, Icon, Input } from 'ant-design-vue'
import labels from '@/utils/labels'

const { Search } = Input

export default {
  name: 'MyTree',
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    search: {
      type: Boolean,
      default: false
    },
    action: {
      type: Boolean,
      default: false
    },
    actionAuth: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: [String, Object],
      default: labels.NO_DATA
    },
    textName: {
      type: String,
      default: 'name'
    },
    authKeys: {
      type: [Object, Array],
      default: () => {
        return {
          add: 'treeAuth.Create',
          edit: 'treeAuth.Modify',
          delete: 'treeAuth.Delete'
        }
      }
    }
  },
  created () {
    this.localOpenKeys = this.openKeys.slice(0)
  },
  data () {
    return {
      localOpenKeys: []
    }
  },
  methods: {
    handlePlus (item) {
      this.$emit('plus', item)
    },
    handleEdit (item) {
      this.$emit('edit', item)
    },
    handleRemove (item) {
      this.$emit('remove', item)
    },
    handleTitleClick (...args) {
      this.$emit('titleClick', { args })
    },

    renderSearch () {
      return (
        <Search
          placeholder="input search text"
          style="width: 100%; margin-bottom: 1rem"
        />
      )
    },
    renderIcon (icon) {
      return icon && (<Icon type={icon}/>) || null
    },
    renderMenuItem (item) {
      return (
        <a-tree-node key={item.key || item.id} title={(item.title || item.name)}></a-tree-node>
      )
    },
    renderItem (item) {
      return item.children ? this.renderItemGroup(item) : this.renderMenuItem(item, item.key)
    },
    renderItemGroup (item) {
      const childrenItems = item.children.map(o => {
        return this.renderItem(o, o.key)
      })
      if (this.action) {
        return (
          <a-tree-node key={item.key || item.id}>
            <div slot="title">
              {item.title || item.name || item.organizationName}
              {item.id === 'top' ? null : item.id
                ? (<a-dropdown>
                  <a className="btn">
                    <a-icon type="ellipsis"/>
                  </a>
                  <a-menu slot="overlay">
                    {this.actionAuth.includes((Array.isArray(this.authKeys) ? this.authKeys[0]  : this.authKeys.add) || 'treeAuth.Create')
                      ? (<a-menu-item
                        key="1" {...{ on: { click: () => this.handlePlus(item) } }}>新增</a-menu-item>) : null}
                    {this.actionAuth.includes((Array.isArray(this.authKeys) ? this.authKeys[1]  : this.authKeys.edit) || 'treeAuth.Modify')
                      ? (<a-menu-item
                        key="2" {...{ on: { click: () => this.handleEdit(item) } }}>编辑</a-menu-item>) : null}
                    {this.actionAuth.includes((Array.isArray(this.authKeys) ? this.authKeys[2]  : this.authKeys.delete) || 'treeAuth.Delete')
                      ? (<a-menu-item key="3">
                        <a-popconfirm title="是否要删除此菜单？"{...{ on: { confirm: () => this.handleRemove(item) } }}>移除
                        </a-popconfirm>
                      </a-menu-item>) : null}

                  </a-menu>
                </a-dropdown>)
                : (<a-dropdown>
                  <a className="btn">
                    <a-icon type="ellipsis"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item key="1" {...{ on: { click: () => this.handlePlus(item) } }}>新增</a-menu-item>
                  </a-menu>
                </a-dropdown>)
              }

            </div>
            {childrenItems}
          </a-tree-node>
        )
      }

      return (
        <a-tree-node key={item.key || item.id}>
          <template slot="title">
            {item.title || item.name || item.organizationName || item[this.textName]}
          </template>
          {childrenItems}
        </a-tree-node>
      )
    }
  },
  render () {
    const { dataSource, search } = this.$props

    let children = dataSource.map(item => {
      return this.renderItem(item)
    })
    if (Array.isArray(children) && !children.length) {
      children = (<a-tree-node style="display: flex;flex-direction: column;pointer-events: none">
        <div slot="title" style="width: calc(100% + 27px);display:flex;justify-content: center;flex: 0 0 auto;">
          <a-empty style="margin-top: -24px" image={Empty.PRESENTED_IMAGE_SIMPLE} description={this.noDataText}></a-empty>
        </div>
      </a-tree-node>)
    }
    return (
      <div className="tree-wrapper">
        <a-spin spinning={this.loading}>
          {search ? this.renderSearch() : null}
          <a-directory-tree ref="refTree" show-icon={false} class="custom-tree" {...{ on: { select: (item, e) => this.$emit('click', item, e) } }} >
            {children}
          </a-directory-tree>
        </a-spin>
      </div>
    )
  }
}
