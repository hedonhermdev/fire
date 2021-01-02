const express = require("express");
const { S3, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { createRequest } = require("@aws-sdk/util-create-request");
const { formatUrl } = require("@aws-sdk/util-format-url");

const File = require("../../models/File");
const { response } = require("express");

const BUCKET_NAME = "ocean-file-bucket";
const REGION = "ap-south-1";
const EXPIRATION = 5 * 60 * 1000;
const BASE_URL = "https://" + BUCKET_NAME + "." + "REGION" + "amazonaws.com/";

const createFile = async (req, res) => {
    const { filename } = req.body;

    let user = req.user;
    if (user == null) {
        user = { username: "AnonymousUser" };
    }
    console.log("User", user);

    if (!filename) {
        return res.status(400).send({
            message:
                'Missing fields in request body. You need to provide the "filename"',
        });
    }

    const key = user.username + "/" + filename;
    const url = BASE_URL + key;

    const Client = new S3({ region: REGION });

    console.debug(Client);

    let signedUrl;

    try {
        const signer = new S3RequestPresigner({ ...Client.config });
        const request = await createRequest(
            Client,
            new PutObjectCommand({ Key: key, Bucket: BUCKET_NAME })
        );

        const expiration = new Date(Date.now() + EXPIRATION);

        signedUrl = formatUrl(await signer.presign(request, expiration));
        console.log("signedUrl", signedUrl);
    } catch (e) {
        const status = e.status || 500;
        return res.status(status).send({
            message: e.message,
        });
    }

    try {
        const file = new File({
            owner: user.id,
            filename: filename,
            key: key,
            url: url,
        });
        await file.save();
    } catch (e) {
        const status = e.status || 500;
        return response.status(status).send(e);
    }

    return res.status(201).send({ file: file, signedUrl: signedUrl });
};

const deleteFile = async (req, res) => {
    const file = await File.findById(req.params.id)
    if (!file) {
        return res.status(404).send({
            message: `File with id ${req.params.id} does not exist`
        })
    }

    // Delete from database
    await file.remove()
    
    // Delete from S3
    const Client = new S3({ region: REGION });

    const { key } = file

    try {
        await Client.send(new DeleteObjectCommand({Bucket: BUCKET, Key: key}))
    } catch (e) {
        return res.status(500).send({
            message: `Failed to delete ${key} from AWS S3 bucket. `
        })
    }
};

const router = new express.Router();
router.post("/", createFile);
router.delete("/:id", deleteFile);

module.exports = router;
