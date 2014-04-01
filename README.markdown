slick
-------

[1]: <https://github.com/kenwheeler/slick>

_the last carousel you'll ever need_

#### Demo

[http://kenwheeler.github.io/slick](http://kenwheeler.github.io/slick/)

#### Options


Option | Type | Default | Description
------ | ---- | ------- | -----------
accessibility | boolean | true | Enables tabbing and arrow key navigation
autoplay | boolean | false | Enables auto play of slides
autoplaySpeed | int  | 3000 | Auto play change interval
cssEase | string |  'ease' | CSS3 easing
dots | boolean | false | Current slide indicator dots
draggable | boolean | true | Enables desktop dragging
easing | string |  'linear' | animate() fallback easing
fade | boolean | false | Enables fade
arrows | boolean | true | Enable Next/Prev arrows
infinite | boolean | true | Infinite looping
onBeforeChange(this, index) | method | null | Before slide change callback
onAfterChange(this, index) | method | null | After slide change callback
pauseOnHover | boolean | true | Pauses autoplay on hover
responsive | object | null | Breakpoint triggered settings
slide | string | 'div' | Slide element query
slidesToShow | int | 1 | # of slides to show at a time
slidesToScroll | int | 1 | # of slides to scroll at a time
speed | int | 300 | Transition speed
swipe | boolean | true | Enables touch swipe
touchMove | boolean | true | Enables slide moving with touch
touchMoveThreshold | int | 5 | Swipe distance threshold
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
slickAdd() | element : html or DOM object | Adds a slide. Accepts HTML String || Object
slideRemove() | index: int | Removes a slide by index
slickFilter() | filter : selector or function | Filters slides using jQuery .filter syntax
slickUnfilter() | | Removes applied filter
slickSetOption(option,value,refresh) | option : string(option name), value : depends on option, refresh : boolean | Sets an option live. Set refresh to true if it is an option that changes the display


#### Example

Initialize with:

```
$(element).slick({
    dots: true,
    speed: 500
 });
 ```

Destroy with:

```
$(element).unslick();
```

#### Dependencies

jQuery 1.7

#### License

Copyright (c) 2014 Ken Wheeler

Licensed under the MIT license.

Free as in Bacon.