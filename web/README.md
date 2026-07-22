# MANAWAVE Demo

An artistic, flairy homepage to describe, explain, and show what MANAWAVE is and what it can do.

It is organized into 2 parts: **homepage** and **realm**. The homepage should lead users to the realms, docs, or github.

## Getting Started

From the root of the repo (`cd ../` this directory)

```shell
mise run site
```

This will build and load `manawave` onto this project as a dependency.

## General Notes

This demo makes use of the [astro framework](https://astro.build)

A lot of effects for the demos make use of CSS `mix-blending-mode: overlay` and `webm` video or `webp` animation.

## Realms

A _realm_ is an artistic demonstration or idea of what MANAWAVE can do. It should be inspired from personal experiences that helped evolve their sense of self (infinite evolution). It should also reveal an aspect or creative usage of MANAWAVE's omnidirectional or customizable capabilities.

If you have an idea for a Realm, it would be very very very cool to represent what you think, envision, and feel onto the MANAWAVE website.

### Creating a new realm

A realm must be specified in multiple places:

1. In `src/realms/[realm].md`
2. In `src/pages/realms/[realm].astro`

#### Realm Schema

```txt
title: string
tagline: string
author: authorFileName // author file in src/content/authors
song:
  name: string
  link: https url string
color:
  portal: css color string
```

#### [realm].md

Make sure you follow the schema precisely and include all parts as shown in the [existing realms](./src/content/realms/).

#### Realm Page

A realm in `pages/realm` must use the `Realm` layout in `/src/layouts/realms/Realm.astro`. Refer to the [other realms](./src/pages/realms/) as an example.

A `Realm` layout must include a `realm` prop which should match the `title` of the realm. You should also include a browser page title with the `pageTitle` prop which can be anything you want. Lastly, you can optionally include a `config.colors.tab` to control the browser tab bar color.

### Styling

Tailwind dresses the art side of the site only — the docs keep Starlight's own styling,
so `@tailwindcss/vite` output never reaches them. Everything shared lives in
[`src/styles/global.css`](./src/styles/global.css):

- `@theme` holds the two colours and two typefaces, which makes them Tailwind
  utilities (`text-fg`, `font-display`) *and* leaves the plain custom properties that
  each realm overrides.
- `@utility block-grid` / `block-subgrid` describe the five-column measure the home
  page is built on. Sections **inherit** those tracks with `grid-template-columns:
  subgrid` rather than redeclaring `repeat(5, 1fr)` at every level, so the column
  numbers in each `grid-area` can only ever refer to one set of tracks.

The one thing to know about `subgrid`: `-1` addresses the end of the *explicit* grid, so
it collapses to a single row in a container that only has `grid-auto-rows`. The home
page's backdrop layers (`GodText`, `Starlight`) rely on this — they share one explicit
row with `.hero-content` instead of spanning a counted number of rows.

One thing done for each realm is overriding the global color by overriding the global css variables.

```html
<style is:global>
  :root {
    /* Foreground (text and border) color */
    --color-fg: black;

    /* Background (HTML body) color */
    --color-bg: white;
  }
</style>
```

### Creating a new author

Inside of `/src/content/authors`, create a new json file titled your preferred named and following the schema.

#### Author Schema

```json
{
  "name": "your name",
  "link": "your preferred, safe link to your bio or website"
}
```

## Documentation

All of the docs are used as MDX in `/src/content/docs/docs`. The docs are built with [Astro Starlight](https://starlight.astro.build/) and demoed with [LiveCodes](https://livecodes.io/).

Most of it follows the format and recommendations given by Starlight, but there is a [custom Playground component](./src/components/docs/Playground.astro). It takes `html`, `css`, and `js` strings plus an `active` editor, and it resolves a bare `import ... from "manawave"` inside the sandbox against the published build. If you do use it, make sure to provide a `_src/baseNameOfFileYouUsedThePlaygroundIn/` folder next to the file you used. There's a [couple examples](./src/content/docs/docs/guides/) for this.

## Typechecking

`pnpm lint` runs `astro sync && tsc --noEmit`.

It is deliberately **not** `astro check`. That command drives
`@astrojs/language-server`, which needs TypeScript's JS Compiler API — the native
TypeScript 7 compiler does not ship it, and the checker refuses to start rather than
crash. Tracking: [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321).

The practical consequence: `.ts` files are fully checked, `.astro` frontmatter is not.
Swap the script back to `astro check` (and add `@astrojs/check` back) once Astro
supports TypeScript 7.

## License

This is licensed under the [included MIT License](../LICENSE).
