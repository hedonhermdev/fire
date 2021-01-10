const AwsS3 = require("./aws_s3")

class FileUploadBackend {
    constructor() {
        throw new Error("FileUploadBackend class cannot be instantiated")
    }

    async getPresignedUrl(key) {
        throw new Error("Not implemented")
    }

    async confirmUpload(key) {
        throw new Error("Not implemented")
    }

    async deleteFile(key) {
        throw new Error("Not implemented")
    }
}

const InitFileUploadBackend = (name, config) => {
    switch(name) {
        case "AWS-S3":
            return new AwsS3(config)
        default:
            throw new Error(`Cannot find backend with name ${name}`)
    }
}

module.exports = {
    FileUploadBackend,
    InitFileUploadBackend,
}
