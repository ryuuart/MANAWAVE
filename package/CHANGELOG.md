# manawave

## 0.12.0

### Minor Changes

- [#239](https://github.com/ryuuart/MANAWAVE/pull/239) [`526f3c9`](https://github.com/ryuuart/MANAWAVE/commit/526f3c9a0fc6f0811bc6dbad970a71c00778e1a3) Thanks [@ryuuart](https://github.com/ryuuart)! - Add `initialSize` input for `onLayout` hook

### Patch Changes

- [#235](https://github.com/ryuuart/MANAWAVE/pull/235) [`5b44ba7`](https://github.com/ryuuart/MANAWAVE/commit/5b44ba70238ff90c21b61caec410c29bede8a7df) Thanks [@ryuuart](https://github.com/ryuuart)! - Improve module import / export behavior

## 0.11.2

### Patch Changes

- [#228](https://github.com/ryuuart/manawave/pull/228) [`01ec9ca`](https://github.com/ryuuart/manawave/commit/01ec9ca8a5442f792b61191441ce8cd0269009e2) Thanks [@ryuuart](https://github.com/ryuuart)! - Fix playstate desync when not using autoplay

## 0.11.1

### Patch Changes

- [#216](https://github.com/ryuuart/manawave/pull/216) [`2cf5895`](https://github.com/ryuuart/manawave/commit/2cf58951c2e1d778ae24118ed501b28c605d2d8e) Thanks [@ryuuart](https://github.com/ryuuart)! - Add browser cdn target by building for IIFE

- [`65184b1`](https://github.com/ryuuart/manawave/commit/65184b1598f3e413656fe753155246a023bf8202) Thanks [@ryuuart](https://github.com/ryuuart)! - Prevent initializing empty marquees

## 0.11.0

### Minor Changes

- [#199](https://github.com/ryuuart/manawave/pull/199) [`748caba`](https://github.com/ryuuart/manawave/commit/748caba85f7440ed174bbeb3f9b046b7277d0fcf) Thanks [@ryuuart](https://github.com/ryuuart)! - Enforce using data-attributes when not using custom elements

- [#200](https://github.com/ryuuart/manawave/pull/200) [`1d2b0f8`](https://github.com/ryuuart/manawave/commit/1d2b0f821f389f4b88fc668ae573f5f577fda24e) Thanks [@ryuuart](https://github.com/ryuuart)! - Changed all references from "ticker" to "marquee" for consistency

- [#201](https://github.com/ryuuart/manawave/pull/201) [`0415ea7`](https://github.com/ryuuart/manawave/commit/0415ea7d28ceded0ee24e54e84d724d0cb17c972) Thanks [@ryuuart](https://github.com/ryuuart)! - Pre-process text nodes instead of throwing an error

### Patch Changes

- [#194](https://github.com/ryuuart/manawave/pull/194) [`5e947ba`](https://github.com/ryuuart/manawave/commit/5e947ba25c60cf16a03232bb1a48e69e72a6b9a7) Thanks [@ryuuart](https://github.com/ryuuart)! - Fix attribute type errors on required pipeline hooks when they should be optional

- [#196](https://github.com/ryuuart/manawave/pull/196) [`ff4c7f5`](https://github.com/ryuuart/manawave/commit/ff4c7f5743370aefd237061845cdc9306e89234a) Thanks [@ryuuart](https://github.com/ryuuart)! - Make marquee visible for accessibility customizability

- [#192](https://github.com/ryuuart/manawave/pull/192) [`381e4ab`](https://github.com/ryuuart/manawave/commit/381e4ab6920ed6bcda5faf24f59d5dab298f29b8) Thanks [@ryuuart](https://github.com/ryuuart)! - Fix attributes not overriding for zero values

- [#197](https://github.com/ryuuart/manawave/pull/197) [`d3a6030`](https://github.com/ryuuart/manawave/commit/d3a60307a92e02f52ba3c8e5b1f029d56fb8e730) Thanks [@ryuuart](https://github.com/ryuuart)! - Fix animation loop time desync breaking the website if you leave it for too long

## 0.10.2

### Patch Changes

- [`03a1afa`](https://github.com/ryuuart/manawave/commit/03a1afac85676b3af42dbc04263c943a6225fd96) Thanks [@ryuuart](https://github.com/ryuuart)! - Add homepage and repository data for package

## 0.10.1

### Patch Changes

- [#148](https://github.com/ryuuart/manawave/pull/148) [`64663fc`](https://github.com/ryuuart/manawave/commit/64663fc366960ea0e9dc444887499cf0a7e14a1e) Thanks [@ryuuart](https://github.com/ryuuart)! - Fix manawave root styling overriding default display

## 0.10.0

### Minor Changes

- [#143](https://github.com/ryuuart/manawave/pull/143) [`f4bf61e`](https://github.com/ryuuart/manawave/commit/f4bf61eef663da9d3115b3f6d047d35bc600f00b) Thanks [@ryuuart](https://github.com/ryuuart)! - Allow initialize hooks from MW object creation

## 0.9.3

### Patch Changes

- Prevent screenreaders from reading ticker content
