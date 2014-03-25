slick
-------

[1]: <https://github.com/kenwheeler/slick>

_the last carousel you'll ever need_

### Demo

[Demo](http://kenwheeler.github.io/slick/)

### Options

autoplay: true | false - (default: false)- Enables auto play of slides

autoplaySpeed: int - (default:  3000) - Auto play change interval

dots: true | false - (default:  false) - Current slide indicator dots

arrows: true | false - (default: true) - Next/Prev arrows

infinite: true | false - (default: true) - Infinite looping

onBeforeChange : function - Before slide change callback

onAfterChange : function - After slide change callback

responsive : object - Breakpoint triggered settings

slide: string (default: 'div') - Slide element query

slidesToShow : int - (default: 1) - # of slides to show at a time

slidesToScroll : int - (default: 1) # of slides to scroll at a time

speed: int - (default: 300) - Transition speed

swipe: true | false - (default: true) - Enables touch swipe  
touchMove: boolean - (default: true) - Enables slide moving with touch

touchMoveThreshold: int - (default: 5) - Swipe distance threshold


### Example

Initialize with:

`$(element).slick({dots: true, speed: 500});`

Destroy with:

`$(element).unslick();`

### License

Copyright (c) 2014 Ken Wheeler

Dual licensed under the MIT and GPL licenses.

Free as in Bacon.


