# SvelteKit-Cloudflare-Blog

This is the accompanying repository for my talk ["Edge Computing For Frontend Web Development"](https://slides.com/nilsroehrig/edge-computing-for-frontend-web-development-ijs-munich-2023). The live app can be found at https://sveltekit-cloudflare-blog.pages.dev/.

## Developing

Once you've checked out the repository and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev
```

## Preview

The project is configured to be run on Cloudflare Pages. You can run a local preview by running the wrangle script:

```bash
npm run wrangle
```

> [!NOTE]
> Please be aware, that it is necessary to configure the app accordingly:
> - `wrangler.toml` must specify your KV namespace id for the binding. Refer to [`wrangler.toml.example`](./wrangler.toml.example).
> - `.env.local` must specify your Github app credentials and a comma-separated list of permitted email addresses. Refer to [`.env.example`](./.env.example).

Please refer to the [Auth.js documentation](https://authjs.dev/getting-started/oauth-tutorial?frameworks=sveltekit) on how to setup an OAuth app in GitHub. If you want to deploy the project to Cloudflare yourself, you can follow my [Guide](https://nilsroehrig.github.io/sveltekit/cloudflare/edge/2022/09/09/setting-up-cloudflare-pages-with-sveltekit.html) or the official SvelteKit and Cloudflare Pages documentation.
