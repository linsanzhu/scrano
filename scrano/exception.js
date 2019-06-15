
class NotImplementedError extends Error {
    constructor(message) {
        super()
        this.message = message || 'function is not implemented'
    }
}

class ValueError extends Error {
    constructor(message) {
        super()
        this.message = message || 'invalid value'
    }
}

class DropItem extends Error {
    constructor(message) {
        super()
        this.message = message || 'drop item'
    }
}

class CloseSpider extends Error {
    constructor(message) {
        super()
        this.message = message || 'close spider'
    }
}

class IgnoreRequest extends Error {
    constructor(message) {
        super()
        this.message = message || 'ignore request'
    }
}

class RedirectError extends Error {
    constructor(message) {
        super()
        this.message = message || 'redirct error'
    }
}


class ParamError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

class TimeoutError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

class MaxRetryTimesError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

module.exports = {
    NotImplementedError,
    ValueError,
    DropItem,
    CloseSpider,
    IgnoreRequest,
    RedirectError,
    ParamError,
    TimeoutError,
    MaxRetryTimesError,
}