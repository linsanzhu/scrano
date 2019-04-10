const __signalManager__ = {

}

const ENGINE_STARTED = Symbol()

const ENGINE_STOPPED = Symbol()

const DOWNLOADER_STARTED = Symbol()

const SCHEDULER_STARTED = Symbol()


// 请求到达下载器时发射
const REQUEST_REACHED_DOWNLOADER = Symbol()

// 请求被调度时发射
const REQUEST_SCHEDULED = Symbol()

// 请求重定向(返回301或302状态码)时发射
const REQUEST_REDIRECTED = Symbol()

// 请求被丢弃时发射
const REQUEST_DROPPED = Symbol()



// 响应被调度时发射
const RESPONSE_SCHEDULED = Symbol()

// 响应到达引擎时发射
const RESPONSE_RECIVED = Symbol()

// 响应下载后发射
const RESPONSE_DOWNLOADED = Symbol()

// 响应到达spider时发射
const RESPONSE_REACHED_SPIDER = Symbol()



// item被调度时发射
const ITEM_SCHEDULED = Symbol()

// item被pipeline处理并抛出DropItem异常时发射
const ITEM_DROPPED = Symbol()

// item经过了所有的pipeline并未被任何一个处理时发射
const ITEM_SCRAPED = Symbol()


// spider被关闭时发射
const SPIDER_CLOSED = Symbol()

// spider被打开进行处理时发射
const SPIDER_OPENED = Symbol()


// 请求被丢弃时发射
const IGNORE_REQUEST = Symbol()


// 调度器待调度队列空时发射
const SCHEDULER_QUEUE_EMPTY = Symbol()

// 有待调度对象等候调度器调度时发射
const SCHEDULER_QUEUE_NOT_EMPTY = Symbol()

// 下载器待下载队列为空时发射
const DOWNLOADER_QUEUE_EMPTY = Symbol()

// 有请求进入下载器的待下载队列时发射
const DOWNLOADER_QUEUE_NOT_EMPTY = Symbol()

// 扩展被初始化时发射
const INIT_EXTENSION = Symbol()

// 请求超时时发射
const REQUEST_TIMEOUT = Symbol()

// 重试请求时发射
const RETRY_REQUEST = Symbol()

// 捕获到异常时发射
const EXCEPTION_RAISED = Symbol()

function emit(signal, ...args) {
    if (!(signal in __signalManager__)) {
        return 
    }
    __signalManager__[signal].forEach((slot) => {
        slot.call(signal, ...args)
    })
}

function connect(signal, slot) {
    if (!(signal in __signalManager__)) {
        __signalManager__[signal] = new Set()
    }
    __signalManager__[signal].add(slot)
}


module.exports = {
    emit,
    connect,

    ENGINE_STARTED,
    ENGINE_STOPPED,

    DOWNLOADER_STARTED,
    SCHEDULER_STARTED,

    REQUEST_REACHED_DOWNLOADER,
    REQUEST_SCHEDULED,
    REQUEST_REDIRECTED,
    REQUEST_TIMEOUT,
    RETRY_REQUEST,
    REQUEST_DROPPED,

    ITEM_SCHEDULED,
    ITEM_DROPPED,
    ITEM_SCRAPED,

    RESPONSE_RECIVED,
    RESPONSE_SCHEDULED,
    RESPONSE_DOWNLOADED,
    RESPONSE_REACHED_SPIDER,

    IGNORE_REQUEST,


    SPIDER_CLOSED,
    SPIDER_OPENED,

    SCHEDULER_QUEUE_EMPTY,
    SCHEDULER_QUEUE_NOT_EMPTY,
    DOWNLOADER_QUEUE_EMPTY,
    DOWNLOADER_QUEUE_NOT_EMPTY,

    INIT_EXTENSION,

    EXCEPTION_RAISED,
}