const DefaultRequestHeadersMiddleware = require('./defaultHeaders')
const ValidRequestMiddleware = require('./validDomain')
const DownloadTimeoutMiddleware = require('./downloadTimeout')
const RedirectMiddleware = require('./redirect')
const RetryMiddleware = require('./retry')


module.exports = {
    DefaultRequestHeadersMiddleware,
    ValidRequestMiddleware,
    DownloadTimeoutMiddleware,
    RedirectMiddleware,
    RetryMiddleware,
}