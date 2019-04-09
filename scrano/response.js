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
        //
    }

    css(selector) {
        // 
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