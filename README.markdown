slick
-------

[1]: <https://github.com/kenwheeler/slick>

_the last carousel you'll ever need_

### Demo

[Demo](http://kenwheeler.github.io/slick/)

### Options

autoplay: true | false - (default: false)- Enables auto play of slides

autoplaySpeed: int - (default:  3000) - Auto play change interval

cssEase: string - (default:  'ease') - CSS3 easing

dots: true | false - (default:  false) - Current slide indicator dots

draggable: true | false - (default:  true) - Enables desktop dragging

easing: string - (default:  'linear') - animate() easing

arrows: true | false - (default: true) - Next/Prev arrows

infinite: true | false - (default: true) - Infinite looping

onBeforeChange : function - Before slide change callback

onAfterChange : function - After slide change callback

pauseOnHover: true | false - (default:  true) - Pauses autoplay on hover

responsive : object - Breakpoint triggered settings

slide: string (default: 'div') - Slide element query

slidesToShow : int - (default: 1) - # of slides to show at a time

slidesToScroll : int - (default: 1) # of slides to scroll at a time

speed: int - (default: 300) - Transition speed

swipe: true | false - (default: true) - Enables touch swipe  

touchMove: boolean - (default: true) - Enables slide moving with touch

touchMoveThreshold: int - (default: 5) - Swipe distance threshold

### Methods

slick(settings : object) - Initializes Slick

unslick() - Destroys Slick

slickNext() - Triggers next slide

slickPrev() - Triggers previous slide

slickPause() - Pause Autoplay

slickPlay() - Start Autoplay

slickGoTo(index : int) - Goes to slide by index

slickAdd(element) - Adds a slide. Accepts HTML String || Object

slideRemove(index) - Removes a slide by index

slickFilter(filter) - Filters slides using jQuery .filter syntax

slickUnfilter() - Removes applied filter

### Example

Initialize with:

`$(element).slick({dots: true, speed: 500});`

Destroy with:

`$(element).unslick();`

### Dependencies

jQuery 1.7

### License

Copyright (c) 2014 Ken Wheeler

Dual licensed under the MIT and GPL licenses.

Free as in Bacon.


