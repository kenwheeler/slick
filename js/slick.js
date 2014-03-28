/*
 slick.js
 Author: Ken Wheeler
 Date: 03/23/14
 */
/*global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }

}(function ($) {

    var slick = window.slick || {};

    /************ Helpers ***********/

    // Function Binder

    var functionBinder = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    /********** End Helpers *********/

    slick.slider = (function () {

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
            var responsiveSettings = this.options.responsive ||
                null;

            if (responsiveSettings && responsiveSettings.length > -
                1) {
                for (var breakpoint in responsiveSettings) {
                    this.breakpoints.push(responsiveSettings[
                        breakpoint].breakpoint);
                    this.breakpointSettings[responsiveSettings[
                        breakpoint].breakpoint] =
                        responsiveSettings[breakpoint].settings;
                }
                this.breakpoints.sort(function (a, b) {
                    return b - a;
                });
            }

            this.changeSlide = functionBinder(this.changeSlide,
                this);
            this.setPosition = functionBinder(this.setPosition,
                this);
            this.swipeHandler = functionBinder(this.swipeHandler,
                this);
            this.dragHandler = functionBinder(this.dragHandler,
                this);
            this.autoPlayIterator = functionBinder(this.autoPlayIterator,
                this);

            this.init();

        }


        slider.prototype.init = function () {

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

        slider.prototype.getAnimType = function () {

            if (document.body.style.MozTransform !== undefined) {

                this.animType = 'MozTransform';

            } else if (document.body.style.webkitTransform !==
                undefined) {

                this.animType = "webkitTransform";

            } else if (document.body.style.msTransform !==
                undefined) {

                this.animType = "msTransform";

            }

            if (this.animType !== null) {

                this.transformsEnabled = true;

            }

        };

        slider.prototype.autoPlay = function () {

            if (this.autoPlayTimer) {

                clearInterval(this.autoPlayTimer);

            }

            this.autoPlayTimer = setInterval(this.autoPlayIterator,
                this.options.autoplaySpeed);

        };

        slider.prototype.autoPlayIterator = function () {

            if (this.options.infinite === false) {

                if (this.direction === 1) {

                    if ((this.currentSlide + 1) === this.slideCount -
                        1) {
                        this.direction = 0;
                    }

                    this.slideHandler(this.currentSlide + this.options
                        .slidesToScroll);

                } else {

                    if ((this.currentSlide - 1 === 0)) {

                        this.direction = 1;

                    }

                    this.slideHandler(this.currentSlide - this.options
                        .slidesToScroll);

                }

            } else {

                this.slideHandler(this.currentSlide + this.options.slidesToScroll);

            }

        };

        slider.prototype.checkResponsive = function () {

            if (this.originalSettings.responsive && this.originalSettings
                .responsive.length > -1) {

                var targetBreakpoint = null;

                for (var breakpoint in this.breakpoints) {
                    if ($(window).width() < this.breakpoints[
                        breakpoint]) {
                        targetBreakpoint = this.breakpoints[
                            breakpoint];
                    }
                }

                if (targetBreakpoint !== null) {
                    if (this.activeBreakpoint !== null) {
                        if (targetBreakpoint !== this.activeBreakpoint) {
                            this.activeBreakpoint =
                                targetBreakpoint;
                            this.options = $.extend({}, this.defaults,
                                this.breakpointSettings[
                                    targetBreakpoint]);
                            this.refresh();
                        }
                    } else {
                        this.activeBreakpoint = targetBreakpoint;
                        this.options = $.extend({}, this.defaults,
                            this.breakpointSettings[
                                targetBreakpoint]);
                        this.refresh();
                    }
                } else {
                    if (this.activeBreakpoint !== null) {
                        this.activeBreakpoint = null;
                        this.options = $.extend({}, this.defaults,
                            this.originalSettings);
                        this.refresh();
                    }
                }

            }
        };

        slider.prototype.startLoad = function () {

            if (this.options.arrows === true) {

                this.prevArrow.hide();
                this.nextArrow.hide();

            }

            if (this.options.dots === true) {

                this.dots.hide();

            }

            this.slider.addClass('slick-loading');

        };

        slider.prototype.loadSlider = function () {

            var self = this;

            self.setPosition();

            self.slideTrack.animate({
                opacity: 1
            }, this.options.speed, function () {
                self.setPosition();
            });

            if (document.readyState !== "complete") {

                $(window).load(function () {

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

        slider.prototype.setValues = function () {

            this.listWidth = this.list.innerWidth();
            this.slideWidth = Math.ceil(this.listWidth / this.options
                .slidesToShow);

        };

        slider.prototype.buildOut = function () {

            var i;

            this.slides = $(this.options.slide +
                ':not(.slick-cloned)', this.slider).addClass(
                'slick-slide');
            this.slideCount = this.slides.length;
            if ((this.slideCount % this.options.slidesToScroll) !==
                0 && this.options.slidesToShow !== 1) {

                var placeholders = Math.abs(this.options.slidesToScroll -
                    (this.slideCount % this.options.slidesToScroll)
                );
                for (i = 0; i < placeholders; i++) {
                    $('<div/>').appendTo(this.slider).addClass(
                        'slick-slide slick-placeholder');
                }
                this.slides = $('.slick-slide:not(.slick-cloned)',
                    this.slider);
                this.slideCount = this.slides.length;

            }

            this.slider.addClass("slick-slider");
            this.slideTrack = this.slides.wrapAll(
                '<div class="slick-track"/>').parent();
            this.list = this.slideTrack.wrap(
                '<div class="slick-list"/>').parent();
            this.slideTrack.css('opacity', 0);

            if (this.options.arrows === true) {

                this.prevArrow = $(
                    '<a href="javascript:void(0)">Previous</a>').appendTo(
                    this.slider).addClass('slick-prev');
                this.nextArrow = $(
                    '<a href="javascript:void(0)">Next</a>').appendTo(
                    this.slider).addClass('slick-next');

                if (this.options.infinite !== true) {
                    this.prevArrow.addClass('slick-disabled');
                }

            }

            if (this.options.dots === true) {

                this.dots = $('<ul class="slick-dots"></ul>').appendTo(
                    this.slider);

                for (i = 1; i <= this.slideCount; i += 1) {

                    $('<li><a href="javascript:void(0)">' + i +
                        '</a></li>').appendTo(this.dots);

                }

                if (this.options.slidesToScroll > 1) {
                    this.dots.find('li').hide();
                    i = 0;
                    while (i < this.slideCount) {
                        $(this.dots.find('li').get(i)).show();
                        i = i + this.options.slidesToScroll;
                    }
                }

                this.dots.find('li').first().addClass(
                    'slick-active');

            }

            if (this.options.draggable === true) {
                this.list.addClass('draggable');
            }

            if (this.options.infinite === true) {

                var slideIndex = null;

                for (i = this.slideCount; i > (this.slideCount -
                    this.options.slidesToShow); i--) {
                    slideIndex = i - 1;
                    $(this.slides[slideIndex]).clone().prependTo(
                        this.slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < this.options.slidesToShow; i++) {
                    slideIndex = i;
                    $(this.slides[slideIndex]).clone().appendTo(
                        this.slideTrack).addClass('slick-cloned');
                }

            }

            this.setSlideClasses(0);

        };

        slider.prototype.setDimensions = function () {
            this.slideWidth = Math.ceil(this.listWidth / this.options
                .slidesToShow);
            this.list.find('.slick-slide').width(this.slideWidth);
            this.slideTrack.width(Math.ceil((this.slideWidth * this
                .slider.find('.slick-slide').length)));
        };

        slider.prototype.setPosition = function () {

            this.setValues();
            this.setDimensions();

            if (this.options.infinite === true) {
                this.slideOffset = (this.slideWidth * this.options.slidesToShow) * -
                    1;
            }

            var animProps = {}, targetLeft = ((this.currentSlide *
                    this.slideWidth) * -1) + this.slideOffset;

            if (this.transformsEnabled === false) {
                this.slideTrack.css('left', targetLeft);
            } else {
                animProps[this.animType] = "translate(" +
                    targetLeft + "px, 0px)";
                this.slideTrack.css(animProps);
            }

        };

        slider.prototype.initializeEvents = function () {

            var self = this;

            if (this.options.arrows === true) {
                this.prevArrow.on('click.slick', {
                    message: 'previous'
                }, this.changeSlide);
                this.nextArrow.on('click.slick', {
                    message: 'next'
                }, this.changeSlide);
            }

            if (this.options.dots === true) {
                $('li a', this.dots).on('click.slick', {
                    message: 'index'
                }, this.changeSlide);
            }

            if (this.options.swipe === true) {
                this.list.on('touchstart.slick', {
                    action: 'start',
                    kind: 'touch'
                }, this.swipeHandler);
                this.list.on('touchmove.slick', {
                    action: 'move',
                    kind: 'touch'
                }, this.swipeHandler);
                this.list.on('touchend.slick', {
                    action: 'end',
                    kind: 'touch'
                }, this.swipeHandler);
            }

            if (this.options.draggable === true) {
                this.list.on('mousedown.slick', {
                    action: 'start',
                    kind: 'drag'
                }, this.swipeHandler);
                this.list.on('mousemove.slick', {
                    action: 'move',
                    kind: 'drag'
                }, this.swipeHandler);
                this.list.on('mouseup.slick', {
                    action: 'end',
                    kind: 'drag'
                }, this.swipeHandler);
                this.list.on('mouseout.slick', {
                    action: 'cancel',
                    kind: 'drag'
                }, this.swipeHandler);
            }

            $(window).on('orientationchange.slick', this.setPosition);

            $(window).on('resize.slick', function () {
                self.checkResponsive();
                self.setPosition();
            });

            $(window).on('load.slick', this.setPosition);

        };

        slider.prototype.changeSlide = function (event) {

            var self = this;

            switch (event.data.message) {

            case 'previous':
                if (this.animating === false) {
                    self.slideHandler(self.currentSlide - self.options
                        .slidesToScroll);
                } else {
                    return false;
                }
                break;

            case 'next':
                if (self.animating === false) {
                    self.slideHandler(self.currentSlide + self.options
                        .slidesToScroll);
                } else {
                    return false;
                }
                break;

            case 'index':
                if (self.animating === false) {
                    self.slideHandler($(event.target).parent().index());
                } else {
                    return false;
                }
                break;

            default:
                return false;
            }

        };

        slider.prototype.updateDots = function () {

            this.dots.find('li').removeClass('slick-active');
            $(this.dots.find('li').get(this.currentSlide)).addClass(
                'slick-active');

        };

        slider.prototype.animateSlide = function (targetLeft,
            callback) {

            var animProps = {}, self = this;

            if (this.options.onBeforeChange !== null) {
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
                    step: function (now) {
                        animProps[self.animType] = "translate(" +
                            now + "px, 0px)";
                        self.slideTrack.css(animProps);
                    },
                    complete: function () {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            }

        };

        slider.prototype.setSlideClasses = function (index) {
            var visible = null;
            this.slides.removeClass('slick-active');
            $(this.slides.get(index)).addClass('slick-active');
            this.slides.removeClass('slick-visible');
            visible = index + this.options.slidesToShow;
            for (var i = index; i < visible; i++) {
                $(this.slides.get(i)).addClass('slick-visible');
            }
        };

        slider.prototype.postSlide = function (index) {

            this.animating = false;

            this.currentSlide = index;

            this.setPosition();

            if (this.swipeLeft !== null) {
                this.swipeLeft = null;
            }

            if (this.options.dots) {
                this.updateDots();
            }

            if (this.options.autoplay === true) {
                this.autoPlay();
            }

            if (this.options.onAfterChange !== null) {
                this.options.onAfterChange.call();
            }

            if (this.options.arrows === true && this.options.infinite !==
                true) {
                if (this.currentSlide === 0) {
                    this.prevArrow.addClass('slick-disabled');
                    this.nextArrow.removeClass('slick-disabled');
                } else if (this.currentSlide >= (this.slideCount /
                    this.options.slidesToScroll * this.options.slidesToShow
                ) - this.options.slidesToScroll) {
                    this.nextArrow.addClass('slick-disabled');
                    this.prevArrow.removeClass('slick-disabled');
                } else {
                    this.prevArrow.removeClass('slick-disabled');
                    this.nextArrow.removeClass('slick-disabled');
                }
            }

            this.setSlideClasses(this.currentSlide);

        };

        slider.prototype.slideHandler = function (index) {

            var targetSlide, slideLeft, targetLeft =
                    null,
                self = this;

            targetSlide = index;
            targetLeft = ((targetSlide * this.slideWidth) * -1) +
                this.slideOffset;
            slideLeft = ((this.currentSlide * this.slideWidth) * -1) +
                this.slideOffset;

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

                    this.animateSlide(targetLeft, function () {

                        self.postSlide(self.slideCount - self.options
                            .slidesToScroll);

                    });

                } else {

                    this.animateSlide(slideLeft);

                    return false;

                }

            } else if (targetSlide > (this.slideCount - 1)) {

                if (this.options.infinite === true) {

                    this.animating = true;

                    this.animateSlide(targetLeft, function () {

                        self.postSlide(0);

                    });

                } else {

                    this.animateSlide(slideLeft);

                    return false;

                }

            } else {

                this.animating = true;

                this.animateSlide(targetLeft, function () {

                    self.postSlide(targetSlide);

                });

            }

        };

        slider.prototype.swipeHandler = function (event) {

            var animProps = {}, curLeft, newLeft = null;

            curLeft = ((this.currentSlide * this.slideWidth) * -1) +
                this.slideOffset;

            if (event.data.kind == 'touch') {
                this.touchObject.fingerCount = event.originalEvent.touches
                    .length;
            }

            this.touchObject.minSwipe = this.slideWidth / this.options
                .touchThreshold;

            switch (event.data.action) {

            case 'start':

                if (this.touchObject.fingerCount === 1 || event.data
                    .kind == 'drag') {

                    if (event.data.kind == 'touch') {
                        this.touchObject.startX = event.originalEvent
                            .touches[0].pageX;
                        this.touchObject.startY = event.originalEvent
                            .touches[0].pageY;
                        this.touchObject.curX = event.originalEvent
                            .touches[0].pageX;
                        this.touchObject.curY = event.originalEvent
                            .touches[0].pageY;
                    } else {
                        this.list.addClass('dragging');
                        this.touchObject.startX = event.clientX;
                        this.touchObject.startY = event.clientY;
                        this.touchObject.curX = event.clientX;
                        this.touchObject.curY = event.clientY;
                    }

                } else {

                    this.touchObject = {};

                }

                break;

            case 'move':

                if ((event.originalEvent.touches && event.originalEvent
                        .touches.length === 1) || event.data.kind ==
                    'drag') {

                    if (event.data.kind == 'touch') {
                        this.touchObject.curX = event.originalEvent
                            .touches[0].pageX;
                        this.touchObject.curY = event.originalEvent
                            .touches[0].pageY;
                    } else {
                        this.touchObject.curX = event.clientX;
                        this.touchObject.curY = event.clientY;
                    }

                    this.touchObject.swipeLength = Math.round(Math.sqrt(
                        Math.pow(this.touchObject.curX - this.touchObject
                            .startX, 2)));

                    if (this.swipeDirection() !== 'up' && this.swipeDirection() !==
                        'down') {

                        event.originalEvent.preventDefault();

                        if (this.touchObject.curX > this.touchObject
                            .startX) {

                            if (this.options.touchMove === true) {

                                newLeft = curLeft + this.touchObject
                                    .swipeLength;
                                if (this.transformsEnabled ===
                                    false) {
                                    this.slideTrack.css('left',
                                        newLeft);
                                } else {
                                    animProps[this.animType] =
                                        "translate(" + newLeft +
                                        "px, 0px)";
                                    this.slideTrack.css(animProps);
                                    this.swipeLeft = newLeft;
                                }

                            }

                        } else {

                            if (this.options.touchMove === true) {

                                newLeft = curLeft - this.touchObject
                                    .swipeLength;
                                if (this.transformsEnabled ===
                                    false) {
                                    this.slideTrack.css('left',
                                        newLeft);
                                } else {
                                    animProps[this.animType] =
                                        "translate(" + newLeft +
                                        "px, 0px)";
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

                if ((this.touchObject.fingerCount === 0 && this.touchObject
                    .curX !== 0) || event.data.kind == 'drag') {

                    if (this.touchObject.swipeLength >= this.touchObject
                        .minSwipe) {

                        switch (this.swipeDirection()) {

                        case 'left':

                            this.slideHandler(this.currentSlide +
                                this.options.slidesToScroll);
                            this.touchObject = {};

                            break;

                        case 'right':

                            this.slideHandler(this.currentSlide -
                                this.options.slidesToScroll);
                            this.touchObject = {};

                            break;

                        }

                    } else {

                        this.slideHandler(this.currentSlide);
                        this.touchObject = {};

                    }

                    if (event.data.kind == 'drag') {
                        this.list.removeClass('dragging');
                    }

                } else {

                    this.touchObject = {};

                }

                break;

            case 'cancel':

                this.list.removeClass('dragging');

                if (this.touchObject.startX) {
                    this.slideHandler(this.currentSlide);
                    this.touchObject = {};
                }

                break;

            }

        };

        slider.prototype.swipeDirection = function () {

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

        slider.prototype.refresh = function () {

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

        };

        slider.prototype.destroy = function () {
            $('.slick-cloned', this.slider).remove();
            $('.slick-placeholder', this.slider).remove();
            if (this.dots) {
                this.dots.remove();
            }
            if (this.prevArrow) {
                this.prevArrow.remove();
                this.nextArrow.remove();
            }
            this.slides.unwrap().unwrap();
            this.slides.removeClass(
                'slick-slide slick-active slick-visible').width('');
            this.slider.removeClass('slick-slider');
            this.slider.removeClass('slick-initialized');
        };

        return slider;

    }());

    $.fn.slick = function (options) {
        return this.each(function () {

            this.slider = new slick.slider(this, options);

        });
    };

    $.fn.unslick = function () {
        return this.each(function () {

            this.slider.destroy();

        });
    };

}));