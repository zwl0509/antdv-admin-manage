import Vue from 'vue'
import router from './router'
import store from './store'
import { timeFix } from '@/utils/util'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/dom-util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import labels from '@/utils/labels'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const defaultRoutePath = '/home-page'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (!store.getters.userInfo.id) {
        store.dispatch('GetInfo')
          .then(res => {
            // console.log(res)
            const targetIds = []
            targetIds.push(res.id)
            localStorage.setItem('userId', res.id)
            res.organizationList && res.organizationList.forEach(item => {
              targetIds.push(item.id)
            })
            res.roles && res.roles.forEach(item => {
              targetIds.push(item.id)
            })
            /*if (!res.roles) {
              notification.error({
                message: labels.NO_DATA,
                description: '请求用户无权限'
              })
              store.dispatch('Logout').then(() => {
                next({ path: '/user/login', query: { redirect: to.fullPath } })
              })
              return
            }*/
            localStorage.setItem('targetIds', JSON.stringify(targetIds))
            return store.dispatch('GenerateRoutes', { token: Vue.ls.get(ACCESS_TOKEN), targetIds: targetIds }).then((res) => {
              if (res[0].children && res[0].children.length) {
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: to.path })
                }
                // 延迟 1 秒显示欢迎信息
                from.path === '/user/login' && setTimeout(() => {
                  notification.success({
                    message: '欢迎',
                    description: `${timeFix()}，欢迎回来`
                  })
                }, 1000)
              } else {
                store.dispatch('Logout')
                setTimeout(() => {
                  next({ path: '/user/login' })
                }, 1500)
                notification.warning({
                  message: 'Warring',
                  description: `您还没有任何权限，请联系管理员配置权限！`
                })
              }
            })
          })
          .catch((e) => {
            // console.log(e)
            notification.error({
              message: labels.NET_ERROR,
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              setTimeout(() => {
                next({ path: '/user/login', query: { redirect: to.fullPath } })
              })
            }, 1500)
            window.location.reload()
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
