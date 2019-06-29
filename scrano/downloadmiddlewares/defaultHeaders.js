
class DefaultRequestHeadersMiddleware {
    static init(options) {
        const instance = new this()
        instance._defaultHeaders_ = options.DEFAULT_REQUEST_HEADER
        return instance
    }

    processRequest({request, spider, }) {
        request.setHeaders(this._defaultHeaders_)
    }
}

module.exports = DefaultRequestHeadersMiddleware