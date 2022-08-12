// @ts-nocheck
import store from '@/store';
import variable from '../common/service/variable.js'
export const wsInit = () => {
	connectSocket()
	socketOpen(socketMessage())
	socketClose()
}

	// 创建连接
	function connectSocket() {
		uni.connectSocket({
			url: variable.socketServer +"&userId="+ store.state.vuex_user.id,
			complete: (e)=> {
				// console.log(e);
			}
		});
	}

	// soket连接开启
	function socketOpen(callback = ()=> {}) {
		uni.onSocketOpen(res => {
			console.log('WebSocket连接已打开！');
			callback()
			// 监听收到消息
			
		});
	}

	// 监听soket内容
	function socketMessage() {
		uni.onSocketMessage(res => {
			try {
				const data = JSON.parse(res.data)
				// console.log(data)
				uni.$emit('onSocketMessage', data)
			} catch (e) {
				console.log('收到服务器内容：' + res.data);
			}
		});
	}

	function socketClose() {
		// 监听WS断开，5秒后重连
		uni.onSocketClose((e)=>{
			console.log('已断开..........');
			// console.log(e);
			const timer = setTimeout(()=>{
				connectSocket()
				clearTimeout(timer)
			}, 3000)
		})
	}