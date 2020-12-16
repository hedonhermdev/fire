import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://192.168.2.2:8070/'
})

export default instance