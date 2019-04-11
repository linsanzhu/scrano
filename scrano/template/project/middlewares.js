class DownloadMiddleware {

    /** 在请求进入下载器之前处理请求
     * 
     * @param {Request} request 待处理的请求
     * @param {Spider} spider 与被处理请求关联的spider
     * @returns {Request} 将会被重新传给调度器进行调度
     * @returns {Response} 将会作为调用processResponse的参数
     * @returns {*} 将会把request沿着中间件链路继续向下传递, 直到传递给下载器
     * @throws {IgnoreRequest} 将该请求丢弃,不再向下载器传递
     */
    static processRequest({request, spider, }) {
        //
    }

    /**
     * 
     * @param {Response} response 下载器回传给引擎的响应
     * @param {Spider} spider 与该响应关联的spider
     * @returns {Response} 将作为response参数沿着处理链路传递, 直到到达引擎
     * @returns {Request} 将交给调度器等待调度
     * @throws {IgnoreRequest} 忽略该响应
     */
    static processResponse({response, spider, }) {
        //
    }

    /** 下载器发生错误或传递请求给下载器或传递响应给引擎过程中发生错误时调用
     * 
     * @param {Request} request
     * @param {Error} exception
     * @param {Spider} spider
     */
    static processException({request, exception, spider, }) {
        //
    }
}


class SpiderMiddleware {

    /** 响应被传递给spider进行处理前调用
     * 
     * @param {Response} response 将要交给spider解析的响应
     * @param {Spider} spider 
     * @returns {null/undefined} 
     */
    static processSpiderInput({response, spider, }) {
        //
    }

    /** spider将解析结果交付给引擎过程中被调用
     * 
     * @param {Response} response
     * @param {any} result spider交付的结果
     * @param {Spider} spider
     */
    static processSpiderOutput({response, result, spider, }) {
        //
    }

    /** processSpiderInput或processSpiderOutput抛出错误时调用
     * 
     * @param {Response} response
     * @param {Error} exception
     * @param {Spider} spider
     */
    static processSpiderException({response, exceptions, spider, }) {
        //
    }

    /** spider出次被开启时调用, 必须返回一个Request构成的的可迭代对象
     * 
     * @param {Iterable} startRequests spider的初始请求列表
     * @param {Spider} spider 
     * @returns {Iterable}
     */
    static processStartRequests(startRequests, spider) {
        return startRequests
    }
}

module.exports = {
    DownloadMiddleware,
    SpiderMiddleware,
}