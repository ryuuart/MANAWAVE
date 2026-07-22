# MANAWAVE

This is the node package that contains the MANAWAVE library.

It uses [Vite](https://vite.dev/) to develop and build, and [Vitest browser mode](https://vitest.dev/guide/browser/) driven by [WebdriverIO](https://webdriver.io/) to test. Everything is written in TypeScript.

## Getting Started

Every command below has a `mise run <task>` equivalent from the repo root, which also
handles installing the toolchain.

### Build

This will package and build MANAWAVE into `/dist` as ESM, UMD, and a standalone IIFE
bundle. The stylesheets are injected into the JavaScript so the library stays a single
drop-in file.

```sh
pnpm build
```

### Development

This will launch the dev website and hot reload changes to the source code.

```sh
pnpm dev
```

### Tests

This will test MANAWAVE across browsers.

```sh
pnpm test
```

## Folder Structure

Generally, MANAWAVE tries to separate what's render and system logic. Render logic refers to anything that transforms system logic into visible DOM elements. System logic represent the "simulation" that moves all the stuff inside the marquee around. The "simulation" is done with numbers only. The "system" is the intersection of render and system logic.

The folder structure tries to accomodate for this process.

### `src/anim`

Contains code that control and manage the render loop used throughout the marquee.

> Might branch off into its own library

### `src/dom`

Code that work with anything relating to the DOM.

### `src/marquee`

Code that manage the marquee logic.

### `src/utils`

Contains utility functions.

### `/test`

Markup fixtures and the helpers that mount them into a page.

### `/example`

TODO: cleanup and organize

## Testing

Tests live next to the code they cover, in `__test__` folders, and run **inside a real
browser** — there is no jsdom shim, because a marquee is only meaningful against a real
layout engine.

Each test file gets its own page, so a file is the unit of isolation. Prefer
`vi.waitFor` over sleeping: it polls a condition instead of guessing at a duration, and
`settle()` from `test/fixtures` exists for the rarer case of proving something did *not*
happen.

Chrome and Firefox both run headless and need nothing beyond being installed —
WebdriverIO fetches the matching drivers. Safari cannot run headless and needs a
one-time `safaridriver --enable`, so it is opt-in:

```sh
MANAWAVE_SAFARI=1 pnpm test
```

Code coverage is its own script:

```sh
pnpm test:coverage
```

## License

[MIT License](../LICENSE)
