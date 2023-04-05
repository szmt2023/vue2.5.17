const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup')
const uglify = require('uglify-js')

// 1. 创建 dist 目录
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

// 生成 rollup 配置对象（各种类型的 rollup 配置对象）
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',') // why split ","?
  builds = builds.filter((b) => {
    return filters.some((f) => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter((b) => {
    return b.output.file.indexOf('weex') === -1 // 打包 web 平台
  })
}

build(builds)

function build(builds) {
  let built = 0
  const total = builds.length
  // next 方法（good）
  // 一个一个遍历出来
  const next = () => {
    buildEntry(builds[built])
      .then(() => {
        built++
        if (built < total) {
          next()
        }
      })
      .catch(logError)
  }

  next()
}

function buildEntry(config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /min\.js$/.test(file)
  // 通过 rollup 的 js api 进行构建
  // rollup.rollup 返回一个 Promise，该 Promise 解析为具有各种属性和方法的 bundle 对象
  return rollup
    .rollup(config) // config => inputOptions 对象   input、external、plugins
    .then((bundle) => bundle.generate(output)) // 输出选项对象    file,format, banner,name
    .then(({ code }) => {
      // 生产环境对 js 进行压缩，然后写入到文件中并且 gzip 压缩
      if (isProd) {
        var minified =
          (banner ? banner + '\n' : '') +
          uglify.minify(code, {
            output: {
              ascii_only: true
            },
            compress: {
              pure_funcs: ['makeMap']
            }
          }).code
        return write(file, minified, true)
      } else {
        // 直接写入文件
        return write(file, code)
      }
    })
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  // 这是怎么表示的？
  // 是一个转义序列  \x1B是不可打印控制字符 的代码escape
  // 'blue'      : '\x1B[34m', // 蓝色
  // 'bright'    : '\x1B[1m', // 亮色
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
