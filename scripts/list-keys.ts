import { $ } from 'bun'

const keys = await $`bunx wrangler kv:key list --binding API_KEYS`.json() as object[]
console.log(keys)

