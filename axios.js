import axios from 'axios'
import env from './env'

window.axios = axios.create({
  baseURL: env.api.host
})
let token = sessionStorage.getItem('token')
if (token) {
  window.axios.defaults.headers.common['Authorization'] = `${env.api.token_prefix}${token}`
}
