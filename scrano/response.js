const {XPathSelector, } = require('./selector')

class Response {
    constructor(request, response) {
        this.request = request
        this.meta = response
        this.docString = ''
    }

    bodyBuffer() {
        return this.meta.buffer()
    }

    get bodyString() {
        return this.docString
    }

    xpath(selector) {
        const sele = new XPathSelector(this.bodyString)
        return sele.xpath(selector)
    }

    re(selector) {
        const sel = (selector instanceof RegExp) ? selector : new RegExp(selector)
        return sel.exec(this.bodyString)
    }

    toString() {
        return `<Response from ${this.request.meta.url}>`
    }
}

module.exports = {
    Response,
}