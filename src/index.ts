interface Env {
  API_KEYS: KVNamespace
  INVITES: KVNamespace
}

function respond(status: number, headers?: HeadersInit) {
  return new Response(null, { status, headers })
}

function create_invite(code: string, timestamp: string) {
  return respond(303, {
    'location': `https://discord.com/invite/${code}`,
    'last-modified': timestamp,
  })
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const now = new Date().toUTCString()
    const cache = caches.default

    const url = new URL(req.url)
    const invite_key = url.pathname.slice(1)
    if (invite_key === '') {
      return respond(404)
    }

    switch (req.method) {
      default: {
        return respond(405)
      }

      case 'GET': {
        const cached = await cache.match(req)
        if (cached) {
          console.info('cached: %d %s', cached.status, invite_key)
          return cached
        }

        const invite_code = await env.INVITES.get(invite_key)
        let res: Response

        if (invite_code === null) {
          res = respond(404, { 'last-modified': now })
        } else {
          res = create_invite(invite_code, now)
        }

        console.info('respond: %d %s "%s"', res.status, invite_key, invite_code)
        await cache.put(req.url, res)
        return res
      }

      // @todo: rate limit by ip
      case 'POST': {
        const api_key = req.headers.get('authorization')
        if (api_key === null) {
          console.info('respond: 401 %s', invite_key)
          return respond(401)
        }

        // checks if api key exists
        if (await env.API_KEYS.get(api_key, 'stream') === null) {
          console.info('respond: 403 %s "%s"', invite_key, api_key)
          return respond(403)
        }

        const invite_code = await req.text()

        if (invite_code === '') {
          console.info('respond: 400 %s "no invite code"', invite_key)
          return respond(400)
        }

        const res = create_invite(invite_code, now)
        await Promise.all([
          cache.put(req.url, res),
          env.INVITES.put(invite_key, invite_code),
        ])

        console.info('respond: 200 %s "%s"', invite_key, invite_code)
        return respond(200)
      }
    }
  },
}
