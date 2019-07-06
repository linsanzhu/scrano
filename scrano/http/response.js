const {XPathSelector, } = require('../selector')
const {Header, } = require('./header')
const convert = require('encoding').convert

class Response {
    constructor({url, status = 200, statusText = 'OK', headers = null, body = null, request = null, rawResponse = null, }) {
        this.headers = new Header(headers)
        this.status = parseInt(status)
        this.statusText = this.statusText
        this.request = request
        this.url = url
        this.setBody(body)
        this.rawResponse = rawResponse 
    }

    setBody(body) {
        if (body === null || body === undefined) {
            this.body = Buffer.from('')
        } else if (!Buffer.isBuffer(body)) {
            throw new TypeError('Response body must be bytes.')
        } else {
            this.body = body
        }
        
    }

    get meta() {
        return this.request.meta
    }

    copy() {
        return new Response(this)
    }

    convertBody() {
        let charset = null 
        if (this.headers.has('content-type')) {
            charset = /charset=([^;]*)/i.exec(this.headers.get('content-type'))
        }
        const topString = this.body.slice(0, 1024).toString()
        if (!charset && topString) {
            charset = /<meta.+?charset=(['"])(.+?)\1/i.exec(topString)
        }
        if (!charset && topString) {
            charset = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(topString)

            if (charset) {
                charset = /charset=(.*)/i.exec(charset.pop())
            }
        }
        if (!charset && topString) {
            charset = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(topString)
        }
        if (charset) {
            charset = charset.pop()
            if (charset === 'gb2312' || charset === 'gbk') {
                charset = 'gb18030'
            }
        } else {
            charset = 'utf-8'
        }
        return this.convertBody(this.body, 'UTF-8', charset).toString()
    }

    xpath(selector) {
        const sele = new XPathSelector(this.convertBody())
        return sele.xpath(selector)
    }

    re(selector) {
        const sel = (selector instanceof RegExp) ? selector : new RegExp(selector)
        return sel.exec(this.bodyString)
    }

    toString() {
        return `<Response from ${this.url}>`
    }
}

module.exports = {
    Response,
}