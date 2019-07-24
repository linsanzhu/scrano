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
            const [ attr, attrValue, ] = field.split(/\s*=\s*/)
            if (attrValue !== undefined) {
                instance[attr.toLowerCase()] = attrValue
            } else {
                instance[attr.toLowerCase()] = true
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
            if (expires) {
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
        this.storage = []
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
            }
            if ((new RegExp(`${co.domain}$`)).test(request.getHost())) {
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
        for (const cookie of this.storage) {
            if (new RegExp(`${cookie.domain}$`).test(request.getHost())) {
                if (!(cookie.path && new RegExp(cookie.path).test(request.url))) {
                    continue
                }
                if (cookie.isExpired()) {
                    continue
                }
                request.setCookie(cookie)
            }
        }
    }

    setCookie(cookie) {
        if (!cookie) {
            return 
        }
        if (!(cookie instanceof Cookie)) {
            throw new TypeError('cookie must be an instance of class Cookie')
        }
        for (const i in this.storage) {
            const _co_ = this.storage[i]
            if (cookie.name === _co_.name) {
                this.storage[i] = cookie
                return
            }
        }
        this.storage.push(cookie)
    }

    clear(domain = null, path = null, name = null) {
        throw new Error('Not implement')
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