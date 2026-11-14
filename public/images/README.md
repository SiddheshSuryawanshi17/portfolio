# Drop your images here

## Your photo → `me/portrait.jpg`
- Name it exactly **portrait.jpg** and put it in the `me` folder.
- Portrait (taller than wide) works best, around **1200 × 1500 px**.
- It shows in black-and-white and turns to colour when someone hovers over it, so any photo works.
- Until you add one, the site shows an "SS" monogram instead.

## Project images → `projects/`
- Name them however you like, e.g. `medintel.jpg`.
- Landscape, around **1600 × 1000 px**, under ~500 KB each.
- Then open `src/data/content.js`, find the project, and set
  `image: '/images/projects/medintel.jpg'`.
- A project with no image gets a generated cover in its own colour.

## Extra photos (`me/` folder)
Put any other photos in `me/` too (hackathon stage shots, team photos,
you at work). Tell Claude and they'll be worked into the site.
