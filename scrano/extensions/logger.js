const {configure, getLogger} = require('log4js')
const path = require('path')
const signal = require('../signal')


class LoggerExtension {
    constructor(options) {
        this._logger_ = this._getLogger_(options)
    }
    _getLogger_(options) {
        let _ = {
            appenders: {
                console: {type: 'console'}
            },
            categories: {
                default: {appenders: ['console'], level: 'ALL'},
            },
            replaceConsole: true,
        }
        if (options.LOG_TO_FILE) {
            _.appenders['file'] = {
                type: 'dateFile',
                filename: path.join((path.resolve(options.LOG_DIR) || '~/log'), 'log'),
                pattern: '_yyyy-MM-dd.log',
                alwaysIncludePattern: true
            }
            _.categories['file'] = {
                appenders: ['console', 'file'],
                level: 'info'
            }
        }
        configure(_)
        return getLogger('scrano')
    }

    static init(options) {
        let logger = new LoggerExtension(options)

        signal.connect(signal.ENGINE_STARTED, ()=>{
            logger._logger_.debug('engine started')
        })

        signal.connect(signal.ENGINE_STOPPED, ()=>{
            logger._logger_.debug('engine stopped')
        })

        signal.connect(signal.REQUEST_REACHED_DOWNLOADER, (request, spider)=>{
            logger._logger_.debug(`request ${request} will be downloaded`)
        })

        signal.connect(signal.REQUEST_REDIRECTED, (request, newRequest, spider)=>{
            logger._logger_.debug(`request redirect from ${request} to ${newRequest}`)
        })

        signal.connect(signal.ITEM_DROPPED, (item, spider) => {
            logger._logger_.info(`Drop item ${item} which returned by spider ${spider}`)
        })

        signal.connect(signal.ITEM_SCRAPED, (item, spider) => {
            logger._logger_.info(`scraped item ${item} which returned by spider ${spider}`)
        })

        signal.connect(signal.RESPONSE_REACHED_SPIDER, (request, response, spider) => {
            logger._logger_.debug(`spider ${spider} recived response ${response}`)
        })

        signal.connect(signal.IGNORE_REQUEST, (request, spider) => {
            logger._logger_.info(`ignore request $(request)`)
        })

        signal.connect(signal.SPIDER_OPENED, (spider) => {
            logger._logger_.debug(`open spider ${spider}`)
        })

        signal.connect(signal.SPIDER_CLOSED, (spider) => {
            logger._logger_.debug(`close spider ${spider}`)
        })

        signal.connect(signal.EXCEPTION_RAISED, (err) => {
            logger._logger_.error(err.message)
        })

        signal.connect(signal.INIT_EXTENSION, (extension) =>{
            logger._logger_.debug(`init extension ${extension.name}`)
        })

        signal.connect(signal.ENGINE_STOPPED, ()=>{
            logger._logger_.debug('finished, engine has been stopped')
        })
    }
}


module.exports = LoggerExtension