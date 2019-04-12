const CommandBase = require('./command')

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
        
    }
}

exports.CrawlCommand = new CrawlCommand()