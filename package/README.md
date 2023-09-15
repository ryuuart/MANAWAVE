# MANAWAVE

This is the node package that contains the MANAWAVE library.

It uses [vite](https://vitejs.dev/) and [wdio](https://webdriver.io/) to develop, build, and test the library. Everything is written in Typescript.

## Getting Started

### Build

This will package and build MANAWAVE into `/dist`.

```sh
pnpm nx build manawave
```

### Development

This will launch the dev website and hot reload changes to the source code.

```sh
pnpm nx dev manawave
```

### Tests

This will test MANAWAVE across browsers.

```sh
pnpm nx test manawave
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

[WDIO page objects](https://webdriver.io/docs/pageobjects/).

### `/example`

TODO: cleanup and organize

## Testing

Tests should all be in one file. This is to make sure wdio doesn't launch too many browsers in parallel.

## License

[MIT License](../LICENSE)
