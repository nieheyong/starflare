workbox.core.setCacheNameDetails({ prefix: 'cdn-gitpage-test' })

workbox.core.skipWaiting()
workbox.core.clientsClaim()

const cdnPath = ''

const tryUseCdn = asset => {
  // const hasHash = /\.[0-f]+\./
  // if (hasHash.test(asset.url) && !asset.cdn) asset.url = cdnPath + asset.url
  return asset
}

const precacheManifest = []
  .concat(self.__precacheManifest || [])
  .filter(({ url }) => !url.endsWith(".png"))
  .map(tryUseCdn)

workbox.precaching.precacheAndRoute(precacheManifest, {})
