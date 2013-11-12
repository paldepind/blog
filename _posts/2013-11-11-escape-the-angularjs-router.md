---
layout: post
title: "Escaping the AngularJS router"
date: 2013-11-12 20:00:00
categories: javascript angularjs
color: 52,152,219
---

When developing single-page applications having a client site router is pretty
much a necessity. Thankfully AngularJS comes with [its own client side
router](http://docs.angularjs.org/api/ngRoute.$route). However, it has its
limitations and problems. One of them appears when using the HTML5 mode with
the AngularJS router. It then hijacks all links to relative URLs on your
site. Most of the time this is what you want. You are creating a SPA so you
don't want to redirect your users in the refreshing the page kind of way. But
_sometimes_ you might actually want to redirect your users with a link. And
well, the AngularJS router wont let you! The problem is demonstrated in [this
JSFiddle](http://jsfiddle.net/paldepind/65xFe/).

I searched but couldn't find a decent solution - only a bunch of hacks. So I
ended up making my own hack which I at least consider to be a nicer hack than the
other I found (one of them was putting `target="_self"` in the links - eeew!).
The trick is that when creating a new route definition one can supply the `redirectTo`
param on the `route` argument. Like this:

```javascript
$routeProvider.when('/foo', { redirectTo: 'bar.html' })
```

But instead of a string a function can also be supplied. AngularJS will then call
it and redirect to its return value. The function will be called with the URL as its
second argument and my trick is to simply do an old school
`window.location.href` inside this function to do an actual page redirect.

```javascript
var redirect = function(skip, url) {
  window.location.href = url
};
$routeProvider.when('/escape-the-router.html', { redirectTo: redirect })
```

See it in all its working glory in [this JSFiddle](http://jsfiddle.net/paldepind/BFYED/).

I hope this tiny technique is useful to you!
