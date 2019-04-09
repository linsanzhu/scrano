const exceptions = require('./exception')
const {Response} = require('./response')
const {Request} = require('./request')
const signal = require('./signal')

class ChainNode {
    constructor({next, prev, middleware}={}) {
        this.next = next || this
        this.prev = prev || this
        this.middleware = middleware
    }

    setNext(next) {
        this.next = next
    }

    setPrev(prev) {
        this.prev = prev
    }
}

class DownloadMiddlewareChain {
    constructor(engine, downloadMiddlewares) {
        this.engine = engine
        this.chain = new ChainNode();
        for(let md of downloadMiddlewares) {
            let chainNode = new ChainNode({middleware: md})
            this.chain.prev.setNext(chainNode);
            chainNode.setPrev(this.chain.prev)
            this.chain.setPrev(chainNode)
            chainNode.setNext(this.chain)
        }
    }

    /** request将沿着download中间件组成的链一路向着下载器前进,途中不断被中间件的processRequest方法处理
     *  并最终到达终点－下载器
     * 
     * @param {Request} request 将要传输给下载器的request
     * @param {Spider} spider 与request关联的spider
     * @param {Funtion} afterProcess request的目的地，下载器接收request的收信器
     */
    processRequest({request, spider}, afterProcess=null) {
        let pointer = this.chain.next;
        let result = null
        while(pointer.middleware) {
            try{
                if(pointer.middleware.processRequest)
                    result = pointer.middleware.processRequest({request, spider})
            }catch(err) {
                pointer.middleware.processExeption({request, exception: err, spider}, pointer)
                return
            }
            if(result instanceof Request) {
                this.engine.schedule(result, spider)
                return
            } else if (result instanceof Response) {
                this.processResponse({response: result, spider}, this.engine.schedule)
                return
            }
            pointer = pointer.next;
        }
        signal.emit(signal.REQUEST_REACHED_DOWNLOADER, request, spider)
        afterProcess && afterProcess(request, spider)
    }

    /** 下载器交付的响应将沿着链路一路返回engine, 途中被中间件的processResponse处理
     * 
     * @param {Response} response 由下载器交付的响应
     * @param {Function} afterProcess engine接收响应的接收器
     */
    processResponse({response, spider}, afterProcess=null) {
        signal.emit(signal.RESPONSE_DOWNLOADED, response, spider)
        let pointer = this.chain.prev;
        let result = null
        while(pointer.middleware) {
            try {
                if(pointer.middleware.processResponse)
                    result = pointer.middleware.processResponse({response, spider})
            } catch(err) {
                this.processExeption({request, exception: err, spider}, pointer)
                return
            }
            if(result instanceof Request) {
                this.engine.schedule(result, spider)
                return
            } else if(result instanceof Response) {
                response = result
            }
            pointer = pointer.prev
        }
        signal.emit(signal.RESPONSE_RECIVED, response, spider)
        afterProcess && afterProcess(response, spider)
    }

    /**
     * 
     * @param {*} param0 
     */
    processExeption({request, exception, spider}, pointer=null) {
        if(exception instanceof exceptions.IgnoreRequest) {
            signal.emit(signal.IGNORE_REQUEST, request, spider)
            return
        }
        pointer || (pointer = this.chain.prev)
        while(pointer.middleware) {
            if(pointer.middleware.processExeption) {
                let result = pointer.middleware.processExeption({request, exception, spider})
                if(result instanceof Request) {
                    this.engine.schedule(result, spider)
                    return
                } else if (result instanceof Response) {
                    this.processResponse({response: result, spider})
                    return
                }
            }
            pointer = pointer.prev
        }
        this.engine.captureError(exception)
    }
}

module.exports = {
    DownloadMiddlewareChain
}