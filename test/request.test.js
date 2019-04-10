const { Request, } = require('../scrano/request')
const exceptions = require('../scrano/exception')

test('set-proxy-without-host-or-port', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    })
    expect(() => {
        request.setProxy()
    }).toThrow(exceptions.ParamError)
    expect(() => {
        request.setProxy('localhost')
    }).toThrow(exceptions.ParamError)
})

test('set-proxy', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    })
    request.setProxy('localhost', 8080)
    expect(request.meta).toEqual({
        url: 'http://www.baidu.com',
        options: {
            method: 'GET',
            headers: {},
            host: 'localhost',
            port: 8080,
            protocol: 'http',
        },
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
    expect(request.meta.options.headers).toEqual({
        'Content-Type': 'test',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    })
})


test('copy-request', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', },
    })

    const newRequest = Request.copy(request, {
        url: 'localhost',
        headers: { 'Content-Type': 'test', },
        data: 'test',
    })
    expect(newRequest.meta.url).toBe('localhost')
    expect(newRequest.data).toBe('test')
    expect(newRequest.meta.options).toEqual({
        headers: {'Content-Type': 'test', },
        protocol: 'http',
    })

    const newRequest2 = Request.copy(request, {
        headers: { 'Content-Type': 'test', },
        data: 'test',
    })
    expect(newRequest2.meta.url).toBe('http://www.baidu.com')
    expect(newRequest2.data).toBe('test')
    expect(newRequest2.meta.options).toEqual({
        headers: {'Content-Type': 'test', },
        protocol: 'http',
    })
})

test('request-to-string', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    })
    expect(`${request}`).toBe('<Request http://www.baidu.com>')
})


