// eslint-disable-next-line
// import * as loginService from '@/api/login'
// import { sitemapsAuthList } from '@/api/system/sitemaps'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import notification from 'ant-design-vue/es/notification'
import store from '@/store'
import labels from '@/utils/labels'
import router from '@/router'
import { $post } from '@/utils/http-service'
import api from '@/api'
import { MENU_ID } from '@/store/mutation-types'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  MemberManage: PageView,
  SystemSetting: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  //  首页 
  'HomePage': () => import('@/views/index'),

  //  系统配置 
  'SystemSitemaps': () => import('@/pages/system-setting/system-sitemaps'),
  'SystemAppVersion': () => import('@/pages/system-setting/system-app-version'),
  'SystemRoles': () => import('@/pages/system-setting/system-roles'),
  'SystemOrganizations': () => import('@/pages/system-setting/system-organizations'),
  'SystemPosition': () => import('@/pages/system-setting/system-position'),
  'SystemUsers': () => import('@/pages/system-setting/system-user'),
  'SystemCode': () => import('@/pages/system-setting/system-code'),
  'SystemBanner': () => import('@/pages/system-setting/system-banner'),
  'SystemSmsTemplate': () => import('@/pages/system-setting/system-sms-template'),
  'SystemAppQALibrary': () => import('@/pages/system-setting/system-app-QALibrary'),
  'SystemAreaProperties':()=> import('@/pages/system-setting/system-area-properties'),
  'SystemFeedbackRecord':() => import('@/pages/system-setting/system-feedback-record'),

  //  基础数据 
  'SupplierData': () => import('@/pages/basic-data/supplier-data'),
  'WarehouseData': () => import('@/pages/basic-data/warehouse-data'),
  'MaterialQuotaData': () => import('@/pages/basic-data/material-quota-data'),
  'QuotaPackageData': () => import('@/pages/basic-data/quota-package-data'),
  'MaintainCellInfo': () => import('@/pages/basic-data/maintain-cell-info'),
  'WorkerManagement': () => import('@/pages/basic-data/worker-management'),
  'POSTerminalDetails': () => import('@/pages/basic-data/pos-terminal-details'),
  'CollectionTemplate': () => import('@/pages/basic-data/collection-template'),
  'OfferInformation':() => import('@/pages/basic-data/offer-information'),

  //  基础分类 
  'MaterialClassification': () => import('@/pages/basic-classify/material-classification'),
  'SupplierClassification': () => import('@/pages/basic-classify/supplier-classification'),

  //  客户管理 
  'FlyOrderEvasionManage': () => import('@/pages/customer-manage/fly-order-evasion-manage'),
  'DesignPhase': ()=> import('@/pages/customer-manage/design-phase'),
  'ConstructionStage': ()=> import('@/pages/customer-manage/construction-stage'),
  'ProjectCompletion':()=> import('@/pages/customer-manage/project-completion'),
  'PrimitiveCommonSeaPool': ()=> import('@/pages/customer-manage/primitive-common-sea-pool'), // 原始公海池
  'FirstCommonSeaPool': ()=> import('@/pages/customer-manage/first-common-sea-pool'),   // 一见公海池
  'SecondCommonSeaPool': ()=> import('@/pages/customer-manage/second-common-sea-pool'), // 二见公海池
  'AgreementCommonSeaPool': ()=> import('@/pages/customer-manage/agreement-common-sea-pool'), // 待协议公海池
  'AgreementStage': ()=> import('@/pages/customer-manage/agreement-stage'),// 协议公海池
  'ContractStage': ()=> import('@/pages/customer-manage/contract-stage'), // 合同阶段
  'CustomerApply': ()=> import('@/pages/customer-manage/customer-apply'), // 客户申请
  'CommissionManage': ()=> import('@/pages/customer-manage/commission-manage'), // 提成管理
  'YunhuRecordManage': ()=> import('@/pages/customer-manage/yunhu-record-manage'), // 提成管理
  'BudgetManage': ()=> import('@/pages/customer-manage/budget-manage'), // 预算管理
  'WorkerDispatch': ()=> import('@/pages/customer-manage/worker-dispatch'), // 工人派工
  'DecorationMaterialSelect': ()=> import('@/pages/customer-manage/decoration-material-select'), // 装修选材
  
  //  客服管理 
  'ComplaintRecord': ()=> import('@/pages/customer-service-manage/complaint-record'), // 投诉记录
  'RepairRecord': ()=> import('@/pages/customer-service-manage/repair-record'), // 报修记录

  //  员工管理 
  'EmployeeInfo':() => import('@/pages/employee-manage/employee-info'),

  //  待办管理 
  'TodoManage':() => import('@/pages/to-do-manage'),

  //  业务配置 
  'ProcessManage':() => import('@/pages/business-configuration/process-manage'),
  'ConfigInfo':()=> import('@/pages/business-configuration/config-info'),
  'CommonLanguageManage': ()=> import('@/pages/business-configuration/common-language-manage'), // 常用语管理
  'RoyaltyAllocation':()=> import('@/pages/business-configuration/royalty-allocation'),
  'QuestionnaireManage':()=> import('@/pages/business-configuration/questionnaire-manage'), // 问卷管理
  // 'ConstructionTasks':()=> import('@/pages/business-configuration/construction-tasks'),//施工任务
  'ConstructionFormwork':()=>import('@/pages/business-configuration/construction-formwork'),//施工计划模板
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '/',
  component: 'BasicLayout',
  redirect: '/home-page',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (token, targetIds) => {
  // return new Promise((resolve, reject) => {
  const data = {
    targetIds: targetIds,
    // 前后端菜单/导航权限区分。默认：1（后台菜单），0（前台导航栏目）
    backstage: 1
  }
  return $post({
    url: api.auth.getMenuListByTargetId,
    data
  })
    .then(res => {
      const result = res
      const menuNav = []
      const childrenNav = menuTreeDataConvert(result)
      rootRouter.children =  childrenNav
      menuNav.push(rootRouter)
      const routers = generator(menuNav)
      // console.log(routers)
      // 动态设置初始打开页面
      if (routers[0] && routers[0].children[0]) {
        const firstRoute = routers[0].children[0]
        routers[0].redirect = firstRoute.children?.length ? firstRoute.children[0].path : routers[0].children[0].path
      }
      routers.push(notFoundRouter)
      return routers
  })
    .catch(err => {
      notification.error({
        message: labels.NET_ERROR,
        description: err && err.message || labels.RESPONSE_RESULT_EXCEPTION
      })
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          router.push({ path: '/user/login', query: { redirect: router.to.fullPath } })
        }, 1500)
        // next({ path: '/user/login', query: { redirect: to.fullPath } })
      })
      return Promise.reject(err)
  })
  // })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[item.component || item.key]) || RouteView, // (() => import(`@/views/${item.component}`)),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        id: item.id,
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name,
        isShow: item.isShow
      }
    }
    // 是否设置了隐藏菜单
    if ( item.isShow === false ) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace(/\/\//g, '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

const menuTreeDataConvert = (list) => {
  if (list && list.length) {
    list.map(m => {
      m.key = m.key || m.name
      if (m.children && m.children.length) {
        m.children = menuTreeDataConvert(m.children)
      } else {
        m.children && (delete m.children)
      }
    })
    // window.console.log(list,'LIST')
    return list
  }
  return []
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
// eslint-disable-next-line no-unused-vars
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        id: item.id,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // item.children && listToTree(item.children, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
