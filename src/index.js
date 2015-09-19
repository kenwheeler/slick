/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

import assign from 'object-assign';

import a11y from './a11y';
import actions from './actions';
import animation from './animation';
import arrows from './arrows';
import autoplay from './autoplay';
import build from './build';
import core from './core';
import dots from './dots';
import events from './events';
import fade from './fade';
import filter from './filter';
import getters from './getters';
import lazyload from './lazy-load';
import responsive from './responsive';
import rows from './rows';
import setters from './setters';
import slides from './slides';
import touch from './touch';

export default class Slick {

  constructor(element: any, settings: Object, callback: Function) {
    var _ = this,
      dataSettings;

    let instanceUid = 0;

    _ = assign(_ , {
      defaults: {
        accessibility: true,
        adaptiveHeight: false,
        appendArrows: $(element),
        appendDots: $(element),
        arrows: true,
        asNavFor: null,
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function(slider, i) {
          return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (i + 1) + '</button>';
        },
        dots: false,
        dotsClass: 'slick-dots',
        draggable: true,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: false,
        focusOnSelect: false,
        infinite: true,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: false,
        pauseOnHover: true,
        pauseOnDotsHover: false,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: false,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: true,
        swipeToSlide: false,
        touchMove: true,
        touchThreshold: 5,
        useCSS: true,
        useTransform: false,
        variableWidth: false,
        vertical: false,
        verticalSwiping: false,
        waitForAnimate: true,
        zIndex: 1000
      }
    });

    _ = assign(_, {
      animating: false,
      dragging: false,
      autoPlayTimer: null,
      currentDirection: 0,
      currentLeft: null,
      currentSlide: 0,
      direction: 1,
      $dots: null,
      listWidth: null,
      listHeight: null,
      loadIndex: 0,
      $nextArrow: null,
      $prevArrow: null,
      slideCount: null,
      slideWidth: null,
      $slideTrack: null,
      $slides: null,
      sliding: false,
      slideOffset: 0,
      swipeLeft: null,
      $list: null,
      touchObject: {},
      transformsEnabled: false,
      unslicked: false
    });

    _.__proto__ = assign(
      _.__proto__,
      a11y,
      actions,
      animation,
      arrows,
      autoplay,
      build,
      core,
      dots,
      events,
      fade,
      filter,
      getters,
      lazyload,
      responsive,
      rows,
      setters,
      slides,
      touch
    );

    _.activeBreakpoint = null;
    _.animType = null;
    _.animProp = null;
    _.breakpoints = [];
    _.breakpointSettings = [];
    _.callback = callback || null;
    _.cssTransitions = false;
    _.hidden = 'hidden';
    _.paused = false;
    _.positionProp = null;
    _.respondTo = null;
    _.rowCount = 1;
    _.shouldClick = true;
    _.$slider = $(element);
    _.$slidesCache = null;
    _.transformType = null;
    _.transitionType = null;
    _.visibilityChange = 'visibilitychange';
    _.windowWidth = 0;
    _.windowTimer = null;

    dataSettings = $(element).data('slick') || {};

    _.options = assign({}, _.defaults, dataSettings, settings);

    _.currentSlide = _.options.initialSlide;

    _.originalSettings = _.options;

    if (typeof document.mozHidden !== 'undefined') {
      _.visibilityChange = 'mozvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      _.visibilityChange = 'webkitvisibilitychange';
    }

    _.autoPlay = $.proxy(_.autoPlay, _);
    _.autoPlayClear = $.proxy(_.autoPlayClear, _);
    _.changeSlide = $.proxy(_.changeSlide, _);
    _.clickHandler = $.proxy(_.clickHandler, _);
    _.selectHandler = $.proxy(_.selectHandler, _);
    _.setPosition = $.proxy(_.setPosition, _);
    _.swipeHandler = $.proxy(_.swipeHandler, _);
    _.dragHandler = $.proxy(_.dragHandler, _);
    _.keyHandler = $.proxy(_.keyHandler, _);
    _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);

    _.instanceUid = instanceUid++;

    // A simple way to check for HTML strings
    // Strict HTML recognition (must start with <)
    // Extracted from jQuery v1.11 source
    _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


    _.registerBreakpoints();
    _.init(true);
    _.checkResponsive(true);
  }

}

$.fn.slick = function() {
  var _ = this,
    opt = arguments[0],
    args = Array.prototype.slice.call(arguments, 1),
    l = _.length,
    i,
    ret;
  for (i = 0; i < l; i++) {
    if (typeof opt == 'object' || typeof opt == 'undefined')
      _[i].slick = new Slick(_[i], ...args);
    else
      ret = _[i].slick[opt].apply(_[i].slick, args);
    if (typeof ret != 'undefined') return ret;
  }
  return _;
};