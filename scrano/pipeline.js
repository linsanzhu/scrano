const exceptions = require('./exception')
const {Item, } = require('./item')
const signal = require('./signal')

class ChainNode {
    constructor({next, prev, item, } = {}) {
        this.next = next || this
        this.prev = prev || this
        this.item = item
    }

    setNext(next) {
        this.next = next
    }

    setPrev(prev) {
        this.prev = prev
    }
}

class PipelineChain {
    constructor(engine, pipelines) {
        this.chain = new ChainNode()
        this.engine = engine
        for (const pl of pipelines) {
            const chainNode = new ChainNode({item: pl, })
            this.chain.prev.setNext(chainNode)
            chainNode.setPrev(this.chain.prev)
            this.chain.setPrev(chainNode)
            chainNode.setNext(this.chain)
        }
    }

    /** 处理由spider返回的item
     * 若返回undefine/null, 或者Item实例, 则继续交由下一个pipeline处理
     * 若返回其他对象,则通过engine交由调度器调度
     * 若抛出DropItem异常,则不再继续交由其他pipeline处理
     * @param {Item} item 
     * @param {Spider} spider 
     */
    processItem(item, spider) {
        let pointer = this.chain.next
        while (pointer.item) {
            try {
                if (pointer.item.processItem) {
                    const result = pointer.item.processItem(item, spider)
                    if (result && !(result instanceof Item)) {
                        this.engine.schedule(item, spider)
                        return
                    }
                    item = result || item
                }
            } catch (err) {
                if (err instanceof exceptions.DropItem) {
                    signal.emit(signal.ITEM_DROPPED, item, err, spider)                    
                    return
                }
                this.engine.captureError(err)
                return
            }
            pointer = pointer.next
        }
        signal.emit(signal.ITEM_SCRAPED, item, spider)
    }

    /**
     * 引擎被开启后调用,用于前置初始化工作
     */
    engineOpended() {
        let pointer = this.chain.prev
        while (pointer.item) {
            try {
                if (pointer.item.engineOpended) {
                    pointer.item.engineOpended()
                }
            } catch (err) {
                this.engine.captureError(err)
            }
            pointer = pointer.prev
        }
    }

    /**
     * 引擎被关闭后调用,用于后置清理工作
     */
    engineClosed() {
        let pointer = this.chain.next
        while (pointer.item) {
            try {
                if (pointer.item.engineClosed) {
                    pointer.item.engineClosed()
                }
            } catch (err) {
                this.engine.captureError(err)
            }
            pointer = pointer.next
        }
    }
}

module.exports = {
    PipelineChain,
}