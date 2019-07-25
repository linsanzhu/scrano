const path = require('path')
const extensions = require('./extensions')
const downloadmiddlewares = require('./downloadmiddlewares')

const SPIDER_MIDDLEWARES = [ 

]

const DOWNLOAD_MIDDLEWARES = [
    [ downloadmiddlewares.ValidRequestMiddleware, 0, ],
    [ downloadmiddlewares.DefaultRequestHeadersMiddleware, 1, ], 
    [ downloadmiddlewares.DownloadTimeoutMiddleware, 2, ],
    [ downloadmiddlewares.RedirectMiddleware, 3, ],
    [ downloadmiddlewares.RetryMiddleware, 500, ],
]

const ITEM_PIPELINES = [

]

const EXTENSIONS = [
    [ extensions.logger, 'on', ],
]

// 开启日志文件
const LOG_TO_FILE = false

// 日志文件存放目录, 仅 LOG_TO_FILE = true 时有效
const LOG_DIR = path.resolve('./log')

// 重定向最大深度, 仅在 REDIRECT_ENABLED = true 时有效, 默认3
const MAX_REDIRECT_DEEPTH = 3

// 超时时间(秒)
const REQUEST_TIMEOUT = 120

// 是否启用重试
const RETRY_ENABLED = true

// 最大重试次数
const MAX_RETRY = 2

// 需要重试的响应状态码
const RETRY_HTTP_CODES = [
    500, 502, 503, 504, 522, 524, 408, 429, 
]

// 最大同时请求数
const CONCURRENT_REQUESTS = 32

// 启用自动限速给能
const AUTOTHROTTLE_ENABLED = true
// 限速最大延迟, 单位秒
const AUTOTHROTTLE_MAX_DELAY = 60



// 默认请求头
const DEFAULT_REQUEST_HEADER = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,zh-HK;q=0.8',
    'Cache-Control': 'no-cache',
    "Accept-Encoding":"gzip, deflate",
    "Connection":"keep-alive",
    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2763.0 Safari/537.36",
}

const config = {
    SPIDER_MIDDLEWARES,
    DOWNLOAD_MIDDLEWARES,
    ITEM_PIPELINES,
    LOG_TO_FILE,
    LOG_DIR,
    MAX_REDIRECT_DEEPTH,
    AUTOTHROTTLE_ENABLED,
    AUTOTHROTTLE_MAX_DELAY,
    CONCURRENT_REQUESTS,
    DEFAULT_REQUEST_HEADER,
    RETRY_ENABLED, 
    RETRY_HTTP_CODES,
    EXTENSIONS,
    REQUEST_TIMEOUT,
    MAX_RETRY,
}

const loadConfig = function(options) {
    for (const key in config) {
        if ([ 'SPIDER_MIDDLEWARES', 'DOWNLOAD_MIDDLEWARES', 'ITEM_PIPELINES', ].includes(key)) {
            const cache = [ ...config[key], ...(options[key] ? options[key] : []), ].filter((x) => {
                return x[1] !== 'off'
            })
            cache.sort((x, y) => {
                return parseInt(x[1]) > parseInt(y[1])
            })
            config[key] = cache.map((x) => x[0])
        } else if (Array.isArray(config[key])) {
            config[key] = [ ...config[key], ...(options[key] ? options[key] : []), ]
        } else if (config[key] instanceof Object) {
            config[key] = Object.assign({}, config[key], options[key])
        } else {
            config[key] = options[key] || config[key]
        }
    }
    for (const key in options) {
        if (!config[key]) {
            config[key] = options[key]
        }
    }
    return config 
}

module.exports = {
    loadConfig,
}