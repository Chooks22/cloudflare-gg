# cloudflare-gg

A project to generate vanity links to discord invites using [Cloudflare Workers](https://workers.cloudflare.com/).

## Prerequisites

This project requires [Bun](https://bun.sh/) to be installed.
You also need a free [Cloudflare account](https://dash.cloudflare.com/) to deploy to.

## Setup

To use, clone and install the project:

```sh
$ git clone https://github.com/Chooks22/cloudflare-gg
$ cd cloudflare-gg
$ bun i
```

Setup `wrangler` and update the [`wrangler.toml`](https://developers.cloudflare.com/workers/wrangler/configuration/)
file to suit your own deployment.

Then deploy your project using:

```sh
$ bun run deploy
```

## How-to

### Create your first vanity url

Create a key to generate urls:

```sh
$ bun generate-key
```

Open up the `.env` file and update `API_URL` to your current deployment:

```sh
API_KEY="..."
API_URL="https://your-deployment.workers.dev"
```

Generate your first vanity url using:

```sh
$ bun create-invite gamers hrgUh5kFns
```

A new vanity url <https://your-deployment.workers.dev/gamers> has been
generated and should now redirect you to <https://discord.com/invite/hrgUh5kFns>.

### Creating a vanity url

```sh
$ bun create-invite <invite-key> <invite-code>
```

### List existing api keys

```sh
$ bun list-keys
```
