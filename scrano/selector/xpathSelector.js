const xpath = require('xpath')
const { DOMParser, XMLSerializer, } = require('xmldom')
const exceptions = require('../exception')


class XPathSelector {
    constructor(doc) {
        if (typeof doc !== 'string' && !Array.isArray(doc)) {
            throw new exceptions.ParamError('the param doc of XPathSelector\'s constructor must be a string or an instance of Array')
        }
        this.doc = typeof doc === 'string' ? [ new DOMParser().parseFromString(doc), ] : doc.map((d) => {return new DOMParser().parseFromString(d.toString())})
        this.extract = this.extract.bind(this)
        this.xpath = this.xpath.bind(this)
    }

    xpath(pattern) {
        const _ = this.doc.map((d) => {return xpath.select(pattern, d)}) 
        const nodes = []
        for (const node of _) {
            if (typeof node === 'string') {
                nodes.push(node)
            } else {
                for (const item of node) {
                    if (xpath.Utilities.isAttribute(item) || item.nodeType === 2) {
                        nodes.push(item.value)
                    } else if (item.nodeType === 3) {
                        nodes.push(item.nodeValue)
                    } else {
                        nodes.push(item)
                    }
                }
            }
        }
        const res = new XPathSelector(nodes)
        return new Proxy(res, {
            get: function(target, propKey, receiver) {
                if (/^\d+$/.test(propKey) && parseInt(propKey) < target.doc.length) {
                    return new XPathSelector(new XMLSerializer().serializeToString(target.doc[parseInt(propKey)]))
                }
                return Reflect.get(target, propKey, receiver)
            },
        })
    }

    extract() {
        if (this.doc.length < 1) {
            return []
        } else {
            return this.doc.map((node) => {
                if (node && node.firstChild) {
                    return node.firstChild.toString()
                }
            })
        }
    }
}

module.exports = {
    XPathSelector,
}