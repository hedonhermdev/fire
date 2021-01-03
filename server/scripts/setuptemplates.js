const path = require('path')
const fs = require('fs')

require('../src/db/mongoose')

const DataBlockTemplate = require('../src/models/DataBlockTemplate')
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

const setPageTemplateData = async (name, structure) => {
    if (!structure._meta) {
        structure._meta = {
            quantity: 1
        }
    }
    const pageTemplate = await DataBlockTemplate.findOne({ name, templateType: 'PAGE' })
    if (!pageTemplate) {
        const pgTemplate = new DataBlockTemplate({ name, structure, templateType: 'PAGE' })
        await pgTemplate.save()
        console.log(`Created DataBlockTemplate ${name}`)
        return
    }

    if (JSON.stringify(structure) === JSON.stringify(pageTemplate.structure)) {
        console.log(`No change in DataBlockTemplate ${name}`)
        return
    }

    try {
        pageTemplate.structure = structure
        pageTemplate.templateType = 'PAGE'
        await pageTemplate.save()
        console.log(`Updated Page Template ${name}`)
    }
    catch (e) {
        console.log(`Unable to populate DataBlockTemplate ${name}`)
    }
}

const loadPageTemplates = async (dir) => {
    const fileNames = getFileList(dir, 'json')
    fileNames.forEach(async (fileName) => {
        const data = require(path.join(dir, `${fileName}.json`))
        await setPageTemplateData(fileName, data)
    })
}

const setPageGroupTemplateData = async (name, template) => {
    if (template.data && !template.data._meta) {
        template.data._meta = {
            quantity: 1
        }
    }
    const pgTemplate = await PageGroupTemplate.findOne({ name }).populate('dataBlockTemplate')
    if (!pgTemplate) {
        const dbt = new DataBlockTemplate({
            name,
            structure: template.data,
            templateType: 'PAGE_GROUP'
        })
        await dbt.save()
        const pgt = new PageGroupTemplate({
            name,
            pageGroupStructure: template.structure,
            dataBlockTemplate: dbt
        })
        await pgt.save()
        console.log(`Created PageGroupTemplate ${name}`)
        return
    }

    const structureUpdated = (JSON.stringify(template.structure) !== JSON.stringify(pgTemplate.pageGroupStructure))
    const dbTemplateUpdated = (JSON.stringify(template.data) !== JSON.stringify(pgTemplate.dataBlockTemplate.structure))

    if (dbTemplateUpdated) {
        const dbTemplate = pgTemplate.dataBlockTemplate
        dbTemplate.structure = template.data
        await dbTemplate.save()
    }

    if (structureUpdated) {
        pgTemplate.pageGroupStructure = template.structure
        await pgTemplate.save()
    }

    if (!dbTemplateUpdated && !structureUpdated) {
        console.log(`No change in PageGroupTemplate ${name}`)
        return
    }

    console.log(`Updated PageGroupTemplate ${name}`)
}

const loadPageGroupTemplates = async (dir) => {
    const fileNames = getFileList(dir, 'json')
    fileNames.forEach(async (fileName) => {
        const data = require(path.join(dir, `${fileName}.json`))
        await setPageGroupTemplateData(fileName, data)
    })
}

const run = async () => {
    await loadPageTemplates(pageTemplateDir)
    await loadPageGroupTemplates(pageGroupTemplateDir)
}

run()