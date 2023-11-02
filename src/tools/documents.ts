import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { app } from 'electron'
const docDir = path.resolve(app.getPath('documents'), app.getName())
const mdDir = path.resolve(docDir, 'markdown')
const printMdPath = (filename: string) => path.resolve(mdDir, `${filename}.md`)
const ensureMdDir = () => fs.ensureDirSync(mdDir, { mode: 0o2775 })
const readFilenames = (): string[] => {
    let filenames: string[] = []
    try {
        ensureMdDir()
        filenames = fs.readdirSync(mdDir)
        filenames = filenames.filter(
            (filename) => !filename.includes('.DS_Store')
        )
    } catch (e) {
        console.error(e)
    }
    return filenames
}
const readFile = (filename: string): string | null => {
    let doc = null
    try {
        ensureMdDir()
        const filePath = printMdPath(filename)
        const exists = fs.existsSync(filePath)
        if (!exists) {
            throw { message: `${filename} 파일을 찾을 수 없습니다.` }
        }
        const file = fs.readFileSync(filePath)
        if (file) {
            doc = _.toString(file)
        }
    } catch (e) {
        console.error(e)
    }
    return doc
}
const writeFile = (filename: string, data: string) => {
    ensureMdDir()
    const filePath = printMdPath(filename)
    fs.writeFileSync(filePath, data)
    return filePath
}
const removeFile = (filename: string): void => {
    try {
        ensureMdDir()
        const filePath = printMdPath(filename)
        const exists = fs.existsSync(filePath)
        if (!exists) {
            throw { message: `${filename} 파일을 찾을 수 없습니다.` }
        }
        fs.unlinkSync(filePath)
    } catch (e) {
        console.error(e)
    }
}
export default {
    readFile,
    readFilenames,
    writeFile,
    removeFile,
}
