 // apiServer
// const apiServer = "http://192.168.0.18:9101";
// const apiServer = "http://192.168.0.8:9101";
const apiServer = "http://192.168.0.10:9101";
// const apiServer = "http://192.168.18.64/red-ant-erp-business-api-dev";//dev。
// const apiServer  ="http://222.92.142.228:8000/red-ant-erp-business-api-dev"//sit
// const apiServer = "http://192.168.18.46/red-ant-erp-business-api"
// const apiServer = "http://222.92.142.228:9000/red-ant-erp-business-api"//uat
// socketServer
// const socketServer = "ws://192.168.2.21:9019/websocket/"
// const socketServer = "ws://192.168.0.18:1025"
const socketServer = "ws://222.92.142.228:9000/ws?type=business"
const mqttServer = ''

let mqttSetting = {
	serve: {
		host: '',
		wsport: '8083',
		wssport:'8084',
		path: '/mqtt',
	},
	//MQTT连接的配置
	options: {
		wsOptions: {},
		protocolVersion: 4, //MQTT连接协议版本
		clientId: 'test',
		keepalive: 60,
		clean: true,
		username: '',
		password: ' ',
		reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
		connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
		resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
	}
};

export default{
	apiServer,
	socketServer,
	mqttServer,
	mqttSetting,
}
