const { Scheduler, } = require('./scheduler')
const { Downloader, } = require('./downloader')
const { SpiderMiddlewareChain, } = require('./spiderMiddleware')
const { DownloadMiddlewareChain, } = require('./downloadMiddleware')
const { PipelineChain, } = require('./pipeline')
const { Response, } = require('./http/response')
const signal = require('./signal')

class Core {
    constructor(options) {
        this.options = options
        this.downloadMiddlewareChain = new DownloadMiddlewareChain(this, options.DOWNLOAD_MIDDLEWARES)
        this.spiderMiddlewareChain = new SpiderMiddlewareChain(this, options.SPIDER_MIDDLEWARES)
        this.pipelineChain = new PipelineChain(this, options.ITEM_PIPELINES)
        this.downloader = new Downloader(this, options)
        this.scheduler = new Scheduler(this, options)
        this.pipelineChain.engineOpended()

        this.schedule = this.schedule.bind(this)
        this.deliverSpiderOutput = this.deliverSpiderOutput.bind(this)
        this.deliverDownloadResult = this.deliverDownloadResult.bind(this)
        this.distributeItem = this.distributeItem.bind(this)
        this.distributeRequest = this.distributeRequest.bind(this)
        this.distributeResponse = this.distributeResponse.bind(this)
        this._loadExtensions_ = this._loadExtensions_.bind(this)
        this.askSpiderParseResult = this.askSpiderParseResult.bind(this)
        this.stop = this.stop.bind(this)
        this.openSpider = this.openSpider.bind(this)
        this.captureError = this.captureError.bind(this)

        this._loadExtensions_()
        this.schedulerStatus = 'pendding'
        this.downloaderStatus = 'pendding'
        this.counter = 0

        this.timer = setInterval(() => {
            if (this.schedulerStatus === 'watting_exit' && this.downloaderStatus === 'watting_exit') {
                this.counter++
                if (this.counter > 10) {
                    this.stop()
                }
            } else {
                this.counter = 0
            }
        }, 500)
        
        signal.connect(signal.SCHEDULER_QUEUE_EMPTY, () => {
            this.schedulerStatus = 'watting_exit'
        })
        signal.connect(signal.SCHEDULER_QUEUE_NOT_EMPTY, () => {
            this.schedulerStatus = 'pendding'
        })
        signal.connect(signal.DOWNLOADER_QUEUE_EMPTY, () => {
            this.downloaderStatus = 'watting_exit'
        })
        signal.connect(signal.DOWNLOADER_QUEUE_NOT_EMPTY, () => {
            this.downloaderStatus = 'pendding'
        })
        signal.emit(signal.ENGINE_STARTED, this)
    }

    _loadExtensions_() {
        for (const extension of this.options.EXTENSIONS) {
            if (extension[1] === 'off') {
                continue
            }
            extension[0].init(this.options)
            signal.emit(signal.INIT_EXTENSION, extension[0])
        }
    }

    /** 分发请求给下载器,分发到途中由下载器中间件处理
     * 
     * @for Core
     * @param {Request} request 将要由下载器处理的请求
     * @param {Spider} spider 与请求相关联的spider
     */
    distributeRequest({request, spider, }) {
        this.downloadMiddlewareChain.processRequest({request, spider, }, this.downloader.fetch)
    }

    /** 用于下载器交付下载结果的指令,交付途中由下载器中间件处理
     * 
     * @for Core
     * @param {Response} response 下载结果
     * @param {Spider} spider 与下载结果关联的spider
     */
    deliverDownloadResult({response, spider, }) {
        this.downloadMiddlewareChain.processResponse({response, spider, }, this.schedule)
    }

    /** 用于下载器处理请求发生错误时提交错误给引擎
     * 
     */
    reportError({request, exception, spider, }) {
        this.downloadMiddlewareChain.processException({request, exception, spider, })
    }

    /** 分发响应到spider, 分发途中由spider中间件处理
     * 
     * @for Core
     * @param {Response} response 将要分发给spider处理的响应
     * @param {Spider} spider 响应被分发的去向
     */
    distributeResponse({response, spider, }) {
        this.spiderMiddlewareChain.processSpiderInput({response, spider, }, this.askSpiderParseResult)
    }

    /** 用于引擎主动回收spider解析响应后的结果, spider处理的结果将直接经由中间件构成的路径传递回引擎
     * 
     * @param {Response} response 将交给spider处理的响应
     * @param {Spider} spider 被交与的spider对象
     */
    askSpiderParseResult(response, spider) {
        if (response instanceof Response && response.request && response.request.callback) {
            const results = response.request.callback(response, spider)
            for (const result of results) {
                setTimeout(() => {
                    this.deliverSpiderOutput({response, result, spider, })
                }, 0)
            }
        }
    }

    /** 用于spider交付处理结果的指令
     * 
     * @for Core
     * @param {Response} response 
     * @param {any} result spider的处理结果
     * @param {Spider} 
     */
    deliverSpiderOutput({response, result, spider, }) {
        this.spiderMiddlewareChain.processSpiderOutput({response, result, spider, }, this.schedule)
    }

    distributeItem({item, spider, }) {
        this.pipelineChain.processItem(item, spider)
    }

    /** 由调度器触发下载请求的指令
     * 
     * @for Core
     * @param {Request} request 被调度将要下载的请求
     * @param {Spider} spider 与被调度的请求关联的spider
     */
    toggleDownloadProcess(request, spider) {
        this.distributeRequest({request, spider, })
    }

    /** 由调度器触发spider处理响应的指令
     * 
     * @for Core
     * @param {Request} request 与将要被处理的response关联的请求
     * @param {Response} response 将要被处理的response
     * @param {Spider} spider 将要处理response的spider
     */
    toggleSpiderProcess(response, spider) {
        this.distributeResponse({response, spider, })
    }

    /** 由调度器触发处理抓取结果的指令
     * 
     * @for Core
     * @param {Item} item 将要被pipeline处理的结果
     * @param {Spider} spider 生成抓取结果的spider
     */
    togglePipelineProcess(item, spider) {
        this.distributeItem({item, spider, })
    }

    /** 向调度器询问如何调度
     * 
     * @for Core
     * @param {any} obj 被调度对象
     * @param {Spider} spider 与被调度对象可能有关联的spider
     */
    schedule(obj, spider) {
        this.scheduler.schedule({obj, spider, })
    }

    /** 捕获异常并处理
     * 
     * @for Core
     * @param {Error} err 被捕获的异常
     */
    captureError(err) {
        signal.emit(signal.EXCEPTION_RAISED, err)
    }

    stop() {
        clearInterval(this.timer)
        this.timer = null
        this.scheduler.stop()
        this.downloader.stop()
        signal.emit(signal.ENGINE_STOPPED)
    }

    openSpider(spider) {
        signal.emit(signal.SPIDER_OPENED, spider)
        const startRequests = this.spiderMiddlewareChain.processStartRequests(spider.startRequests(), spider)
        for (const req of startRequests) {
            this.schedule(req, spider)
        }
    }
}

module.exports = Core