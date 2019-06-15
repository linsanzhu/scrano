const { Request, } = require('../scrano/request')
const exceptions = require('../scrano/exception')
const fetch = require('node-fetch')
const http = require("http")
const url = require("url")

http.createServer(function(req, res) {
    const options = url.parse(req.url)
    options.headers = req.headers

    const proxyRequest = http.request(options, function(proxyResponse) {
        proxyResponse.on('data', function(chunk) {
            console.log('proxyResponse length:', chunk.length)
            res.write(chunk, 'binary')
        })
        proxyResponse.on('end', function() {
            res.end()
        })

        res.writeHead(proxyResponse.statusCode, proxyResponse.headers)
    }) 

    req.on('data', function(chunk) {
        proxyRequest.write(chunk, 'binary')
    })

    req.on('end', function() {
        proxyRequest.end()
    })

}).listen(8080)

test('set-proxy', () => {
    const request = new Request('http://www.baidu.com', () => {
        //
    })
    request.setProxy({host: 'localhost', port: 8080, })
    return fetch(request.url, request.meta).then((response) => {
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


