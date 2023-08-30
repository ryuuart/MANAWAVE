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
      content: `window.addEventListener('load', () => document.querySelector('.site-title').href += 'docs')`
    }],
  }), react()]
});