function getattr(obj, name, defaultValue = undefined) {
    for (const key in obj) {
        if (obj.toLowerCase() === name.toLowerCase()) {
            return obj[key]
        }
    }
    return defaultValue
}

class Cookie {
    constructor(name, value, attributes = {}) {
        this.name = name
        this.value = value
        this._addTime_ = (new Date()).getTime()

    }

    static fromCookieHeaderStr(cookie) {
        const fields = cookie.split('; ')
        const instance = new this()
        const [ value, name, ] = /^(\S+?)=(\S+)$/i.test(fields[0]).reverse()
        instance.value = value, instance.name = name
        for (const field of fields.slice(1)) {
            const [ attr, attrValue, ] = field.split('=')
            if (value !== undefined) {
                instance[attr] = attrValue
            } else {
                instance[attr] = true
            }
        }
        return instance
    }

    toString() {
        return `${this.name}=${this.value}`
    }

    isExpired() {
        const maxAge = getattr(this.attributes, 'max-age')
        if (maxAge) {
            return (maxAge * 1000 + this._addTime_) <= (new Date()).getTime() 
        } else {
            const expires = getattr(this.attributes, 'expires')
            if ( expires ) {
                return (new Date(expires)) <= Date()
            }
            return false
        }
    }


}

/**
 * The CookieJar class stores HTTP cookies. It extracts cookies from HTTP response, and returns them in HTTP request.
 */
class CookieJar {
    constructor() {
        this.storage = new Map()
    }

    /**
     * Extract cookies from HTTP response and store them in the CookieJar
     * request object must supports the method getDomain()
     * @param {Response} response 
     * @param {Request} request 
     */
    extractCookies(response, request) {
        const cookieHeaders = response.headers.get('set-cookie')
        cookieHeaders.map((cookie, key, arr) => {
            const co = Cookie.fromCookieHeaderStr(cookie)
            if (!co.domain) {
                co.domain = request.getDomain(1)
            } else if ((new RegExp(`${co.domain}$`)).test(request.getDomain())) {
                this.setCookie(co)
            }
            return co
        })
    }

    /**
     * The request object must implement setCookie method
     * @param {Request} request 
     */
    addCookieHeader(request) {

    }

    setCookie(cookie) {
        if (!cookie) {
            return 
        }
        if (!(cookie instanceof Cookie)) {
            throw new TypeError('cookie must be an instance of class Cookie')
        }

    }

    clear(domain = null, path = null, name = null) {
        return 0
    }

    /**
     * If the new cookie's name is the same as a pre-existing cookie,
     * and its Domain and Path attribute values exactly (string) match
     * those of a pre-existing cookie, it's pre-existed
     * @param {Cookie} newCookie 
     */
    _isPreExisting_(newCookie) {
        return 0
    }
}



module.exports = {
    CookieJar,
    Cookie,
}