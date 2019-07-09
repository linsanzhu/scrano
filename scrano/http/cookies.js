/**
 * The CookieJar class stores HTTP cookies. It extracts cookies from HTTP response, and returns them in HTTP request.
 */
class CookieJar {
    constructor() {
        this.storage = new Map()
    }

    /**
     * Extract cookies from HTTP response and store them in the CookieJar
     * @param {Response} response 
     * @param {Request} request 
     */
    extractCookies(response, request) {
        const cookieHeaders = response.headers.get('set-cookie')
        cookieHeaders.map((cookie, key, arr) => {
            return Cookie.fromCookieHeaderStr(cookie)
        })
    }

    setCookie(cookie) {
        if (!(cookie instanceof Cookie)) {
            throw new TypeError('cookie must be an instance of class Cookie')
        }

    }

    clear({ domain = null, path = null, name = null, }) {
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
        instance._addTime_ = (new Date()).getTime()

    }

    static fromCookieHeaderStr(cookie) {
        const fields = cookie.split('; ')
        const instance = new this()
        [ instance.value, instance.name ] = /^(\S+?)=(\S+)$/i.test(fields[0]).reverse()
        for (const field of fields.slice(1)) {
            [ attr, value ] = field.split('=')
            if (value !== undefined) {
                instance[attr] = value
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

module.exports = {
    CookieJar,
    Cookie,
}