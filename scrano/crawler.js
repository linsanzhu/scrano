const Core = require('./core')
const config = require('./config')

class Crawler {
    constructor(options) {
        this.options = config.loadConfig(options)
        this.engine = new Core(this.options)
    }

    crawl(spiderName) {
        for (const sn in this.options.SPIDER_MODULES) {
            if (spiderName !== sn) {
                continue
            }
            const spider = this.options.SPIDER_MODULES[sn].from_crawler(this)
            this.engine.openSpider(spider)
            break
        }
    }

    stop() {
        this.engine.stop()
    }
}


module.exports = {
    Crawler, 
}