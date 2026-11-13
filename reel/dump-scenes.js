// Serialise the animatic's scene SVGs so render.py can bake frames without a browser.
require("./scenes.js");
const scenes = globalThis.REEL_SCENES;
require("fs").writeFileSync(
  __dirname + "/scenes.json",
  JSON.stringify(
    scenes.map((s) => ({ t0: s.t0, t1: s.t1, title: s.title, svg: s.svg, titleCard: !!s.titleCard }))
  )
);
console.log("scenes.json written:", scenes.length, "scenes");
