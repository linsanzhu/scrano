import { CookieJar, } from '../http/cookies'

class CookiesMiddleware {
    static init(options) {
        const instance = new this()
        instance.cookieJar = new CookieJar()
        return instance
    }

    processRequest({request, spider, }) {
        if (request.meta.dont_merge_cookies) {
            return
        }
        this.cookieJar.addCookieHeader(request)
    }

    processResponse({response, spider, }) {
        if (response.request.meta.dont_merge_cookies) {
            return
        }
        this.cookieJar.extractCookies(response, response.request)
        return response
    }
}

module.exports = CookiesMiddleware