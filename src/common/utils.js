import linkHeader from 'http-link-header'
import qs from 'query-string'
import githubLanColor from './githubLanColor'

export const delay = ms => new Promise(res => setTimeout(res, ms))

export const AuthToken = {
  getAppToken() {
    return localStorage.appToken
  },
  getGithubToken() {
    return localStorage.githubToken
  },
  setToken(appToken, githubToken) {
    localStorage.githubToken = githubToken
    localStorage.appToken = appToken
  },
  clean() {
    AuthToken.setToken('', '')
  },
  exist() {
    return !!AuthToken.getAppToken()
  }
}

// https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
export const openWindowCenter = (url, title, w, h) => {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft =
    window.screenLeft != undefined ? window.screenLeft : window.screenX
  var dualScreenTop =
    window.screenTop != undefined ? window.screenTop : window.screenY

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  var systemZoom = width / window.screen.availWidth
  var left = (width - w) / 2 / systemZoom + dualScreenLeft
  var top = (height - h) / 2 / systemZoom + dualScreenTop
  var newWindow = window.open(
    url,
    title,
    'scrollbars=yes, width=' +
      w / systemZoom +
      ', height=' +
      h / systemZoom +
      ', top=' +
      top +
      ', left=' +
      left
  )

  // Puts focus on the newWindow
  if (window.focus) newWindow.focus()
  return newWindow
}

export const getPageFromLinkStr = linkStr => {
  const link = linkHeader.parse(linkStr)
  const refs = link.get('rel', 'last')
  if (refs.length) {
    const res = qs.parseUrl(refs[0].uri)
    return res.query.page
  }
  return 1
}

export const getLanguageColor = lan => githubLanColor[lan]

export function downloadString(text, fileType, fileName) {
  const blob = new Blob([text], { type: fileType })

  const a = document.createElement('a')
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(function() {
    URL.revokeObjectURL(a.href)
  }, 1500)
}
