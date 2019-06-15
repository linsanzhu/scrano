const { Request, } = require('../scrano/request')
const exceptions = require('../scrano/exception')
const fetch = require('node-fetch')


test('set-proxy', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    })
    request.setProxy({host: '111.177.190.42', port: 9999, })
    fetch(request.url, request.meta).then((response) => {
        expect(response.ok).toBeTruthy()
    })
})

test('set-header', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', },
    })
    request.setHeaders({
        'Content-Type': 'test',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    })
    expect(request.meta.headers).toEqual({
        'Content-Type': 'test',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    })
})


test('request-to-string', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    })
    expect(`${request}`).toBe('<Request http://www.baidu.com>')
})


