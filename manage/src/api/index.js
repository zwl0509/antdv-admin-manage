const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  UserInfo: '/user/info',
  mock: {
    getList: '/customer/list',
    getPageList: '/intended/list',
    getListPage: '/process/list',
  },
  // /system/sitemaps/getIdByKey/{key}
  auth: {
    getMenuActionListByTargetIds: '/auth/getAuthActionByTargetIds',//根据菜单获取按钮权限
    getMenuListByTargetId: '/auth/getAuthSiteMapByTargetId',///获取菜单权限
    getUserInfo: '/auth/getCurrentUser',//获取当前用户
    getPersonalAuthChooseList: '/auth/getPersonalSiteMapRelevanceByType',   // 获取个人权限列表
    getAuthChooseList: '/auth/getSiteMapRelevanceByType',//获取权限列表
    resetPwd: '/auth/resetPassword',//修改/重置密码
    setZhiZInfo: '/auth/setZhiZInfo', // post 修改智装信息
    menuAuthEdit: '/auth/siteMapActionAuthority',//菜单功能授权
    getView: '/auth/getView/{id}', // get 获取视野
    getSiteMapAuth: '/auth/getSiteMapAuth', // 
    siteMapActionAuthorityBatch:'/auth/siteMapActionAuthorityBatch',//菜单功能批量授权 -- WindChaser
  },
  // 会员
  member: {
    downloadMember: '/manage/member/downloadMember',// 导出
    delete: '/manage/member/lockOrDelMember/{id}', // 删除
    getDetail: '/manage/member/memberDetail/{id}',  // 获取会员信息详情
    getListPage: '/manage/member/memberList', // 获取会员列表
    exportEmployee: '/organization/employee/downloadEmployee'
  },
  // 标题管理
  columnXManage: {
    getColumnX: '/common/customerCommon/getCustomerTableHead/{type}', // get 获取表头
    editColumnx: '/common/customerCommon/putCustomerTableHead', // post 保存表头 
  },
  // 组织机构管理
  organization: {
    auditStatus:'/system/organizations/audit',//审核组织机构信息
    delete: '/system/organizations/delete/{id}',
    edit: '/system/organizations/edit',
    getDetail: '/system/organizations/getDetail/{id}',
    getListNoPage: '/system/organizations/getListNoPage',
    getListPage: '/system/organizations/pageList',
    getTreeList: '/system/organizations/getTreeMap', // get 组织机构树状列表
    authority: '/system/organizationAuthority/authority',//部门授权
    getAuthority: '/system/organizationAuthority/getAuthority/{id}', // get部门授权视野
    addPersonInCharge: '/system/organizations/addPersonInCharge', // post 批量负责人
  },
  //基础数据
  basicData: {
    posInfo: {
      edit: '/basic/posInfo/edit',// 编辑pos机基本信息
      delete: '/basic/posInfo/delete',// 删除pos机基本信息
      getListPage: '/basic/posInfo/getList',// 获取pos机基本信息
      getDetail: '/basic/posInfo/getDetail/{id}'// 获取pos机基本信息详情
    },
    areaInfo:{
      edit: '/basic/areaInfo/edit',// 编辑小区基本信息
      delete: '/basic/areaInfo/delete',// 删除小区基本信息
      getListPage: '/basic/areaInfo/getList',// 获取小区基本信息
      getDetail: '/basic/areaInfo/getDetail/{id}',// 获取小区基本信息详情
      getResidenceList: '/basic/areaInfo/getResidenceList'// 获取小区信息
    },
    // 材料数据
    materialInfo:{
      edit: '/basic/materialInfo/edit',// 编辑材料
      delete: '/basic/materialInfo/deleteById/{id}',// 删除材料
      getListPage: '/basic/materialInfo/getList',// 获取材料
      getDetail: '/basic/materialInfo/getDetail/{id}',// 获取材料详情
      isOpen: '/basic/materialInfo/updateMaterialSwitch', // post 改变状态
      export: '/basic/materialInfo/materialExport',// 获取材料详情
      import: '/basic/materialInfo/materialImport', // post 改变状态

    },
    receiptTemplate:{
      edit: '/basic/receiptTemplate/editReceiptTemplate',// 编辑收费模板
      delete: '/basic/receiptTemplate/deleteReceiptTemplate/{id}',// 删除收费模板
      deleteDetail: '/basic/receiptTemplate/deleteReceiptTemplateDetail',// 删除收费模板子集
      getListPage: '/basic/receiptTemplate/getList',// 获取收费模板
      getDetail: '/basic/receiptTemplate/getDetailReceiptTemplate/{templateId}',// 获取收费模板详情
      setActive:'/basic/receiptTemplate/setActive'// 是否启用
    },
    worker:{
      edit: '/basic/worker/edit',// 编辑工人基本信息
      delete: '/basic/worker/delete',// 删除工人基本信息
      getListPage: '/basic/worker/getList',// 获取工人基本信息
      getDetail: '/basic/worker/getDetail/{id}',// 获取工人基本信息详情
      isOpen: '/basic/worker/setActive',
      export: '/basic/worker/exportWorker',
      import: '/basic/worker/importWorker'
    },
    // 优惠活动
    promotionInfo:{
      getList:'/basic/promotionInfo/getList',//查询优惠活动列表
      getDetailList: '/basic/promotionInfo/getPromotionDetailInfo', // 获取活动下的材料列表
      getDetail:'/basic/promotionInfo/getDetail/{id}',//查询活动详情
      edit: '/basic/promotionInfo/edit',
      del: '/basic/promotionInfo/deletedPromotion/{id}', // 删除优惠活动
      delMaterials: '/basic/promotionInfo/deletedPromotionDetail', // 删除活动下的材料
      activePromotion: '/basic/promotionInfo/isActive/{id}', // 启用禁用
      uploadMaterials: '/basic/promotionInfo/PromotionDetailImport', // 导入活动下的材料数据
      downloadMaterials: '/basic/promotionInfo/PromotionDetailExport', // 导出材料数据
      downloadMaterialsTemplate: '', // 导出材料数据模板
    },
    packageInfo:{
      getList:'/basic/basicPackageInfo/getList',//获取定额包列表
      getDetail:'/basic/basicPackageInfo/getMasterDetail/{id}',//获取定额包数据详情
      editMaster:'/basic/basicPackageInfo/editMaster',//编辑定额包主表数据
      deleteMaster:'/basic/basicPackageInfo/deleteMasterById/{id}',//删除定额包主数据,
      deleteSlave:'/basic/basicPackageInfo/deleteSlaveById/{id}',//删除定额包明细数据,
      getMasterList:'/basic/basicPackageInfo/getMasterList',//获取定额包主数据列表
      getSlaveList:'/basic/basicPackageInfo/getSlaveList',//获取定额包明细数据列表
      getSlaveDetail:'/basic/basicPackageInfo/getSlaveDetail/{id}',//获取定额包明细数据列表
      isActive:'/basic/basicPackageInfo/isActive/{id}',//启用禁用
      updateSlaveSwitch:'/basic/basicPackageInfo/updateSlaveSwitch',//编辑定额包明细switch状态
      editSlave:'/basic/basicPackageInfo/editSlave',//编辑定额包明细数据
    },
    supplyInfo: {
      getListPage: '/basic/supplyInfo/getList',
      getDetail: '/basic/supplyInfo/getDetail/{id}',
      edit: '/basic/supplyInfo/edit',
      delete: '/basic/supplyInfo/deleteById/{id}',
      isOpen: '/basic/supplyInfo/isActive/{id}', // 是否启用
      // getTreeList: '/basic/supplyClass/SupplyClassList', // get 树状分类列表
    },
    stock: {
      getListPage: '/basic/stock/getList',
      getDetail: '/basic/stock/getDetail/{id}',
      edit: '/basic/stock/edit',
      delete: '/basic/stock/delete',
      getStockManager:'/basic/stock/getStockManager',
      isActive: '/basic/stock/setActive/{id}',
      isLocked: '/basic/stock/setLocked/{id}',
      getStock:'/basic/stock/getStock', // post
    },
    // 材料确认
    materialConfirmInfo: {
      getMaterialDetail: '/customer/materialConfirm/getBillMaster/{customerId}', // get材料到场
      getBillMasterDetail: '/customer/materialConfirm/getBillMasterDetail/{billMasterId}', // get 材料明细
      masterMaterialInfo: '/customer/materialConfirm/masterMaterialInfo/{customerId}', // get 主材申请
      deliveryNotice: '/customer/materialConfirm/deliveryNotice', // post 送货通知
      deliveryPrivilege: '/customer/materialConfirm/deliveryPrivilege', // post 特权送货
      allConfirmBatch: '/customer/materialConfirm/allConfirmBatch', // post 批量确认
      allConfirm: '/customer/materialConfirm/allConfirm', // post 材料确认
    }
  },
  // 客户信息
  customInfo: {
    // 公海池客户
    highSeaPoolCustomer: {
      getListPage: '/customer/highSeaPoolCustomer/getList', // get 列表
      delete: '/customer/highSeaPoolCustomer/delByIds', // 删除
      getDetail: '/customer/highSeaPoolCustomer/getDetail/{id}', // get 详情
      edit:'/customer/highSeaPoolCustomer/edit',//编辑
      editCustomer:'/customer/highSeaPoolCustomer/editCustomerRelatedEmployee',//变更客户相关员工信息
      changeMobileNumber: '/customer/highSeaPoolCustomer/changeMobileNumber', // post 修改手机号
      import:'/customer/highSeaPoolCustomer/importCustomer',//导入客户信息
      export:'/customer/highSeaPoolCustomer/exportCustomer',//导出客户信息
      downloadTemplate:'/customer/highSeaPoolCustomer/downloadTemplate',//下载模板
      handoverCustomer:'/customer/highSeaPoolCustomer/handoverCustomer', // post 移交客户
    },
    // 客户跟踪
    customerTrackingInfo: {
      getListPage: '/customer/customerTrackingInfo/getList', // get 列表
      edit: '/customer/customerTrackingInfo/edit', // 新建or回复
      getMobileNumber: '/customer/customerTrackingInfo/getMobileNumber/{customerId}', // 新建or回复
     },
    // 常用语
    commonWords:{
      getList: '/basic/commonWords/getList', //获取常用语列表
      deleted: '/basic/commonWords/deleted', //删除常用语列表
      edit: '/basic/commonWords/edit', //编辑常用语列表
      getDetail: '/basic/commonWords/getDetail/{id}', //获取常用语详情
    },
    // 资源客户
    resourceCustomer: {
      getListPage: '/customer/resourceCustomer/getList', // get 列表
      delete: '/customer/resourceCustomer/delByIds', // 删除
      getDetail: '/customer/resourceCustomer/getDetail', // get 详情
      edit:'/customer/resourceCustomer/edit',//编辑
    },
    // 意向客户
    intendedCustomInfo: {
      getListPage: '/customer/intendedCustomer/getList', // get 列表
      delete: '/customer/intendedCustomer/delByIds', // 删除
      getDetail: '/customer/intendedCustomer/getDetail/{id}', // get 详情
      edit:'/customer/intendedCustomer/edit',//编辑
      getEvasionDetail: '/customer/intendedCustomer/getEvasionDetail/{customerId}', // get 逃单详情页
    },
    // 材料测量通知
    measureNotifyInfo: {
      getNotifiedList: '/material/measureNotify/getNotifiedList', // get 获取已通知列表
      notMeasure: '/material/measureNotify/notMeasure', // 转不测量
      sendMeasureNotify:'/material/measureNotify/sendMeasureNotify', // 发送测量通知
    },
    // 文明出库
    civilizedDeliveryInfo:{
      getMaterialClassList: '/material/civilizedDeliveryInfo/getMaterialClassList',// get 获取材料分类列表
      getMaterialsByClassId: '/material/civilizedDeliveryInfo/getMaterialsByClassId', // get 获取材料列表
      application: '/material/civilizedDeliveryInfo/application',  // 文明材料申请
      getDetail: '/material/civilizedDeliveryInfo/getDetail/{id}', // get 申请记录详情
      getList: '/material/civilizedDeliveryInfo/getList', // get 申请记录列表
      audit: '/material/civilizedDeliveryInfo/audit', // 文明材料审核
    },
    // 飞单逃单管理
    flyOrEvasionInfo: {
      getListPage: '/customer/flyOrEvasion/getList', // get 列表
      audit: '/customer/flyOrEvasion/audit', // 审核
      delete: '/customer/flyOrEvasion/delById/{id}', // 删除飞/逃单
      export: '/customer/flyOrEvasion/flyOrEvasionExport', // 导出飞/逃单
      getDetail: '/customer/flyOrEvasion/getDetail/{id}', // get 详情
      application:'/customer/flyOrEvasion/application',//飞/逃单申请
    },
    // 审核管理
    customerAuditInfo: {
      getListPage: '/customer/customerAuditInfo/getList',
      audit: '/customer/customerAuditInfo/audit',
      uploadAttach: '/customer/customerAuditInfo/uploadAttach', // post 移交设计部 => 上传附件
      getDetail: '/customer/customerAuditInfo/getDetailWeb/{applicationId}',// 获取审核详情
    },
    // 原始公海池
    customerCommon: {
      getListPage: '/common/customerCommon/getCustomerBindByEmployee', // get 获取当前登录员工所负责的客户列表 
      getRandCustomer: '/common/customerCommon/getRandCustomer', // get 捞取目标客户池随机客户信息并绑定
      chooseCustomer: '/common/customerCommon/chooseCustomer', // post 绑定/指派客户
      application: '/customer/customerAuditInfo/application', // post 客户相关信息通用申请
      audit: '/customer/customerAuditInfo/audit', // post 客户相关信息通用审核
      promote: '/common/customerCommon/promoteCustomer', // post 客户相关信息通用审核
      trackingCustomer: '/common/customerCommon/trackingCustomer', // post 客户跟踪
      getTrackingList: '/common/customerCommon/getTrackingList',// get 客户跟踪列表
      checkWorkFlow: '/common/customerCommon/checkWorkFlow', // get 查看当前客户是否绑定流程
      workFlowDetail: '/common/customerCommon/getCustomerWorkFlowHistoryDetail',// get 工作流程详情
      getLogList:'/common/customerCommon/getList',// 获取客户信息重复记录信息列表
    },
    // 合同信息
    contractInfo: {
      customerBuildContractInfo: '/customer/customerBuildContractInfo/customerBindDesignContract', // post 客户绑定施工合同
      getContractDetail:'/customer/customerBuildContractInfo/getBuildContract/{constructionContractId}',// 获取施工合同详情
      customerDesignContractInfo: '/customer/customerDesignContractInfo/customerBindDesignContract', // post 客户绑定设计协议
    },
    // 提成管理
    customerCommissionInfo: {
      getListPage: '/config/employeeInCustomerInCommissionInfo/getList',
      export:'/config/employeeInCustomerInCommissionInfo/exportCommissions' // 导出
    },
    //
    BasicNoInfo: {
      getList:'/customer/basicDesignNoInfo/getList', // get 设计协议号
    },
    // 云呼记录
    CloudCallRecord: {
      getListPage: '/cloudcall/Record/getLit', // post 
      getDetail: '/cloudcall/Record/getDetail/{id}', // post
    },
    // 客户巡检信息
    customerInspectionRecordInfo:{
      getListPage:'/customer/customerInspectionRecord/getList',  // 查询巡检记录列表
      getDetail:'/customer/customerInspectionRecord/getDetail/{id}', // 查询巡检记录详情
      edit:'/customer/customerInspectionRecord/edit', // 新增/编辑巡检记录
      delete:'/customer/customerInspectionRecord/delById/{id}',// 删除巡检记录
      editStandard:'/customer/customerInspectionRecord/editStandard',// 新增标准巡检记录
      getQuestionInfo:'/customer/customerInspectionRecord/getStandardInspectionInfo/{inspectionId}',// 查询标准巡检记录问卷列表
      getRectificationList:'/customer/customerInspectionRecord/getRectificationList/{inspectionId}',// 查询巡检整改列表
    },
    //工人派工
    workerDispatchInfo:{
      dispatch:'/worker/customerWorkerDispatchInfo/dispatchWeb',// 工人派工
      getList:'/worker/customerWorkerDispatchInfo/getCustomerDispatchInfo',// 查询巡检记录列表
      verify:'/worker/customerWorkerDispatchInfo/verify',// 工人验证
    },
    // 客户选材信息
    chooseMaterialInfo:{
      getCustomer:'/common/customerCommon/getCustomerInfoList',// 获取客户列表(无视野限制)
      confirm:'/material/customerChooseMaterialInfo/confirm',// 客户选材信息确认
      edit:'/material/customerChooseMaterialInfo/edit',// 客户选材信息保存
      reset:'/material/customerChooseMaterialInfo/reset',// 客户选材信息重置
      getList:'/material/customerChooseMaterialInfo/getList', // 客户选材信息查看
      submit:'/material/customerChooseMaterialInfo/submit/{id}',// 客户选材信息提交
      getAreaList:'/material/customerChooseMaterialInfo/getAreaList',// 客户选材信息所属区域查看
      delete:'/material/customerChooseMaterialInfo/delByIds',// 客户选材信息删除
      getPackages:'/material/customerChooseMaterialInfo/getPackages',// 获取所有主材包
      getPackageMaterials:'/material/customerChooseMaterialInfo/getPackageMaterials',// 客户预算主材包材料信息获取
      getPromotionMaterials:'/material/customerChooseMaterialInfo/getPromotionMaterials',// 客户活动材料信息获取
      getDetail:'/material/customerChooseMaterialInfo/getChooseMaterialDetail/{id}',// 客户活动材料信息获取
      import:'/material/customerChooseMaterialInfo/importBudMaterial/{customerId}'// 一键导入客户选材预算
    },
    // 客户验收信息
    acceptanceInfo: {
      getListPage: '/construction/customerConstructionTaskInfo/getCustomerBuildList', // post 已完工or未完工
      getCheckTypeList: '/construction/customerConstructionTaskInfo/getCheckTypeList/{customerId}', // get 客户验收类型列表
      getCheckList: '/construction/customerConstructionTaskInfo/getCheckList/{customerConstructionTaskId}',// get 客户验收列表
      editRectification: '/customer/customerInspectionRecord/editRectification', // post 编辑客户整改信息
      getRectificationDetail: '/customer/customerInspectionRecord/getRectificationDetail', // post 获取详情
    }
  },
  // 材料申报
  materialDeclare:{
    // 辅材申报信息
    auxiliaryMaterialsInfo:{
      edit: '/material/auxiliaryMaterialsInfo/edit', // 申报/修改/提交材料申报单据 材料申报信息新增/编辑
      getDetail: '/material/auxiliaryMaterialsInfo/getDeclarationDetail/{declarationId}', // 获取客户材料申报单据详情
      getDeclarationList: '/material/auxiliaryMaterialsInfo/getDeclarationList', // 获取客户材料申报单据列表
      getMaterialClassList:'/material/auxiliaryMaterialsInfo/getMaterialClassList',// 获取对应仓库的材料分类
      getMaterials:'/material​/auxiliaryMaterialsInfo/getMaterialsWithClassify/{stockId}',// 获取对应仓库的带分类材料
      getStockList:'/material/auxiliaryMaterialsInfo/getStockList',// 获取仓库列表
      getListForBrand:'/material/customerChooseMaterialInfo/getListForBrandForPage',// 客户选材信息查看(带品牌分类)
    },

  },
  // 基础分类
  basicsClass: {
    // 供应商分类
    supplyClass: {
      getListPage: '/basic/supplyClass/getList',
      getDetail: '/basic/supplyClass/getDetail/{id}',
      edit: '/basic/supplyClass/edit',
      delete: '/basic/supplyClass/delete/{id}',
      isOpen: '/basic/supplyClass/setActive', // 是否启用
      getTreeList: '/basic/supplyClass/SupplyClassList', // get 树状分类列表

    },
    // 材料分类
    materialClass:{
      edit: '/basic/materialClassInfo/edit',// post 编辑材料
      delete: '/basic/materialClassInfo/deleteById/{id}',// delete 删除材料
      getListPage: '/basic/materialClassInfo/getList',// get 获取材料
      getTreeList: '/basic/materialClassInfo/getTreeList', // get 树状列表
      getDetail: '/basic/materialClassInfo/getDetail/{id}',// get 获取材料详情
      isOpen: '/basic/materialClassInfo/updateMaterialClassSwitch' // post 是否启用
    },
  },
  // 员工管理
  employeeManage: {
    // 员工信息
    employeeInfo: {
      edit: '/organization/employee/edit',// post 编辑工人基本信息
      delete: '/organization/employee/del/{id}',// delete删除工人基本信息
      getListPage: '/organization/employee/getList',// post 获取工人基本信息
      getDetail: '/organization/employee/getDetail/{id}',// get 获取工人基本信息详情
      import: '/organization/employee/employeeInfoImport',// 员工信息导入
      export: '/organization/employee/employeeInfoExport',// 员工信息导出
      getEasyList: '/organization/employee/getEasyList',// get 员工简略信息
    }
  },
  //待办事项
  toDealWith:{
    getListPage: '/toDealWith/getToDealWithList',// post 获取待办基本信息
    getDetail:'/toDealWith/getExamineDetail',//查看
    haveToDeal:'/toDealWith/haveToDeal',//是否有待办事项
    ignore:'/toDealWith/toDealWithIgnore/{id}',//待办事项忽略
    isView:'/toDealWith/toDealWithIsView/{id}',//待办事项已读
  },
  // 导入日志信息
  logImportInfo:{
    delete: '/log/logImportInfo/delById/{id}',// 删除导入日志信息
    edit: '/log/logImportInfo/edit', // 新增编辑导入日志信息
    getDetail: '/log/logImportInfo/getDetail/{id}', // 获取导入日志信息详情
    getListPage: '/log/logImportInfo/getList',// 获取导入日志信息列表
  },

  //客服信息
  customerServiceInfo:{
    dispatch:'complain/csComplaintRecordInfo/dispatch',// 新增/编辑 派单信息
    getListPage:'complain/csComplaintRecordInfo/getList', // 新增/编辑 报修信息
    edit:'complain/csComplaintRecordInfo/edit',// 获取客户基本信息列表
    getDetail:'complain/csComplaintRecordInfo/getDetail',// 获取报修信息详情
    getCustomerList:'complain/csComplaintRecordInfo/getCustomerList',// 获取报修信息列表
    closeTask:'/complain/csComplaintInfo/closeTask/{id}',// 关闭 报修/检修/投诉 任务
    remindBySelf:'/complain/csComplaintInfo/remindBySelf',// 自定义下次提醒时间
    getDispatch:'/complain/csComplaintRecordInfo/getRecordDispatchs/{recordId}',// 获取报修任务的工单列表
    revisit:'/complain/csComplaintRecordInfo/revisit',// 客服回访记录
    getHistoryList:'/complain/csComplaintRecordInfo/getCustomerRevisitList/{customerId}',// 客户历史回访记录

  },

  //流程管理
  workFlowTypeInfo: {
    getListPage: '/workFlow/workFlowTypeInfo/getList',// post 获取流程管理分类列表
    edit: '/workFlow/workFlowTypeInfo/edit',// post 编辑流程管理分类
    editDetail: '/workFlow/workFlowTypeInfo/editWorkFlowInfoDetail',//编辑流程管理
    getDetailList: '/workFlow/workFlowTypeInfo/getWorkFlowInfoList',//获取流程管理分类详情列表
    getDetail: '/workFlow/workFlowTypeInfo/getDetail/{id}', // get 获取流程详情
    isOpen: '/workFlow/workFlowTypeInfo/enable/{id}', // 是否启用
    customerUpdateWorkFlowNode:'/customer/customerBaseInfo/customerUpdateWorkFlowNode', // post 客户执行流程
  },
  //配置信息
  allocation:{
    // 客户归属规则信息
    customerAscriptionInfo: {
      getListPage:'/customer/configCustomerAscriptionInfo/getList',//获取配置信息列表
      getDetail:'/customer/configCustomerAscriptionInfo/getDetail/{id}',//获取配置信息详情
      edit:'/customer/configCustomerAscriptionInfo/edit',//新增/编辑获取配置信息
      delete:'/customer/configCustomerAscriptionInfo/delById/{id}'//删除配置信息
    },
    // 业绩配置信息
    CommissionInfo: {
      getListPage:'/customer/configCommissionInfo/getList',//获取配置信息列表
      getDetail:'/customer/configCommissionInfo/getDetail/{id}',//获取配置信息详情
      edit:'/customer/configCommissionInfo/edit',//新增/编辑获取配置信息
      delete:'/customer/configCommissionInfo/delById/{id}'//删除配置信息
    },
    //  问卷调查
    surveyInfo: {
      getListPage:'/surveyInfo/getList', // post 获取问卷调查列表
      edit:'/surveyInfo/edit', // post 编辑问卷调查
      delete: '/surveyInfo/delete/{id}', // delete 删除问卷调查
      getDetail: '/surveyInfo/getDetail/{id}', // get 获取问卷调查信息
      updateIsUse:'/surveyInfo/updateIsUse/{id}', // put 变更状态
      getSurveyDetail:'/customer/customerSurvey/getSurveyDetail/{surveyType}', // get 获取问卷详情
      getSurveyDetailById:'/customer/customerSurvey/getSurveyDetailById/{id}', // get 获取问卷详情(id)
      submitSurvey:'/customer/customerSurvey/submitSurvey', // post 提交问卷
      constructionTaskCheck: '/construction/customerConstructionTaskInfo/constructionTaskCheck', // post 施工任务验收
      getQuestionByIds: '/customer/customerSurvey/getQuestionByIds', // post 获取不合格问卷ID
    }
  },
  construction:{
    // 施工任务基础信息表
    basicConstructionTaskInfo:{
      getListPage:'/construction/basicConstructionTaskInfo/getList',// 获取施工任务基础信息
      getDetail:'/construction/basicConstructionTaskInfo/getDetail/{id}',// 获取施工任务基础信息详情
      edit:'/construction/basicConstructionTaskInfo/edit', // 编辑施工任务基础信息
      delete:'/construction/basicConstructionTaskInfo/delete/{id}',// 删除施工任务基础信息
    },
    // 施工任务模板信息表
    basicConstructionTemplateInfo:{
      getListPage:'/construction/basicConstructionTemplateInfo/getList',// 获取施工任务模板信息
      getDetail:'/construction/basicConstructionTemplateInfo/getDetail/{id}',// 获取施工任务模板信息详情
      edit:'/construction/basicConstructionTemplateInfo/edit', // 编辑施工任务模板信息
      delete:'/construction/basicConstructionTemplateInfo/delete/{id}',// 删除施工任务模板信息
    },
    // 客户施工任务信息 => 客户信息
    customerConstructionTaskInfo: {
      getGanttList: '/construction/customerConstructionTaskInfo/getGanttChartInfo',// post获取gantt信息
      edit: '/construction/customerConstructionTaskInfo/edit', // post 编辑施工任务
      startOrEnd:'/construction/customerConstructionTaskInfo/startOrEnd', // 开工/完工
      delay: '/construction/customerConstructionTaskInfo/delay', // post 延期
      createGanttList: '/construction/customerConstructionTaskInfo/createGanttChartInfo',// post gantt信息
      getGanttDetail: '/construction/customerConstructionTaskInfo/getCustomerGanttChartList/{customerId}',// get 客户gantt数据
      getTableData: '/construction/customerConstructionTaskInfo/getCustomerTaskList/{customerId}', // get客户施工计划表
      getTaskDetail: '/construction/customerConstructionTaskInfo/getCustomerTaskExtendsInfo/{customerConstructionTaskId}',// get 获取任务详情
      getResumeWorkPlanList: '/construction/customerConstructionTaskInfo/getConstructionPlanStopInfo', // post 停复工列表
      createShutDownApply: '/construction/customerConstructionTaskInfo/constructionPlanStop', // post 新增停工申请
		  shutDownAudit: '/construction/customerConstructionTaskInfo/auditConstructionPlanStop', // post 审核停复工
      customerTaskUrge: '/construction/customerConstructionTaskInfo/customerTaskUrge', //post 催办
    }
  },

  // 系统设置
  system: {
    // 用户
    user: {
      getListPage: '/system/sysUsers/getList',
      edit: '/system/sysUsers/edit',
      delete: '/system/sysUsers/delete/{id}',
      getDetail: '/system/sysUsers/getDetail/{id}',
      authorityEdit: '/sysUser/Authority/edit', // post 用户管理视野
      getDepartmentView:'/sysUser/Authority/getDepartmentView', // post 获取视野
      getUserView: '/sysUser/Authority/getUserView/{id}', // get 获取用户视野
    },
    // 菜单
    menu: {
      edit: '/system/sitemaps/edit',
      delete: '/system/sitemaps/delete/{id}',
      getDetail: '/system/sitemaps/getDetail/{id}',
      getListPage: '/system/sitemaps/getList',
      getIdByKey: '/system/sitemaps/getIdByKey/{key}', // get 根据key获取ID
      actionDelete: '/system/action/delete/{id}',
      getActionList: '/system/action/getList',
      getActionDetail: '/system/action/getDetail/{id}',
      editAction: '/system/action/edit'
    },
    // 部门组织所属区域
    organizationGroup:{
      edit:'/sysOrganization/group/edit',// 编辑/新增 区域
      delete:'/sysOrganization/group/deleted',// 删除区域
      getDetail:'/sysOrganization/group/getDetail/{id}', // 获取 区域详情
      getListPage:'/sysOrganization/group/getList',// 获取区域列表
    },
    // 角色
    role: {
      getListPage: '/system/roles/getList',
      edit: '/system/roles/edit',
      delete: '/system/roles/delete/{id}',
      getDetail: '/system/roles/getDetail/{id}'
    },
    //职位描述
    partTimeJobLibraryInfo:{
      delete:'/system/partTimeJobLibraryInfo/delete/{id}',//删除职位描述素材库
      edit: '/system/partTimeJobLibraryInfo/edit',//编辑职位描述素材库
      getDetail: '/system/partTimeJobLibraryInfo/getDetail/{id}',//获取职位描述素材库详情
      getListPage: '/system/partTimeJobLibraryInfo/getList',//获取职位描述素材库列表

    },

    // 职位
    position: {
      getListPage: '/system/position/getList',//获取职位信息列表
      edit: '/system/position/edit',//编辑职位信息
      delete: '/system/position/delete/{id}',//删除职位信息
      getDetail: '/system/position/getDetail/{id}',//获取职位信息详情
      isLocked: '/system/position/setLocked/{id}',
    },
    // 应用版本
    appVersion: {
      getListPage: '/system/appVersion/getList',
      edit: '/system/appVersion/edit',
      delete: '/system/appVersion/delete/{id}',
      getDetail: '/system/appVersion/getDetail/{id}'
    },
    banner: {
      getListPage: '/system/banner/getList',
      edit: '/system/banner/edit',
      delete: '/system/banner/delete/{id}',
      getDetail: '/system/banner/getDetail/{id}'
    },
    // 短信
    shortMessage: {
      getListPage: '/system/messageTemplate/getList',
      edit: '/system/messageTemplate/edit',
      delete: '/system/messageTemplate/delete/{id}',
      getDetail: '/system/messageTemplate/getDetail/{id}'
    },
    // 数据字典
    code: {
      getListPage: '/system/code/getList',
      edit: '/system/code/edit',
      delete: '/system/code/delete/{id}',
      getDetail: '/system/code/getDetail/{id}',
      getList: '/system/code/getListNoPage'
    },
    // APP疑难解答
    appQALibrary: {
      getListPage: '/system/appQuestionAnswerLibrary/getList',
      edit: '/system/appQuestionAnswerLibrary/edit',
      delete: '/system/appQuestionAnswerLibrary/delete/{id}',
      getDetail: '/system/appQuestionAnswerLibrary/getDetail/{id}'
    },

    // 设备消息管理
    message: {
      getListPage: '/open/equipmentStateList',   // 获取消息列表
      getDetail: '/open/getEquipmentStateById/{id}',  // 获取消息详情
    },
    //常用语
    commonWords:{
      getList:'/basic/commonWords/getList',//获取常用语列表 -- Aimer
      getDetail :'/basic/commonWords/getDetail/{id}',//获取常用语详情 -- Aimer
      edit:'/basic/commonWords/edit',//编辑常用语列表 -- Aimer
      deleted:'/basic/commonWords/deleted',//删除常用语列表 -- Aimer
    },
    // 反馈记录
    feedback: {
      getListPage: '/Feedback/getFeedbackList'
    }
   
  }

}
export default api
