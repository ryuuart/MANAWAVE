# MANAWAVE Demo

An artistic, flairy homepage to describe, explain, and show what MANAWAVE is and what it can do.

It is organized into 2 parts: **homepage** and **realm**. The homepage should lead users to the realms, docs, or github.

## Getting Started

From the root of the repo (`cd ../` this directory)

```shell
pnpm nx dev manawave-demo
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

All of the docs are used as MDX in `/src/content/docs/docs`. The docs are built with [Astro Starlight](https://starlight.astro.build/) and demoed with [Sandpack](https://sandpack.codesandbox.io/).

Most of it follows the format and recommendations given by Starlight, but there is a [custom Sandpack component](./src/components/docs/sandpack/Sandpack.astro). If you do use it, make sure to provide a `_src/baseNameOfFileYouUsedSandpackIn/` folder next to the file you used. There's a [couple examples](./src/content/docs/docs/guides/) for this.

## License

This is licensed under the [included MIT License](../LICENSE).
