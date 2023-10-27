import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { app } from 'electron'
const docDir = path.resolve(app.getPath('documents'), app.getName())
const mdDir = path.resolve(docDir, 'markdown')
const printMdPath = (id: string) => path.resolve(mdDir, `${id}.md`)
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
const readFile = (id: string): string | null => {
    let doc = null
    try {
        ensureMdDir()
        const filePath = printMdPath(id)
        const exists = fs.existsSync(filePath)
        if (!exists) {
            throw { message: `${id} 파일을 찾을 수 없습니다.` }
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
const writeFile = (id: string, data: string) => {
    ensureMdDir()
    const filePath = printMdPath(id)
    fs.writeFileSync(filePath, data)
    return filePath
}
const removeFile = (id: string): void => {
    try {
        ensureMdDir()
        const filePath = printMdPath(id)
        const exists = fs.existsSync(filePath)
        if (!exists) {
            throw { message: `${id} 파일을 찾을 수 없습니다.` }
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
