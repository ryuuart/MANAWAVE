import { defineConfig } from 'astro/config';
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [starlight({
    title: "MANAWAVE DOCS",
    favicon: '/favicon-32x32.png',
    social: {
      github: "https://github.com/ryuuart/manawave",
    },
    head: [{
      tag: 'script',
      content: `window.addEventListener('load', () => document.querySelector('.site-title').href += 'docs/quickstart')`
    }, {
      tag: 'script',
      content: "console.info('If you see sandpack CORS error, it is a current issue in sandpack-react');"
    },
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        href: 'favicon.ico',
        sizes: '32x32',
      },
    },
    ],
    sidebar: [
      { label: "Home", link: "/" },
      {
        label: "Start Here",
        autogenerate: { directory: 'docs/quickstart' }
      },
      {
        label: "Guides",
        autogenerate: { directory: 'docs/guides' }
      },
      {
        label: "Reference",
        autogenerate: { directory: 'docs/reference' }
      }
    ]
  }), react()]
});