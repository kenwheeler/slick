slick
-------

[1]: <https://github.com/kenwheeler/slick>

_the last carousel you'll ever need_

#### Demo

[http://kenwheeler.github.io/slick](http://kenwheeler.github.io/slick/)

#### CDN

CDN hosted slick is a great way to get set up quick:

In your ```<head>``` add:

````
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/jquery.slick/1.3.6/slick.css"/>
````

Then, before your closing ```<body>``` tag add:

```
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.slick/1.3.6/slick.min.js"/></script>
```

#### Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
accessibility | boolean | true | Enables tabbing and arrow key navigation
autoplay | boolean | false | Enables auto play of slides
autoplaySpeed | int  | 3000 | Auto play change interval
centerMode | boolean | false | Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts.
centerPadding | string | '50px' | Side padding when in center mode. (px or %)
cssEase | string |  'ease' | CSS3 easing
customPaging | function | n/a | Custom paging templates. See source for use example.
dots | boolean | false | Current slide indicator dots
draggable | boolean | true | Enables desktop dragging
easing | string |  'linear' | animate() fallback easing
fade | boolean | false | Enables fade
arrows | boolean | true | Enable Next/Prev arrows
appendArrows | string | $(element) | Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object)
prevArrow | string (html|jQuery selector) | object (DOM node|jQuery object) | <button type="button" class="slick-prev">Previous</button> | Allows you to select a node or customize the HTML for the "Previous" arrow.
nextArrow | string (html|jQuery selector) | object (DOM node|jQuery object) | <button type="button" class="slick-next">Next</button> | Allows you to select a node or customize the HTML for the "Next" arrow.
infinite | boolean | true | Infinite looping
lazyLoad | string | 'ondemand' | Accepts 'ondemand' or 'progressive' for lazy load technique
onBeforeChange(this, index) | method | null | Before slide change callback
onAfterChange(this, index) | method | null | After slide change callback
onInit(this) | method | null | When Slick initializes for the first time callback
onReInit(this) | method | null | Every time Slick (re-)initializes callback
pauseOnHover | boolean | true | Pauses autoplay on hover
pauseOnDotsHover | boolean | false | Pauses autoplay when a dot is hovered
responsive | object | null | Breakpoint triggered settings
slide | string | 'div' | Slide element query
slidesToShow | int | 1 | # of slides to show at a time
slidesToScroll | int | 1 | # of slides to scroll at a time
speed | int | 300 | Transition speed
swipe | boolean | true | Enables touch swipe
touchMove | boolean | true | Enables slide moving with touch
touchThreshold | int | 5 | To advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider.
useCSS | boolean | true | Enable/Disable CSS Transitions
vertical | boolean | false | Vertical slide direction


#### Methods

Method | Argument | Description
------ | -------- | -----------
slick() | options : object | Initializes Slick
unslick() |  | Destroys Slick
slickNext() |  |  Triggers next slide
slickPrev() | | Triggers previous slide
slickPause() | | Pause Autoplay
slickPlay() | | Start Autoplay
slickGoTo() | index : int | Goes to slide by index
slickCurrentSlide() |  |  Returns the current slide index
slickAdd() | element : html or DOM object, index: int, addBefore: bool | Add a slide. If an index is provided, will add at that index, or before if addBefore is set. If no index is provided, add to the end or to the beginning if addBefore is set. Accepts HTML String || Object
slideRemove() | index: int, removeBefore: bool | Remove slide by index. If removeBefore is set true, remove slide preceding index, or the first slide if no index is specified. If removeBefore is set to false, remove the slide following index, or the last slide if no index is set.
slickFilter() | filter : selector or function | Filters slides using jQuery .filter syntax
slickUnfilter() | | Removes applied filter
slickGetOption(option) | option : string(option name) | Gets an option value.
slickSetOption(option,value,refresh) | option : string(option name), value : depends on option, refresh : boolean | Sets an option live. Set refresh to true if it is an option that changes the display


#### Example

Initialize with:

```javascript
$(element).slick({
  dots: true,
  speed: 500
});
 ```

Destroy with:

```javascript
$(element).unslick();
```


#### Sass Variables

Variable | Type | Default | Description
------ | ---- | ------- | -----------
$slick-font-path | string | "./fonts/" | Directory path for the slick icon font
$slick-font-family | string | "slick" | Font-family for slick icon font
$slick-loader-path | string | "./" | Directory path for the loader image
$slick-arrow-color | color | white | Color of the left/right arrow icons
$slick-dot-color | color | black | Color of the navigation dots
$slick-dot-color-active | color | $slick-dot-color | Color of the active navigation dot
$slick-prev-character | string | '\2190' | Unicode character code for the previous arrow icon
$slick-next-character | string | '\2192' | Unicode character code for the next arrow icon
$slick-dot-character | string | '\2022' | Unicode character code for the navigation dot icon
$slick-dot-size | pixels | 6px | Size of the navigation dots


#### Dependencies

jQuery 1.7

#### License

Copyright (c) 2014 Ken Wheeler

Licensed under the MIT license.

Free as in Bacon.
