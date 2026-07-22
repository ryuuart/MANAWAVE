---
"manawave": minor
---

Ship the ambient types the public API actually references. `MW`, its options and every
pipeline hook were typed against globals (`manawave.Options`, `Rect`, `PipelineHooksMap`)
that never made it into `dist`, so consumers saw `any` for hook callbacks. The entry
declaration now pulls them in.

The `browser` export condition has been dropped. It pointed at the IIFE bundle, which has
no exports, so any bundler that resolved it got a module with nothing in it — those
consumers now resolve the ESM build. CDN consumers are unaffected: `unpkg` and `jsdelivr`
fields point at `dist/manawave.min.js` as before.
