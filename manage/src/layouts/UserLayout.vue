<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <!-- <div class="top">
        <div class="header">
          <a href="/">
            <img :src="require('../assets/logo.png')" class="logo" alt="logo">
          </a>
        </div>
        <div class="desc">
          <div class="line"></div>
          红蚂蚁项目管理系统
          <div class="line"></div>
        </div>
      </div>-->

      <div class="login-box-container">
        <!--<img :src="require('../assets/images/login-left-bg.png')" alt="">-->
        <div class="login-box">
          <div class="welcome">
            <!--<p>HELLO</p>-->
            <!--<p>欢迎使用后台管理系统</p>-->
          </div>
          <div class="main-container">
            <route-view></route-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RouteView from './RouteView'
  import { mixinDevice } from '@/utils/mixin'

  export default {
    name: 'UserLayout',
    components: { RouteView },
    mixins: [mixinDevice],
    data() {
      return {}
    },
    methods: {
    },
    mounted() {
      document.body.classList.add('userLayout')
    },
    beforeDestroy() {
      document.body.classList.remove('userLayout')
    }
  }
</script>

<style lang="scss" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: $primaryColor;
      background-size: 100% 100%;
      /*padding: 50px 0 100px;*/
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        text-decoration: none;
      }

      .top {
        text-align: center;
        .header {
          height: 55px;
          line-height: 55px;

          .logo {
            height: 55px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }
        }

        .desc {
          font-size: 24px;
          color: #f1f9fe;
          margin-top: 20px;
          margin-bottom: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          .line{
            width: 60px;
            height: 1px;
            background: #f1f9fe;
            margin: 5px 20px 0;
          }
        }
      }

      .login-box-container{
        width: 55%;
        min-width: 1394px;
        margin: 0 auto;
        position: relative;
        min-height: 714px;
        background-color: #f1f9fe;
        border-radius: 16px;
        box-shadow: 0px 16px 60px 0px rgba(0, 0, 0, 0.5);
        img{
          width: 100%;
        }
        .login-box{
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          .welcome{
            background: url("~@/assets/images/login-left-bg.png") no-repeat left top;
            background-size:100% auto;
            width: 55%;
            padding: 8% 0 0 6%;

            p:first-child{
              font-size: 50px;
              font-weight:500;
              color:rgba(102,102,102,1);
              margin-bottom: 20px;
            }
            p:last-child{
              font-size:30px;
              font-weight:500;
              color:rgba(102,102,102,1);
            }
          }
          .main-container{
            width: 45%;
            padding: 6% 7.4% 0 12px;
            .main {
              width: 100%;
              min-width: 260px;
              margin: 0 auto;
            }
          }

        }
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;

            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }

        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
  @media screen and (max-width: 1660px){
    #userLayout.user-layout-wrapper .container .login-box-container{
      min-width: 1205px;
      min-height: 540px;
    }
  }
  @media screen and (max-width: 1366px){
    #userLayout.user-layout-wrapper .container .login-box-container{
      min-width: 991px;
      min-height: 400px;
    }
  }
  @media screen and (max-width: 1280px){
    #userLayout.user-layout-wrapper .container .login-box-container{
      min-width: 929px;
      min-height: 360px;
    }
  }
</style>
