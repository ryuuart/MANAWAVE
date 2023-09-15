# MANAWAVE

MANAWAVE is a zero-dependency, customizable, and omnidirectional marquee library for vanilla javascript.

Artistically, it's the website [manawave.art](https://manawave.art) that uses the MANAWAVE library. The website contains a lot of artistic and visual experimentation by [ryuuart](https://github.com/ryuuart).

## Getting Started

[![Edit MANAWAVE STARTER](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/manawave-starter-gj9x2k?file=/src/index.html)

### Documentation

You can take a deep dive into using MANAWAVE on the [documentation site](https://manawave.art/docs/quickstart).

### Installation

You can install in two ways: using a CDN script or using `npm`.

#### CDN

Include this in the `<head>` portion of your HTML.

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/manawave@0.11.1/dist/manawave.min.js"
></script>
```

#### npm

You can use `pnpm`, `yarn`, or the others instead of `npm` if you want.

```sh
npm install manawave
```

### Basic Example

```html
<manawave-marquee speed="1.5" direction="35.5" autoplay>
  Content&nbsp;
</manawave-marquee>
```

## Developing

This repo is an [NX](https://nx.dev) monorepo using [pnpm workspaces](https://pnpm.io) with two packages:

- [manawave](./package/)
- [manawave-demo](./web/)

You can find out more in those repos. There's also a Nix flake devshell if you want to use the included development configuration.

You can use it like this:

```sh
nix develop
```

## Contributing

MANAWAVE started as a solo hobby project so there's definitely something that could be improved. Don't be afraid to [create issues](https://github.com/ryuuart/manawave/issues/new) or PRs for the project. It's greatly appreciated!!

## License

[MIT License](./LICENSE) for everything!
