const express = require("express")

const File = require("../../models/File")
const { response } = require("express")
const { InitFileUploadBackend } = require("./backend")

const auth = require('../../middleware/auth')

const BUCKET_NAME = "ocean-file-bucket"
const REGION = "ap-south-1"
const EXPIRATION = 5 * 60 * 1000
const BASE_URL = "https://" + BUCKET_NAME + "." + "REGION" + "amazonaws.com/"

const FileUploadBackend = InitFileUploadBackend("AWS-S3", {
    bucket_name: BUCKET_NAME,
    region: REGION,
    expiration: REGION,
    base_url: BASE_URL,
})

const createFile = async (req, res) => {
    const { filename } = req.body

    let user = req.user
    if (user == null) {
        user = { username: "AnonymousUser" }
    }
    console.log("User", user)

    if (!filename) {
        return res.status(400).send({
            message:
                'Missing fields in request body. You need to provide the "filename"',
        })
    }

    const key = user.username + "/" + filename
    const url = BASE_URL + key

    let signedUrl
    try {
        signedUrl = await FileUploadBackend.getPresignedUrl(key)
    } catch (e) {
        const status = e.status || 500
        return response.status(status).send(e)
    }

    let file
    try {
        file = new File({
            owner: user.id,
            filename: filename,
            key: key,
            url: url,
        })
        await file.save()
    } catch (e) {
        const status = e.status || 500
        return response.status(status).send(e)
    }

    return res.status(201).send({ file: file, signedUrl: signedUrl })
}

const deleteFile = async (req, res) => {
    const file = await File.findById(req.params.id)
    if (!file) {
        return res.status(404).send({
            message: `File with id ${req.params.id} does not exist`,
        })
    }

    // Delete from database
    await file.remove()

    // Delete from S3
   
    try {
        const resp = FileUploadBackend.deleteFile(file.key)
        return res.status(200).send(resp)
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
}

const confirmFile = async (req, res) => {
    const file = await File.findById(req.params.id)

    if (!file) {
        return res.status(404).send({
            message: `File with id ${req.params.id} does not exist`,
        })
    }

    try {
        const resp = await FileUploadBackend.confirmUpload(file.key)
        return res.status(200).send(resp)
    } catch(e) {
        return res.status(400).send({
            message: `Failed to confirm file with key: ${file.key}`
        })
    }
}


const router = new express.Router()

router.post("/", auth, createFile)
router.delete("/:id", auth, deleteFile)
router.get("/:id", auth, confirmFile)

module.exports = router
