const jwt = require('jsonwebtoken')
const {now} = require('lodash')

class DiskStorage {
    constructor({root_path, expiration=5*60*1000, host='localhost', upload_path}) {
        this.host = host
        this.root_path = root_path
        this.upload_path = upload_path
        this.expiration = expiration
    }

    async getPresignedUrl(key) {
        const data = {
            key: key,
            expires: now() + this.expiration
        }
        const encoded_token = jwt.sign(data, process.env.JWT_SECRET || 'lolmao12345')

        const signedUrl = this.host + this.upload_path + encoded_token

        return signedUrl
    }

    async handleFileUpload(token, file) {
    }
}
