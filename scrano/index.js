const config = require('./config')
const Core = require('./core')
const crawler = require('./crawler')
const downloader = require('./downloader')
const exceptions = require('./exception')
const item = require('./item')
const request = require('./request')
const response = require('./response')
const scheduler = require('./scheduler').default
const spider = require('./spider')
const signal = require('./signal')
const extensions = require('./extensions')
const selector = require('./selector')

const core = {
    'engine': Core,
    exceptions,
    scheduler,
    downloader
}

const common = {
    config,
    signal,
    extensions,
    selector,
}


module.exports = {
    core,
    common,
    spider,
    item,
    request,
    response,
    crawler
}