const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const Timestamp = new Date().getTime()
const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  publicPath: process.env.VUE_APP_PACKAGE_NAME,
  assetsDir: 'static',
  configureWebpack: {
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `static/js/[name].${Timestamp}.js`,
      chunkFilename: `static/js/[name].${Timestamp}.js`
    },
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {},
    // 文件资源限制解除
    performance: {
      maxEntrypointSize: 4194304, //入口起点的最大体积,整数类型（以字节为单位）
      maxAssetSize: 4194304, //生成文件的最大体积,整数类型（以字节为单位）
      assetFilter: function(assetsFileName) { // 只给出 js 文件的性能提示, 提供资源文件名的断言函数
        return assetsFileName.endsWith('.js')
      }
    }
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })

    }
    // 文件资源限制解除
    // config.performance = {
    //   maxEntrypointSize: 3145728, //入口起点的最大体积,整数类型（以字节为单位）
    //   maxAssetSize: 3145728 //生成文件的最大体积,整数类型（以字节为单位）
    //   // assetFilter: function(assetsFileName) { // 只给出 js 文件的性能提示, 提供资源文件名的断言函数
    //   //   return assetsFileName.endsWith('.js')
    //   // }
    // }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: { // 配置全局less变量
          // less vars，customize ant design theme
          'primary-color': '#b80201',
          // 'link-color': '#585A62',
          // 'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      },
      scss: { // 注入全局scss文件
        additionalData: `@import "~@/global-vars.scss";`
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 9099
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
