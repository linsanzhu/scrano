const exceptions = require('./exception')

class Request {
    constructor(url, callback, options = {method: 'GET', headers: {}, data: undefined, }) {
        const _ = /^(\S+:)\/\/[\s\S]+/.exec(url)
        this.protocol = (_ && _.length > 1) ? _[1] : 'http:'
        options.protocol = this.protocol

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
        port = (() => {throw new exceptions.ParamError('you must specify port')})()) {
        this.meta.options.host = host
        this.meta.options.port = port
    }

    toString() {
        return `<Request ${this.meta.url}>`
    }

    redirect(url) {
        const headers = {
            'refer': this.meta.url,
        }
        return new Request(url, 
            this.callback, 
            Object.assign({}, this.meta.options, {data: this.data, headers, })
        )
    }
}


module.exports = {
    Request,
}