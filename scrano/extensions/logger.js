const {configure, getLogger, } = require('log4js')
const path = require('path')
const signal = require('../signal')


class LoggerExtension {
    constructor(options) {
        this._logger_ = this._getLogger_(options)
    }
    _getLogger_(options) {
        const _ = {
            appenders: {
                console: {type: 'console', }, 
            },
            categories: {
                default: {appenders: [ 'console', ], level: 'ALL', },
            },
            replaceConsole: true,
        }
        if (options.LOG_TO_FILE) {
            _.appenders['file'] = {
                type: 'dateFile',
                filename: path.join((path.resolve(options.LOG_DIR) || '~/log'), 'log'),
                pattern: '_yyyy-MM-dd.log',
                alwaysIncludePattern: true,
            }
            _.categories['file'] = {
                appenders: [ 'console', 'file', ],
                level: 'info',
            }
        }
        configure(_)
        return getLogger('scrano')
    }

    static init(options) {
        const logger = new LoggerExtension(options)

        signal.connect(signal.ENGINE_STARTED, () => {
            logger._logger_.debug('engine started')
        })

        signal.connect(signal.ENGINE_STOPPED, () => {
            logger._logger_.debug('engine stopped')
        })

        signal.connect(signal.REQUEST_REACHED_DOWNLOADER, (request, spider) => {
            logger._logger_.debug(`request ${request} from spider ${spider} will be downloaded`)
        })

        signal.connect(signal.REQUEST_REDIRECTED, (request, newRequest, spider) => {
            logger._logger_.debug(`request from ${spider} redirected from ${request} to ${newRequest}`)
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
            if (typeof request === 'string') {
                logger._logger_.info(request)
            } else {
                logger._logger_.info(`ignore request ${request} from spider ${spider}`)
            }
        })

        signal.connect(signal.SPIDER_OPENED, (spider) => {
            logger._logger_.debug(`open spider ${spider}`)
        })

        signal.connect(signal.SPIDER_CLOSED, (spider) => {
            logger._logger_.debug(`close spider ${spider}`)
        })

        signal.connect(signal.EXCEPTION_RAISED, (err) => {
            logger._logger_.error(err)
        })

        signal.connect(signal.INIT_EXTENSION, (extension) => {
            logger._logger_.debug(`init extension ${extension.name}`)
        })

        signal.connect(signal.ENGINE_STOPPED, () => {
            logger._logger_.debug('finished, engine has been stopped')
        })

        signal.connect(signal.REQUEST_TIMEOUT, (request) => {
            logger._logger_.debug(`timeout with request ${request}`)
        })

        signal.connect(signal.RETRY_REQUEST, (request, reason) => {
            logger._logger_.debug(`Retrying ${request} (failed ${request.retried + 1}d times): ${reason}`)
        })
    }
}


module.exports = LoggerExtension