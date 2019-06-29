const {Spider, } = require('../scrano/spider')
const {Crawler, } = require('../scrano/crawler')
const exceptions = require('../scrano/exception')

test('from-crawler', () => {
    const crawler = new Crawler({})
    const spider = Spider.fromCrawler(crawler)
    spider.startUrls = [ 'http://www.baidu.com', ]
    for (const req of spider.startRequests()) {
        expect(req.url).toBe('http://www.baidu.com')
    }
    expect(() => {
        for (const i of spider.parse()) {
            //
        }
    }).toThrow(exceptions.NotImplementedError)
}) 