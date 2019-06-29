class RedirectMiddleware {
    static init(options) {
        const instance = new this()
        instance._maxRedirectTimes_ = options.MAX_REDIRECT_DEEPTH
        return instance
    }

    processRequest({request, spider, }) {
        request.meta.follow = this._maxRedirectTimes_ || 3
    }
}

module.exports = RedirectMiddleware