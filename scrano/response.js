const {XPathSelector, } = require('./selector')

class Response {
    constructor(request, response) {
        this.request = request
        this.meta = response
        this.body = null
    }
    setBody(body) {
        this.body = body
    }

    xpath(selector) {
        const sele = new XPathSelector(this.body.toString())
        return sele.xpath(selector)
    }

    re(selector) {
        const sel = (selector instanceof RegExp) ? selector : new RegExp(selector)
        return sel.exec(this.body.toString())
    }

    toString() {
        return `<Response from ${this.request.meta.url}>`
    }
}

module.exports = {
    Response,
}