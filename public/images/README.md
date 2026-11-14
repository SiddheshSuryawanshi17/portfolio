# Images

All site photos are WebP (smaller and faster than JPG). Most come in two
sizes, e.g. `01.webp` (large) and `01-640.webp` (phones). The browser picks
the right one.

| File | Used for |
|---|---|
| `me/portrait-cutout.webp` | The particle portrait in the hero (photo with the background removed) |
| `me/portrait*.webp` | About section photo |
| `me/portrait-casual*.webp` | Photo shown when hovering over the About photo |
| `me/gallery/*.webp` | "Off the clock" photo strip |
| `projects/*.webp` | Project screenshots |

**Changing photos:** easiest is to drop the new photo in the main folder and
ask Claude to swap it. It will resize, convert and wire it up for you. To add
a gallery photo yourself, add both sizes and list it in `src/data/content.js`.
