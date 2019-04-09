
class NotImplementError extends Error {
    constructor(message) {
        super(this)
        this.message = message || 'function is not implemented'
    }
}

class ValueError extends Error {
    constructor(message) {
        super(this)
        this.message = message || 'invalid value'
    }
}

class DropItem extends Error {
    constructor(message) {
        super(this)
        this.message = message || 'drop item'
    }
}

class CloseSpider extends Error {
    constructor(message) {
        super(this)
        this.message = message || 'close spider'
    }
}

class IgnoreRequest extends Error {
    constructor(message) {
        super(this)
        this.message = message || 'ignore request'
    }
}

class RedirectError extends Error {
    constructor(message) {
        super(this)
        this.message = message || 'redirct error'
    }
}

module.exports = {
    NotImplementError,
    ValueError,
    DropItem,
    CloseSpider,
    IgnoreRequest,
    RedirectError,
}