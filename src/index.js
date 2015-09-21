/* @flow */
/*eslint-disable max-statements, complexity, max-len, prefer-spread, no-proto */

const $ = window.$ || window.jQuery;

import assign from "object-assign";

import a11y from "./a11y";
import actions from "./actions";
import animation from "./animation";
import arrows from "./arrows";
import autoplay from "./autoplay";
import build from "./build";
import core from "./core";
import dots from "./dots";
import events from "./events";
import fade from "./fade";
import filter from "./filter";
import getters from "./getters";
import lazyload from "./lazy-load";
import responsive from "./responsive";
import rows from "./rows";
import setters from "./setters";
import slides from "./slides";
import touch from "./touch";

let instanceUid = 0;

const Slick = function Slick(element: any, settings: Object, callback: Function) {

  assign(this, {
    defaults: {
      accessibility: true,
      adaptiveHeight: false,
      appendArrows: $(element),
      appendDots: $(element),
      arrows: true,
      asNavFor: null,
      prevArrow: "<button type=\"button\" data-role=\"none\" class=\"slick-prev\" aria-label=\"Previous\" tabindex=\"0\" role=\"button\">Previous</button>",
      nextArrow: "<button type=\"button\" data-role=\"none\" class=\"slick-next\" aria-label=\"Next\" tabindex=\"0\" role=\"button\">Next</button>",
      autoplay: false,
      autoplaySpeed: 3000,
      centerMode: false,
      centerPadding: "50px",
      cssEase: "ease",
      customPaging: (slider, i) => {
        return "<button type=\"button\" data-role=\"none\" role=\"button\" aria-required=\"false\" tabindex=\"0\">" + (i + 1) + "</button>";
      },
      dots: false,
      dotsClass: "slick-dots",
      draggable: true,
      easing: "linear",
      edgeFriction: 0.35,
      fade: false,
      focusOnSelect: false,
      infinite: true,
      initialSlide: 0,
      lazyLoad: "ondemand",
      mobileFirst: false,
      pauseOnHover: true,
      pauseOnDotsHover: false,
      respondTo: "window",
      responsive: null,
      rows: 1,
      rtl: false,
      slide: "",
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

  this.initials = assign(this, {
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

  assign(
    this.__proto__,
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

  this.activeBreakpoint = null;
  this.animType = null;
  this.animProp = null;
  this.breakpoints = [];
  this.breakpointSettings = [];
  this.callback = callback || null;
  this.cssTransitions = false;
  this.hidden = "hidden";
  this.paused = false;
  this.positionProp = null;
  this.respondTo = null;
  this.rowCount = 1;
  this.shouldClick = true;
  this.$slider = $(element);
  this.$slidesCache = null;
  this.transformType = null;
  this.transitionType = null;
  this.visibilityChange = "visibilitychange";
  this.windowWidth = 0;
  this.windowTimer = null;

  const dataSettings = $(element).data("slick") || {};

  this.options = assign({}, this.defaults, dataSettings, settings);

  this.currentSlide = this.options.initialSlide;

  this.originalSettings = this.options;

  if (typeof document.mozHidden !== "undefined") {
    this.visibilityChange = "mozvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    this.visibilityChange = "webkitvisibilitychange";
  }

  this.autoPlay = $.proxy(this.autoPlay, this);
  this.autoPlayClear = $.proxy(this.autoPlayClear, this);
  this.changeSlide = $.proxy(this.changeSlide, this);
  this.clickHandler = $.proxy(this.clickHandler, this);
  this.selectHandler = $.proxy(this.selectHandler, this);
  this.setPosition = $.proxy(this.setPosition, this);
  this.swipeHandler = $.proxy(this.swipeHandler, this);
  this.dragHandler = $.proxy(this.dragHandler, this);
  this.keyHandler = $.proxy(this.keyHandler, this);
  this.autoPlayIterator = $.proxy(this.autoPlayIterator, this);

  this.instanceUid = instanceUid++;

  // A simple way to check for HTML strings
  // Strict HTML recognition (must start with <)
  // Extracted from jQuery v1.11 source
  this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


  this.registerBreakpoints();
  this.init(true);
  this.checkResponsive(true);
};

$.fn.slick = function () {
  const opt = arguments[0];
  const args = Array.prototype.slice.call(arguments, 1);
  const l = this.length;
  let i = 0;
  let ret = null;
  for (i = 0; i < l; i++) {
    if (typeof opt === "object" || typeof opt === "undefined") {
      this[i].slick = new Slick(this[i], ...arguments);
    } else {
      ret = this[i].slick[opt].apply(this[i].slick, args);
      if (typeof ret !== "undefined") { return ret; }
    }
  }
  return this;
};

export default Slick;

