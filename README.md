# Billboard

I've seen plent of marquees out there but we ain't out here just to make a simple marquee... We're always living in NYC Times Square online and people deserve to see that energy and vibe on the web more. That's why I'm making Billboard, the next generation _not-a-marquee_.

## Getting Started

```shell
npm install billboard
```

## Features

You can configure it go in 4 directions at differing speeds.

### Quick Example

Should show you how to get by at a glance ;). There are two properties that you can configure the behavior of the `billboard-ticker`: direction and speed. These are self-explanatory. You can style the inner content of the `billboard-ticker` any way you'd like using good ol' CSS.

```HTML
<billboard-ticker direction="up" speed="2">
    <!-- will repeat everything here even if there are multiple children under the ticker-->
    <div class="content">
        <p>Content 1</p>
        <p>Content 2</p>
    </div>
    <div class="content">
        <p>Content 1</p>
        <p>Content 2</p>
    </div>
</billboard-ticker>
```

### Directions

- up
- down
- left
- right
- angle (in degrees)

## Todo

- [ ] Responsiveness
