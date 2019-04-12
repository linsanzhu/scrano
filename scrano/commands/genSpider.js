#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const CommandBase = require('./command')

class GenSpiderCommand extends CommandBase {
    constructor() {
        super()
        this.description = 'Generate new spider using pre-defined templates'
        this.usage = 'srano genspider [options] <name> <domain>'
        this.options = {
            '--help': {
                alias: '-h',
                description: 'show this help message and exit',
            },
            '--template': {
                alias: '-t',
                description: 'Uses a custom template',
                usage: '--template=TEMPLATE, -t TEMPLATE',
            },
            '--force': {
                description: 'If the spider already exists, overwrite it with the template',
            },
        }
    }

    run(...args) {
        if (args.length < 1 || args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
            this.printOptions()
            return
        }
        let force = false
        let template = path.resolve(__dirname, '../template/spider.template')
        for (let i = 0;i < args.length; ++i) {
            if (args[i].indexOf('--template') >= 0) {
                const tn = /--template\s*=\s*(\S+)/.exec(args[i])
                if (!tn || tn.length <= 1) {
                    this.printOptions()
                    return
                }
                template = path.resolve(tn[1])
                args.splice(i, 1)
                break
            } else if (args[i] === '-t') {
                template = path.resolve(args[i + 1])
                args.splice(i, 2)
                break
            }
        }
        if (args.indexOf('--force') >= 0) {
            args.splice(args.indexOf('--force'), 1)
            force = true
        }
        let spiderName = null
        let domain = []
        if (args.length === 1) {
            spiderName = args[0]
        } else if (args.length >= 2) {
            spiderName = args[0]
            domain = args.slice(1)
        } else {
            this.printOptions()
            return
        }

        if (fs.existsSync('./config.js')) {
            fs.mkdirSync(path.resolve('./spiders/'), {
                recursive: true,
            })
        }
        const spiderPath = fs.existsSync('./config.js') ? path.resolve('./spiders/', spiderName + '.js') : path.resolve('./', spiderName + '.js')
        fs.readFile(template, (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            if (fs.existsSync(spiderPath) && !force) {
                console.log('the spider is exist')
                return
            }
            data = data.toString().replace(/\$\{SPIDER_NAME\}/g, spiderName)
            data = data.toString().replace(/\$\{DOMAIN\}/g, domain.length < 1 ? '' : domain.map((i) => '"' + i + '"').join(', '))
            fs.writeFileSync(spiderPath, data)
        })

    }
}

exports.GenSpiderCommand = new GenSpiderCommand()