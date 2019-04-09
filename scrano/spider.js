const exceptions = require('./exception')
const {Request, } = require('./request')
const signal = require('./signal')


class Spider {
    constructor(options) {
        this.allowDomains = []
        this.startUrls = []
        this.crawler = options.crawler
        this.config = options
        this.validateAllowDomain = this.validateAllowDomain.bind(this)
    }

    _initProcess_() {
        // 将allow_domain转化为RegExp对象
        for (const i in this.allow_domains) {
            this.allow_domains[i] = new RegExp(this.allow_domains[i])
        }
    }

    validateAllowDomain(url) {
        if (this.allow_domains.length === 0) {
            return true
        }
        for (const ad of this.allow_domains) {
            if (ad.test(url)) {
                return true
            }
        }
        return false
    }

    * startRequests() {
        if (this.start_urls.length < 1) {
            return []
        }
        for (const startUrl of this.start_urls) {
            if (this.allow_domains.length === 0 || this.validateAllowDomain(startUrl)) {
                yield new Request(startUrl, this.parse)
            }
        }
    }

    * parse(response) {
        throw new exceptions.NotImplementError('parse is not implemented')
    }

    closed() {
        signal.emit(signal.SPIDER_CLOSED, this)
    }

    static fromCrawler (crawler) {
        const instance = new this({crawler, options: crawler.options, })
        instance._initProcess_()
        return instance
    }

    toString() {
        return `<Spider ${this.name}>`
    }
}

module.exports = {
    Spider,
}