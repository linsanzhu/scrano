const exceptions = require('../exception')

class ValidDomainMiddleware {
    static init(options) {
        const instance = new this()
        return instance
    }

    processRequest({request, spider, }) {
        if (!spider.validateAllowDomain(request.meta.url)) {
            throw new exceptions.IgnoreRequest()
        }
    }
}

module.exports = ValidDomainMiddleware