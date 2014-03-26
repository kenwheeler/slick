// Slick
/*

 slick.js

 Author: Ken Wheeler
 Date: 03/23/14
 Version: 1.0

 */

/*global window, document, $, setInterval, clearInterval */

var slick = window.slick || {};

/************ Helpers ***********/

// Function Binder

var functionBinder = function(fn, me) {
    'use strict';
    return function() {
        return fn.apply(me, arguments);
    };
};

// Mobile Detect

var mobileDetect = function() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

// Helpers

    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function() {
            var context = scope || this;

            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    /********** End Helpers *********/

    slick.slider = (function() {
        'use strict';

        function slider(element, settings) {

            this.defaults = {
                autoplay: false,
                autoplaySpeed: 3000,
                dots: false,
                draggable: true,
                arrows: true,
                infinite: true,
                onBeforeChange: null,
                onAfterChange: null,
                responsive: null,
                slide: 'div',
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 300,
                swipe: true,
                touchMove: true,
                touchThreshold: 5
            };

            this.activeBreakpoint = null;
            this.animating = false;
            this.animType = null;
            this.autoPlayTimer = null;
            this.breakpoints = [];
            this.breakpointSettings = [];
            this.currentSlide = 0;
            this.currentLeft = null;
            this.direction = 1;
            this.dots = null;
            this.listWidth = null;
            this.loadIndex = 0;
            this.nextArrow = null;
            this.prevArrow = null;
            this.slideCount = null;
            this.slideWidth = null;
            this.slideTrack = null;
            this.slides = null;
            this.sliding = false;
            this.slideOffset = 0;
            this.slider = $(element);
            this.swipeLeft = null;
            this.list = null;
            this.touchObject = {};
            this.transformsEnabled = false;

            this.options = $.extend({}, this.defaults, settings);

            this.originalSettings = this.options;
            var responsiveSettings = this.options.responsive || null;

            if(responsiveSettings && responsiveSettings.length > -1) {
                for(var breakpoint in responsiveSettings) {
                    this.breakpoints.push(responsiveSettings[breakpoint].breakpoint);
                    this.breakpointSettings[responsiveSettings[breakpoint].breakpoint] = responsiveSettings[breakpoint].settings;
                }
                this.breakpoints.sort(function(a,b){return b-a});
            }

            this.changeSlide = functionBinder(this.changeSlide, this);
            this.setPosition = functionBinder(this.setPosition, this);
            this.swipeHandler = functionBinder(this.swipeHandler, this);
            this.dragHandler = functionBinder(this.dragHandler, this);
            this.autoPlayIterator = functionBinder(this.autoPlayIterator, this);

            this.init();

        }


        slider.prototype.init = function() {

            if (!$(this.slider).hasClass('slick-initialized')) {

                $(this.slider).addClass('slick-initialized');
                this.buildOut();
                this.setValues();
                this.getAnimType();
                this.setPosition();
                this.startLoad();
                this.loadSlider();
                this.initializeEvents();
                this.checkResponsive();
            }

        };

        slider.prototype.getAnimType = function() {

            if (document.body.style.MozTransform !== undefined) {

                this.animType = 'MozTransform';

            } else if (document.body.style.webkitTransform !== undefined) {

                this.animType = "webkitTransform";

            } else if (document.body.style.msTransform !== undefined) {

                this.animType = "msTransform";

            }

            if (this.animType !== null) {

                this.transformsEnabled = true;

            }

        };

        slider.prototype.autoPlay = function() {

            if (this.autoPlayTimer) {

                clearInterval(this.autoPlayTimer);

            }

            this.autoPlayTimer = setInterval(this.autoPlayIterator, this.options.autoplaySpeed);

        };

        slider.prototype.autoPlayIterator = function() {

            if (this.options.infinite === false) {

                if (this.direction === 1) {

                    if ((this.currentSlide + 1) === this.slideCount - 1) {
                        this.direction = 0;
                    }

                    this.slideHandler(this.currentSlide + this.options.slidesToScroll);

                } else {

                    if ((this.currentSlide - 1 === 0)) {

                        this.direction = 1;

                    }

                    this.slideHandler(this.currentSlide - this.options.slidesToScroll);

                }

            } else {

                this.slideHandler(this.currentSlide + this.options.slidesToScroll);

            }

        };

        slider.prototype.checkResponsive = function() {

            if(this.originalSettings.responsive && this.originalSettings.responsive.length > -1) {

                var targetBreakpoint = null;

                for(var breakpoint in this.breakpoints) {
                    if($(window).width() < this.breakpoints[breakpoint]) {
                        targetBreakpoint = this.breakpoints[breakpoint];
                    }
                }

                if(targetBreakpoint !== null) {
                    if(this.activeBreakpoint !== null) {
                        if(targetBreakpoint !== this.activeBreakpoint) {
                            this.activeBreakpoint = targetBreakpoint;
                            this.options = $.extend({}, this.defaults, this.breakpointSettings[targetBreakpoint]);
                            this.refresh();
                        }
                    } else {
                        this.activeBreakpoint = targetBreakpoint;
                        this.options = $.extend({}, this.defaults, this.breakpointSettings[targetBreakpoint]);
                        this.refresh();
                    }
                } else {
                    if(this.activeBreakpoint !== null) {
                        this.activeBreakpoint = null;
                        this.options = $.extend({}, this.defaults, this.originalSettings);
                        this.refresh();
                    }
                }

            }
        };

        slider.prototype.startLoad = function() {

            if (this.options.arrows === true) {

                this.prevArrow.hide();
                this.nextArrow.hide();

            }

            if (this.options.dots === true) {

                this.dots.hide();

            }

            this.slider.addClass('slick-loading');

        };

        slider.prototype.loadSlider = function() {

            var self = this;

            self.setPosition();

            self.slideTrack.animate({
                opacity: 1
            }, this.options.speed, function() {
                self.setPosition();
            });

            if(document.readyState !== "complete") {

                $(window).load(function() {

                    if (self.options.arrows === true) {

                        self.prevArrow.show();
                        self.nextArrow.show();

                    }

                    if (self.options.dots === true) {

                        self.dots.show();

                    }

                    self.slider.removeClass('slick-loading');

                    if (self.options.autoplay === true) {

                        self.autoPlay();

                    }

                });

            } else {

                if (self.options.arrows === true) {

                    self.prevArrow.show();
                    self.nextArrow.show();

                }

                if (self.options.dots === true) {

                    self.dots.show();

                }

                self.slider.removeClass('slick-loading');

                if (self.options.autoplay === true) {

                    self.autoPlay();

                }

            }

        };

        slider.prototype.setValues = function() {

            this.listWidth = this.list.innerWidth();
            this.slideWidth = Math.ceil(this.listWidth / this.options.slidesToShow);

        };

        slider.prototype.buildOut = function() {

            var i;

            this.slides = $(this.options.slide + ':not(.cloned)', this.slider).addClass('slide');
            this.slideCount = this.slides.length;
            if((this.slideCount % this.options.slidesToScroll) !== 0 && this.options.slidesToShow !== 1) {

                var placeholders = Math.abs(this.options.slidesToScroll - (this.slideCount % this.options.slidesToScroll));
                for(i=0; i<placeholders; i++) {
                    $('<div/>').appendTo(this.slider).addClass('slide placeholder');
                }
                this.slides = $('.slide:not(.cloned)', this.slider);
                this.slideCount = this.slides.length;

            }

            this.slider.addClass("slick-slider");
            this.slideTrack = this.slides.wrapAll('<div class="slick-track"/>').parent();
            this.list = this.slideTrack.wrap('<div class="slick-list"/>').parent();
            this.slideTrack.css('opacity', 0);

            if (this.options.arrows === true) {

                this.prevArrow = $('<a href="javascript:void(0)">Previous</a>').appendTo(this.slider).addClass('slick-prev');
                this.nextArrow = $('<a href="javascript:void(0)">Next</a>').appendTo(this.slider).addClass('slick-next');

                if (this.options.infinite !== true) {
                    this.prevArrow.addClass('disabled');
                }

            }

            if (this.options.dots === true) {

                this.dots = $('<ul class="slick-dots"></ul>').appendTo(this.slider);

                for (i = 1; i <= this.slideCount; i += 1) {

                    $('<li><a href="javascript:void(0)">' + i + '</a></li>').appendTo(this.dots);

                }

                if(this.options.slidesToScroll > 1) {
                    this.dots.find('li').hide();
                    var i = 0;
                    while(i < this.slideCount) {
                        $(this.dots.find('li').get(i)).show();
                        i = i + this.options.slidesToScroll;
                    }
                }

                this.dots.find('li').first().addClass('active');

            }

            if (this.options.draggable == true) {
                this.list.addClass('draggable');
            }

            if (this.options.infinite === true) {

                var slideIndex = null;

                for(i=this.slideCount; i>(this.slideCount - this.options.slidesToShow); i--) {
                    slideIndex = i -1;
                    $(this.slides[slideIndex]).clone().prependTo(this.slideTrack).addClass('cloned');
                }
                for(i=0; i<this.options.slidesToShow; i++) {
                    slideIndex = i;
                    $(this.slides[slideIndex]).clone().appendTo(this.slideTrack).addClass('cloned');
                }

            }

        };

        slider.prototype.setDimensions = function() {
            this.slideWidth = Math.ceil(this.listWidth / this.options.slidesToShow);
            this.list.find('.slide').width(this.slideWidth);
            this.slideTrack.width(Math.ceil((this.slideWidth * this.slider.find('.slide').length)));
        };

        slider.prototype.setPosition = function() {

            this.setValues();
            this.setDimensions();

            if (this.options.infinite === true) {
                this.slideOffset = (this.slideWidth * this.options.slidesToShow) * -1;
            }

            var animProps = {}, targetLeft = ((this.currentSlide * this.slideWidth) * -1) + this.slideOffset;

            if (this.transformsEnabled === false) {
                this.slideTrack.css('left', targetLeft);
            } else {
                animProps[this.animType] = "translate(" + targetLeft + "px, 0px)";
                this.slideTrack.css(animProps);
            }

        };

        slider.prototype.initializeEvents = function() {

            var self = this;

            if (this.options.arrows === true) {

                this.prevArrow.on('click', {
                    message: 'previous'
                }, this.changeSlide);
                this.nextArrow.on('click', {
                    message: 'next'
                }, this.changeSlide);

            }

            if (this.options.dots === true) {

                $('li a', this.dots).on('click', {
                    message: 'index'
                }, this.changeSlide);

            }

            if (this.options.swipe === true) {

                this.list.on('touchstart', {
                    action: 'start'
                }, throttle(this.swipeHandler, 20));

                this.list.on('touchmove', {
                    action: 'move'
                }, throttle(this.swipeHandler, 20));

                this.list.on('touchend', {
                    action: 'end'
                }, throttle(this.swipeHandler, 20));

            }

            if (this.options.draggable === true) {
                this.list.on('mousedown', {action: 'start'}, this.dragHandler);
                this.list.on('mousemove', {action: 'move'}, this.dragHandler);
                this.list.on('mouseup', {action: 'end'}, this.dragHandler);
                this.list.on('mouseout', {action: 'cancel'}, this.dragHandler);
            }

            $(window).on('orientationchange', this.setPosition);

            $(window).on('resize', function(){
                self.checkResponsive();
                self.setPosition();
            });

            $(window).on('load', this.setPosition);

        };

        slider.prototype.changeSlide = function(event) {

            var self = this;

            switch (event.data.message) {

                case 'previous':
                    if(this.animating == false) {
                        self.slideHandler(self.currentSlide - self.options.slidesToScroll);
                    } else {
                        return false;
                    }
                    break;

                case 'next':
                    if(self.animating == false) {
                        self.slideHandler(self.currentSlide + self.options.slidesToScroll);
                    } else {
                        return false;
                    }
                    break;

                case 'index':
                    if(self.animating == false) {
                        self.slideHandler($(event.target).parent().index());
                    } else {
                        return false;
                    }
                    break;

                default:
                    return false;
            }

        };

        slider.prototype.updateDots = function() {

            this.dots.find('li').removeClass('active');
            $(this.dots.find('li').get(this.currentSlide)).addClass('active');

        };

        slider.prototype.animateSlide = function(targetLeft, callback) {

            var animProps = {}, self = this;

            if(this.options.onBeforeChange !== null) {
                this.options.onBeforeChange.call();
            }

            if (this.transformsEnabled === false) {

                this.slideTrack.animate({
                    left: targetLeft
                }, self.options.speed, callback);

            } else {

                $({
                    animStart: this.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: self.options.speed,
                    step: function(now) {
                        animProps[self.animType] = "translate(" + now + "px, 0px)";
                        self.slideTrack.css(animProps);
                    },
                    complete: function() {
                        if(callback) {
                            callback.call();
                        }
                    }
                });

            }

        }

        slider.prototype.slideHandler = function(index) {

            var animProps = {}, targetSlide, slideLeft, targetLeft = null,
                self = this;

            targetSlide = index;
            targetLeft = ((targetSlide * this.slideWidth) * -1) + this.slideOffset;
            slideLeft = ((this.currentSlide * this.slideWidth) * -1) + this.slideOffset;

            if (self.options.autoplay === true) {
                clearInterval(this.autoPlayTimer);
            }

            if (this.swipeLeft === null) {
                this.currentLeft = slideLeft;
            } else {
                this.currentLeft = this.swipeLeft;
            }

            if (targetSlide < 0) {

                if (this.options.infinite === true) {

                    this.animating = true;

                    this.animateSlide(targetLeft, function(){

                        self.animating = false;

                        self.currentSlide = self.slideCount - self.options.slidesToScroll;

                        self.setPosition();

                        if (self.swipeLeft !== null) {
                            self.swipeLeft = null;
                        }

                        if (self.options.dots) {
                            self.updateDots();
                        }

                        if (self.options.autoplay === true) {
                            self.autoPlay();
                        }

                        if(self.options.onAfterChange !== null) {
                            self.options.onAfterChange.call();
                        }

                        self.slides.removeClass('active');
                        $(self.slides.get(targetSlide)).addClass('active');

                    });

                } else {

                    this.animateSlide(slideLeft);

                    return false;

                }

            } else if (targetSlide > (this.slideCount - 1)) {

                if (this.options.infinite === true) {

                    this.animating = true;

                    this.animateSlide(targetLeft, function(){

                        self.animating = false;

                        self.currentSlide = 0;

                        self.setPosition();

                        if (self.swipeLeft !== null) {
                            self.swipeLeft = null;
                        }

                        if (self.options.dots) {
                            self.updateDots();
                        }

                        if (self.options.autoplay === true) {
                            self.autoPlay();
                        }

                        if(self.options.onAfterChange !== null) {
                            self.options.onAfterChange.call();
                        }

                        self.slides.removeClass('active');
                        $(self.slides.get(targetSlide)).addClass('active');

                    });

                } else {

                    this.animateSlide(slideLeft);

                    return false;

                }

            } else {

                this.animating = true;

                this.animateSlide(targetLeft, function(){

                    self.animating = false;

                    self.currentSlide = targetSlide;

                    self.setPosition();

                    if (self.swipeLeft !== null) {
                        self.swipeLeft = null;
                    }

                    if (self.options.dots) {
                        self.updateDots();
                    }

                    if (self.options.autoplay === true) {
                        self.autoPlay();
                    }

                    if(self.options.onAfterChange !== null) {
                        self.options.onAfterChange.call();
                    }

                    self.slides.removeClass('active');
                    $(self.slides.get(targetSlide)).addClass('active');

                    if (self.options.arrows === true && self.options.infinite !== true) {
                        if (self.currentSlide === 0) {
                            self.prevArrow.addClass('disabled');
                            self.nextArrow.removeClass('disabled');
                        } else if (self.currentSlide >= (self.slideCount / self.options.slidesToScroll * self.options.slidesToShow) - self.options.slidesToScroll) {
                            self.nextArrow.addClass('disabled');
                            self.prevArrow.removeClass('disabled');
                        } else {
                            self.prevArrow.removeClass('disabled');
                            self.nextArrow.removeClass('disabled');
                        }
                    }

                });

            }

        };

        slider.prototype.dragHandler = function(event) {

            var animProps = {}, curLeft, newLeft = null;

            curLeft = ((this.currentSlide * this.slideWidth) * -1) + this.slideOffset;

            this.touchObject.minSwipe = this.slideWidth / this.options.touchThreshold;

            switch (event.data.action) {

                case 'start':


                    this.list.addClass('dragging');

                    this.touchObject.startX = event.clientX;
                    this.touchObject.startY = event.clientY;
                    this.touchObject.curX = event.clientX;
                    this.touchObject.curY = event.clientY;

                    break;

                case 'move':

                    this.touchObject.curX = event.clientX;
                    this.touchObject.curY = event.clientY;

                    this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curX - this.touchObject.startX, 2)));

                    if (this.swipeDirection() !== 'up' && this.swipeDirection() !== 'down') {

                        event.originalEvent.preventDefault();

                        if (this.touchObject.curX > this.touchObject.startX) {

                            if(this.options.touchMove == true) {

                                newLeft = curLeft + this.touchObject.swipeLength;
                                if (this.transformsEnabled === false) {
                                    this.slideTrack.css('left', newLeft);
                                } else {
                                    animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                                    this.slideTrack.css(animProps);
                                    this.swipeLeft = newLeft;
                                }

                            }

                        } else {

                            if(this.options.touchMove == true) {

                                newLeft = curLeft - this.touchObject.swipeLength;
                                if (this.transformsEnabled === false) {
                                    this.slideTrack.css('left', newLeft);
                                } else {
                                    animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                                    this.slideTrack.css(animProps);
                                    this.swipeLeft = newLeft;
                                }

                            }

                        }

                    }

                    break;

                case 'end':

                    this.list.removeClass('dragging');

                    if (this.touchObject.curX !== 0) {

                        if (this.touchObject.swipeLength >= this.touchObject.minSwipe) {

                            switch (this.swipeDirection()) {

                                case 'left':

                                    this.slideHandler(this.currentSlide + this.options.slidesToScroll);
                                    this.touchObject = {};

                                    break;

                                case 'right':

                                    this.slideHandler(this.currentSlide - this.options.slidesToScroll);
                                    this.touchObject = {};

                                    break;

                            }

                        } else {

                            this.slideHandler(this.currentSlide);
                            this.touchObject = {};

                        }

                    } else {

                        this.touchObject = {};

                    }

                    break;

                case 'cancel':

                    this.list.removeClass('dragging');

                    if(this.touchObject.startX) {
                        this.slideHandler(this.currentSlide);
                        this.touchObject = {};
                    }

                    break;

            }

        }

        slider.prototype.swipeHandler = function(event) {

            var animProps = {}, curLeft, newLeft = null;

            curLeft = ((this.currentSlide * this.slideWidth) * -1) + this.slideOffset;

            this.touchObject.fingerCount = event.originalEvent.touches.length;

            this.touchObject.minSwipe = this.slideWidth / this.options.touchThreshold;

            switch (event.data.action) {

                case 'start':

                    if (this.touchObject.fingerCount === 1) {

                        this.touchObject.startX = event.originalEvent.touches[0].pageX;
                        this.touchObject.startY = event.originalEvent.touches[0].pageY;
                        this.touchObject.curX = event.originalEvent.touches[0].pageX;
                        this.touchObject.curY = event.originalEvent.touches[0].pageY;

                    } else {

                        this.touchObject = {};

                    }

                    break;

                case 'move':

                    if (event.originalEvent.touches.length === 1) {

                        this.touchObject.curX = event.originalEvent.touches[0].pageX;
                        this.touchObject.curY = event.originalEvent.touches[0].pageY;

                        this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curX - this.touchObject.startX, 2)));

                        if (this.swipeDirection() !== 'up' && this.swipeDirection() !== 'down') {

                            event.originalEvent.preventDefault();

                            if (this.touchObject.curX > this.touchObject.startX) {

                                if(this.options.touchMove == true) {

                                    newLeft = curLeft + this.touchObject.swipeLength;
                                    if (this.transformsEnabled === false) {
                                        this.slideTrack.css('left', newLeft);
                                    } else {
                                        animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                                        this.slideTrack.css(animProps);
                                        this.swipeLeft = newLeft;
                                    }

                                }

                            } else {

                                if(this.options.touchMove == true) {

                                    newLeft = curLeft - this.touchObject.swipeLength;
                                    if (this.transformsEnabled === false) {
                                        this.slideTrack.css('left', newLeft);
                                    } else {
                                        animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                                        this.slideTrack.css(animProps);
                                        this.swipeLeft = newLeft;
                                    }

                                }

                            }

                        }

                    } else {

                        this.touchObject = {};

                    }

                    break;

                case 'end':

                    if (this.touchObject.fingerCount === 0 && this.touchObject.curX !== 0) {

                        if (this.touchObject.swipeLength >= this.touchObject.minSwipe) {

                            switch (this.swipeDirection()) {

                                case 'left':

                                    this.slideHandler(this.currentSlide + this.options.slidesToScroll);
                                    this.touchObject = {};

                                    break;

                                case 'right':

                                    this.slideHandler(this.currentSlide - this.options.slidesToScroll);
                                    this.touchObject = {};

                                    break;

                            }

                        } else {

                            this.slideHandler(this.currentSlide);
                            this.touchObject = {};

                        }

                    } else {

                        this.touchObject = {};

                    }

                    break;

                case 'cancel':

                    break;

            }

        };

        slider.prototype.swipeDirection = function() {

            var xDist, yDist, r, swipeAngle;

            xDist = this.touchObject.startX - this.touchObject.curX;
            yDist = this.touchObject.startY - this.touchObject.curY;
            r = Math.atan2(yDist, xDist);

            swipeAngle = Math.round(r * 180 / Math.PI);
            if (swipeAngle < 0) {
                swipeAngle = 360 - Math.abs(swipeAngle);
            }

            if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
                return 'left';
            } else if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
                return 'left';
            } else if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
                return 'right';
            } else if ((swipeAngle > 45) && (swipeAngle < 135)) {
                return 'down';
            } else {
                return 'up';
            }

        };

        slider.prototype.refresh = function() {

            this.destroy();
            this.autoPlayTimer = null;
            this.currentSlide = 0;
            this.currentLeft = null;
            this.direction = 1;
            this.dots = null;
            this.listWidth = null;
            this.loadIndex = 0;
            this.nextArrow = null;
            this.prevArrow = null;
            this.slideCount = null;
            this.slideWidth = null;
            this.slideTrack = null;
            this.slides = null;
            this.sliding = false;
            this.slideOffset = 0;
            this.swipeLeft = null;
            this.list = null;
            this.touchObject = {};
            this.transformsEnabled = false;

            if (!$(this.slider).hasClass('slick-initialized')) {

                $(this.slider).addClass('slick-initialized');
                this.buildOut();
                this.setValues();
                this.getAnimType();
                this.setPosition();
                this.startLoad();
                this.loadSlider();
                this.initializeEvents();

            }

        }

        slider.prototype.destroy = function() {
            $('.cloned', this.slider).remove();
            $('.placeholder', this.slider).remove();
            if(this.dots) {
                this.dots.remove();
            }
            if(this.prevArrow) {
                this.prevArrow.remove();
                this.nextArrow.remove();
            }
            this.slides.unwrap().unwrap();
            this.slides.removeClass('slide').width('');
            this.slider.removeClass('slick-slider');
            this.slider.removeClass('slick-initialized');
        }

        return slider;

    }());

$.fn.slick = function(options) {

    'use strict';

    return this.each(function(index) {

        this.slider = new slick.slider(this, options);

    });
}

$.fn.unslick = function(){
    return this.each(function(index) {

        this.slider.destroy();

    });
}