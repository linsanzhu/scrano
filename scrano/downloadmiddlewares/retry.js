const FetchError = require('node-fetch').FetchError
const exceptions = require('../exception')
const signal = require('../signal')

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
        if (this._retryHttpCodes_.has(response.status)) {
            const reason = response.statusText
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