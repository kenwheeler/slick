slick
-------

[1]: <https://github.com/kenwheeler/slick>

_the last carousel you'll ever need_

#### Demo

[http://kenwheeler.github.io/slick](http://kenwheeler.github.io/slick/)

#### CDN

To start working with Slick right away, there's a couple of CDN choices availabile
to serve the files as close, and fast as possible to your users:

- https://cdnjs.com/libraries/slick-carousel
- https://www.jsdelivr.com/projects/jquery.slick

##### Example using jsDelivr

Just add a link to the css file in your `<head>`:

```html
<!-- Add the slick-theme.css if you want default styling -->
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.9.0/slick/slick.css"/>
<!-- Add the slick-theme.css if you want default styling -->
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.9.0/slick/slick-theme.css"/>
```

Then, before your closing ```<body>``` tag add:

```html
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.9.0/slick/slick.min.js"></script>
```

#### Package Managers

```sh
# Bower
bower install --save slick-carousel

# NPM
npm install slick-carousel
```

#### Contributing

PLEASE review CONTRIBUTING.markdown prior to requesting a feature, filing a pull request or filing an issue.

### Data Attribute Settings

In slick 1.5 you can now add settings using the data-slick attribute. You still need to call $(element).slick() to initialize slick on the element.

Example:

```html
<div data-slick='{"slidesToShow": 4, "slidesToScroll": 4}'>
  <div><h3>1</h3></div>
  <div><h3>2</h3></div>
  <div><h3>3</h3></div>
  <div><h3>4</h3></div>
  <div><h3>5</h3></div>
  <div><h3>6</h3></div>
</div>
```

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
accessibility | boolean | true | Enables tabbing and arrow key navigation.  Unless `autoplay: true`, sets browser focus to current slide (or first of current slide set, if multiple `slidesToShow`) after slide change. For full a11y compliance enable focusOnChange in addition to this.
adaptiveHeight | boolean | false | Adapts slider height to the current slide
appendArrows | string | $(element) | Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object)
appendDots | string | $(element) | Change where the navigation dots are attached (Selector, htmlString, Array, Element, jQuery object)
arrows | boolean | true | Enable Next/Prev arrows
asNavFor | string | $(element) | Enables syncing of multiple sliders
autoplay | boolean | false | Enables auto play of slides
autoplaySpeed | int  | 3000 | Auto play change interval
centerMode | boolean | false | Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts.
centerPadding | string | '50px' | Side padding when in center mode. (px or %)
cssEase | string |  'ease' | CSS3 easing
customPaging | function | n/a | Custom paging templates. See source for use example.
dots | boolean | false | Current slide indicator dots
dotsClass | string | 'slick-dots' | Class for slide indicator dots container
draggable | boolean | true | Enables desktop dragging
easing | string |  'linear' | animate() fallback easing
edgeFriction | integer | 0.15 | Resistance when swiping edges of non-infinite carousels
fade | boolean | false | Enables fade
focusOnSelect | boolean | false | Enable focus on selected element (click)
focusOnChange | boolean | false | Puts focus on slide after change
infinite | boolean | true | Infinite looping
initialSlide | integer | 0 | Slide to start on
lazyLoad | string | 'ondemand' | Accepts 'ondemand' or 'progressive' for lazy load technique. 'ondemand' will load the image as soon as you slide to it, 'progressive' loads one image after the other when the page loads.
mobileFirst | boolean | false | Responsive settings use mobile first calculation
nextArrow | string (html \| jQuery selector) \| object (DOM node \| jQuery object) | `<button type="button" class="slick-next">Next</button>` | Allows you to select a node or customize the HTML for the "Next" arrow.
pauseOnDotsHover | boolean | false | Pauses autoplay when a dot is hovered
pauseOnFocus | boolean | true | Pauses autoplay when slider is focussed
pauseOnHover | boolean | true | Pauses autoplay on hover
prevArrow | string (html \| jQuery selector) \| object (DOM node \| jQuery object) | `<button type="button" class="slick-prev">Previous</button>` | Allows you to select a node or customize the HTML for the "Previous" arrow.
respondTo | string | 'window' | Width that responsive object responds to. Can be 'window', 'slider' or 'min' (the smaller of the two).
responsive | array | null | Array of objects [containing breakpoints and settings objects (see example)](#responsive-option-example). Enables settings at given `breakpoint`. Set `settings` to "unslick" instead of an object to disable slick at a given breakpoint.
rows | int | 1 | Setting this to more than 1 initializes grid mode. Use slidesPerRow to set how many slides should be in each row.
rtl | boolean | false | Change the slider's direction to become right-to-left
slide | string | '' | Slide element query
slidesPerRow | int | 1 | With grid mode initialized via the rows option, this sets how many slides are in each grid row.
slidesToScroll | int | 1 | # of slides to scroll at a time
slidesToShow | int | 1 | # of slides to show at a time
speed | int | 300 | Transition speed
swipe | boolean | true | Enables touch swipe
swipeToSlide | boolean | false | Swipe to slide irrespective of slidesToScroll
touchMove | boolean | true | Enables slide moving with touch
touchThreshold | int | 5 | To advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider.
useCSS | boolean | true | Enable/Disable CSS Transitions
useTransform | boolean | true | Enable/Disable CSS Transforms
variableWidth | boolean | false | Disables automatic slide width calculation
vertical | boolean | false | Vertical slide direction
verticalSwiping | boolean | false | Changes swipe direction to vertical
waitForAnimate | boolean | true | Ignores requests to advance the slide while animating
zIndex | number | 1000 | Set the zIndex values for slides, useful for IE9 and lower

##### Responsive Option Example
The responsive option, and value, is quite unique and powerful.
You can use it like so:

```javascript
$(".slider").slick({

  // normal options...
  infinite: false,

  // the magic
  responsive: [{

      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        infinite: true
      }

    }, {

      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        dots: true
      }

    }, {

      breakpoint: 300,
      settings: "unslick" // destroys slick

    }]
});
```




### Events

In slick 1.4, callback methods were deprecated and replaced with events. Use them before the initialization of slick as shown below:

```javascript
// On swipe event
$('.your-element').on('swipe', function(event, slick, direction){
  console.log(direction);
  // left
});

// On edge hit
$('.your-element').on('edge', function(event, slick, direction){
  console.log('edge was hit')
});

// On before slide change
$('.your-element').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  console.log(nextSlide);
});
```

Event | Params | Description
------ | -------- | -----------
afterChange | event, slick, currentSlide | After slide change callback
beforeChange | event, slick, currentSlide, nextSlide | Before slide change callback
breakpoint | event, slick, breakpoint | Fires after a breakpoint is hit
destroy | event, slick | When slider is destroyed, or unslicked.
edge | event, slick, direction | Fires when an edge is overscrolled in non-infinite mode.
init | event, slick | When Slick initializes for the first time callback. Note that this event should be defined before initializing the slider.
reInit | event, slick | Every time Slick (re-)initializes callback
setPosition | event, slick | Every time Slick recalculates position
swipe | event, slick, direction | Fires after swipe/drag
lazyLoaded | event, slick, image, imageSource | Fires after image loads lazily
lazyLoadError | event, slick, image, imageSource | Fires after image fails to load


#### Methods

Methods are called on slick instances through the slick method itself in version 1.4, see below:

```javascript
// Add a slide
$('.your-element').slick('slickAdd',"<div></div>");

// Get the current slide
var currentSlide = $('.your-element').slick('slickCurrentSlide');
```

This new syntax allows you to call any internal slick method as well:

```javascript
// Manually refresh positioning of slick
$('.your-element').slick('setPosition');
```


Method | Argument | Description
------ | -------- | -----------
`slick` | options : object | Initializes Slick
`unslick` |  | Destroys Slick
`slickNext` |  |  Triggers next slide
`slickPrev` | | Triggers previous slide
`slickPause` | | Pause Autoplay
`slickPlay` | | Start Autoplay (_will also set `autoplay` option to `true`_)
`slickGoTo` | index : int, dontAnimate : bool | Goes to slide by index, skipping animation if second parameter is set to true
`slickCurrentSlide` |  |  Returns the current slide index
`slickAdd` | element : html or DOM object, index: int, addBefore: bool | Add a slide. If an index is provided, will add at that index, or before if addBefore is set. If no index is provided, add to the end or to the beginning if addBefore is set. Accepts HTML String || Object
`slickRemove` | index: int, removeBefore: bool | Remove slide by index. If removeBefore is set true, remove slide preceding index, or the first slide if no index is specified. If removeBefore is set to false, remove the slide following index, or the last slide if no index is set.
`slickFilter` | filter : selector or function | Filters slides using jQuery .filter syntax
`slickUnfilter` | | Removes applied filter
`slickGetOption` | option : string(option name) | Gets an option value.
`slickSetOption` | change an option, `refresh` is always `boolean` and will update UI changes...
 | `option, value, refresh` | change a [single `option`](https://github.com/kenwheeler/slick#settings) to given `value`; `refresh` is optional.
 | `"responsive", [{ breakpoint: n, settings: {} }, ... ], refresh` | change or add [whole sets of responsive options](#responsive-option-example)
 | `{ option: value, option: value, ... }, refresh` | change  [multiple `option`s](https://github.com/kenwheeler/slick#settings) to corresponding `value`s.


#### Example

Initialize with:

```javascript
$(element).slick({
  dots: true,
  speed: 500
});
 ```

Change the speed with:

```javascript
$(element).slick('slickSetOption', 'speed', 5000, true);
```

Destroy with:

```javascript
$(element).slick('unslick');
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

#### Browser support

Slick works on IE8+ in addition to other modern browsers such as Chrome, Firefox, and Safari.

#### Dependencies

jQuery 1.7

#### License

Copyright (c) 2017 Ken Wheeler

Licensed under the MIT license.

Free as in Bacon.
