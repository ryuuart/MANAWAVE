import { defineConfig } from 'astro/config';
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: "manawave docs",
    head: [
      {
        tag: 'script',
        content: `window.addEventListener('load', () => document.querySelector('.site-title').href += 'docs')`,
      },
    ],
  })]
});