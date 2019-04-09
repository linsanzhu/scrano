class Request {
    constructor(url, callback, options={method: 'GET', headers: {}, data: undefined, args: undefined}) {
        this.callback = callback
        this.meta = {
            url,
            options: {
                method: options.method,
                headers: options.headers,
            }
        }
        this.data = options.data
    }
    setHeaders(headers) {
        this.meta.options.headers = {...this.meta.options.headers, ...headers}
    }
    setProxy(proxy) {

    }

    toString() {
        return `<Request ${this.meta.url}>`
    }
    static copy(request, meta) {
        return new Request(meta.url, request.callback, Object.assign({}, request.meta, meta))
    }
}


module.exports = {
    Request
}