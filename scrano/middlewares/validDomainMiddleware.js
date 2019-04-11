const exceptions = require('../exception')

class ValidDomainMiddleware {
    static processRequest({request, spider, }) {
        if (!spider.validateAllowDomain(request.meta.url)) {
            throw new exceptions.IgnoreRequest()
        }
    }
}

module.exports = ValidDomainMiddleware