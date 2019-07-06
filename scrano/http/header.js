function find(instance, key) {
    key = key.toLowerCase()
    for (const ent of instance) {
        if (ent[0].toLowerCase() === key) {
            return ent[1]
        }
    }    
    return undefined
}

function validHeaderName(name) {
    if (!name || /[^\\^_`a-zA-Z\-0-9!#$%&'*+.|~]/.test(name)) {
        throw new TypeError(`${name} is not a legal HTTP header name`)
    }
    return true
}

function validHeaderValue(val) {
    if (!val || /[^\t\\x20-\\x7e\\x80-\\xff]/.test(val)) {
        throw new TypeError(`${val} is not a legal HTTP header value`)
    }
}

class Header {
    constructor(headers = undefined) {
        if (headers instanceof Header) {
            this.map = headers.map
        } else if (Object.hasOwnProperty('entries', headers)) {
            this.map = new Map(headers.entries())
        } else if (typeof headers === 'string') {
            this.map = new Map()

        } else {
            this.map = new Map()
            for (const key in headers) {
                this.set(key, headers[key])
            }
        }
    }

    has(name) {
        this.map.has(name)
    }

    toDict() {
        return Object.fromEntries(this.map.entries())
    }

    set(key, val) {
        key = key.toString()
        val = val.toString()
        validHeaderName(key)
        validHeaderValue(val)
        this.map.set(key.toLowerCase(), [ val, ])
    }

    append(key, val) {
        key = key.toString()
        val = val.toString()
        validHeaderName(key)
        validHeaderValue(val)
        const entrie = find(this.map, key)
        if (entrie) {
            entrie.push(val)
        } else {
            this.map.set(key.toLowerCase(), [ val, ])
        }
    }

    get(key) {
        key = key.toString()
        validHeaderName(key)
        let ent = find(this.map, key)
        if (ent) {
            ent = ent.join(', ')
        }
        return ent
    }

    keys() {
        return Array.from(this.map.keys())
    }

    values() {
        return Array.from(this.map.values())
    }

    delete(name) {
        name = name.toString()
        validHeaderName(name)
        for (const ent of this.map) {
            if (ent[0].toLowerCase() === name.toLowerCase()) {
                this.map.delete(ent[0])
            }
        }
    }
}


module.exports = {
    Header,
}