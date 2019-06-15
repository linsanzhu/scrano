const { Request, } = require('./request')
const { Response, } = require('./response')
const exceptions = require('./exception')
const signal = require('./signal')
const nodeFetch = require('node-fetch')
const {FetchError, Headers, } = nodeFetch

class Downloader {
    constructor(engine, options) {
        this.options = options
        this.engine = engine
        this.waitingQueue = []
        this.processingCount = 0
        this.timer = null
        this._process_ = this._process_.bind(this)
        this._autothrottle_ = this._autothrottle_.bind(this)
        this.fetch = this.fetch.bind(this)
        this.counter = 0 // 用于记录空转次数,连续空转超过10次,即可确定确实没有可下载请求了, 随即发送信号通知引擎准备停止工作
        signal.emit(signal.INIT_DOWNLOADER)
        this._process_()
        this.countTimer = setInterval(() => {
            if (this.processingCount < 1 && this.waitingQueue.length < 1) {
                this.counter++
                if (this.counter > 10) {
                    signal.emit(signal.DOWNLOADER_QUEUE_EMPTY)
                    return
                }
            }
        }, 500)
    }

    _autothrottle_() {
        if (!this.options.AUTOTHROTTLE_ENABLED) {
            return 0
        } else if (this.processingCount < 1) {
            return 500
        }
        return Math.random() * this.options.AUTOTHROTTLE_MAX_DELAY * 1000
    }
    _process_() {
        if (this.processingCount < this.options.CONCURRENT_REQUESTS && this.waitingQueue.length > 0) {
            this.counter = 0
            const item = this.waitingQueue.splice(0, 1)

            nodeFetch(item[0].url, Object.assign({}, item[0].meta, {
                follow: this.options.MAX_REDIRECT_DEEPTH, 
                timeout: this.options.REQUEST_TIMEOUT,
            })).then((response) => {
                if (response.ok) {
                    return 1
                } else {
                    return 
                }
            }).then((response) => {
                return response
            }).catch((err) => {
                if (err instanceof FetchError && err.type === "request-timeout") {
                    if (item[0].retried >= this.options.MAX_RETRY) {
                        this.engine.captureError(new exceptions.MaxRetryTimesError(`The request ${item[0]} has been retried ${this.options.MAX_RETRY} times, and will be droped`))
                        return
                    }
                    signal.emit(signal.REQUEST_TIMEOUT, err.message)
                    item[0].retried++
                    signal.emit(signal.RETRY_REQUEST, item[0])
                    this.waitingQueue.push(item[0])
                } else {
                    this.engine.captureError(err)
                }
            })
        } 
        const delay = this._autothrottle_()
        this.timer = setTimeout(this._process_, delay)
    }

    _deliver_({response, spider, }) {
        if (this.waitingQueue.length < 1 && this.processingCount < 1) {
            signal.emit(signal.DOWNLOADER_QUEUE_EMPTY)
        }
        this.engine.deliverDownloadResult({response, spider, })
    }

    /** 将请求添加到待下载队列等待被下载
     * 
     * @param {Request} request 将要被下载的请求体
     * @param {Spider} spider 与request关联的spider
     */
    fetch(request, spider) {
        this.status = 'pendding'
        signal.emit(signal.DOWNLOADER_QUEUE_NOT_EMPTY)
        this.waitingQueue.push({request, spider, })
    }

    stop() {
        this.timer && clearTimeout(this.timer)
        this.timer = null
        this.countTimer && clearInterval(this.countTimer)
        this.countTimer = null
    }
}

module.exports = {
    Downloader, 
}