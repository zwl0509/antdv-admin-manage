import Mock from 'mockjs2'
import {
  builder
} from '../util'

const info = (options) => {
  const userInfo = {
    // 'id': '4291d7da9005377ec9aec4a71ea837f',
    // 'name': '天野远子',
    // 'loginName': 'admin',
    // 'password': '',
    // 'avatar': '/avatar2.jpg',
    // 'status': 1,
    // 'telephone': '',
    // 'lastLoginIp': '27.154.74.117',
    // 'lastLoginTime': 1534837621348,
    // 'creatorId': 'admin',
    // 'createTime': 1497160610259,
    // 'merchantCode': 'TLif2btpzg079h15bk',
    // 'deleted': 0,
    // 'roleId': 'admin',
    // 'role': {}
  }
  // role

  return builder(userInfo)
}

// const userNav = (options) => {
//   const nav = [
//     // dashboard
//     // {
//     //   'name': 'dashboard',
//     //   'parentId': null,
//     //   'id': '1',
//     //   'meta': {
//     //     'icon': 'dashboard',
//     //     'title': 'DashBoard',
//     //     'show': true
//     //   },
//     //   'component': 'RouteView',
//     //   'redirect': '/dashboard/workplace'
//     // },
//     // {
//     //   'name': 'workplace',
//     //   'parentId': '1',
//     //   'id': 1001,
//     //   'meta': {
//     //     'title': '工作台',
//     //     'show': true
//     //   },
//     //   'component': 'Workplace'
//     // },
//     // {
//     //   'name': 'Analysis',
//     //   'parentId': '1',
//     //   'id': 1003,
//     //   'meta': {
//     //     'title': '分析页',
//     //     'show': true
//     //   },
//     //   'component': 'Analysis',
//     //   'path': '/dashboard/analysis'
//     // },
//
//     //SystemSetting
//     {
//       'name': 'setting',
//       'parentId': null,
//       'id': 2,
//       'meta': {
//         'icon': 'setting',
//         'title': '系统设置',
//         'show': true
//       },
//       'redirect': '/menu-config',
//       'component': 'SystemSetting'
//     },
//     {
//       'name': 'menu-config',
//       'parentId': null,
//       'id': 3,
//
//       'meta': {
//         'title': '菜单管理',
//         'show': true
//       },
//       'component': 'SystemSitemaps'
//     },
//     {
//       'name': 'table-list',
//       'parentId': null,
//       'id': 4,
//
//       'meta': {
//         'title': '组织机构管理',
//         'show': true
//       },
//       'component': 'SystemOrganizations'
//     },
//     {
//       'name': 'position-config',
//       'parentId': null,
//       'id': 5,
//       'meta': {
//         'title': '职位管理',
//         'show': true
//       },
//       'component': 'SystemPosition'
//     },
//     {
//       'name': 'account-config',
//       'parentId': null,
//       'id': 6,
//       'meta': {
//         'title': '角色管理',
//         'show': true
//       },
//       'component': 'SystemRoles'
//     },
//     {
//       'name': 'user-config',
//       'parentId': null,
//       'id': 7,
//       'meta': {
//         'title': '用户管理',
//         'show': true
//       },
//       'component': 'SytemUsers'
//     },
//     {
//       'name': 'banner-config',
//       'parentId': null,
//       'id': 8,
//       'meta': {
//         'title': 'Banner管理',
//         'show': true
//       },
//       'component': 'SystemBanner'
//     },
//     {
//       'name': 'app-version',
//       'parentId': null,
//       'id': 9,
//       'meta': {
//         'title': '应用版本',
//         'show': true
//       },
//       'component': 'SystemAppVersion'
//     },
//     {
//       'name': 'sms-mode',
//       'parentId': null,
//       'id': 10,
//       'meta': {
//         'title': '短信模块管理',
//         'show': true
//       },
//       'component': 'SystemSmsTemplate'
//     },
//     {
//       'name': 'data-dict',
//       'parentId': null,
//       'id': 11,
//       'meta': {
//         'title': '数据字典',
//         'show': true
//       },
//       'component': 'SystemCode'
//     },
//   ]
//   const json = builder(nav)
//   return json
// }

const userNav = (options) => {
  const nav = [
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'parentId': null,
      'name': 'system-setting',
      'level': 1,
      'component': 'SystemSetting',
      'sequence': 0,
      'meta': {
        'icon': 'anticon anticon-setting',
        'title': '系统管理',
        'show': 1
      }
    },
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4154',
      'parentId': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'name': 'system-roles',
      'level': 2,
      'component': 'SystemRoles',
      'sequence': 0,
      'meta': {
        'icon': '',
        'title': '角色管理',
        'show': 1
      }
    },
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4155',
      'parentId': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'name': 'system-organizations',
      'level': 2,
      'component': 'SystemOrganizations',
      'sequence': 1,
      'meta': {
        'icon': '',
        'title': '组织机构管理',
        'show': 1
      }
    },
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4156',
      'parentId': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'name': 'system-position',
      'level': 2,
      'component': 'SystemPosition',
      'sequence': 2,
      'meta': {
        'icon': '',
        'title': '职位管理',
        'show': 1
      }
    },
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4157',
      'parentId': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'name': 'sytem-users',
      'level': 2,
      'component': 'SytemUsers',
      'sequence': 3,
      'meta': {
        'icon': '',
        'title': '用户管理',
        'show': 1
      }
    },
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4158',
      'parentId': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'name': 'system-code',
      'level': 2,
      'component': 'SystemCode',
      'sequence': 4,
      'meta': {
        'icon': '',
        'title': '数据字典',
        'show': 1
      }
    },
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4159',
      'parentId': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'name': 'system-app-version',
      'level': 2,
      'component': 'SystemAppVersion',
      'sequence': 5,
      'meta': {
        'icon': '',
        'title': '应用版本',
        'show': 1
      }
    },
    {
      'id': 'f3e6fda7bf5f11eaa32a00163e0f4160',
      'parentId': 'f3e6fda7bf5f11eaa32a00163e0f4153',
      'name': 'system-banner',
      'level': 2,
      'component': 'SystemBanner',
      'sequence': 6,
      'meta': {
        'icon': '',
        'title': 'banner信息',
        'show': 1
      }
    }
  ]
  const json = builder(nav)
  return json
}

const userInfo = () => {
  return builder({
    id: 'test_id',
    username: 'test',
    'avatar': '/avatar2.jpg',
    organizationList: [],
    roles: []
  }, '', 200)
}

const menus = () => {
  return builder([
    {
      id: 'menu_test_001',
      parentId: null,
      path: '/home-page',
      name: 'home-page',
      meta: { title: '留言列表', icon: 'home' },
      component: 'HomePage'
    }
    // {
    // id: 'menu_test_002',
    // parentId: null,
    // path: '/manage',
    // name: 'manage',
    // redirect: '/manage/message',
    // meta: { title: '留言管理', icon: 'message' },
    // component: 'RouteView',
    // children: [
    //   {
    //     id: 'menu_test_003',
    //     parentId: null,
    //     path: '/message',
    //     name: 'message',
    //     meta: { title: '留言管理', icon: 'message' },
    //     component: 'MessageBoard/MessageList'
    //   }
    //   ]
    // }
  ], '', 200)
}


Mock.mock(/\/auth\/getCurrentUser/, 'get', userInfo)
Mock.mock(/\/auth\/getAuthSiteMapByTargetId/, 'post', menus)
Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
