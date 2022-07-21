/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'
import { defaultErrorMessage } from '@/utils/common'
import { $post } from '@/utils/http-service'
import api from '@/api'
import { MENU_ID } from '@/store/mutation-types'
// import {  }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      const { token, targetIds } = data
      return generatorDynamicRouter(token, targetIds).then(routers => {
        commit('SET_ROUTERS', routers)
        return routers
      })
    },
    GetActionAuth () {
      // return new Promise(resolve => {
        const menuId = localStorage.getItem(MENU_ID)
        const targetIds = localStorage.getItem('targetIds')
        const data = {
          sitemapId: menuId,
          targetIds: JSON.parse(targetIds)
        }
        return $post({
          url: api.auth.getMenuActionListByTargetIds,
          data
        })
        // getAuthActionByTargetIds(data)
        //   .then(res => {
          // if (res.code === 200) {
          //   resolve(res.result)
          // }
        // })
        .catch(err => {
          defaultErrorMessage(err, '页面权限加载失败')
          return Promise.reject(err)
        })
      // })
    }
  }
}

export default permission
