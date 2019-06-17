const {Response, } = require('../scrano/response')
const nodeFetch = require('node-fetch')

test('response-test', () => {
    return nodeFetch('http://www.baidu.com').then((response) => {
        response.text().then((txt) => {
            const res = new Response({}, response)
            res.docString = txt
            expect(res.xpath('//img')[0].xpath('//@src').extract()[0]).toBe('//www.baidu.com/img/bd_logo1.png')
        })
    })
})