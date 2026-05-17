# ui-looper

UI component library for **Module Federation 2.0** — distributed via **GitHub** (no npm required).

- Repository: https://github.com/EvgenyAbc/ui-looper
- MF remote (after release): https://evgenyabc.github.io/ui-looper/remoteEntry.js
- Versioned: `https://evgenyabc.github.io/ui-looper/v1.0.0/remoteEntry.js`

## Quick start (local)

```bash
git clone https://github.com/EvgenyAbc/ui-looper.git
cd ui-looper
npm install
npm run dev
```

- `http://localhost:3030/remoteEntry.js`
- Demo: `http://localhost:3030`

## Use from any MF2 host

```ts
init({
  remotes: [{
    name: 'ui_looper',
    entry: 'https://evgenyabc.github.io/ui-looper/remoteEntry.js',
    alias: 'ui_looper',
  }],
});
await loadRemote('ui_looper/Button');
```

See [CONNECT.md](./CONNECT.md).

## Docker

```bash
docker compose up --build
```

## Releases

Tag `v*` → GitHub Actions builds `dist/` and deploys to GitHub Pages.

```bash
npm run build:mf
git tag v1.0.0 && git push origin v1.0.0
```

Enable **GitHub Pages** in repo Settings → Pages → source: **GitHub Actions**.

## License

MIT
