class CommandBase {

    printOptions() {
        const align = (l, tabLen = 25) => {
            let res = ''
            if (l >= tabLen) {
                res += '\n  '
                l = tabLen
            } else {
                l = tabLen - l
            }
            for (let i = 0;i < l; ++i) {
                res += ' '
            }
            return res
        }
        console.log("Usage:")
        console.log("======")
        console.log(`  ${this.usage}`)
        console.log()
        console.log(`${this.description}`)
        console.log()
        console.log('Options:')
        console.log('======')
        for (const entry of Object.entries(this.options)) {
            if (entry[1].usage) {
                console.log(`  ${entry[1].usage}${align(entry[1].usage.length)}${entry[1].description}`)
            } else {
                const _ = `${entry[0]}${entry[1].alias ? ', ' + entry[1].alias : ''}`
                console.log(`  ${_}${align(_.length)}${entry[1].description}`)
            }
        }
        console.log()
    }
}

module.exports = CommandBase