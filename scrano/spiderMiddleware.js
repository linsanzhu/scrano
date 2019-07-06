const signal = require('./signal')
const { Request, } = require('./http/request')
const { Item, } = require('./item')

class ChainNode {
    constructor({next, prev, middleware, } = {}) {
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

class SpiderMiddlewareChain {
    constructor(engine, middleWares) {
        this.engine = engine
        this.chain = new ChainNode()
        for (const md of middleWares) {
            const chainNode = new ChainNode({middleware: md.init(this.engine.options), })
            this.chain.prev.setNext(chainNode)
            chainNode.setPrev(this.chain.prev)
            this.chain.setPrev(chainNode)
            chainNode.setNext(this.chain)
        }
    }

    processSpiderInput({response, spider, }, afterProcess = null) {
        let pointer = this.chain.next
        while (pointer.middleware) {
            try {
                if (pointer.middleware.processSpiderInput) {
                    pointer.middleware.processSpiderInput({response, spider, })
                }
            } catch (err) {
                this.processSpiderException(response, err, spider)
                return
            }
            pointer = pointer.next
        }
        signal.emit(signal.RESPONSE_REACHED_SPIDER, response.request, response, spider)
        afterProcess && afterProcess(response, spider)
    }

    processSpiderOutput({response, result, spider, }, afterProcess = null) {
        let pointer = this.chain.prev
        while (pointer.middleware) {
            try {
                if (pointer.middleware.processSpiderOutput) {
                    pointer.middleware.processSpiderOutput({response, result, spider, })
                }
            } catch (err) {
                this.processSpiderException(response, err, spider)
            }
            pointer = pointer.prev
        }
        afterProcess && afterProcess(result, spider)
    }

    /** 处理响应过程中发生错误时调用
     * 
     * @param {Response} response 
     * @param {Error} exception 
     * @param {Spider} spider 
     */
    processSpiderException(response, exception, spider) {
        let pointer = this.chain.prev
        let result = null
        while (pointer.middleware) {
            if (pointer.middleware.processSpiderException) {
                result = pointer.middleware.processSpiderException({response, exception, spider, })
                if (result instanceof Request) {
                    this.engine.schedule(result, spider)
                    return
                } else if (result instanceof Item) {
                    this.processSpiderOutput({response, result, spider, }, this.engine.schedule)
                    return
                }
            }
            pointer = pointer.prev
        }
        this.engine.caputreError(exception)
    }

    processStartRequests(startRequests, spider) {
        let pointer = this.chain.prev
        while (pointer.middleware) {
            if (pointer.middleware.processStartRequests) {
                startRequests = pointer.middleware.processStartRequests({startRequests, spider, })
            }
            pointer = pointer.prev
        }
        return startRequests
    }
}

module.exports = {
    SpiderMiddlewareChain,
}