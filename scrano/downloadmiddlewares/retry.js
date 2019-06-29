const FetchError = require('node-fetch').FetchError
const exceptions = require('../exception')
const signal = require('../signal')

function responseStatusMessage(status) {
    const httpStatusMessages = {
        100: 'Continue',
        101: 'Switching Protocols',
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        203: 'Non-authoritative Information',
        204: 'No Content',
        205: 'Reset Content',
        206: 'Partial Content',
        300: 'Multiple Choices',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other',
        304: 'Not Modified',
        305: 'Use Proxy',
        306: 'Unused',
        307: 'Temporary Redirect',
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Request Entity Too Large',
        414: 'Request-url Too Long',
        415: 'Unsupported Media Type',
        417: 'Expectation Failed',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
    }
    const message = httpStatusMessages[status]
    return `${status} ${message}`
}

class RetryMiddleware {
    static init(options) {
        const instance = new this()
        instance._maxRetryTimes_ = options.MAX_RETRY
        instance._retryHttpCodes_ = new Set(options.RETRY_HTTP_CODES)
        return instance
    }

    processResponse({response, spider, }) {
        if (response.request.dontRetry) {
            return response
        }
        if (this._retryHttpCodes_.has(response.meta.status)) {
            const reason = responseStatusMessage(response.meta.status)
            return this._retry_(response.request, spider) || response
        }
        return response
    }

    processException({request, exception, spider, }) {
        if (exception instanceof FetchError && exception.type === "request-timeout" && !request.dontRetry) {
            signal.emit(signal.REQUEST_TIMEOUT, exception.message)
            return this._retry_(request, exception, spider)
        }
    }

    _retry_(request, reason, spider) {
        if (request.retried + 1 >= this._maxRetryTimes_) {
            signal.emit(signal.IGNORE_REQUEST, `Gave up retrying ${request} (failed ${request.retried + 1}d times): ${reason}`)
            return 
        }
        request.retried++
        request.dontFilter = true
        signal.emit(signal.RETRY_REQUEST, request, reason)
        return request
    }
}

module.exports = RetryMiddleware