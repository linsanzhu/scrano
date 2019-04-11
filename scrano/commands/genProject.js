#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const CommandBase = require('./command')

class GenProjectCommand extends CommandBase {
    constructor() {
        super()
        this.options = {
            '--help': {
                cmd: null,
                alias: '-h',
                description: 'show this help message and exit',
            },
        }
        this.usage = 'scrano genproject <project_name> [project_dir]'
        this.description = 'Create new project'
        this.copyDir = this.copyDir.bind(this)
    }

    copyDir(fromDir, toDir) {
        fs.readdir(fromDir, (err, list) => {
            if (err) {
                console.log(`error occur while generate project`)
                return
            }
            list.forEach((fp) => {
                const fpPath = path.join(fromDir, fp)
                const toPath = path.join(toDir, fp)
                fs.stat(fpPath, (err, stats) => {
                    if (err) {
                        //
                    } else if (stats.isDirectory()) {
                        fs.mkdirSync(toPath)
                        this.copyDir(fpPath, toPath)
                    } else if (stats.isFile()) {
                        fs.readFile(fpPath, (err, data) => {
                            if (err) {
                                console.log(`error occur while generate project`)
                                return
                            }
                            fs.writeFileSync(toPath, data)
                        })
                    }
                })
            })
        })
    }

    run(...args) {
        if (args.length < 1 || args.indexOf('-h') >= 0 || args.indexOf('--help') >= 0) {
            this.printOptions()
        } else {
            const [ projectName, projectDir, ] = args
            const dir = path.join(path.resolve(projectDir || './'), projectName)

            fs.mkdirSync(dir, {
                recursive: true,
            })

            const templateDir = path.resolve(__dirname, '../template/project/')
            this.copyDir(templateDir, dir)
        }
    }

}

exports.GenProjectCommand = new GenProjectCommand()
