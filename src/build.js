/* @flow */
/*eslint-disable max-statements, complexity */

const $ = window.$ || window.jQuery;

import assign from "object-assign";

export default {
  buildOut() {
    this.$slides =
      this.$slider
      .children(this.options.slide + ":not(.slick-cloned)")
      .addClass("slick-slide");

    this.slideCount = this.$slides.length;

    this.$slides.each(function (index, element) {
      $(element)
        .attr("data-slick-index", index)
        .data("originalStyling", $(element).attr("style") || "");
    });

    this.$slidesCache = this.$slides;

    this.$slider.addClass("slick-slider");

    this.$slideTrack = this.slideCount === 0 ?
      $("<div class=\"slick-track\"/>").appendTo(this.$slider) :
      this.$slides.wrapAll("<div class=\"slick-track\"/>").parent();

    this.$list = this.$slideTrack.wrap(
      "<div aria-live=\"polite\" class=\"slick-list\"/>").parent();
    this.$slideTrack.css("opacity", 0);

    if (this.options.centerMode === true || this.options.swipeToSlide === true) {
      this.options.slidesToScroll = 1;
    }

    $("img[data-lazy]", this.$slider).not("[src]").addClass("slick-loading");

    this.setupInfinite();

    this.buildArrows();

    this.buildDots();

    this.updateDots();


    this.setSlideClasses(typeof this.currentSlide === "number" ? this.currentSlide : 0);

    if (this.options.draggable === true) {
      this.$list.addClass("draggable");
    }
  },
  destroy(refresh: boolean) {
    this.autoPlayClear();

    this.touchObject = {};

    this.cleanUpEvents();

    $(".slick-cloned", this.$slider).detach();

    if (this.$dots) {
      this.$dots.remove();
    }


    if (this.$prevArrow && this.$prevArrow.length) {

      this.$prevArrow
        .removeClass("slick-disabled slick-arrow slick-hidden")
        .removeAttr("aria-hidden aria-disabled tabindex")
        .css("display", "");

      if (this.htmlExpr.test(this.options.prevArrow)) {
        this.$prevArrow.remove();
      }
    }

    if (this.$nextArrow && this.$nextArrow.length) {

      this.$nextArrow
        .removeClass("slick-disabled slick-arrow slick-hidden")
        .removeAttr("aria-hidden aria-disabled tabindex")
        .css("display", "");

      if (this.htmlExpr.test(this.options.nextArrow)) {
        this.$nextArrow.remove();
      }

    }


    if (this.$slides) {

      this.$slides
        .removeClass("slick-slide slick-active slick-center slick-visible slick-current")
        .removeAttr("aria-hidden")
        .removeAttr("data-slick-index")
        .each((i, slide) => {
          $(slide).attr("style", $(slide).data("originalStyling"));
        });

      this.$slideTrack.children(this.options.slide).detach();

      this.$slideTrack.detach();

      this.$list.detach();

      this.$slider.append(this.$slides);
    }

    this.cleanUpRows();

    this.$slider.removeClass("slick-slider");
    this.$slider.removeClass("slick-initialized");

    this.unslicked = true;

    if (!refresh) {
      this.$slider.trigger("destroy", [this]);
    }
  },
  init(creation: boolean) {
    if (!$(this.$slider).hasClass("slick-initialized")) {

      $(this.$slider).addClass("slick-initialized");

      this.buildRows();
      this.buildOut();
      this.setProps();
      this.startLoad();
      this.loadSlider();
      this.initializeEvents();
      this.updateArrows();
      this.updateDots();
      if (this.callback) { this.callback(); }

    }

    if (creation) {
      this.$slider.trigger("init", [this]);
    }

    if (this.options.accessibility === true) {
      this.initADA();
    }
  },
  initUI() {
    if (this.options.arrows === true && this.slideCount > this.options.slidesToShow) {
      this.$prevArrow.show();
      this.$nextArrow.show();
    }

    if (this.options.dots === true && this.slideCount > this.options.slidesToShow) {
      this.$dots.show();
    }

    if (this.options.autoplay === true) {
      this.autoPlay();
    }
  },
  loadSlider() {
    this.setPosition();

    this.$slideTrack.css({
      opacity: 1
    });

    this.$slider.removeClass("slick-loading");

    this.initUI();

    if (this.options.lazyLoad === "progressive") {
      this.progressiveLazyLoad();
    }
  },
  refresh(initializing: boolean) {
    const firstVisible = this.slideCount - this.options.slidesToShow;

    // check that the new breakpoint can actually accept the
    // "current slide" as the current slide, otherwise we need
    // to set it to the closest possible value.
    if (!this.options.infinite) {
      if (this.slideCount <= this.options.slidesToShow) {
        this.currentSlide = 0;
      } else if (this.currentSlide > firstVisible) {
        this.currentSlide = firstVisible;
      }
    }

    this.destroy(true);

    assign(this, this.initials, {
      currentSlide: this.currentSlide
    });

    this.init();

    if (!initializing) {

      this.changeSlide({
        data: {
          message: "index",
          index: this.currentSlide
        }
      }, false);

    }
  },
  reinit() {
    this.$slides =
      this.$slideTrack
      .children(this.options.slide)
      .addClass("slick-slide");

    this.slideCount = this.$slides.length;

    if (this.currentSlide >= this.slideCount && this.currentSlide !== 0) {
      this.currentSlide = this.currentSlide - this.options.slidesToScroll;
    }

    if (this.slideCount <= this.options.slidesToShow) {
      this.currentSlide = 0;
    }

    this.registerBreakpoints();

    this.setProps();
    this.setupInfinite();
    this.buildArrows();
    this.updateArrows();
    this.initArrowEvents();
    this.buildDots();
    this.updateDots();
    this.initDotEvents();

    this.checkResponsive(false, true);

    if (this.options.focusOnSelect === true) {
      $(this.$slideTrack).children().on("click.slick", this.selectHandler);
    }

    this.setSlideClasses(0);

    this.setPosition();

    this.$slider.trigger("reInit", [this]);

    if (this.options.autoplay === true) {
      this.focusHandler();
    }
  },
  setupInfinite() {
    if (this.options.fade === true) {
      this.options.centerMode = false;
    }

    if (this.options.infinite === true && this.options.fade === false) {

      let slideIndex = null;
      let infiniteCount = null;

      if (this.slideCount > this.options.slidesToShow) {

        if (this.options.centerMode === true) {
          infiniteCount = this.options.slidesToShow + 1;
        } else {
          infiniteCount = this.options.slidesToShow;
        }

        let i = this.slideCount;

        for (i; i > this.slideCount -
            infiniteCount; i -= 1) {
          slideIndex = i - 1;
          $(this.$slides[slideIndex]).clone(true).attr("id", "")
            .attr("data-slick-index", slideIndex - this.slideCount)
            .prependTo(this.$slideTrack).addClass("slick-cloned");
        }
        for (i = 0; i < infiniteCount; i += 1) {
          slideIndex = i;
          $(this.$slides[slideIndex]).clone(true).attr("id", "")
            .attr("data-slick-index", slideIndex + this.slideCount)
            .appendTo(this.$slideTrack).addClass("slick-cloned");
        }
        this.$slideTrack.find(".slick-cloned").find("[id]").attr("id", "");

      }

    }
  },
  startLoad() {
    if (this.options.arrows === true && this.slideCount > this.options.slidesToShow) {
      this.$prevArrow.hide();
      this.$nextArrow.hide();
    }

    if (this.options.dots === true && this.slideCount > this.options.slidesToShow) {
      this.$dots.hide();
    }

    this.$slider.addClass("slick-loading");
  },
  unload() {
    $(".slick-cloned", this.$slider).remove();

    if (this.$dots) {
      this.$dots.remove();
    }

    if (this.$prevArrow && this.htmlExpr.test(this.options.prevArrow)) {
      this.$prevArrow.remove();
    }

    if (this.$nextArrow && this.htmlExpr.test(this.options.nextArrow)) {
      this.$nextArrow.remove();
    }

    this.$slides
      .removeClass("slick-slide slick-active slick-visible slick-current")
      .attr("aria-hidden", "true")
      .css("width", "");
  },
  unslick(fromBreakpoint: string) {
    this.$slider.trigger("unslick", [this, fromBreakpoint]);
    this.destroy();
  }
};
