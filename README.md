<img src="./aksell-logo.svg" width="100px"/>

# Astro Umbraco Headless Starter

```sh
yarn create astro@latest -- --template aksellsor/aks_astro_template
npm create astro@latest -- --template aksellsor/aks_astro-template
```

## Live demo

[![View on Cloudflare Pages](https://img.shields.io/badge/view%20on-Cloudflare%20Pages-orange?logo=cloudflare&logoColor=white&style=for-the-badge)](https://aks-astro-template.pages.dev/)

## Edit

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/aksellsor/aks_astro_template/tree/main)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/devbox/github/aksellsor/aks_astro_template/tree/main)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new/aksellsor/aks_astro_template)

## 🚀 Features

- Multilingual support
- Page transitions by using Swup
- SEO
- Darkmode support

## 🚀 Project Structure

```text
/
├── public/
├── src/
│   └── umbraco-client.ts
│   └── utils.ts
│   └── components/
│       └── standard/
│   └── data/
│       └── translation.json
│   └── layouts/
│       └── Layout.astro
│       └── Root.astro
│       └── Page.astro
│   └── pages/
│       └── [...slug].astro
│       └── 404.astro
│       └── sitemap.xml.js
│       └── robots.txt.ts
└── package.json
```

## Umbraco Compositions

- [umbraco_compositions/globalSEO.udt](umbraco_compositions/globalSEO.udt)

![Umbraco SEO Composition](umbraco_compositions/umbraco-global-seo-composition.jpg)

- [umbraco_compositions/SEO.udt](umbraco_compositions/SEO.udt)

![Umbraco SEO Composition](umbraco_compositions/umbraco-seo-composition.jpg)
