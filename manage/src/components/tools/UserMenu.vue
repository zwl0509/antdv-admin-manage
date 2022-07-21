<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a-badge :dot="show" style="margin:0 10px;" @click="openMessage">
        <img :src="require('@/assets/images/to-do-list.png')" :class="!this.show ? '' : 'image'">
      </a-badge>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" :src="avatar" icon="user"/>
          <span style="font-size: 16px">{{ nickname }}</span>
          <a-icon type="down" style="margin-left: 11px"></a-icon>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <a href="javascript:;" @click="modifyUserInfo">
              <a-icon type="user"/>
              <span>智装帐号</span>
            </a>
          </a-menu-item>
          <a-menu-item key="1">
            <a href="javascript:;" @click="modifyPassword">
              <a-icon type="lock"/>
              <span>修改密码</span>
            </a>
          </a-menu-item>
          <a-menu-item key="2">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <reset-password ref="ResetModal"></reset-password>
    <user-info ref="UserInfo"></user-info>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import NoticeIcon from '@/components/NoticeIcon'
  import resetPassword from '@/views/user/modules/ResetPassword'
  import UserInfo from '@/views/user/modules/UserInfo'

  export default {
    name: 'UserMenu',
    components: {
      NoticeIcon,
      resetPassword,
      UserInfo
    },
    computed: {
      ...mapGetters(['nickname', 'avatar'])

    },
    created () {
      this.countIsHasRead()
      window.addEventListener('beforeunload', e => this.websocketclose(e))
    },
    data () {
      return {
        dotMessage: true,
        show: true,
        dataChart: '',
      }
    },
    mounted () {
      this.initWebSocket()
    },
    beforeDestroy () {
 	    window.removeEventListener('beforeunload', e => this.websocketclose(e))
      clearTimeout()
    },
    methods: {
      // 生成uuid
      createUUID(){
        const id = new SnowflakeId()
        return id.generate()
      },
      //初始化weosocket
      initWebSocket(){
        const wsurl = process.env.VUE_APP_WS_URL + `${this.$store.state.user.info.id}`+'&type=manage'
        this.websock = new WebSocket(wsurl)
        this.websock.onmessage = this.websocketonmessage
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      },
      //连接建立之后执行send方法发送数据
      websocketonopen(){
        const actions = {'test':'help'}
        console.log('已连接')
        this.websocketsend(JSON.stringify(actions))
      },
      //连接建立失败重连
      websocketonerror(){
        setTimeout(()=>{
          console.log('正在重新连接......')
          this.initWebSocket()
        },5000)
      },
      // 数据接收 去处理
      websocketonmessage(e){
        const redata = JSON.parse(e.data)
        const key = `open${Date.now()}`
        this.$notification.open({
          message: '待办消息',
          description: '您有一条新的' + redata.description + '消息，待处理！',
          placement: 'bottomRight',
          duration: 5,
          btn: h => {
            return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                on: {
                  click: () => {
                    if(this.$route.name == 'to-do-manage') {
                      this.$router.go(0)
                    }else {
                      this.$router.push('/to-do-manage')
                    }
                    this.$notification.close(key)
                  },
                },
              },
              '去办理',
            )
          },
          key,
          onClose: close,
        })

      },
      //数据发送
      websocketsend(Data){
        this.websock.send(Data)
      },
      //关闭
      websocketclose(e){
        console.log('断开连接',e)

      },
      ...mapActions(['Logout']),
      modifyPassword(){
        this.$refs.ResetModal.visible = true
      },
      // 个人信息
      modifyUserInfo () {
        this.$refs.UserInfo.show()
      },
      handleLogout() {
        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk: () => {
            setTimeout(() => {
              this.$store.dispatch('Logout').then(() => {
                location.reload()
              })
              // this.$router.push('/user/login')
            }, 16)
          },
          onCancel() {
          }
        })
      },
      openMessage() {
        this.$router.push('/to-do-manage')
      },
      // 未读消息数
      countIsHasRead() {
        this.$store.dispatch('countIsHasRead').then((res)=>{
          if(res){
            this.show = true
          }else {
            this.show = false
          }
          setTimeout(()=>{
            this.countIsHasRead()
          },50000)
        }).catch(err=> {
          setTimeout(()=>{
            this.countIsHasRead()
          },50000)
        })
      },
      // 订单提醒列表
      badgeMessageList() {
        this.$refs.ModalMessageList.show()
      },
    }
  }
</script>
<style scoped>
  .user-dropdown-menu{
    height: 64px;
    line-height: 60px;
  }
  .image{
    height: 24px;
    width: 25px;
    animation: twinkle 0.6s infinite alternate;
  }
  @keyframes twinkle {
    0%{
      opacity:1;
    }
    100%{
      opacity:0;
    }
  }
</style>