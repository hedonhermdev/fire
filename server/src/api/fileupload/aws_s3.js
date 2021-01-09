const {
    S3,
    PutObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
} = require("@aws-sdk/client-s3")
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner")
const { createRequest } = require("@aws-sdk/util-create-request")
const { formatUrl } = require("@aws-sdk/util-format-url")

class AwsS3 {
    constructor({
        bucket_name,
        region,
        expiration = 5 * 60 * 1000,
        base_url = null,
    }) {
        this.bucket_name = bucket_name
        this.region = region
        this.expiration = expiration
        this.base_url = base_url
            ? base_url
            : "https://" + bucket_name + "." + "REGION" + "amazonaws.com/"

        this.client = new S3({ region: this.region })
    }

    async getPresignedUrl(key) {
        let signedUrl

        try {
            const signer = new S3RequestPresigner({ ...this.client.config })
            const request = await createRequest(
                this.client,
                new PutObjectCommand({ Key: key, Bucket: this.bucket_name })
            )

            const expiration = new Date(Date.now() + this.expiration)

            signedUrl = formatUrl(await signer.presign(request, expiration))

            console.log(signedUrl)

            return signedUrl
        } catch (e) {
            throw new Error(`Cannot generate presigned url for AwsS3: ${e}`)
        }
    }

    async confirmUpload(key) {
        try {
            const resp = await this.client.send(new HeadObjectCommand({Bucket: this.bucket_name, Key: key}))
            return resp
        } catch (e) {
            throw new Error(`Cannot find file with key ${key}: ${e}`)
        }
    }

    async deleteFile(key) {
        try {
            const resp = await this.client.send(new DeleteObjectCommand({Bucket: this.bucket_name, Key: key}))
            return resp
        } catch (e) {
            throw new Error(`Cannot delete file with key ${key}: ${e}`)
        }
    }
}

module.exports = AwsS3
