import { defineConfig } from 'astro/config';
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [starlight({
    title: "manawave docs",
    social: {
      github: "https://github.com/ryuuart/manawave",
    },
    head: [{
      tag: 'script',
      content: `window.addEventListener('load', () => document.querySelector('.site-title').href += 'docs/quickstart')`
    }, {
      tag: 'script',
      content: "console.info('If you see sandpack CORS error, it is a current issue in sandpack-react');"
    }],
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