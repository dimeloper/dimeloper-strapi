# Dimeloper Strapi

Strapi instance used to host content for dimeloper's blog.

## 🚀 Getting started with Strapi

Strapi comes with a fully featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
yarn build
```

## Deploy on pm2

`pm2 start yarn --interpreter bash --name dimeloper-cms -- start-production`

## Environment variables

The environment variables are being saved locally on the `.env` file, and on EC2 there is the ecosystem file which manages them.
