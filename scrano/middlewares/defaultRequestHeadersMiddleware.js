
class DefaultRequestHeadersMiddleware {
    static processRequest({request, spider, }) {
        request.setHeaders(spider.config.DEFAULT_REQUEST_HEADER)
    }
}

module.exports = DefaultRequestHeadersMiddleware