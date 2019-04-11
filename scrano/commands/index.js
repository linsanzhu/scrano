#!/usr/bin/env node
'use strict'


const path = require('path')
const { GenProjectCommand, } = require('./genProject')
const { GenSpiderCommand, } = require('./genSpider')
const { CrawlCommand, } = require('./crawl')


class Command {
    constructor() {
        this.options = {
            'genproject': GenProjectCommand,
            'genspider': GenSpiderCommand,
            'crawl': CrawlCommand,
        }
        this.usage = 'scrano <command> [options] [args]'
    }

    printOptions() {
        console.log("Usage:")
        console.log(`  ${this.usage}\r\n`)
        console.log("Available commands:")
        const align = (l) => {
            let res = ''
            for (let i = 0;i < l; ++i) {
                res += ' '
            }
            return res
        }
        for (const item of Object.entries(this.options)) {
            console.log(`  ${item[0]}${align(20 - item[0].length)}${item[1].description}`)
        }
        console.log()
        console.log('Use "scrano <command> -h" to see more info about a command')
    }

    run(cmd, ...args) {
        if (!(cmd in this.options)) {
            console.log(`Unkown command: ${cmd}\r\n`)
            console.log('Use "scrano" see available commands')
            return 
        }
        this.options[cmd].run(...args)
    }

    parseArgs() {
        const args = process.argv.splice(1)
        if (args.length <= 1 || args[1] === '--help' || args[1] === '-h') {
            this.printOptions()
        } else {
            this.run(args[1], ...args.slice(2))
        }
    }
}

new Command().parseArgs()