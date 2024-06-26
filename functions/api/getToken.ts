interface Env {
  KV: KVNamespace
  CLIENT_ID: string
  CLIENT_SECRET: string
}

async function getToken(
  code: string,
  client_id: string,
  client_secret: string
) {
  const query = `code=${code}&client_id=${client_id}&client_secret=${client_secret}`
  const url = 'https://github.com/login/oauth/access_token?' + query
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const body = await res.json<any>()
  if (!body.access_token) throw 'access_token empty'
  return body
}

export const onRequestGet: PagesFunction<Env> = async context => {
  const { request, env } = context
  const url = new URL(request.url)
  const code = url.searchParams.get('code') || ''
  const tokenData = await getToken(code, env.CLIENT_ID, env.CLIENT_SECRET)
  return Response.json(tokenData)
}
