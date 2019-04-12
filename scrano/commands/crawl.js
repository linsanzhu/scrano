#!/usr/bin/env node

const CommandBase = require('./command')
const { Crawler, } = require('../crawler')
const path = require('path')
const fs = require('fs')

const getConfig = () => {
    let config = {}
    if (!fs.existsSync(path.resolve('./config.js'))) {
        console.log('cannot find config.js, be sure you are in a project folder')
        return
    }
    try {
        config = require(path.resolve('./config.js'))
    } catch (err) {
        console.log(err)
        return
    }
    return config
}

class CrawlCommand extends CommandBase {
    constructor() {
        super()
        this.description = 'Crawl specify spider'
        this.usage = 'scrano crawl [option] <spider_name>'
        this.options = {
            '--help': {
                alias: '-h',
                description: 'show this help message and exit',
            },
        }
    }

    run(...args) {
        if (args.length < 1 || args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
            this.printOptions()
            return
        }
        const spiderName = args[0]
        const config = getConfig()
        if (!config) {
            return
        }
        const crawler = new Crawler(config)
        crawler.crawl(spiderName)
    }
}

exports.CrawlCommand = new CrawlCommand()