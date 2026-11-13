#!/usr/bin/env python3
"""Bake the Madhubani animatic's CSS animations into frames and encode an MP4.

Usage
-----
  node dump-scenes.js                 # writes scenes.json next to this file
  python3 render.py --preview 0,40,71  # a few PNG stills
  python3 render.py --video out.mp4    # the full 1:15, 1080x1920, 30 fps

Needs: resvg-py, imageio-ffmpeg (pip), and two TTFs in ./fonts — see README.

The animatic in reel/ is animated with CSS keyframes. resvg does not run CSS
animations, so this script samples the same keyframes at 30 fps, rewrites the
SVG transforms/opacity for that instant, rasterises with resvg and pipes PNG
frames straight into ffmpeg.
"""
import json, math, re, subprocess, sys, time
import resvg_py
import imageio_ffmpeg

W, H = 1080, 1920
FPS = 30
import os

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = [
    os.path.join(HERE, "fonts", "NotoSerifDevanagari-Bold.ttf"),
    os.path.join(HERE, "fonts", "NotoSerifLatin-Bold.ttf"),
]
SCENES = json.load(open(os.path.join(HERE, "scenes.json")))
TOTAL = SCENES[-1]["t1"]

TAG = re.compile(r"<(g|circle|ellipse|path|rect|polygon|text)([^>]*?)(/?)>", re.S)
CLASS = re.compile(r'class="([^"]*)"')
STYLE = re.compile(r'style="([^"]*)"')
TRANS = re.compile(r'transform="([^"]*)"')
ATTR = re.compile(r'([a-zA-Z-]+)="([^"]*)"')

TAU = math.tau


def attr(attrs, name):
    m = re.search(r'\b' + name + r'="([^"]*)"', attrs)
    return m.group(1) if m else None


def ease_out_cubic(p):
    return 1 - (1 - p) ** 3


def keyframes(name, p, tag_attrs):
    """Return (transform, opacity) for a CSS animation class at phase p in [0,1)."""
    s = math.sin(TAU * p)
    c = math.cos(TAU * p)

    if name == "bob":
        return f"translate(0 {(-9 * (1 - c) / 2):.2f})", None
    if name == "sway":
        return f"rotate({(1.2 * s):.3f})", None
    if name == "drift":
        return f"translate({(5 * (1 - c)):.2f} {(-6 * (1 - c)):.2f})", None
    if name == "flicker":
        return f"scale({1 + 0.035 * s:.4f} {1 - 0.03 * s:.4f})", f"{0.94 + 0.06 * (1 - c) / 2:.3f}"
    if name == "glowpulse":
        return None, f"{0.6 + 0.4 * (1 - c) / 2:.3f}"
    if name == "twinkle":
        return None, f"{0.3 + 0.7 * (0.5 + 0.5 * math.sin(TAU * p + 0.4)):.3f}"
    if name == "ripple":
        k = 0.45 + 1.95 * p
        return f"scale({k:.3f})", f"{max(0.0, 0.85 * (1 - p)):.3f}"
    if name == "wave":
        return f"translate({-160 * p:.2f} 0)", None
    if name == "scrollstrip":
        return f"translate({-1080 * p:.2f} 0)", None
    if name == "sink":
        return f"translate(0 {96 * p:.2f})", f"{1 - 0.1 * p:.3f}"
    if name == "rayturn":
        return f"rotate({360 * p:.2f})", None
    if name == "ray-sweep":
        return None, f"{0.35 + 0.55 * (1 - c) / 2:.3f}"
    if name == "paper-lift":
        return f"translate(0 {(-10 * (1 - c) / 2):.2f})", None
    if name == "floatup":
        return f"translate(0 {(-8 * (1 - c)):.2f})", None
    if name == "collapse":
        k = 1.5 - 1.38 * ease_out_cubic(p)
        op = 0.9 if p < 0.72 else 0.9 * (1 - (p - 0.72) / 0.28)
        return f"scale({k:.4f})", f"{max(0.0, op):.3f}"
    if name == "cam":
        k = 1 + 0.07 * (0.5 - 0.5 * c)
        return f"scale({k:.4f})", None
    return None, None


DUR = {
    "bob": 3.2, "sway": 6.0, "drift": 7.0, "flicker": 1.6, "glowpulse": 3.4,
    "twinkle": 3.0, "ripple": 4.2, "wave": 6.5, "scrollstrip": 9.0, "sink": 6.4,
    "rayturn": 60.0, "ray-sweep": 5.6, "paper-lift": 7.0, "floatup": 5.5,
    "collapse": 2.0, "cam": 9.0,
}
PIVOT_XY = {"cam": (594, 1190), "collapse": (620, 900)}


def origin_of(attrs, tag, style):
    if style and "transform-origin" in style:
        m = re.search(r"transform-origin:\s*(-?[\d.]+)px\s+(-?[\d.]+)px", style)
        if m:
            return float(m.group(1)), float(m.group(2))
    tr = attr(attrs, "transform") or ""
    m = re.match(r"\s*translate\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s*\)", tr)
    if m and tag != "circle":
        return float(m.group(1)), float(m.group(2))
    if tag in ("ellipse", "circle"):
        return float(attr(attrs, "cx") or 0), float(attr(attrs, "cy") or 0)
    return 0.0, 0.0


def scene_at(t):
    idx = 0
    for i, s in enumerate(SCENES):
        if t >= s["t0"]:
            idx = i
    return idx


def title_overlay(local, dur):
    """Devanagari title plate for the 1:10 shot."""
    alpha = max(0.0, min(1.0, (local - 0.35) / 0.55))
    if alpha <= 0:
        return ""
    rise = (1 - ease_out_cubic(alpha)) * 24
    return f"""
    <g opacity="{alpha:.3f}" transform="translate(0 {rise:.1f})">
      <rect x="92" y="1008" width="896" height="324" rx="4" fill="#fbf3e2" opacity=".96"/>
      <rect x="92" y="1008" width="896" height="324" rx="4" fill="none" stroke="#241a12" stroke-width="6"/>
      <rect x="108" y="1024" width="864" height="292" fill="none" stroke="#cf3f2e" stroke-width="2.5"/>
      <text x="540" y="1098" text-anchor="middle" font-family="Noto Serif Devanagari"
            font-size="88" font-weight="700" fill="#cf3f2e">छठ</text>
      <text x="540" y="1172" text-anchor="middle" font-family="Noto Serif Devanagari"
            font-size="50" font-weight="700" fill="#241a12">आस्था की रोशनी</text>
      <text x="540" y="1230" text-anchor="middle" font-family="Noto Serif Devanagari"
            font-size="50" font-weight="700" fill="#241a12">पीढ़ी दर पीढ़ी</text>
      <text x="540" y="1288" text-anchor="middle" font-family="Noto Serif Devanagari"
            font-size="22" font-weight="700" letter-spacing="7" fill="#cf3f2e">FAITH · LIGHT · HANDED DOWN</text>
    </g>"""


def bake_markup(sc, local):
    """Bake every CSS animation in one scene at `local` seconds."""
    svg = sc["svg"]

    def repl(m):
        tag, attrs, selfclose = m.group(1), m.group(2), m.group(3)
        cls = CLASS.search(attrs)
        if not cls:
            return m.group(0)
        names = cls.group(1).split()
        sm = STYLE.search(attrs)
        style = sm.group(1) if sm else ""
        inject = {}

        if "enter" in names:
            at = float(attr(attrs, "data-at") or 0)
            d = float(attr(attrs, "data-dur") or 0.75)
            p = max(0.0, min(1.0, (local - at) / d))
            e = ease_out_cubic(p)
            inject["opacity"] = f"{e:.3f}"
            inject["transform"] = f"translate(0 {(1 - e) * 26:.2f})"
            style = f"--p:{e:.3f}"
        else:
            delay = 0.0
            m2 = re.search(r"animation-delay:\s*(-?[\d.]+)s", style or "")
            if m2:
                delay = float(m2.group(1))
            for name in names:
                if name not in DUR:
                    continue
                d = DUR[name]
                p = ((local - delay) % d) / d
                tr, op = keyframes(name, p, attrs)
                if tr is not None:
                    ox, oy = PIVOT_XY.get(name) or origin_of(attrs, tag, style)
                    if name in ("bob", "drift", "wave", "scrollstrip", "sink", "floatup", "paper-lift"):
                        inject["transform"] = tr
                    elif ox or oy:
                        inject["transform"] = f"translate({ox} {oy}) {tr} translate({-ox} {-oy})"
                    else:
                        inject["transform"] = tr
                    existing = attr(attrs, "transform")
                    if existing:
                        inject["transform"] = tr + " " + existing
                        attrs = TRANS.sub("", attrs)
                if op is not None:
                    inject["opacity"] = op
                break

        if not inject:
            return m.group(0)

        attrs2 = TRANS.sub("", attrs)
        if "opacity" in inject:
            attrs2 = re.sub(r'\sopacity="[^"]*"', "", attrs2)
        new_style = style
        if new_style:
            new_style = re.sub(r"transform-origin:\s*-?[\d.]+px\s+-?[\d.]+px;?", "", new_style).strip("; ")
        if "enter" in names:
            new_style = f"--p:{inject['opacity']}"
        if new_style:
            attrs2 = STYLE.sub(f'style="{new_style}"', attrs2)
        else:
            attrs2 = re.sub(r'\sstyle="[^"]*"', "", attrs2)
        extra = ""
        if "transform" in inject:
            extra += f' transform="{inject["transform"]}"'
        if "opacity" in inject:
            extra += f' opacity="{inject["opacity"]}"'
        return f"<{tag}{attrs2}{extra}{'/' if selfclose else ''}>"

    out = TAG.sub(repl, svg)
    if sc.get("titleCard"):
        out = out.replace("</svg>", title_overlay(local, sc["t1"] - sc["t0"]) + "</svg>")
    return out


def split_svg(svg):
    i = svg.index(">") + 1
    j = svg.rindex("</svg>")
    return svg[:i], svg[i:j]


def frame_svg(t):
    i = scene_at(t)
    sc = SCENES[i]
    local = t - sc["t0"]
    cur = bake_markup(sc, local)
    head, inner = split_svg(cur)

    # paper-fold reveal: the previous shot holds, the new one slides up under a shadow
    if i > 0 and local < 0.72:
        k = ease_out_cubic(local / 0.72)
        top = H * (1 - k)
        prev = SCENES[i - 1]
        _, prev_inner = split_svg(bake_markup(prev, prev["t1"] - prev["t0"] - 0.001))
        defs = (
            '<defs>'
            f'<clipPath id="rv"><rect x="0" y="{top:.1f}" width="{W}" height="{H - top:.1f}"/></clipPath>'
            '<linearGradient id="fs" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#1d1610" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#1d1610" stop-opacity=".6"/></linearGradient>'
            "</defs>"
        )
        shadow = (
            f'<rect x="0" y="{max(0.0, top - 110):.1f}" width="{W}" height="110" fill="url(#fs)"/>'
            if top > 2 else ""
        )
        return (
            head + defs
            + f'<g opacity="{0.55 + 0.45 * k:.3f}">{prev_inner}</g>'
            + f'<g clip-path="url(#rv)">{inner}</g>'
            + shadow + "</svg>"
        )
    return cur


def render(t):
    svg = frame_svg(t)
    return resvg_py.svg_to_bytes(
        svg_string=svg, width=W, height=H, background="#f8efdb", font_files=FONTS
    )


def render_index(f):
    return f, render(f / FPS)


def make_video(out, start_f=0, end_f=None):
    import multiprocessing as mp
    n = int(TOTAL * FPS) if end_f is None else end_f
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ff, "-y", "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
        "-c:v", "libx264", "-preset", "medium", "-crf", "19",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", out,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL)
    t0 = time.time()
    idxs = list(range(start_f, n))
    with mp.Pool(2) as pool:
        for k, (f, png) in enumerate(pool.imap(render_index, idxs, chunksize=4)):
            proc.stdin.write(png)
            if k % 120 == 0:
                el = time.time() - t0
                print(f"frame {f}/{n}  {el:6.1f}s  eta {el / max(1, k) * (len(idxs) - k):6.0f}s", flush=True)
    proc.stdin.close()
    proc.wait()
    print("done", out, f"{time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    if sys.argv[1] == "--preview":
        for ts in sys.argv[2].split(","):
            t = float(ts)
            t0 = time.time()
            png = render(t)
            open(f"frame_{t:06.2f}.png", "wb").write(png)
            print(f"{t:6.2f}s  {len(png)/1024:7.1f} KB  {time.time()-t0:.2f}s", flush=True)
    elif sys.argv[1] == "--video":
        make_video(sys.argv[2])
    elif sys.argv[1] == "--test":
        make_video(sys.argv[2], 0, int(sys.argv[3]))
