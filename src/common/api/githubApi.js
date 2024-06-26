import qs from 'query-string'
import axios from 'axios'
import { AuthToken } from '../utils'

const http = axios.create({ baseURL: `https://api.github.com` })

http.interceptors.request.use(
  req => {
    Object.assign(req.headers, {
      authorization: AuthToken.getGithubToken()
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

export const getLoginUser = () => http.get(`user`)

export const getUser = userName => http.get(`users/${userName}`)

export const getLoginUserStarred = (per_page = 40, page = 1) =>
  http.get(`user/starred?` + qs.stringify({ per_page, page }))

export const getUserStarred = (userName, per_page = 40, page = 1) =>
  http.get(`users/${userName}/starred?` + qs.stringify({ per_page, page }))

export const getReadme = (owner, repo) =>
  http.get(`repos/${owner}/${repo}/readme`, {
    headers: { Accept: 'application/vnd.github.VERSION.raw' }
  })
