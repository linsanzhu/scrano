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
            '--fore': {
                description: 'If the spider already exists, overwrite it with the template',
            },
        }
    }

    run(...args) {
        if (args.length < 1 || args.indexOf('--help') < 0 || args.indexOf('-h') < 0) {
            this.printOptions()
            return
        }

    }
}

exports.GenSpiderCommand = new GenSpiderCommand()