const exceptions = require('./exception')

class Request {
    constructor(url, callback, options = {method: 'GET', headers: {}, data: undefined, }) {
        this.callback = callback

        this.data = options.data

        delete options.data

        this.meta = {
            url,
            options: Object.assign({}, options),
        }
    }

    setHeaders(headers) {
        this.meta.options.headers = Object.assign({}, this.meta.options.headers, headers)
    }

    setProxy(host = (() => {throw new exceptions.ParamError('you must specify host')})(), 
        port = (() => {throw new exceptions.ParamError('you must specify port')})(), protocol = 'http') {
        this.meta.options.host = host
        this.meta.options.port = port
        this.meta.options.protocol = protocol
    }

    toString() {
        return `<Request ${this.meta.url}>`
    }

    static copy(request, meta = {}) {
        const url = meta.url
        if (url) {
            delete meta.url
        }
        return new Request(url || request.meta.url, 
            request.callback, 
            Object.assign({}, request.meta.options, {data: request.data, }, meta)
        )
    }
}


module.exports = {
    Request,
}