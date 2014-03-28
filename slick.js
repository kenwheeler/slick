/*
 slick.js
 Author: Ken Wheeler
 Date: 03/23/14
 */
/*global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }

}(function ($) {
    'use strict';
    var slick = window.slick || {}, functionBinder;

    /************ Helpers ***********/

    // Function Binder

    functionBinder = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    /********** End Helpers *********/

    slick.slider = (function () {

        function slider(element, settings) {

            var _ = this, responsiveSettings, breakpoint;

            _.defaults = {
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

            _.initials = {
                animating : false,
                autoPlayTimer : null,
                currentSlide : 0,
                currentLeft : null,
                direction : 1,
                dots : null,
                listWidth : null,
                loadIndex : 0,
                nextArrow : null,
                prevArrow : null,
                slideCount : null,
                slideWidth : null,
                slideTrack : null,
                slides : null,
                sliding : false,
                slideOffset : 0,
                swipeLeft : null,
                list : null,
                touchObject : {},
                transformsEnabled : false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.slider = $(element);

            _.options = $.extend({}, _.defaults, settings);

            _.originalSettings = _.options;
            responsiveSettings = _.options.responsive ||
                null;

            if (responsiveSettings && responsiveSettings.length > -1) {
                for (breakpoint in responsiveSettings) {
                    if (responsiveSettings.hasOwnProperty(breakpoint)) {
                        _.breakpoints.push(responsiveSettings[
                            breakpoint].breakpoint);
                        _.breakpointSettings[responsiveSettings[
                            breakpoint].breakpoint] =
                            responsiveSettings[breakpoint].settings;
                    }
                }
                _.breakpoints.sort(function (a, b) {
                    return b - a;
                });
            }

            _.changeSlide = functionBinder(_.changeSlide,
                _);
            _.setPosition = functionBinder(_.setPosition,
                _);
            _.swipeHandler = functionBinder(_.swipeHandler,
                _);
            _.dragHandler = functionBinder(_.dragHandler,
                _);
            _.autoPlayIterator = functionBinder(_.autoPlayIterator,
                _);

            _.init();

        }


        slider.prototype.init = function () {

            var _ = this;

            if (!$(_.slider).hasClass('slick-initialized')) {

                $(_.slider).addClass('slick-initialized');
                _.buildOut();
                _.getAnimType();
                _.startLoad();
                _.loadSlider();
                _.initializeEvents();
                _.checkResponsive();
            }

        };

        slider.prototype.getAnimType = function () {

            var _ = this;

            if (document.body.style.MozTransform !== undefined) {

                _.animType = 'MozTransform';

            } else if (document.body.style.webkitTransform !==
                undefined) {

                _.animType = "webkitTransform";

            } else if (document.body.style.msTransform !==
                undefined) {

                _.animType = "msTransform";

            }

            if (_.animType !== null) {

                _.transformsEnabled = true;

            }

        };

        slider.prototype.autoPlay = function () {

            var _ = this;

            if (_.autoPlayTimer) {

                clearInterval(_.autoPlayTimer);

            }

            _.autoPlayTimer = setInterval(_.autoPlayIterator,
                _.options.autoplaySpeed);

        };

        slider.prototype.autoPlayIterator = function () {

            var _ = this;

            if (_.options.infinite === false) {

                if (_.direction === 1) {

                    if ((_.currentSlide + 1) === _.slideCount -
                        1) {
                        _.direction = 0;
                    }

                    _.slideHandler(_.currentSlide + _.options
                        .slidesToScroll);

                } else {

                    if ((_.currentSlide - 1 === 0)) {

                        _.direction = 1;

                    }

                    _.slideHandler(_.currentSlide - _.options
                        .slidesToScroll);

                }

            } else {

                _.slideHandler(_.currentSlide + _.options.slidesToScroll);

            }

        };

        slider.prototype.checkResponsive = function () {
            var _ = this, breakpoint, targetBreakpoint;

            if (_.originalSettings.responsive && _.originalSettings
                .responsive.length > -1) {

                targetBreakpoint = null;

                for (breakpoint in _.breakpoints) {
                    if (_.breakpoints.hasOwnProperty(breakpoint)) {
                        if ($(window).width() < _.breakpoints[
                            breakpoint]) {
                            targetBreakpoint = _.breakpoints[
                                breakpoint];
                        }
                    }
                }

                if (targetBreakpoint !== null) {
                    if (_.activeBreakpoint !== null) {
                        if (targetBreakpoint !== _.activeBreakpoint) {
                            _.activeBreakpoint =
                                targetBreakpoint;
                            _.options = $.extend({}, _.defaults,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                                _.refresh();
                        }
                    } else {
                        _.activeBreakpoint = targetBreakpoint;
                        _.options = $.extend({}, _.defaults,
                            _.breakpointSettings[
                                targetBreakpoint]);
                            _.refresh();
                    }
                } else {
                    if (_.activeBreakpoint !== null) {
                        _.activeBreakpoint = null;
                        _.options = $.extend({}, _.defaults,
                            _.originalSettings);
                            _.refresh();
                    }
                }

            }
        };

        slider.prototype.startLoad = function () {

            var _ = this;

            if (_.options.arrows === true) {

                _.prevArrow.hide();
                _.nextArrow.hide();

            }

            if (_.options.dots === true) {

                _.dots.hide();

            }

            _.slider.addClass('slick-loading');

        };

        slider.prototype.loadSlider = function () {

            var _ = this;

            _.setPosition();

            _.slideTrack.animate({
                opacity: 1
            }, _.options.speed, function () {
                _.setPosition();
            });

            if (document.readyState !== "complete") {

                $(window).load(function () {

                    if (_.options.arrows === true) {

                        _.prevArrow.show();
                        _.nextArrow.show();

                    }

                    if (_.options.dots === true) {

                        _.dots.show();

                    }

                    _.slider.removeClass('slick-loading');

                    if (_.options.autoplay === true) {

                        _.autoPlay();

                    }

                });

            } else {

                if (_.options.arrows === true) {

                    _.prevArrow.show();
                    _.nextArrow.show();

                }

                if (_.options.dots === true) {

                    _.dots.show();

                }

                _.slider.removeClass('slick-loading');

                if (_.options.autoplay === true) {

                    _.autoPlay();

                }

            }

        };

        slider.prototype.setValues = function () {

            var _ = this;

            _.listWidth = _.list.width();
            _.slideWidth = Math.ceil(_.listWidth / _.options
                .slidesToShow);

        };

        slider.prototype.buildOut = function () {

            var i, _ = this, placeholders, slideIndex;

            _.slides = $(_.options.slide +
                ':not(.slick-cloned)', _.slider).addClass(
                'slick-slide');
            _.slideCount = _.slides.length;
            if ((_.slideCount % _.options.slidesToScroll) !==
                0 && _.options.slidesToShow !== 1) {

                placeholders = Math.abs(_.options.slidesToScroll -
                    (_.slideCount % _.options.slidesToScroll)
                );
                for (i = 0; i < placeholders; i += 1) {
                    $('<div/>').appendTo(_.slider).addClass(
                        'slick-slide slick-placeholder');
                }
                _.slides = $('.slick-slide:not(.slick-cloned)',
                    _.slider);
                _.slideCount = _.slides.length;

            }

            _.slider.addClass("slick-slider");
            _.slideTrack = _.slides.wrapAll(
                '<div class="slick-track"/>').parent();
            _.list = _.slideTrack.wrap(
                '<div class="slick-list"/>').parent();
            _.slideTrack.css('opacity', 0);

            if (_.options.arrows === true) {

                _.prevArrow = $(
                    '<a href="javascript:void(0)">Previous</a>').appendTo(
                    _.slider).addClass('slick-prev');
                _.nextArrow = $(
                    '<a href="javascript:void(0)">Next</a>').appendTo(
                    _.slider).addClass('slick-next');

                if (_.options.infinite !== true) {
                    _.prevArrow.addClass('slick-disabled');
                }

            }

            if (_.options.dots === true) {

                _.dots = $('<ul class="slick-dots"></ul>').appendTo(
                    _.slider);

                for (i = 1; i <= _.slideCount; i += 1) {

                    $('<li><a href="javascript:void(0)">' + i +
                        '</a></li>').appendTo(_.dots);

                }

                if (_.options.slidesToScroll > 1) {
                    _.dots.find('li').hide();
                    i = 0;
                    while (i < _.slideCount) {
                        $(_.dots.find('li').get(i)).show();
                        i = i + _.options.slidesToScroll;
                    }
                }

                _.dots.find('li').first().addClass(
                    'slick-active');

            }

            if (_.options.draggable === true) {
                _.list.addClass('draggable');
            }

            if (_.options.infinite === true) {

                slideIndex = null;

                for (i = _.slideCount; i > (_.slideCount -
                    _.options.slidesToShow); i -= 1) {
                    slideIndex = i - 1;
                    $(_.slides[slideIndex]).clone().prependTo(
                        _.slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < _.options.slidesToShow; i += 1) {
                    slideIndex = i;
                    $(_.slides[slideIndex]).clone().appendTo(
                        _.slideTrack).addClass('slick-cloned');
                }

            }

            _.setSlideClasses(0);

        };

        slider.prototype.setDimensions = function () {
            var _ = this;
            _.slideWidth = Math.ceil(_.listWidth / _.options
                .slidesToShow);
            _.list.find('.slick-slide').width(_.slideWidth);
            _.slideTrack.width(Math.ceil((_.slideWidth * _
                .slider.find('.slick-slide').length)));
        };

        slider.prototype.setPosition = function () {
            var _ = this, animProps = {}, targetLeft;
            _.setValues();
            _.setDimensions();

            if (_.options.infinite === true) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
            }

            targetLeft = ((_.currentSlide *
                    _.slideWidth) * -1) + _.slideOffset;

            if (_.transformsEnabled === false) {
                _.slideTrack.css('left', targetLeft);
            } else {
                animProps[_.animType] = "translate(" +
                    targetLeft + "px, 0px)";
                _.slideTrack.css(animProps);
            }

        };

        slider.prototype.initializeEvents = function () {

            var _ = this;

            if (_.options.arrows === true) {
                _.prevArrow.on('click.slick', {
                    message: 'previous'
                }, _.changeSlide);
                _.nextArrow.on('click.slick', {
                    message: 'next'
                }, _.changeSlide);
            }

            if (_.options.dots === true) {
                $('li a', _.dots).on('click.slick', {
                    message: 'index'
                }, _.changeSlide);
            }

            if (_.options.swipe === true) {
                _.list.on('touchstart.slick', {
                    action: 'start',
                    kind: 'touch'
                }, _.swipeHandler);
                _.list.on('touchmove.slick', {
                    action: 'move',
                    kind: 'touch'
                }, _.swipeHandler);
                _.list.on('touchend.slick', {
                    action: 'end',
                    kind: 'touch'
                }, _.swipeHandler);
            }

            if (_.options.draggable === true) {
                _.list.on('mousedown.slick', {
                    action: 'start',
                    kind: 'drag'
                }, _.swipeHandler);
                _.list.on('mousemove.slick', {
                    action: 'move',
                    kind: 'drag'
                }, _.swipeHandler);
                _.list.on('mouseup.slick', {
                    action: 'end',
                    kind: 'drag'
                }, _.swipeHandler);
                _.list.on('mouseout.slick', {
                    action: 'cancel',
                    kind: 'drag'
                }, _.swipeHandler);
            }

            $(window).on('orientationchange.slick', _.setPosition);

            $(window).on('resize.slick', function () {
                _.checkResponsive();
                _.setPosition();
            });

            $(window).on('load.slick', _.setPosition);

        };

        slider.prototype.changeSlide = function (event) {

            var _ = this;

            switch (event.data.message) {

            case 'previous':
                if (_.animating === false) {
                    _.slideHandler(_.currentSlide - _.options
                        .slidesToScroll);
                } else {
                    return false;
                }
                break;

            case 'next':
                if (_.animating === false) {
                    _.slideHandler(_.currentSlide + _.options
                        .slidesToScroll);
                } else {
                    return false;
                }
                break;

            case 'index':
                if (_.animating === false) {
                    _.slideHandler($(event.target).parent().index());
                } else {
                    return false;
                }
                break;

            default:
                return false;
            }

        };

        slider.prototype.updateDots = function () {
            var _ = this;
            _.dots.find('li').removeClass('slick-active');
            $(_.dots.find('li').get(_.currentSlide)).addClass(
                'slick-active');

        };

        slider.prototype.animateSlide = function (targetLeft,
            callback) {

            var animProps = {}, _ = this;

            if (_.options.onBeforeChange !== null) {
                _.options.onBeforeChange.call();
            }

            if (_.transformsEnabled === false) {

                _.slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, callback);

            } else {

                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    step: function (now) {
                        animProps[_.animType] = "translate(" +
                            now + "px, 0px)";
                        _.slideTrack.css(animProps);
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
            var visible = null, _ = this, i;
            _.slides.removeClass('slick-active');
            $(_.slides.get(index)).addClass('slick-active');
        };

        slider.prototype.postSlide = function (index) {

            var _ = this;

            _.animating = false;

            _.currentSlide = index;

            _.setPosition();

            if (_.swipeLeft !== null) {
                _.swipeLeft = null;
            }

            if (_.options.dots) {
                _.updateDots();
            }

            if (_.options.autoplay === true) {
                _.autoPlay();
            }

            if (_.options.onAfterChange !== null) {
                _.options.onAfterChange.call();
            }

            if (_.options.arrows === true && _.options.infinite !==
                true) {
                if (_.currentSlide === 0) {
                    _.prevArrow.addClass('slick-disabled');
                    _.nextArrow.removeClass('slick-disabled');
                } else if (_.currentSlide >= (_.slideCount /
                    _.options.slidesToScroll * _.options.slidesToShow
                ) - _.options.slidesToScroll) {
                    _.nextArrow.addClass('slick-disabled');
                    _.prevArrow.removeClass('slick-disabled');
                } else {
                    _.prevArrow.removeClass('slick-disabled');
                    _.nextArrow.removeClass('slick-disabled');
                }
            }

            _.setSlideClasses(_.currentSlide);

        };

        slider.prototype.slideHandler = function (index) {

            var targetSlide, slideLeft, targetLeft =
                    null,
                _ = this;

            targetSlide = index;
            targetLeft = ((targetSlide * _.slideWidth) * -1) +
                _.slideOffset;
            slideLeft = ((_.currentSlide * _.slideWidth) * -1) +
                _.slideOffset;

            if (_.options.autoplay === true) {
                clearInterval(_.autoPlayTimer);
            }

            if (_.swipeLeft === null) {
                _.currentLeft = slideLeft;
            } else {
                _.currentLeft = _.swipeLeft;
            }

            if (targetSlide < 0) {

                if (_.options.infinite === true) {

                    _.animating = true;

                    _.animateSlide(targetLeft, function () {

                        _.postSlide(_.slideCount - _.options
                            .slidesToScroll);

                    });

                } else {

                    _.animateSlide(slideLeft);

                    return false;

                }

            } else if (targetSlide > (_.slideCount - 1)) {

                if (_.options.infinite === true) {

                    _.animating = true;

                    _.animateSlide(targetLeft, function () {

                        _.postSlide(0);

                    });

                } else {

                    _.animateSlide(slideLeft);

                    return false;

                }

            } else {

                _.animating = true;

                _.animateSlide(targetLeft, function () {

                    _.postSlide(targetSlide);

                });

            }

        };

        slider.prototype.swipeHandler = function (event) {

            var animProps = {}, curLeft, newLeft = null, _ = this;

            curLeft = ((_.currentSlide * _.slideWidth) * -1) +
                _.slideOffset;

            if (event.data.kind === 'touch') {
                _.touchObject.fingerCount = event.originalEvent.touches
                    .length;
            }

            _.touchObject.minSwipe = _.slideWidth / _.options
                .touchThreshold;

            switch (event.data.action) {

            case 'start':

                if (_.touchObject.fingerCount === 1 || event.data
                    .kind === 'drag') {

                    if (event.data.kind === 'touch') {
                        _.touchObject.startX = event.originalEvent
                            .touches[0].pageX;
                        _.touchObject.startY = event.originalEvent
                            .touches[0].pageY;
                        _.touchObject.curX = event.originalEvent
                            .touches[0].pageX;
                        _.touchObject.curY = event.originalEvent
                            .touches[0].pageY;
                    } else {
                        _.list.addClass('dragging');
                        _.touchObject.startX = event.clientX;
                        _.touchObject.startY = event.clientY;
                        _.touchObject.curX = event.clientX;
                        _.touchObject.curY = event.clientY;
                    }

                } else {

                    _.touchObject = {};

                }

                break;

            case 'move':

                if ((event.originalEvent.touches && event.originalEvent
                        .touches.length === 1) || event.data.kind ===
                    'drag') {

                    if (event.data.kind === 'touch') {
                        _.touchObject.curX = event.originalEvent
                            .touches[0].pageX;
                        _.touchObject.curY = event.originalEvent
                            .touches[0].pageY;
                    } else {
                        _.touchObject.curX = event.clientX;
                        _.touchObject.curY = event.clientY;
                    }

                    _.touchObject.swipeLength = Math.round(Math.sqrt(
                        Math.pow(_.touchObject.curX - _.touchObject
                            .startX, 2)));

                    if (_.swipeDirection() !== 'up' && _.swipeDirection() !==
                        'down') {

                        event.originalEvent.preventDefault();

                        if (_.touchObject.curX > _.touchObject
                            .startX) {

                            if (_.options.touchMove === true) {

                                newLeft = curLeft + _.touchObject
                                    .swipeLength;
                                if (_.transformsEnabled ===
                                    false) {
                                    _.slideTrack.css('left',
                                        newLeft);
                                } else {
                                    animProps[_.animType] =
                                        "translate(" + newLeft +
                                        "px, 0px)";
                                    _.slideTrack.css(animProps);
                                    _.swipeLeft = newLeft;
                                }

                            }

                        } else {

                            if (_.options.touchMove === true) {

                                newLeft = curLeft - _.touchObject
                                    .swipeLength;
                                if (_.transformsEnabled ===
                                    false) {
                                    _.slideTrack.css('left',
                                        newLeft);
                                } else {
                                    animProps[_.animType] =
                                        "translate(" + newLeft +
                                        "px, 0px)";
                                    _.slideTrack.css(animProps);
                                    _.swipeLeft = newLeft;
                                }

                            }

                        }

                    }

                } else {

                    _.touchObject = {};

                }

                break;

            case 'end':

                if ((_.touchObject.fingerCount === 0 && _.touchObject
                    .curX !== 0) || event.data.kind === 'drag') {

                    if (_.touchObject.swipeLength >= _.touchObject
                        .minSwipe) {

                        switch (_.swipeDirection()) {

                        case 'left':

                            _.slideHandler(_.currentSlide +
                                _.options.slidesToScroll);
                            _.touchObject = {};

                            break;

                        case 'right':

                            _.slideHandler(_.currentSlide -
                                _.options.slidesToScroll);
                            _.touchObject = {};

                            break;

                        }

                    } else {

                        _.slideHandler(_.currentSlide);
                        _.touchObject = {};

                    }

                    if (event.data.kind === 'drag') {
                        _.list.removeClass('dragging');
                    }

                } else {

                    _.touchObject = {};

                }

                break;

            case 'cancel':

                _.list.removeClass('dragging');

                if (_.touchObject.startX) {
                    _.slideHandler(_.currentSlide);
                    _.touchObject = {};
                }

                break;

            }

        };

        slider.prototype.swipeDirection = function () {

            var xDist, yDist, r, swipeAngle, _ = this;

            xDist = _.touchObject.startX - _.touchObject.curX;
            yDist = _.touchObject.startY - _.touchObject.curY;
            r = Math.atan2(yDist, xDist);

            swipeAngle = Math.round(r * 180 / Math.PI);
            if (swipeAngle < 0) {
                swipeAngle = 360 - Math.abs(swipeAngle);
            }

            if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
                return 'left';
            }
            if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
                return 'left';
            }
            if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
                return 'right';
            }
            if ((swipeAngle > 45) && (swipeAngle < 135)) {
                return 'down';
            }

            return 'up';

        };

        slider.prototype.refresh = function () {

            var _ = this;

            _.destroy();

            $.extend(_, _.initials);

            _.init();

        };

        slider.prototype.destroy = function () {
            var _ = this;
            $('.slick-cloned', _.slider).remove();
            $('.slick-placeholder', _.slider).remove();
            if (_.dots) {
                _.dots.remove();
            }
            if (_.prevArrow) {
                _.prevArrow.remove();
                _.nextArrow.remove();
            }
            _.slides.unwrap().unwrap();
            _.slides.removeClass(
                'slick-slide slick-active slick-visible').width('');
            _.slider.removeClass('slick-slider');
            _.slider.removeClass('slick-initialized');
        };

        return slider;

    }());

    $.fn.slick = function (options) {
        var _ = this;
        return _.each(function (index, element) {

            element.slider = new slick.slider(element, options);

        });
    };

    $.fn.unslick = function (index, element) {
        var _ = this;
        return _.each(function () {

            element.slider.destroy();

        });
    };

}));