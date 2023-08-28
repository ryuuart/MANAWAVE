# Manawave Demo

An artistic, flairy homepage to describe, explain, and show what manawave is and what it can do.

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

A _realm_ is an artistic demonstration or idea of what manawave can do. It should be inspired from personal experiences that helped evolve their sense of self (infinite evolution). It should also reveal an aspect or creative usage of manawave's omnidirectional or customizable capabilities.

### Creating a new realm

A realm must be specified in multiple places:

1. In `data/realms.json`
2. In `src/pages/realms/[realm].astro`

For `realms.json`, make sure you follow the schema precisely and include all parts as shown in the existing realms.

A realm in `pages/realm` must use the `Realm` layout in `src/layouts/realms/Realm.astro`.

A `Realm` layout must include a `realm` prop which should match the name of the realm (the key) in `realm.json`. You should also include a browser page title with the `pageTitle` prop which can be anything you want. Lastly, you can optionally include a `config.colors.tab` to control the browser tab bar color.

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

## License

This is licensed under the [included MIT License](../LICENSE).
