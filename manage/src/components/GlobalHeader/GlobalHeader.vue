<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header v-if="visible" :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]" :style="{ padding: '0' }">
        <div v-if="mode === 'sidemenu'" class="header ">
          <!--<div style="min-width: 310px">-->
          <!--  <logo/>-->
          <!--</div>-->
          <!--<a-row style="flex: 2">-->
          <!--<a-col :span="3" style="min-width: 310px">-->
          <!--</a-col>-->
          <a-col :span="2" style="line-height: 32px">
            <a-icon v-if="device==='mobile'" class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle"/>
            <a-icon v-else class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggle" style="margin-top: 4px;line-height: 60px"/>
          </a-col>
          <a-col :span="14">
            <s-breadcrumb style="width:100%; line-height: 64px; font-size: 16px;"/>
          </a-col>
          <a-col :span="8">
            <user-menu></user-menu>
          </a-col>
          <!-- </a-row> -->
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <logo class="top-nav-header" :show-title="device !== 'mobile'"/>
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme"/>
              <a-icon v-else class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle"/>
            </div>
            <user-menu class="header-index-right"></user-menu>
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
  import UserMenu from '../tools/UserMenu'
  import SMenu from '../Menu/'
  import Logo from '../tools/Logo'
  import {
    mixin
  } from '@/utils/mixin'
  import Breadcrumb from '@/components/tools/Breadcrumb'

  export default {
    name: 'GlobalHeader',
    components: {
      's-breadcrumb': Breadcrumb,
      UserMenu,
      SMenu,
      Logo
    },
    mixins: [mixin],
    props: {
      mode: {
        type: String,
        // sidemenu, topmenu
        default: 'sidemenu'
      },
      menus: {
        type: Array,
        required: true
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      device: {
        type: String,
        required: false,
        default: 'desktop'
      }
    },
    data () {
      return {
        visible: true,
        oldScrollTop: 0
      }
    },
    mounted () {
      document.addEventListener('scroll', this.handleScroll, {
        passive: true
      })
    },
    methods: {
      handleScroll () {
        if (!this.autoHideHeader) {
          return
        }

        const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
        if (!this.ticking) {
          this.ticking = true
          requestAnimationFrame(() => {
            if (this.oldScrollTop > scrollTop) {
              this.visible = true
            } else if (scrollTop > 300 && this.visible) {
              this.visible = false
            } else if (scrollTop < 300 && !this.visible) {
              this.visible = true
            }
            this.oldScrollTop = scrollTop
            this.ticking = false
          })
        }
      },
      toggle () {
        this.$emit('toggle')
      }
    },
    beforeDestroy () {
      document.body.removeEventListener('scroll', this.handleScroll, true)
    }
  }
</script>

<style lang="less">
  @import '../index.less';

  .header-animat {
    position: relative;
    z-index: @ant-global-header-zindex;
  }

  .showHeader-enter-active {
    transition: all 0.25s ease;
  }

  .showHeader-leave-active {
    transition: all 0.5s ease;
  }

  .showHeader-enter,
  .showHeader-leave-to {
    opacity: 0;
  }
  .flex-header{
    display: flex;
    align-items: center;
  }
</style>
