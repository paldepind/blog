---
layout: post
title:  "Using arrays as keys for associative arrays in JavaScript"
date:   2013-09-14 13:04:27
categories: javascript performance
color: "46,204,113"
---

## The problem
Recently I was faced with the following problem in JavaScript: Create a function
that as its argument takes an array of numbers and returns a unique object for
every unique combination of numbers in the array. That is if the function
recieves a particular combination of numbers it hasn't seen before it create a
new object and returns it. Otherwise it returns the object that was created when
this combination of numbers was recieved for the first time.

I hope the above explanation makes sense. Otherwise here is pseudocode:

{% highlight javascript %}
var getObject = function (arrayOfNumbers) {
  if seenBefore(arrayOfNumbers) {
    return existingObjectBelonginTo(arrayOfNumbers)
  } else {
    saveOjectBelongingTo(newObject, arrayOfNumbers)
    return newObject
  }
}
{% endhighlight %}

## The naive solution
 
A simple/naive solution to the above would be to store all created objects in an
array together with the combination of numbers they individualy belong to.
Then one could simply loop over the array while checking if the current
stored array and the given array contains the same numbers. And if they do,
return the related object. This solution however would be inefficient. The
problem was in a non-performance critical part of my code so that didn't bother
me though. But I wanted a simple and compact solution - not one requiring lots
of looping.

## Realizing that we need an associative array
So the primitive solution was not adequate and I began trying to figure out a
better one. I knew that the array would contain no duplicate numbers (the final
solution does not depend on that being true but this intermediate one does) so
my idea was to create a string with a length equal to the maximum number I knew
that array could contain and initialize it with zeros. Then for every number in
the recieved array I'd change the character in the string at that index to 1
representing a present number. So for instance `[1, 3, 4]` would turn into the
string `"0101010"` if the maximum number was 6. The produced string would be
unique for every combination of numbers and thus it could be used as a key in an
associative array (JavaScript objects works great as associative arrays) mapping
the string to the object to return in responce. The solution would then be like this

{% highlight javascript %}
var associativeArray = {}
var getObject = function(array) {
  var key = createKeyString(array)
  if (!associativeArray[key])
    associativeArray[key] = newObject()
  return associativeArray[key]
}
{% endhighlight %}

The only gripe left was what the `createKeyString` implementation would look
like. JavaScript string are immuteable so they can't be modified directly
and they have no inbuilt method to create a new string with one
character changed. Furthemore there is no compact way to initialize a string with a given
character either. All in all the `createKeyString` function would be far from
compact and elegant which forced me to deem this solution too clumpsy as well.

## Using arrays as keys

But, if you look at the code above its clear that all `createKeyString` is
really doing is returning a string that's unique for every array with a
unique combination of numbers. If we forget everything about my idea with a string of
0's and 1's it turns out that we can actually write a sufficient definition of
`createKeyString` that relies only on built-in Array methods. We don't want the
order of the numbers to matter - that sounds like [Array#sort][MDN-sort]. We'd
also like to turn the array into a string and that's a job for
[Array#toString][MDN-toString].

{% highlight javascript %}
var createKeyString = function(array) {
  return array.slice(0).sort().toString()
}
{% endhighlight%}

`Array#sort` is destructive as it sorts the array in place so we're making a
copy of it with `slice`. Otherwise the original away would be modified which
might not be desireable. Also note that unless provided a sorting callback
`Array#sort` sorts the array in lexicographic order. This is not a problem for
us - as long as the arrays are always sorted in the same predictable order we
could care less.

The definition of `createKeyString` turned out to be so short
that we could insert it right into `getObject` if we wanted. We've solved the
problem in a neat and concise way!

## Comparing arrays as well

Converting arrays to strings is also a short way of figuring out if two arrays
contain the same elements.
 
{% highlight javascript %}
var identical = function(a1, a2) {                                   
  return a1.slice(0).sort().toString == a2.slice(0).sort().toString()
}    
{% endhighlight %}

The above function only works correctly if the array consists of JavaScript
_primitives_. This means that if your array contains arrays or other kinds of
objects our function wont work. Object by default turns into the string
`"[object Object]"` which is not very helpful when trying to compare them. If
your array contains a mix of strings and numbers there is also a possibility
that it will report incorrectly since

{% highlight javascript %}
[1, "2"].toString() == [1, 2] // true
{% endhighlight %}

I'm quite happy with this technique. It's compact without being too clever. It's
not unreadable or obfuscated. Unsuprisingly I'm not the first person to think of
this. I've searched and found it mentioned a bunch of other places mostly using `Array#join`
instead of `Array#toString`.

## Fastest way to convert an array into a string?

As I mentioned I was not concerned with performance - only briefness - when
coding this. That however, didn't stop me from getting curious about what the
fastest way to convert an array into a string is? Luckily we JavaScripters are
blessed with the wonderfull [jsPerf](http://jsperf.com) to answer such questions. So I
threw [some tests together][perf1]. Take a look for yourself. My conclusion
is that `toString` shows stable performance across the field and more
importantly it's definitely the most idiomatic way to go.

Last but now least I also tested just how much slower comparing arrays as
strings is compared to proper looping. [It's quite a bit][perf2].

Thanks for reading this far! You might consider following [me on Twitter][tweet].

[MDN-sort]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[MDN-toString]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString
[perf1]: http://jsperf.com/convert-array-to-string
[perf2]: http://jsperf.com/fastest-way-to-compare-arrays
[tweet]: https://twitter.com/paldepind
