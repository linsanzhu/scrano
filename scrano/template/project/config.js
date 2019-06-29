const path = require('path')
const middlewares = require('./middlewares')
const pipelines = require('./pipelines')


const SPIDER_MODULES = {

}

const SPIDER_MIDDLEWARES = [ 
    [ middlewares.SpiderMiddleware, 543, ],
]

const DOWNLOAD_MIDDLEWARES = [
    [ middlewares.DownloadMiddleware, 543, ],
]

const ITEM_PIPELINES = [
    [ pipelines.Pipeline, 543, ],
]

const EXTENSIONS = [
]

// 开启日志文件
const LOG_TO_FILE = false

// 日志文件存放目录, 仅 LOG_TO_FILE = true 时有效
const LOG_DIR = path.resolve('./log')

// 重定向最大深度, 仅在 REDIRECT_ENABLED = true 时有效, 默认3
const MAX_REDIRECT_DEEPTH = 3

// 超时时间(秒)
const REQUEST_TIMEOUT = 120

// 最大重试次数
const MAX_RETRY = 3

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

// 请求失败的最大重试次数
const RETRY_TIMES = 3

const config = {
    SPIDER_MODULES,
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
    RETRY_TIMES,
    EXTENSIONS,
    REQUEST_TIMEOUT,
    MAX_RETRY,
}


module.exports = config