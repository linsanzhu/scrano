const http = require('http')
const {Request} = require('./request')
const {Response} = require('./response')
const signal = require('./signal')


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
        this.counter = 0    // 用于记录空转次数,连续空转超过10次,即可确定确实没有可下载请求了, 随即发送信号通知引擎准备停止工作
        signal.emit(signal.INIT_DOWNLOADER)
        this._process_()
    }

    _autothrottle_() {
        if(!this.options.AUTOTHROTTLE_ENABLED) {
            return 0;
        } else if(this.processingCount < 1) {
            return 500;
        }
        return Math.random() * this.options.AUTOTHROTTLE_MAX_DELAY * 1000;
    }
    _process_() {
        if(this.processingCount < this.options.CONCURRENT_REQUESTS && this.waitingQueue.length > 0) {
            this.counter = 0
            let item = this.waitingQueue.splice(0,1)
            this._request_(item[0])
        } else if(this.processingCount < 1 && this.waitingQueue.length < 1){
            this.counter++;
            if(this.counter > 10) {
                signal.emit(signal.DOWNLOADER_QUEUE_EMPTY)
                return
            }
        }
        let delay = this._autothrottle_()
        this.timer = setTimeout(this._process_, delay)
    }

    _deliver_({response, spider}) {
        if(this.waitingQueue.length < 1 && this.processingCount < 1)
            signal.emit(signal.DOWNLOADER_QUEUE_EMPTY)
        this.engine.deliverDownloadResult({response, spider})
    }

    _request_({request, spider}, deepth=0) {
        if(deepth >= this.options.MAX_REDIRECT_DEEPTH) {
            throw new exceptions.RedirectError(`redirect limited less than ${this.options.MAX_REDIRECT_DEEPTH} times`)
            return undefined
        }
        this.processingCount++
        let req = http.request(request.meta.url, request.meta.options, (res) => {
            this.processingCount--
            if((res.statusCode === 302 || res.statusCode === 301) && this.options.REDIRECT_ENABLED) {
                let newRequest = Request.copy(request, {url: res.getHeader('Location')})
                signal.emit(signal.REQUEST_REDIRECTED, request, newRequest, spider)

                let response = this._request_(newRequest, deepth+1)
                if(response)
                    this._deliver_({response, spider})
            } else {
                let response = new Response(request, res)
                let bufferCache = [] 
                res.on('data', chunk => {
                    bufferCache.push(chunk)
                })
                res.on('end', ()=>{
                    response.setBody(Buffer.concat(bufferCache))
                    this._deliver_({response, spider})
                })
            }
        }).on('error', (err)=>{
            this.processingCount--
            this.engine.captureError(err)
        })
        if(request.data) {
            req.write(request.data)
        }
        req.end()
    }

    /** 将请求添加到待下载队列等待被下载
     * 
     * @param {Request} request 将要被下载的请求体
     * @param {Spider} spider 与request关联的spider
     */
    fetch(request, spider) {
        this.status = 'pendding'
        signal.emit(signal.DOWNLOADER_QUEUE_NOT_EMPTY)
        this.waitingQueue.push({request, spider})
    }

    stop() {
        this.timer && clearTimeout(this.timer)
        this.timer = null
    }
}

module.exports = {
    Downloader
}