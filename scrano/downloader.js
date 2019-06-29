const { Request, } = require('./request')
const { Response, } = require('./response')
const signal = require('./signal')
const nodeFetch = require('node-fetch')

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
            this.processingCount++
            nodeFetch(
                item[0].request.url, item[0].request.meta
            ).then((response) => {
                this.processingCount--
                if (response.ok) {
                    response.text().then((doc) => {
                        const _res_ = new Response(item[0].request, response)
                        _res_.docString = doc
                        this._deliver_({response: _res_, spider: item[0].spider, })
                    }).catch(() => {
                        const _res_ = new Response(item[0].request, response)
                        this._deliver_({response: _res_, spider: item[0].spider, })
                    })
                } else {
                    throw Error(response.statusText)
                }
            }).catch((err) => {
                this.processingCount--
                this.engine.reportError({request: item[0].request, exception: err, spider: item[0].spider, })
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