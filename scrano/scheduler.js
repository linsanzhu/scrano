const signal = require('./signal')
const {Request} = require('./request')
const {Response} = require('./response')
const {Item} = require('./item')

class Scheduler {
    constructor(engine, options) {
        this.options = options
        this.engine = engine
        this.waitingQueue = []
        this.timer = null
        this._process_ = this._process_.bind(this)
        this._process_()
    }

    _process_() {
        let item = this.waitingQueue.splice(0,1)
        if(item.length > 0) {
            item = item[0]
            if(item.obj instanceof Request) {
                signal.emit(signal.REQUEST_SCHEDULED, item.obj)
                this.engine.toggleDownloadProcess(item.obj, item.spider)
            } else if (item.obj instanceof Response) {
                signal.emit(signal.RESPONSE_SCHEDULED, item.obj)
                this.engine.toggleSpiderProcess(item.obj, item.spider)
            } else if (item.obj instanceof Item) {
                signal.emit(signal.ITEM_SCHEDULED, item.obj)
                this.engine.togglePipelineProcess(item.obj, item.spider)
            } else {

            }
        } else {
            signal.emit(signal.SCHEDULER_QUEUE_EMPTY)
        }
        this.timer = setTimeout(this._process_, 0)
    }

    schedule({obj, spider}) {
        signal.emit(signal.SCHEDULER_QUEUE_NOT_EMPTY)
        this.waitingQueue.push({obj, spider})
    }
    
    stop() {
        this.timer && clearTimeout(this.timer)
        this.timer = null
    }
}


module.exports = {
    Scheduler
}
