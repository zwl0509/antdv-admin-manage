// 后台接口地址
const api = {
	common: {
		getCodeByType: '', // 根据code获取code数据
		upload: '/common/attachment/uploadFiles', //上传文件
		uploadImg: '/common/attachment/uploadSingleFile', //上传图片
		getAuthSiteMapByTargetId: '/auth/getAuthSiteMapByTargetId', //获取菜单权限 -- Aimer
	},
	//登录认证
	AuthUser: {
		login: '/auth/login', //员工编号登录
		getCurrentUser: '/auth/getCurrentUser', //获取当前用户
		updatePw: '/auth/updatePassword', //修改密码
		getList: "/auth/getList", //获取功能管理列表 -- Aimer
		getAuthActionByTargetIds: '/auth/getAuthActionByTargetIds', //根据菜单获取按钮权限 -- Aimer
		setZhiZInfo: '/auth/setZhiZInfo', //设置智装erp账号
		updatePhone:'/business/employee/updatePhone',//修改员工手机号
	},
	// 云呼号码导入
	CloudCallInfo:{
		getCloudPhone:'/cloudCall/getCloudPhone/{customerId}',//获取云呼手机号 -- Lionel
	},
	//客服信息
	CustomerServiceInfo:{
		getList:'/complain/csComplaintRecordInfo/getList',//获取保修信息列表
		getDetail:'/complain/csComplaintRecordInfo/getDetail',//获取报修信息详情 
		dispatch:"/complain/csComplaintRecordInfo/dispatch",//新增编辑派单信息
		getHistoryList:'/complain/csComplaintRecordInfo/getHistoryList',//获取报修信息列表 -- Ray
	},
	//员工管理
	Employee: {
		delEmployee: '/business/employee/del/{id}', //删除员工
		editEmployee: '/business/employee/edit', //新增编辑员工
		getDetail: '/business/employee/getDetail/{id}', //获取员工详情
		getList: '/business/employee/getList', //获取员工信息列表
		employeeFeedback: '/business/employee/employeeFeedback', //员工反馈
		updateInfo: '/business/employee/UpdateAvatarOrNickName', //修改员工头像或昵称
		getEasyList: '/business/employee/getEasyList', //获取员工简略信息列表 -- Ray
	},
	//APP问题答疑
	SysAppQuestionAnswerLibrary: {
		getList: '/system/appQuestionAnswerLibrary/getList', //常见问题
	},
	//资源客户信息
	CustomInfo: {
		getList: '/basic/resourceCustomer/getList', //获取 资源客户信息 -- Aimer
		getFollowList: '/basic/resourceCustomer/getFollowList', ///获取 资源客户 跟进信息列表 -- Aimer
		edit: '/basic/resourceCustomer/edit', //新建/编辑 资源客户信息 -- Aimer
		delFollowInfo: '/basic/resourceCustomer/delFollowInfo/{id}', //删除 资源客户跟进信息 -- Aimer
		editFollowInfo: '/basic/resourceCustomer/editFollowInfo', //新建 资源客户跟进信息 -- Aimer
		getDetail: '/basic/resourceCustomer/getDetail/{id}', //获取客户详情 -- Aimer
		getFollowDetail: '/basic/resourceCustomer/getFollowDetail/{id}', //获取 资源客户 跟进信息详情 -- Aimer
		getOrg: '/basic/resourceCustomer/getOrg', //获取新建资源客户门店
		chooseCustomer: '/basic/resourceCustomer/chooseCustomer', //绑定/指派客户/剔除 -- Aimer
		assignEmployeeList: '/basic/resourceCustomer/assignEmployeeList', //获取指派人
		promoteCustomer: '/basic/resourceCustomer/promoteCustomer', //绑定/指派客户/剔除
		futureHouseApply: '/basic/resourceCustomer/futureHouseApply', //期房申请
		flyerApply: '/basic/resourceCustomer/flyerApply', //飞单申请
		trackingCustomer: '/basic/resourceCustomer/trackingCustomer', //客户跟进
		getTrackingList: '/basic/resourceCustomer/getTrackingList', //获取目标客户跟进信息列表 -- Aimer
		audit: '/basic/resourceCustomer/audit', //客户相关信息通用审核 -- Aimer
		getCustomerAuditLog: '/basic/resourceCustomer/getCustomerAuditLog', //获取当前客户审核最新一条 -- Aimer
		keepApply: '/basic/resourceCustomer/keepApply', //保留申请
		getAuditLogInfo: '/basic/resourceCustomer/getAuditLogInfo', //客户审核列表 -- Aimer
		getAuditLogInfoDetail: '/basic/resourceCustomer/getAuditLogInfoDetail/{id}', //客户申请详情 -- Aimer
		getTrackingListDetail: '/basic/resourceCustomer/getTrackingListDetail/{id}', //获取 客户跟进信息详情 -- Aimer
		getRandCustomer: '/basic/resourceCustomer/getRandCustomer', //捞取
		customerStageApply: '/basic/resourceCustomer/customerStageApply', //移交设计部
		getFlyOrEvasionOrderList: '/basic/resourceCustomer/getFlyOrEvasionOrderList', //飞单 / 逃单获取列表
		deletedFlyOrEvasion: '/basic/resourceCustomer/deletedFlyOrEvasion/{id}', //删除飞单逃单
		getCustomerFlyOrEvasion: '/basic/resourceCustomer/getCustomerFlyOrEvasion', //获取当前客户 飞单 / 逃单 审核最新一条 -- Aimer
		auditFlyOrEvasion: '/basic/resourceCustomer/auditFlyOrEvasion', //飞 / 逃 单 /复活 审核 -- Aimer
		delCustomers: '/basic/resourceCustomer/delByIds', // post 原始公海池 删除
		getFlyOrEvasionDetail: '/basic/resourceCustomer/getFlyOrEvasionDetail/{id}', // 获取客户飞单或逃单详情
		getCustomerFlyOrEvasionList: '/basic/resourceCustomer/getCustomerFlyOrEvasionList', // 获取客户飞单逃单申请记录
		getRepeatRecord:'/basic/resourceCustomer/getRepeatRecord',//日志列表
		unRead:'/basic/resourceCustomer/unRead',//消息提示
	},
	CustomerAuditInfo:{
		uploadAttach:"/basic/resourceCustomer/uploadAttach",//业务员或设计经理上传附件
	},
	toDealWith: {
		getToDealWithList: '/toDealWith/getToDealWithList', //获取待办事项 -- Aimer
		getActionId: '/toDealWith/getActionId', //获取按钮id -- Aimer
		toDealWithIsView: '/toDealWith/toDealWithIsView/{id}', //待办事项已读 -- Aimer
	},
	//客户流程信息
	CustomWorkFlowInfo: {
		editCustomerRelatedEmployee: '/customer/customerBaseInfo/editCustomerRelatedEmployee', //（批量）变更客户相关员工信息 -- Ray
		customerBindDesignContract: '/customer/customerBaseInfo/customerBindDesignContract', //客户绑定设计协议 -- Ray
		customerUpdateWorkFlowNode: '/customer/customerBaseInfo/customerUpdateWorkFlowNode', //客户执行流程 -- Ray
		getDesignNoList:'/customer/customerBaseInfo/getDesignNoList',//获取设计协议号列表 -- Ray
		customerBindBuildContract:'/customer/customerBaseInfo/customerBindBuildContract',//客户绑定施工合同 -- Ray
		getBuildContract:'/customer/customerBaseInfo/getBuildContract/{constructionContractId}',//获取施工合同详情 -- Ray
	},
	//问卷信息
	CustomerSurveyInfo:{
		submitSurvey:'/customer/customerSurvey/submitSurvey',//提交问卷
		submitSurveyByWeb:'/customer/customerSurvey/submitSurveyByWeb',//提交问卷h5
		getSurveyDetail:'/customer/customerSurvey/getSurveyDetail/{surveyType}',//获取阶段审核问卷
		getSurveyDetailById:'/customer/customerSurvey/getSurveyDetailById/{id}',//验收问卷
		getQuestionByIds:'/customer/customerSurvey/getQuestionByIds',//根据问题ids获取问题列表 -- Ray
		getSurveyQrCode:'/customer/customerSurvey/getSurveyQrCode',//获取二维码
	},
	//消息记录
	SysMessage: {
		getList: '/sysmessageinfo/sys-message-info/getList', //获取消息类型列表 -- Aimer
		getTypeList: '/sysmessageinfo/sys-message-info/getTypeList', //根据类型获取消息 -- Aimer
		oneKeyRead: '/sysmessageinfo/sys-message-info/oneKeyRead', //一键已读 -- Aimer
	},
	//通用基础信息
	BasicCommonInfo: {
		getList: '/basic/commonInfo/getList', //查询优惠活动列表 - Ray
	},
	//客户巡检信息
	CustomerInspectionRecordInfo:{
		edit:'/customer/customerInspectionRecord/edit',//新增/编辑巡检记录 -- Ray
		getList:'/customer/customerInspectionRecord/getList',//查询巡检记录列表 -- Ray
		getDetail:'/customer/customerInspectionRecord/getDetail/{id}',//查询巡检记录详情 -- Ray
		editStandard:'/customer/customerInspectionRecord/editStandard',//新增标准巡检记录 -- Ray
		getStandardInspectionInfo:'/customer/customerInspectionRecord/getStandardInspectionInfo/{inspectionId}',//查询标准巡检记录问卷列表 -- Ray
	},
	System: {
		getList: '/system/code/getList', //获取数据字典列表
	},
	//小区基本信息
	AreaInfo: {
		getAreaInfoByLevel: '/basic/areaInfo/getAreaInfoByLevel', //获取地域信息 -- Aimer
		getAreaInfoList: '/basic/areaInfo/getAreaInfoList', //获取地域信息 -- Aimer
		getResidenceList: '/basic/areaInfo/getResidenceList', //获取小区信息 -- Aimer
	},
	//组织机构
	SysOrganization: {
		getTreeMap: '/system/organizations/getTreeMap', //获取组织机构树状列表
		getList:'/system/organizations/getList',//获取职位信息表列表 -- WindChaser
	},
	//常用语
	CommonWords: {
		getList: '/basic/commonWords/getList', //获取常用语列表
	},
	//工人信息
	WorkerInfo:{
		getList:'/basic/worker/getWorkerInfoList',//获取工人信息列表 -- Aimer
		getMaterialInfoList:'/basic/worker/getMaterialInfoList',//获取材料信息列表 -- Ray
		getMaterialInfoById:'/basic/worker/getMaterialInfoById/{id}',//获取材料信息列表 -- Ray
	},
	//工人派工信息
	CustomerWorkerDispatchInfo:{
		getAppCustomerDispatchInfo:'/worker/customerWorkerDispatchInfo/getAppCustomerDispatchInfo',//APP获取客户派工信息 -- Ray
		dispatch:'/worker/customerWorkerDispatchInfo/dispatchApp',//工人派工 -- Ray
		getCustomerDispatchInfo:'/worker/customerWorkerDispatchInfo/getCustomerDispatchInfo',//获取客户派工信息 -- Ray
		verify:'/worker/customerWorkerDispatchInfo/verify',//工人验证 -- Ray
	},
	//通用客户信息
	CommonCustomInfo:{
		getCustomerInfoList:'/common/customerCommon/getCustomerInfoList',//获取客户列表(无视野限制) -- Ray
	},
	//客户选材信息
	CustomerChooseMaterialInfo:{
		getList:'/material/customerChooseMaterialInfo/getAppList',//客户选材信息查看 -- Ray
		edit:'/material/customerChooseMaterialInfo/edit',//客户选材信息保存 -- Ray
		reset:'/material/customerChooseMaterialInfo/reset',//客户选材信息重置 -- Ray
		confirm:'/material/customerChooseMaterialInfo/confirm',//客户选材信息确认 -- Ray
		delByIds:'/material/customerChooseMaterialInfo/delByIds',//客户选材信息删除 -- Ray
		getAppPackageMaterials:'/material/customerChooseMaterialInfo/getAppPackageMaterials',//客户预算主材包材料信息获取（带分类 )-- Ray
		getPromotionMaterialsWithClass:'/material/customerChooseMaterialInfo/getPromotionMaterialsWithClass',//客户活动材料信息获取（带分类） -- Ray
		getPackages:'/material/customerChooseMaterialInfo/getPackages',//获取所有主材包 -- Ray
		getChooseMaterialDetail:'/material/customerChooseMaterialInfo/getChooseMaterialDetail/{id}',//客户选材信息材料详情查看 -- Ray
		importBudMaterial:'/material/customerChooseMaterialInfo/importBudMaterial/{customerId}',//一键导入客户选材预算 -- Ray
		getListForBrand:'/material/customerChooseMaterialInfo/getListForBrand',//客户选材信息查看(带品牌分类) -- Ray
	},
	// 施工计划
	CustomerConstructionTaskInfo: {
		getTaskList: '/construction/customerConstructionTaskInfo/getCustomerTaskList/{customerId}', // get 获取客户施工任务列表信息
		getTaskDetail: '/construction/customerConstructionTaskInfo/getCustomerTaskExtendsInfo/{customerConstructionTaskId}', // get 获取任务详情
		startOrEnd: '/construction/customerConstructionTaskInfo/startOrEnd', // post 开工/完工
		delay: '/construction/customerConstructionTaskInfo/delay', //post 延期
		getConstructionPlanStopInfo: '/construction/customerConstructionTaskInfo/getConstructionPlanStopInfo', // post 获取停复工列表信息
		createShutDownApply: '/construction/customerConstructionTaskInfo/constructionPlanStop', // post 新增停工申请
		shutDownAudit: '/construction/customerConstructionTaskInfo/auditConstructionPlanStop', // post 审核停复工
		getCustomerBuildList:"/construction/customerConstructionTaskInfo/getCustomerBuildList",//获取客户已完工/未完工列表 -- Lionel
		getConstructionPlanStopDetailInfo:"/construction/customerConstructionTaskInfo/getConstructionPlanStopDetailInfo/{id}",//获取施工计划停工/复工列表信息 -- Lionel
		getCheckTypeList:'/construction/customerConstructionTaskInfo/getCheckTypeList/{customerId}',//查询客户验收类型列表 -- Lionel
		getCheckList:"/construction/customerConstructionTaskInfo/getCheckList/{customerConstructionTaskId}",//查询客户验收列表 -- Lionel
		customerTaskUrge:"/construction/customerConstructionTaskInfo/customerTaskUrge",//催办
		constructionTaskCheck:'/construction/customerConstructionTaskInfo/constructionTaskCheck',//施工任务验收
		editRectification:'/customer/customerInspectionRecord/editRectification',//编辑客户整改信息 -- Lionel
		getRectificationDetail:'/customer/customerInspectionRecord/getRectificationDetail',//查看整改信息
		rectificationReply:"/customer/customerInspectionRecord/rectificationReply",//整改信息回复
		getCustomerRectificationList:'/customer/customerInspectionRecord/getCustomerRectificationList',//客户整改列表
	},
	//材料确认信息
	MaterialConfirmInfo:{
		masterMaterialInfo:'/customer/materialConfirm/masterMaterialInfo/{customerId}',//获取材料确认主材申请状况
		getBillMaster:'/customer/materialConfirm/getBillMaster/{customerId}',// 获取材料确认 材料清单
		getBillMasterDetail: '/customer/materialConfirm/getBillMasterDetail/{billMasterId}', // get 材料明细
		deliveryNotice: '/customer/materialConfirm/deliveryNotice', // post 送货通知
		deliveryPrivilege: '/customer/materialConfirm/deliveryPrivilege', // post 特权送货
		allConfirmBatch: '/customer/materialConfirm/allConfirmBatch', // post 批量确认
		allConfirm: '/customer/materialConfirm/allConfirm', // post 材料确认
	},
	//辅材申报信息
	AuxiliaryMaterialsInfo:{
		edit:'/material/auxiliaryMaterialsInfo/edit',//申报/修改/提交材料申报单据 材料申报信息新增/编辑 -- Ray
		getStockList:"/material/auxiliaryMaterialsInfo/getStockList",//获取仓库列表 -- Ray
		getMaterialsWithClassify:'/material/auxiliaryMaterialsInfo/getMaterialsWithClassify',//获取对应仓库的带分类材料 -- Ray
		getStockManager:'/material/auxiliaryMaterialsInfo/getStockManager',//获取仓库管理员 -- Ray
		getDeclarationList:'/material/auxiliaryMaterialsInfo/getDeclarationList',//获取客户材料申报单据列表 -- Ray
		addMaterial:'/material/auxiliaryMaterialsInfo/addMaterial',//单据 添加材料 -- Ray
		getStockMaterials:'/material/auxiliaryMaterialsInfo/getStockMaterials',//获取客户对应仓库已申报的材料 -- Ray
	},
	//文明出库
	civilizedDelivery:{
		getDetail:'/material/civilizedDeliveryInfo/getDetail/{id}',// 文明材料申请记录详情
		getList:'/material/civilizedDeliveryInfo/getList',// 文明材料申请记录列表
		getMaterialClassList:'/material/civilizedDeliveryInfo/getMaterialClassListWithChildren',// 获取材料分类列表（带子集数据）
	},
	// 材料测量通知
	measureNotifyInfo:{
		getNotifiedList: '/material/measureNotify/getNotifiedList',// 获取已通知列表
		notMeasure: '/material/measureNotify/notMeasure',// 转不测量
		sendMeasureNotify: '/material/measureNotify/sendMeasureNotify',// 发送测量通知
		getSupplyInfo:'/material/customerChooseMaterialInfo/getListForSupply',//获取供应商列表
	}
}

export default api
