const exceptions = require('./exception')
const {Request} = require('./request')
const signal = require('./signal')


class Spider {
    constructor(options) {
        this.allow_domains = []
        this.start_urls = []
        this.crawler = options.crawler
        this.config = options
    }

    _init_process_() {
        // 将allow_domain转化为RegExp对象
        for (let i in this.allow_domains) {
            this.allow_domains[i] = new RegExp(this.allow_domains[i])
        }
    }

    validate_allow_domain(url) {
        if(this.allow_domains.length === 0)
            return true;
        for (let ad of this.allow_domains) {
            if(ad.test(url)){
                return true;
            }
        }
        return false;
    }

    *startRequests() {
        if(this.start_urls.length < 1)
            return []
        for(let start_url of this.start_urls) {
            if(this.allow_domains.length == 0 || validate_allow_domain(start_url)) {
                yield new Request(start_url, this.parse);
            }
        }
    }

    *parse(response){
        throw new exceptions.NotImplementError('parse is not implemented')
    }

    closed() {
        signal.emit(signal.SPIDER_CLOSED, this)
    }

    static from_crawler(crawler) {
        let instance = new this({crawler, ...crawler.options});
        instance._init_process_();
        return instance;
    }

    toString() {
        return `<Spider ${this.name}>`
    }
}

module.exports = {
    Spider,
}