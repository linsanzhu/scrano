const {Downloader, } = require('../scrano/downloader')
const {Request, } = require('../scrano/request')

test('test-request-url', () => {
    let downloader = null
    const engine = {
        deliverDownloadResult: function({response, spider, }) {
            console.log(response.xpath('//a').extract())
            downloader.stop()
        },
    }
    downloader = new Downloader(engine, {
        MAX_REDIRECT_DEEPTH: 2,
        REQUEST_TIMEOUT: 30000,
        AUTOTHROTTLE_ENABLED: true,
        AUTOTHROTTLE_MAX_DELAY: 10,
    })
    downloader.fetch(new Request('http://www.baidu.com', console.log), null)
})