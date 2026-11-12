#Paperfold JS

Fold website elements in 3D. Demo: [felixniklas.com/paperfold](http://felixniklas.com/paperfold). It's based on an [experiment](https://developer.mozilla.org/en-US/demos/detail/paperfold-css) from 2011.

##Usage

Include jQuery and paperfold.js in your site.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="/path/to/paperfold.js"></script>
```

Call paperfold on the container you want to fold and bind the fold interaction to a button or any other interaction.

```javascript
$(function() {
	var paperfold = $('.hidden').paperfold();

	$('.paperfold-toggle').click(paperfold.toggle);
});
```

## Animatic demo

[`reel/`](reel/) is a 1:15 vertical Madhubani animatic for a Chhath reel — 12 hand-drawn SVG shots, a
scrub-able timeline and a paper-fold move between shots. Open [`reel/storyboard.html`](reel/storyboard.html)
or run `python3 -m http.server 8000 --directory reel`. Shot-by-shot prompts live in
[`reel/shot-prompts.md`](reel/shot-prompts.md).

====

[MIT License](LICENSE.md). © Felix Niklas (http://twitter.com/mrflix).