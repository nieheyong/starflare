import axios from 'axios'
import { AuthToken } from '../utils'

const http = axios.create({ baseURL: `/api` })

http.interceptors.request.use(
  req => {
    Object.assign(req.headers, {
      authorization: AuthToken.getAppToken()
    })
    return req
  },
  err => {
    throw err
  }
)

http.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      AuthToken.clean()
      location.href = '/'
    }
    throw err
  }
)

export const getToken = code => http.get(`getToken?code=${code}`)

export const getTag = hash => http.get(`getTag?hash=${hash}`)

export const updateTag = data => http.post(`updateTag`, data)
