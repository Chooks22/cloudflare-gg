import { $ } from 'bun'

const len = 512 / 8
const buf = new Uint8Array(len)
crypto.getRandomValues(buf)

let data = ''
for (let i = 0; i < len; i++) {
  data += String.fromCharCode(buf[i])
}

const key = btoa(data)
await $`wrangler kv:key put --binding API_KEYS ${key} '1'`

const env = `
API_KEY="${key}"
API_URL="${process.env.API_URL ?? ''}"
`

await Bun.write('.env', env.trim())
