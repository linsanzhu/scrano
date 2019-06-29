class DownloadTimeoutMiddleware {
    processRequest({request, spider, }) {
        request.meta.timeout = this._timeout_
    }

    static init(options) {
        const instance = new this()
        instance._timeout_ = (options.REQUEST_TIMEOUT || 120) * 1000
        return instance
    }
}

module.exports = DownloadTimeoutMiddleware