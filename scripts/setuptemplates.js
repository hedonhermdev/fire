const path = require('path')
const fs = require('fs')

require('../src/db/mongoose')
const PageTemplate = require('../src/models/PageTemplate')
const PageGroupTemplate = require('../src/models/PageGroupTemplate')

const pageTemplateDir = path.join(__dirname, '../meta/pageTemplates')
const pageGroupTemplateDir = path.join(__dirname, '../meta/pageGroupTemplates')

const getFileList = (dir, ext) => {
    const files = fs.readdirSync(dir)
    const fileList = []
    files.forEach((file) => {
        if (file.split('.').pop() === ext) {
            const fileName = path.parse(path.basename(file)).name
            fileList.push(fileName)
        }
    })

    return fileList
}

const setPageTemplateData = async (name, data) => {
    const pageTemplate = await PageTemplate.findOne({ name })
    if (!pageTemplate) {
        const pgTemplate = new PageTemplate({ name, data })
        await pgTemplate.save()
        console.log(`Created PageTemplate ${name}`)
        return
    }

    if (JSON.stringify(data) === JSON.stringify(pageTemplate.data)) {
        console.log(`No change in PageTemplate ${name}`)
        return
    }

    try {
        pageTemplate.data = data
        await pageTemplate.save()
        console.log(`Updated Page Template ${name}`)
    }
    catch (e) {
        console.log(`Unable to populate PageTemplate ${name}`)
    }
}

const loadPageTemplates = async (dir) => {
    const fileNames = getFileList(dir, 'json')
    fileNames.forEach(async (fileName) => {
        const data = require(path.join(dir, `${fileName}.json`))
        await setPageTemplateData(fileName, data)
    })
}

const setPageGroupTemplateData = async (name, data) => {
    const pageGroupTemplate = await PageGroupTemplate.findOne({ name })
    if (!pageGroupTemplate) {
        const pgTemplate = new PageGroupTemplate({ name, data })
        await pgTemplate.save()
        console.log(`Created PageGroupTemplate ${name}`)
        return
    }

    if (JSON.stringify(data) === JSON.stringify(pageGroupTemplate.data)) {
        console.log(`No change in PageGroupTemplate ${name}`)
        return
    }

    try {
        pageGroupTemplate.data = data
        await pageGroupTemplate.save()
        console.log(`Updated PageGroupTemplate ${name}`)
    }
    catch (e) {
        console.log(`Unable to populate PageGroupTemplate ${name}`)
    }
}

const loadPageGroupTemplates = async (dir) => {
    const fileNames = getFileList(dir, 'json')
    fileNames.forEach(async (fileName) => {
        const data = require(path.join(dir, `${fileName}.json`))
        await setPageGroupTemplateData(name, data)
    })
}

const run = async () => {
    await loadPageTemplates(pageTemplateDir)
    await loadPageGroupTemplates(pageGroupTemplateDir)
}

run()