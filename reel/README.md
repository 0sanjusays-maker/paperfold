# Patte mein basa Suraj — a 1:15 Madhubani animatic

An interactive, vertical (9:16) animatic for a Chhath reel built on **“Kelwa Ke Paat Par Ugelan Suraj
Dev”** (Sharda Sinha ji). Every one of the 12 shots from the storyboard is drawn as hand-built inline
SVG in Madhubani style, timed to a 75-second timeline, and stitched together with the horizontal
paper-fold move that gives this repo its name.

No build step, no dependencies, no external assets. Open `storyboard.html`.

```bash
# from the repo root
python3 -m http.server 8000 --directory reel
# → http://localhost:8000/storyboard.html
```

## What's in here

| file | what it is |
| --- | --- |
| `storyboard.html` | the stage + timeline panel |
| `reel.css` | layout, transport UI, all SVG motion (fold transition, ripples, flame, camera push) |
| `scenes.js` | the Madhubani drawing kit (`woman`, `soop`, `diya`, `sun`, `ghat`, `leaf`, …) and the 12 shots |
| `reel.js` | timeline engine: play/scrub, per-shot entrances, title card, PNG frame export |
| `shot-prompts.md` | per-shot prompts for image/video models + caption and hashtags |

## Rendered video

A finished render lives at `reel/media/patte-mein-basa-suraj_9x16.mp4` (gitignored, 1080×1920, 30 fps,
1:15, H.264, silent). To rebuild it:

```bash
cd reel
node dump-scenes.js                     # scenes.json from scenes.js
python3 render.py --preview 0,40,71     # spot-check stills
python3 render.py --video media/reel.mp4
```

`render.py` samples the same CSS keyframes the browser runs (fold reveal, flicker, ripples, walk bob,
camera push, entrance staggers), bakes them into each SVG, rasterises with resvg and pipes PNGs into
ffmpeg — no browser needed. It wants `pip install resvg-py imageio-ffmpeg` and two TTFs in
`reel/fonts/` (`NotoSerifDevanagari-Bold.ttf`, `NotoSerifLatin-Bold.ttf`, OFL). Easiest source:
`npm pack @fontsource/noto-serif-devanagari`, then convert the `-devanagari-700` and `-latin-700`
`.woff2` files to `.ttf` with `fontTools` (`TTFont(path).save(out)` after `f.flavor = None`).

Full render on 2 cores takes about 16 minutes.

## Controls

| | |
| --- | --- |
| <kbd>space</kbd> | play / pause |
| <kbd>←</kbd> <kbd>→</kbd> | seek ±2s |
| <kbd>[</kbd> <kbd>]</kbd> | previous / next shot |
| <kbd>H</kbd> | clean mode — hides the panel for screen recording |
| <kbd>C</kbd> | captions on / off |
| <kbd>P</kbd> | export the current frame as a 1080×1920 PNG |
| <kbd>R</kbd> | restart · <kbd>F</kbd> fullscreen |
| click the stage | play / pause |

Deep links: `?t=33` jumps to a timecode, `?shot=6` to a shot number.

## How to actually cut the reel

1. Play the track in Instagram (or on a second device) and find the first “Kelwa ke paat…” line.
2. Open clean mode (<kbd>H</kbd>), press play, and screen-record the 9:16 frame at 1080×1920 / 30 fps.
   The stage is exactly 9:16, so a simple crop gives you vertical video.
3. Cut on the vocal phrases using the shot boundaries above; the animatic already puts the fold on each
   boundary so you can see where a cut wants to be.
4. Swap any shot you animate for real footage — the timeline stays the same.

## Timeline

| # | time | shot |
| --- | --- | --- |
| 01 | 0:00–0:04 | Kelwa ke paat — leaf macro, veins become river, golden drop with a sun inside |
| 02 | 0:04–0:09 | Gudiya sees the drop; Maa's hand offers marigolds; the vein becomes the road |
| 03 | 0:09–0:17 | Aangan — soop is arranged, one item per beat, motifs bloom in the tray |
| 04 | 0:17–0:25 | Walking to the ghat, side-scroll, daura on Dadi's head |
| 05 | 0:25–0:33 | Wide ghat reveal at dusk, camera pushes toward the soop |
| 06 | 0:33–0:45 | Sandhya arghya — Maa in the water, sun aligned behind the soop (long hold) |
| 07 | 0:45–0:48 | The sun sinks |
| 08 | 0:48–0:51 | Match cut: sun → diya flame, night, stars switch on |
| 09 | 0:51–0:59 | Pre-dawn walk — same camera as 04, new sky, Gudiya half asleep |
| 10 | 0:59–1:10 | Usha arghya — first ray writes gold Madhubani patterns on the water |
| 11 | 1:10–1:13 | Title: छठ — आस्था की रोशनी, पीढ़ी-दर-पीढ़ी |
| 12 | 1:13–1:15 | The sun folds back into the drop — seamless loop to shot 01 |

## Design notes

- **Palette:** ivory `#f7eeda`, saffron `#f2a03d`, vermilion `#cf3f2e`, leaf `#3d7a4c`, gold `#e8b04b`,
  indigo `#18213d`, night `#0c1129`.
- **Line:** every shape carries an ink outline; large fills get a second, patterned pass so the eye has
  texture without gradients.
- **Motion budget:** two or three moving things per shot — hands, eyes, dupatta, flame, water, sun.
  Everything else is held.
- **Fold transition:** the incoming shot unfolds upward on a 720 ms rotateX with a moving shadow,
  echoing `paperfold.js`'s fold-over feel at scene scale.
- **Loop:** shots 01 and 12 share framing and drop position on purpose.

## Credit / licence

Artwork and code here are original and MIT-licensed, same as the rest of this repo. The song is **not**
included and is not covered by that licence — use Instagram's official audio.
