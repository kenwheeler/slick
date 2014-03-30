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
    var Slick = window.Slick || {}, functionBinder;

    /************ Helpers ***********/

    // Function Binder

    functionBinder = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    /********** End Helpers *********/

    Slick = (function () {

        function Slick(element, settings) {

            var _ = this, responsiveSettings, breakpoint;

            _.defaults = {
                accessibility: true,
                autoplay: false,
                autoplaySpeed: 3000,
                cssEase: 'ease',
                dots: false,
                draggable: true,
                easing: 'linear',
                arrows: true,
                infinite: true,
                onBeforeChange: null,
                onAfterChange: null,
                pauseOnHover: true,
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
            _.slidesCache = null;
            _.cssTransitions = false;

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

            _.autoPlay = functionBinder(_.autoPlay,
                _);
            _.autoPlayClear = functionBinder(_.autoPlayClear,
                _);
            _.changeSlide = functionBinder(_.changeSlide,
                _);
            _.setPosition = functionBinder(_.setPosition,
                _);
            _.swipeHandler = functionBinder(_.swipeHandler,
                _);
            _.dragHandler = functionBinder(_.dragHandler,
                _);
            _.keyHandler = functionBinder(_.keyHandler,
                _);
            _.autoPlayIterator = functionBinder(_.autoPlayIterator,
                _);

            _.init();

        }

        return Slick;

    }());

    Slick.prototype.init = function () {

        var _ = this;

        if (!$(_.slider).hasClass('slick-initialized')) {

            $(_.slider).addClass('slick-initialized');
            _.buildOut();
            _.getAnimType();
            _.checkTransition();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.checkResponsive();
        }

    };

    Slick.prototype.addSlide = function (markup) {

        var _ = this;

        _.unload();

        $(markup).appendTo(_.slideTrack);

        _.slides = _.slideTrack.find(this.options.slide);

        _.slideTrack.find(this.options.slide).remove();

        _.slideTrack.append(_.slides);

        _.reinit();

    };

    Slick.prototype.removeSlide = function (index) {

        var _ = this;

        _.unload();

        if(_.slideCount < 1) {
            return false;
        }

        $(_.slideTrack.find(this.options.slide).get(index)).remove();

        _.slides = _.slideTrack.find(this.options.slide);

        _.slideTrack.find(this.options.slide).remove();

        _.slideTrack.append(_.slides);

        _.reinit();

    };

    Slick.prototype.filterSlides = function (filter) {

        var _ = this;

        if(filter !== null) {

            _.unload();

            _.slideTrack.find(this.options.slide).remove();

            _.slidesCache.filter(filter).appendTo(_.slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unfilterSlides = function () {

        var _ = this;

        if(_.slidesCache !== null) {

            _.unload();

            _.slideTrack.find(this.options.slide).remove();

            _.slidesCache.appendTo(_.slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.checkTransition = function () {

        var _ = this;

        if (document.body.style.WebkitTransition !== undefined) {

            _.cssTransitions = true;

        } else if (document.body.style.MozTransition !==
            undefined) {

            _.cssTransitions = true;

        } else if (document.body.style.msTransition !==
            undefined) {

            _.cssTransitions = true;

        }

    };

    Slick.prototype.applyTransition = function () {

        var _ = this, transition,origin;

        transition = 'all ' + _.options.speed + 'ms ' + _.options.cssEase;
        origin = (_.listWidth / 2) + ' 50%';

        _.slideTrack.css({
            transition: transition,
            transformOrigin: origin
        });
    };

    Slick.prototype.disableTransition = function () {

        var _ = this;

        _.slideTrack.css({
            transition: '',
            transformOrigin: ''
        });

    };

    Slick.prototype.getAnimType = function () {

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

    Slick.prototype.autoPlay = function () {

        var _ = this;

        if (_.autoPlayTimer) {

            clearInterval(_.autoPlayTimer);

        }

        _.autoPlayTimer = setInterval(_.autoPlayIterator,
            _.options.autoplaySpeed);

    };

    Slick.prototype.autoPlayClear = function () {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function () {

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

    Slick.prototype.checkResponsive = function () {
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

    Slick.prototype.startLoad = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.prevArrow.hide();
            _.nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.dots.hide();

        }

        _.slider.addClass('slick-loading');

    };

    Slick.prototype.initUI = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.prevArrow.show();
            _.nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.dots.show();

        }

        if (_.options.autoplay === true) {

            _.autoPlay();

        }

    };

    Slick.prototype.loadSlider = function () {

        var _ = this;

        _.setPosition();

        _.slideTrack.css({
            opacity: 1
        });

        if (document.readyState !== "complete") {

            $(window).load(function () {

                _.slider.removeClass('slick-loading');

                _.initUI();

            });

        } else {

            _.slider.removeClass('slick-loading');

            _.initUI();

        }

    };

    Slick.prototype.setValues = function () {

        var _ = this;

        _.listWidth = _.list.width();
        _.slideWidth = Math.ceil(_.listWidth / _.options
            .slidesToShow);

    };

    Slick.prototype.buildArrows = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.prevArrow = $(
                '<a href="javascript:void(0)" tabIndex="-1">Previous</a>').appendTo(
                _.slider).addClass('slick-prev');
            _.nextArrow = $(
                '<a href="javascript:void(0)" tabIndex="-1">Next</a>').appendTo(
                _.slider).addClass('slick-next');

            if (_.options.infinite !== true) {
                _.prevArrow.addClass('slick-disabled');
            }

        }

    };

    Slick.prototype.buildDots = function () {

        var _ = this, i, dotString;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            dotString = '<ul class="slick-dots">';

            for (i = 1; i <= _.slideCount; i += 1) {

                dotString += '<li><a href="javascript:void(0)" tabIndex="-1">' + i +
                    '</a></li>';

            }

            dotString += "</ul>";

            _.dots = $(dotString).appendTo(
                _.slider);

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

    };

    Slick.prototype.setupInfinite = function () {

        var _ = this, i, slideIndex;

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

    };

    Slick.prototype.setupPlaceholders = function () {

        var _ = this, i, placeholders;

        if ((_.slideCount % _.options.slidesToScroll) !==
            0 && _.options.slidesToShow !== 1) {

            placeholders = Math.abs(_.options.slidesToScroll -
                (_.slideCount % _.options.slidesToScroll)
            );
            for (i = 0; i < placeholders; i += 1) {
                $('<div/>').appendTo(_.slideTrack).addClass(
                    'slick-slide slick-placeholder');
            }
            _.slides = $('.slick-slide:not(.slick-cloned)',
                _.slider);
            _.slideCount = _.slides.length;
        }

    };

    Slick.prototype.buildOut = function () {

        var _ = this;

        _.slides = $(_.options.slide +
            ':not(.slick-cloned)', _.slider).addClass(
            'slick-slide');
        _.slideCount = _.slides.length;
        _.slidesCache = _.slides;

        _.slider.addClass("slick-slider");
        _.slideTrack = _.slides.wrapAll(
            '<div class="slick-track"/>').parent();
        _.list = _.slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.slideTrack.css('opacity', 0);

        if(_.options.accessibility === true) {
            _.list.prop('tabIndex',0);
        }

        _.setupPlaceholders();

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.setSlideClasses(0);

        if (_.options.draggable === true) {
            _.list.addClass('draggable');
        }

    };

    Slick.prototype.setDimensions = function () {
        var _ = this;
        _.slideWidth = Math.ceil(_.listWidth / _.options
            .slidesToShow);
        _.list.find('.slick-slide').width(_.slideWidth);
        _.slideTrack.width(Math.ceil((_.slideWidth * _
            .slider.find('.slick-slide').length)));
    };

    Slick.prototype.setPosition = function () {
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
            if(_.cssTransitions === false) {
                animProps[_.animType] = "translate(" +
                    targetLeft + "px, 0px)";
                _.slideTrack.css(animProps);
            } else {
                animProps[_.animType] = "translate3d(" +
                targetLeft + "px, 0px,0px)";
                _.slideTrack.css(animProps);
            }
        }

    };

    Slick.prototype.initArrowEvents = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.prevArrow.on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.nextArrow.on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }

    };

    Slick.prototype.initDotEvents = function () {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li a', _.dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

    };

    Slick.prototype.initializeEvents = function () {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();

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
            _.list.on('touchcancel.slick', {
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
            _.list.on('mouseleave.slick', {
                action: 'cancel',
                kind: 'drag'
            }, _.swipeHandler);
        }

        if (_.options.pauseOnHover === true && _.options.autoplay === true) {
            _.list.on('mouseenter.slick', _.autoPlayClear);
            _.list.on('mouseleave.slick', _.autoPlay);
        }

        _.list.on('keydown.slick', _.keyHandler);

        $(window).on('orientationchange.slick', _.setPosition);

        $(window).on('resize.slick', function () {
            _.checkResponsive();
            _.setPosition();
        });

        $(window).on('load.slick', _.setPosition);

    };

    Slick.prototype.changeSlide = function (event) {

        var _ = this;

        switch (event.data.message) {

        case 'previous':
            _.slideHandler(_.currentSlide - _.options
                .slidesToScroll);
            break;

        case 'next':
            _.slideHandler(_.currentSlide + _.options
                .slidesToScroll);
            break;

        case 'index':
            _.slideHandler($(event.target).parent().index());
            break;

        default:
            return false;
        }

    };

    Slick.prototype.updateDots = function () {

        var _ = this;

        if(_.dots !== null) {

            _.dots.find('li').removeClass('slick-active');
            $(_.dots.find('li').get(_.currentSlide)).addClass(
                'slick-active');

        }

    };

    Slick.prototype.updateArrows = function () {

        var _ = this;

        if (_.options.arrows === true && _.options.infinite !==
            true && _.slideCount > _.options.slidesToShow) {
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

    };

    Slick.prototype.animateSlide = function (targetLeft,
        callback) {

        var animProps = {}, _ = this;

        if (_.options.onBeforeChange !== null) {
            _.options.onBeforeChange.call();
        }

        if (_.transformsEnabled === false) {

            _.slideTrack.animate({
                left: targetLeft
            }, _.options.speed,_.options.easing, callback);

        } else {

            if(_.cssTransitions === false) {

                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
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

            } else {

                _.applyTransition();

                animProps[_.animType] = "translate3d(" + targetLeft + "px, 0px, 0px)";
                _.slideTrack.css(animProps);

                if(callback) {
                    setTimeout(function(){

                    _.disableTransition();

                    callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.setSlideClasses = function (index) {
        var _ = this;
        _.slides.removeClass('slick-active');
        $(_.slides.get(index)).addClass('slick-active');
    };

    Slick.prototype.postSlide = function (index) {

        var _ = this;

        _.animating = false;

        _.currentSlide = index;

        _.setPosition();

        _.swipeLeft = null;

        _.updateDots();

        _.updateArrows();

        if (_.options.autoplay === true) {
            _.autoPlay();
        }

        if (_.options.onAfterChange !== null) {
            _.options.onAfterChange.call();
        }

        _.setSlideClasses(_.currentSlide);

    };

    Slick.prototype.slideHandler = function (index) {

        var targetSlide, slideLeft, targetLeft =
                null,
            _ = this;

        if(_.animating === true) {
            return false;
        }

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

    Slick.prototype.swipeStart = function (event) {

        var _ = this, touches;

        touches = event.originalEvent.touches;

        if ((_.touchObject.fingerCount === 1 || event.data
            .kind === 'drag') &&  _.slideCount > _.options.slidesToShow) {

            if (event.data.kind === 'touch') {
                _.touchObject.startX = _.touchObject.
                    curX =touches[0].pageX;
                _.touchObject.startY = _.touchObject.
                    curY =touches[0].pageY;
            } else {
                _.list.addClass('dragging');
                _.touchObject.startX = _.touchObject.
                    curX = event.clientX;
                _.touchObject.startY = _.touchObject.
                    curY = event.clientY;
            }

        } else {

            _.touchObject = {};

        }

    };

    Slick.prototype.swipeMove = function (event) {

        var _ = this, animProps = {}, curLeft, newLeft = null, touches;

        touches = event.originalEvent.touches;

        curLeft = ((_.currentSlide * _.slideWidth) * -1) +
            _.slideOffset;

        if ((touches && touches.length === 1) || event.
            data.kind ==='drag') {

            if (event.data.kind === 'touch') {
                _.touchObject.curX = touches[0].pageX;
                _.touchObject.curY = touches[0].pageY;
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
                            if(_.cssTransitions === false) {
                                animProps[_.animType] =
                                    "translate(" + newLeft +
                                    "px, 0px)";
                                _.slideTrack.css(animProps);
                                _.swipeLeft = newLeft;
                            } else {
                                animProps[_.animType] =
                                    "translate3d(" + newLeft +
                                    "px, 0px, 0px)";
                                _.slideTrack.css(animProps);
                                _.swipeLeft = newLeft;
                            }
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
                            if(_.cssTransitions === false) {
                                animProps[_.animType] =
                                    "translate(" + newLeft +
                                    "px, 0px)";
                                _.slideTrack.css(animProps);
                                _.swipeLeft = newLeft;
                            } else {
                                animProps[_.animType] =
                                    "translate3d(" + newLeft +
                                    "px, 0px, 0px)";
                                _.slideTrack.css(animProps);
                                _.swipeLeft = newLeft;
                            }
                        }

                    }

                }

            }

        } else {

            _.touchObject = {};

        }

    };

    Slick.prototype.swipeEnd = function (event) {

        var _ = this;

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

    };

    Slick.prototype.swipeCancel = function () {

        var _ = this;

        _.list.removeClass('dragging');

        if (_.touchObject.startX) {
            _.slideHandler(_.currentSlide);
            _.touchObject = {};
        }

    };

    Slick.prototype.keyHandler = function (event) {

        var _ = this;

        if (event.keyCode === 37) {
            _.changeSlide({data: {message: 'previous'}});
        } else if (event.keyCode === 39) {
            _.changeSlide({data: {message: 'next'}});
        }

    };

    Slick.prototype.swipeHandler = function (event) {

        var _ = this;

        if (event.data.kind === 'touch') {
            _.touchObject.fingerCount = event.originalEvent.touches
                .length;
        }

        _.touchObject.minSwipe = _.slideWidth / _.options
            .touchThreshold;

        switch (event.data.action) {

        case 'start':

            _.swipeStart(event);

            break;

        case 'move':

            _.swipeMove(event);

            break;

        case 'end':

            _.swipeEnd(event);

            break;

        case 'cancel':

            _.swipeCancel();

            break;

        }

    };

    Slick.prototype.swipeDirection = function () {

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

    Slick.prototype.refresh = function () {

        var _ = this;

        _.destroy();

        $.extend(_, _.initials);

        _.init();

    };

    Slick.prototype.unload = function () {
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
        _.slides.removeClass(
            'slick-slide slick-active slick-visible').width('');
    };

    Slick.prototype.reinit = function () {

        var _ = this;

        _.slides = $(_.options.slide +
            ':not(.slick-cloned)', _.slideTrack).addClass(
            'slick-slide');

        _.slideCount = _.slides.length;

        if(_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        _.setupPlaceholders();

        _.setupInfinite();

        _.buildArrows();

        _.updateArrows();

        _.initArrowEvents();

        _.buildDots();

        _.updateDots();

        _.initDotEvents();

        _.setSlideClasses(0);

        _.setPosition();

    };

    Slick.prototype.destroy = function () {
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

    $.fn.slick = function (options) {
        var _ = this;
        return _.each(function (index, element) {

            element.slick = new Slick(element, options);

        });
    };

    $.fn.slickAdd = function (slide) {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.addSlide(slide);

        });
    };

    $.fn.slickRemove = function (slide) {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.removeSlide(slide);

        });
    };

    $.fn.slickFilter = function (filter) {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.filterSlides(filter);

        });
    };

    $.fn.slickUnfilter = function () {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.unfilterSlides();

        });
    };

    $.fn.slickGoTo = function (slide) {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.slideHandler(slide);

        });
    };

    $.fn.slickNext = function () {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.changeSlide({data: {message: 'next'}});

        });
    };

    $.fn.slickPrev = function () {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.changeSlide({data: {message: 'previous'}});

        });
    };

    $.fn.slickPause = function () {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.autoPlayClear();

        });
    };

    $.fn.slickPlay = function () {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.autoPlay();

        });
    };

    $.fn.unslick = function () {
        var _ = this;
        return _.each(function (index, element) {

            element.slick.destroy();

        });
    };

}));