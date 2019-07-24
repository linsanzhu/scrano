const HttpProxyAgent = require('http-proxy-agent')
const HttpsProxyAgent = require('https-proxy-agent')


class Request {
    constructor(url, callback, options = {method: 'GET', headers: {}, }) {
        this.callback = callback
        
        this.url = url

        this.retried = 0
        
        this.meta = Object.assign({}, options)
    }

    setHeaders(headers) {
        this.meta.headers = Object.assign({}, this.meta.headers, headers)
    }

    /**
     * 
     * @param {Cookie} cookie 
     */
    setCookie(cookie) {
        if (!this.meta.headers.cookie) {
            this.meta.headers.cookie = `${cookie}`
        } else {
            this.meta.headers.cookie = `${this.meta.headers.cookie}; ${cookie}`
        }
    }

    getHost() {
        return /^https?.+?([\w.]+)(:\d+?)?\/?/.exec(this.url)[1]
    }

    getMethod() {
        return this.meta.method
    }

    getDomain(level = 0) {
        const host = this.getHost()
        return host.split('.').slice(-1 - level).join('.')
    }

    getProtocol() {
        return /^(https?):\/\//.exec(this.url).pop()
    }

    setProxy(proxy) {
        this.meta.agent = /^https.+$/.test(this.url) ? new HttpsProxyAgent(proxy) : new HttpProxyAgent(proxy) 
    }

    toString() {
        return `<Request ${this.url}>`
    }

    redirect(url) {
        const headers = {
            'refer': this.url,
        }
        return new Request(url, 
            this.callback, 
            Object.assign({}, this.meta, {data: this.data, headers, })
        )
    }
}


module.exports = {
    Request,
}