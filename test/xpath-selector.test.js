const {XPathSelector, } = require('../scrano/selector')
const exceptions = require('../scrano/exception')

test('match-list', () => {
    const doc = '<div id="test"><div class="test-class">text</div><ul><li>li text</li><li>li text two</li></ul></div>'
    const selector = new XPathSelector(doc)
    const nodes = selector.xpath('//div[@id="test"]//li').extract()

    expect(nodes).toEqual([ '<li>li text</li>', '<li>li text two</li>', ])
})

test('match-text', () => {
    const doc = '<div id="test"><div class="test-class">text</div><ul><li>li text</li><li>li text two</li></ul></div>'
    const selector = new XPathSelector(doc)
    const nodes = selector.xpath('//div[@id="test"]//li/text()').extract()

    expect(nodes).toEqual([ 'li text', 'li text two', ])
})

test('match-linked-xpath-to-be-empty', () => {
    const doc = '<div id="test"><div class="test-class">text</div><ul><li>li text</li><li>li text two</li></ul></div>'
    const selector = new XPathSelector(doc)
    const nodes = selector.xpath('//div[@id="test"]//li/text()').xpath('/div')
        .extract()

    expect(nodes).toEqual([])
})

test('match-linked-xpath-functions-string', () => {
    const doc = '<div id="test"><div class="test-class">text</div><ul><li>li text</li><li>li text two</li></ul></div>'
    const selector = new XPathSelector(doc)
    const nodes = selector.xpath('//div[@id="test"]').xpath('string(//li[2])')
        .extract()

    expect(nodes).toEqual([ 'li text two', ])
})

test('match-property', () => {
    const doc = '<div id="test"><div class="test-class">text</div><ul><li>li text</li><li>li text two</li></ul></div>'
    const selector = new XPathSelector(doc)
    const nodes = selector.xpath('//div/div/@class').extract()

    expect(nodes).toEqual([ 'test-class', ])
})

test('match-list', () => {
    const doc = '<div id="test"><div class="test-class">text</div><ul><li>li text</li><li>li text two</li></ul><div class="test-class">dasf</div></div>'
    const selector = new XPathSelector(doc)
    const nodes = selector.xpath('//div[@id="test"]/div[@class="test-class"]').extract()

    expect(nodes).toEqual([ '<div class="test-class">text</div>', '<div class="test-class">dasf</div>', ])
})

test('constructor-should-throw-error-when-param-not-string-and-array', () => {
    expect(() => {
        new XPathSelector(3)
    }).toThrow(exceptions.ParamError)
})