const path = require('path')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.105:7001',
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => {
    // if (isProd) {
    //   config.externals = {
    //     vue: 'Vue',
    //     'vue-router': 'VueRouter',
    //     vuex: 'Vuex',
    //     axios: 'axios',
    //     marked: 'marked',
    //     'highlight.js': 'hljs',
    //     'vue-text-highlight': 'VueTextHighlight.default',
    //     'vue-virtual-scroller': 'VueVirtualScroller',
    //     dompurify: 'DOMPurify',
    //     vuedraggable: 'vuedraggable',
    //     dexie: 'Dexie'
    //   }
    // }
    config.plugins.push(new MyAppTagManagerHtmlPlugin())
    config.devtool = 'source-map'
  },
  publicPath: '',
  productionSourceMap: false,
  chainWebpack: config => {
    const svgPath = path.resolve('src/assets/svgIcon')
    config.module.rule('svg').exclude.add(svgPath).end()

    config.module
      .rule('svg-icon')
      .test(/\.(svg)(\?.*)?$/)
      .include.add(svgPath)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
      swSrc: './src/common/service-worker.js',
      swDest: 'service-worker.js',
      manifestTransforms: [addCdnFilesToPwaPrecache]
    },
    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa#configuration
    name: 'Starflare',
    themeColor: '#141419',
    msTileColor: '#141419',
    background_color: '#141419',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      background_color: '#141419',
      start_url: '.'
    }
  }
}

const headerFiles = []

const bodyFiles = [
  // {
  //   addDev: true,
  //   tag: 'link',
  //   url: 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css'
  // },
  // {
  //   addDev: true,
  //   tag: 'link',
  //   url:
  //     'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.16.2/build/styles/atom-one-dark.min.css'
  // },
  // {
  //   addDev: true,
  //   tag: 'link',
  //   url:
  //     'https://cdn.jsdelivr.net/npm/vue-virtual-scroller@1.0.0-rc.2/dist/vue-virtual-scroller.css'
  // },
  // {
  //   tag: 'script',
  //   url:
  //     'https://cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/core-js-bundle@3.4.2/minified.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.runtime.min.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/marked@0.7.0/marked.min.js'
  // },
  // {
  //   tag: 'script',
  //   url:
  //     'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.16.2/build/highlight.min.js'
  // },
  // {
  //   tag: 'script',
  //   url:
  //     'https://cdn.jsdelivr.net/npm/vue-text-highlight@2.0.10/dist/vue-text-highlight.min.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/dompurify@2.0.7/dist/purify.min.js'
  // },
  // {
  //   tag: 'script',
  //   url:
  //     'https://cdn.jsdelivr.net/npm/vue-virtual-scroller@1.0.0-rc.2/dist/vue-virtual-scroller.min.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/sortablejs@1.8.4/Sortable.min.js'
  // },
  // {
  //   tag: 'script',
  //   url:
  //     'https://cdn.jsdelivr.net/npm/vuedraggable@2.23.2/dist/vuedraggable.umd.min.js'
  // },
  // {
  //   tag: 'script',
  //   url: 'https://cdn.jsdelivr.net/npm/dexie@2.0.4/dist/dexie.min.js'
  // }
]

const cdnPath = ''
class MyAppTagManagerHtmlPlugin {
  // https://github.com/jantimon/html-webpack-plugin/issues/1001#issuecomment-404762021
  apply(compiler) {
    compiler.hooks.compilation.tap('MyAppTagManagerHtmlPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        'MyAppTagManagerHtmlPlugin',
        (pluginArgs, cb) => {
          console.log('MyAppTagManagerHtmlPlugin Start')
          // You can use either `head` or `body` and either `push` or `unshift`:
          const tryUseCdn = item => {
            const hasHash = /\.[0-f]+\./
            if (item.tagName === 'link' && hasHash.test(item.attributes.href)) {
              const url = cdnPath + item.attributes.href
              item.attributes.href = url
              console.log('Use cdn ' + url)
            }
            if (
              item.tagName === 'script' &&
              hasHash.test(item.attributes.src)
            ) {
              const url = cdnPath + item.attributes.src
              item.attributes.src = url
              console.log('Use cdn ' + url)
            }

            return item
          }
          const addCustomeFile = item => {
            if (item.tag === 'script') {
              console.log('inject ' + item.url)
              return {
                attributes: {
                  type: 'text/javascript',
                  src: item.url
                },
                closeTag: true,
                tagName: 'script'
              }
            }
            if (item.tag === 'link') {
              console.log('inject ' + item.url)
              return {
                attributes: {
                  href: item.url,
                  rel: 'stylesheet'
                },
                selfClosingTag: false,
                tagName: 'link',
                voidTag: true
              }
            }
            const error =
              'MyAppTagManagerHtmlPlugin inject customeFile wrong,only support link,script tag'
            cb(error)
          }
          const addToHeader = isProd
            ? headerFiles
            : headerFiles.filter(item => item.addDev)
          const addToBody = isProd
            ? bodyFiles
            : bodyFiles.filter(item => item.addDev)

          pluginArgs.head = [
            ...pluginArgs.head.map(tryUseCdn),
            ...addToHeader.map(addCustomeFile)
          ]
          pluginArgs.body = [
            ...addToBody.map(addCustomeFile),
            ...pluginArgs.body.map(tryUseCdn)
          ]

          cb(null, pluginArgs)
        }
      )
    })
  }
}

function addCdnFilesToPwaPrecache(originalManifest) {
  const warnings = []
  const files = [...headerFiles, ...bodyFiles]
  const manifest = files.map(item => {
    console.log(`Add CDN PWA cache: ${item.url}`)
    return {
      url: item.url,
      cdn: true
    }
  })
  return { manifest: [...originalManifest, ...manifest], warnings }
}
