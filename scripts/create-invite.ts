const [invite_key = '', invite_code = ''] = process.argv.slice(2)

if (invite_key === '' || invite_code === '') {
  console.error('usage: bun create-invite <invite-key> <invite-code>')
  console.error('example: bun create-invite gamers hrgUh5kFns')
  process.exit(1)
}

const { API_URL = 'https://gg.chooks.app', API_KEY } = process.env
if (API_KEY === undefined) {
  console.error('error: api key is not defined')
}

const invite_link = `${API_URL}/${invite_key}`

const res = await fetch(invite_link, {
  method: 'POST',
  headers: {
    authorization: process.env.API_KEY!,
  },
  body: invite_code,
})

if (res.ok) {
  console.log(`invite created: ${invite_link}`)
} else {
  console.error(`server responded with status code: ${res.status}`)
  process.exit(1)
}
