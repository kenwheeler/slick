/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Date: 04/02/14
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

/* global window, document, define, jQuery, setInterval, clearInterval */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }

}(function ($) {
    'use strict';
    var Slick = window.Slick || {};

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
                fade: false,
                easing: 'linear',
                arrows: true,
                infinite: true,
                onBeforeChange: null,
                onAfterChange: null,
                pauseOnHover: true,
                placeholders: true,
                responsive: null,
                slide: 'div',
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 300,
                swipe: true,
                touchMove: true,
                touchThreshold: 5,
                vertical: false
            };

            _.initials = {
                animating : false,
                autoPlayTimer : null,
                currentSlide : 0,
                currentLeft : null,
                direction : 1,
                dots : null,
                listWidth : null,
                listHeight : null,
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
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.paused = false;
            _.positionProp = null;
            _.slider = $(element);
            _.slidesCache = null;
            _.cssTransitions = false;
            _.windowWidth = 0;
            _.windowTimer = null;

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

            _.autoPlay = $.proxy(_.autoPlay,
                _);
            _.autoPlayClear = $.proxy(_.autoPlayClear,
                _);
            _.changeSlide = $.proxy(_.changeSlide,
                _);
            _.setPosition = $.proxy(_.setPosition,
                _);
            _.swipeHandler = $.proxy(_.swipeHandler,
                _);
            _.dragHandler = $.proxy(_.dragHandler,
                _);
            _.keyHandler = $.proxy(_.keyHandler,
                _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator,
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
            _.setProps();
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

        _.slides = _.slideTrack.children(this.options.slide);

        _.slideTrack.children(this.options.slide).remove();

        _.slideTrack.append(_.slides);

        _.reinit();

    };

    Slick.prototype.removeSlide = function (index) {

        var _ = this;

        _.unload();

        if(_.slideCount < 1) {
            return false;
        }

        $(_.slideTrack.children(this.options.slide).get(index)).remove();

        _.slides = _.slideTrack.children(this.options.slide);

        _.slideTrack.children(this.options.slide).remove();

        _.slideTrack.append(_.slides);

        _.reinit();

    };

    Slick.prototype.filterSlides = function (filter) {

        var _ = this;

        if(filter !== null) {

            _.unload();

            _.slideTrack.children(this.options.slide).remove();

            _.slidesCache.filter(filter).appendTo(_.slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unfilterSlides = function () {

        var _ = this;

        if(_.slidesCache !== null) {

            _.unload();

            _.slideTrack.children(this.options.slide).remove();

            _.slidesCache.appendTo(_.slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.applyTransition = function (slide) {

        var _ = this, transition,origin;

        transition = 'all ' + _.options.speed + 'ms ' + _.options.cssEase;
        if (_.options.vertical === false) {
            origin = (_.listWidth / 2) + ' 50%';
        } else {
            origin = '';
        }

        if (_.options.fade === false) {
            _.slideTrack.css({
                transition: transition,
                transformOrigin: origin
            });
        } else {
            $(_.slides.get(slide)).css({
                transition: transition
            });
        }

    };

    Slick.prototype.disableTransition = function (slide) {

        var _ = this;

        if (_.options.fade === false) {
            _.slideTrack.css({
                transition: '',
                transformOrigin: ''
            });
        } else {
            $(_.slides.get(slide)).css({
                transition: ''
            });
        }

    };

    Slick.prototype.autoPlay = function () {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

        if(_.slideCount > _.options.slidesToShow && _.paused !== true) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator,
                _.options.autoplaySpeed);
        }

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
            .responsive.length > -1 && _.originalSettings.responsive !== null) {

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
        _.listHeight = _.list.height();
        _.slideWidth = Math.ceil(_.listWidth / _.options
            .slidesToShow);

    };

    Slick.prototype.buildArrows = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.prevArrow = $(
                '<button type="button" tabIndex="-1">Previous</button>').appendTo(
                _.slider).addClass('slick-prev');
            _.nextArrow = $(
                '<button type="button" tabIndex="-1">Next</button>').appendTo(
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
                if (_.options.placeholders === false && i +
                _.options.slidesToShow - (_.options.slidesToScroll - 1) > _.slideCount) {
                    break;
                }
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

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

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

        }

    };

    Slick.prototype.setupPlaceholders = function () {

        var _ = this, i, placeholders;

        if(_.options.fade === true || _.options.vertical === true) {
            _.options.slidesToShow = 1;
            _.options.slidesToScroll = 1;
        }

        if(_.options.placeholders === false) {
            _.options.infinite === false;
            return false;
        }

        if ((_.slideCount % _.options.slidesToScroll) !==
            0 && _.slideCount > _.options.slidesToShow) {

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

        _.slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.slider) :
            _.slides.wrapAll('<div class="slick-track"/>').parent();

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

        _.list.find('.slick-slide').width(_.slideWidth);
        if (_.options.vertical === false) {
            _.slideTrack.width(Math.ceil((_.slideWidth * _
                .slider.find('.slick-slide').length)));
        } else {
            _.list.height(_.slides.first().outerHeight());
            _.slideTrack.height(Math.ceil((_.listHeight * _
                .slider.find('.slick-slide').length)));
        }

    };

    Slick.prototype.setPosition = function () {

        var _ = this, targetPosition, targetSlide;

        targetSlide = _.currentSlide;

        _.setValues();
        _.setDimensions();

        _.slideOffset = 0;

        if (_.options.infinite === true) {
            if(_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
            }
        }

        if (_.options.placeholders === false && _.currentSlide +
            _.options.slidesToScroll >= _.slideCount) {
            targetSlide = _.slideCount - _.options.slidesToShow;
        }

        if (_.options.fade === false) {
            if (_.options.vertical === false) {
                targetPosition = ((targetSlide *
                        _.slideWidth) * -1) + _.slideOffset;
            } else {
                targetPosition = ((targetSlide *
                        _.listHeight) * -1) - _.listHeight;
            }
            _.setCSS(targetPosition);
        } else {
            _.setFade();
        }
    };

    Slick.prototype.setProps = function () {

        var _ = this;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.slider.addClass('slick-vertical');
        } else {
            _.slider.removeClass('slick-vertical');
        }

        if ( document.body.style.WebkitTransition !== undefined ||
             document.body.style.MozTransition !== undefined ||
             document.body.style.msTransition !== undefined ) {
                _.cssTransitions = true;
        }

        if (document.body.style.MozTransform !== undefined) _.animType = 'MozTransform';
        if (document.body.style.webkitTransform !== undefined) _.animType = 'webkitTransform';
        if (document.body.style.msTransform !== undefined) _.animType = 'msTransform';

        _.transformsEnabled = (_.animType !== null);

    };

    Slick.prototype.setFade = function () {

        var _ = this, targetLeft;

        _.slides.each(function (index,element) {
            targetLeft = (_.slideWidth * index) * -1;
            $(element).css({
                position: 'relative',
                left: targetLeft,
                top: 0,
                zIndex: 800,
                opacity: 0
            });
        });

        $(_.slides.get(_.currentSlide)).css({
            zIndex: 900,
            opacity: 1
        });

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
                action: 'end',
                kind: 'drag'
            }, _.swipeHandler);
        }

        if (_.options.pauseOnHover === true && _.options.autoplay === true) {
            _.list.on('mouseenter.slick', _.autoPlayClear);
            _.list.on('mouseleave.slick', _.autoPlay);
        }

        _.list.on('keydown.slick', _.keyHandler);

        $(window).on('orientationchange.slick', function(){
            _.checkResponsive();
            _.setPosition();
        });

        $(window).resize(function () {
                if ($(window).width !== _.windowWidth) {
                    clearTimeout(_.windowDelay);
                    _.windowDelay = window.setTimeout(function () {
                        _.windowWidth = $(window).width();
                        _.checkResponsive();
                        _.setPosition();
                    }, 50);
                }
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
            if ((_.options.placeholders === false && _.currentSlide +
                _.options.slidesToShow >= _.slideCount)) {
                return false;
            }
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
            } else if (_.options.placeholders === false && _.currentSlide +
                _.options.slidesToShow >= _.slideCount) {
                _.nextArrow.addClass('slick-disabled');
                _.prevArrow.removeClass('slick-disabled');
            } else {
                _.prevArrow.removeClass('slick-disabled');
                _.nextArrow.removeClass('slick-disabled');
            }
        }

    };

    Slick.prototype.fadeSlide = function (slideIndex, callback) {

        var _ = this;

        if(_.cssTransitions === false) {

            $(_.slides.get(slideIndex)).css({zIndex: 1000});

            $(_.slides.get(slideIndex)).animate({
                opacity: 1
            }, _.options.speed,_.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            $(_.slides.get(slideIndex)).css({
                opacity: 1,
                zIndex: 1000
            });

            if(callback) {
                setTimeout(function(){

                _.disableTransition(slideIndex);

                callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.animateSlide = function (targetLeft,
        callback) {

        var animProps = {}, _ = this;

        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.slideTrack.animate({
                    left: targetLeft
                }, _.options.speed,_.options.easing, callback);
            } else {
                _.slideTrack.animate({
                    top: targetLeft
                }, _.options.speed,_.options.easing, callback);
            }

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
                        if (_.options.vertical === false) {
                            animProps[_.animType] = "translate(" +
                                now + "px, 0px)";
                            _.slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = "translate(0px," +
                                now + "px,0px)";
                            _.slideTrack.css(animProps);
                        }
                    },
                    complete: function () {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();

                if (_.options.vertical === false) {
                    animProps[_.animType] = "translate3d(" + targetLeft + "px, 0px, 0px)";
                } else {
                    animProps[_.animType] = "translate3d(0px," + targetLeft + "px, 0px)";
                }
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

        if (_.options.onAfterChange !== null && index !== _.currentSlide) {
            _.options.onAfterChange.call(_, index);
        }

        _.animating = false;

        _.currentSlide = index;

        _.setPosition();

        _.swipeLeft = null;

        _.updateDots();

        _.updateArrows();

        if (_.options.autoplay === true && _.paused === false) {
            _.autoPlay();
        }

        _.setSlideClasses(_.currentSlide);

    };

    Slick.prototype.slideHandler = function (index) {

        var targetSlide, animSlide, slideLeft, targetLeft = null, _ = this;

        if(_.animating === true) {
            return false;
        }

        targetSlide = index;

        if(_.options.vertical === false) {
            targetLeft = ((targetSlide * _.slideWidth) * -1) + _.slideOffset;
            slideLeft = ((_.currentSlide * _.slideWidth) * -1) + _.slideOffset;
            if (_.options.placeholders === false && targetSlide +
            _.options.slidesToShow >= _.slideCount) {
            targetLeft = (((_.slideCount - _.options.slidesToShow) * _.slideWidth) * -1) + _.slideOffset;
            }
        } else {
            targetLeft = ((targetSlide * _.listHeight) * -1) - _.listHeight;
            slideLeft = ((_.currentSlide * _.listHeight) * -1) - _.listHeight;
            if (_.options.placeholders === false && targetSlide +
            _.options.slidesToShow >= _.slideCount) {
            targetLeft = (((_.slideCount - _.options.slidesToShow) * _.listHeight) * -1) - _.listHeight;
            }
        }

        if (_.options.infinite === false && (index < 0 || index > (_.slideCount -1))) {
            targetSlide = _.currentSlide;
            _.animateSlide(slideLeft, function () {
                _.postSlide(targetSlide);
            });
            return false;
        }

        if (_.options.autoplay === true) {
            clearInterval(_.autoPlayTimer);
        }

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (targetSlide < 0) {
            animSlide = _.slideCount - _.options.slidesToScroll;
        } else if (targetSlide > (_.slideCount - 1)) {
            animSlide = 0;
        } else if (_.options.placeholders === false && targetSlide +
            _.options.slidesToShow >= _.slideCount) {
            animSlide = _.slideCount - _.options.slidesToShow;
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        if (_.options.onBeforeChange !== null && index !== _.currentSlide) {
            _.options.onBeforeChange.call(_, animSlide);
        }

        if (_.options.fade === true) {
            _.fadeSlide(animSlide, function(){
                _.postSlide(animSlide);
            });
            return false;
        }
        _.animateSlide(targetLeft, function () {
            _.postSlide(animSlide);
        });

    };

    Slick.prototype.setCSS = function (position) {

        var _ = this, positionProps = {}, x, y;

        x = _.positionProp == 'left' ? position + 'px' : '0px';
        y = _.positionProp == 'top' ? position + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if(_.cssTransitions === false) {
                positionProps[_.animType] = "translate(" + x + ", " + y + ")";
                _.slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = "translate3d(" + x + ", " + y + ", 0px)";
                _.slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.swipeStart = function (event) {

        var _ = this, touches;


        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if(event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.list.addClass('dragging');

    };

    Slick.prototype.swipeMove = function (event) {

        var _ = this, curLeft, swipeDirection, positionOffset, touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        curLeft = _.options.vertical === false ? ((_.currentSlide * _.slideWidth) * -1) +
                _.slideOffset : ((_.currentSlide * _.listHeight) * -1) -
                _.listHeight;

        if (_.options.placeholders === false && _.currentSlide +
            _.options.slidesToShow >= _.slideCount) {
            curLeft = (((_.slideCount - _.options.slidesToShow) * _.slideWidth) * -1) + _.slideOffset;
        }

        if((!_.list.hasClass('dragging') && event.data.kind === 'drag') ||
            touches && touches.length !== 1){
            return false;
        }

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return false;
        }

        if(event.originalEvent !== undefined) {
            event.preventDefault();
        }

        positionOffset = _.touchObject.curX > _.touchObject.startX ? 1 : -1;

        if(_.options.vertical === false) {
            _.swipeLeft = curLeft + _.touchObject.swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (_.touchObject
                    .swipeLength * (_.listHeight / _.listWidth)) * positionOffset;
        }

        if(_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeEnd = function (event) {

        var _ = this;

        _.list.removeClass('dragging');

        if ((_.touchObject.fingerCount !== 0) && event.data.kind !== 'drag') {
            _.touchObject = {};
            return false;
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            switch (_.swipeDirection()) {
                case 'left':
                    _.slideHandler(_.currentSlide + _.options.slidesToScroll);
                    _.touchObject = {};
                break;

                case 'right':
                    _.slideHandler(_.currentSlide - _.options.slidesToScroll);
                    _.touchObject = {};
                break;
            }

        } else {
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

        if(event.originalEvent !== undefined) {
            _.touchObject.fingerCount = event.originalEvent.touches !== undefined ?
                event.originalEvent.touches.length : 1;
        }

        _.touchObject.minSwipe = _.listWidth / _.options
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

        return 'vertical';

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
            'slick-slide slick-active slick-visible').removeAttr('style');
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

        _.setProps();

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

        _.autoPlayClear();

        _.touchObject = {};

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
            'slick-slide slick-active slick-visible').removeAttr('style');
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
           element.slick.paused = true;

        });
    };

    $.fn.slickPlay = function () {
        var _ = this;
        return _.each(function (index, element) {

           element.slick.paused = false;
           element.slick.autoPlay();

        });
    };

    $.fn.slickSetOption = function (option, value, refresh) {
        var _ = this;
        return _.each(function (index, element) {

        element.slick.options[option] = value;

        if(refresh === true) {
            element.slick.unload();
            element.slick.reinit();
        }

        });
    };

    $.fn.unslick = function () {
        var _ = this;
        return _.each(function (index, element) {

            element.slick.destroy();

        });
    };

}));