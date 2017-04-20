/* @flow */
/*eslint-disable max-statements, complexity */

const $ = window.$ || window.jQuery;

export default {
  cleanUpEvents() {
    if (this.options.dots && this.$dots !== null) {
      $("li", this.$dots).off("click.slick", this.changeSlide);

      if (this.options.pauseOnDotsHover === true && this.options.autoplay === true) {
        $("li", this.$dots)
          .off("mouseenter.slick", $.proxy(this.setPaused, this, true))
          .off("mouseleave.slick", $.proxy(this.setPaused, this, false));
      }
    }

    if (this.options.arrows === true && this.slideCount > this.options.slidesToShow) {
      if (this.$prevArrow) { this.$prevArrow.off("click.slick", this.changeSlide); }
      if (this.$nextArrow) { this.$nextArrow.off("click.slick", this.changeSlide); }
    }

    this.$list.off("touchstart.slick mousedown.slick", this.swipeHandler);
    this.$list.off("touchmove.slick mousemove.slick", this.swipeHandler);
    this.$list.off("touchend.slick mouseup.slick", this.swipeHandler);
    this.$list.off("touchcancel.slick mouseleave.slick", this.swipeHandler);

    this.$list.off("click.slick", this.clickHandler);

    $(document).off(this.visibilityChange, this.visibility);

    this.$list.off("mouseenter.slick", $.proxy(this.setPaused, this, true));
    this.$list.off("mouseleave.slick", $.proxy(this.setPaused, this, false));

    if (this.options.accessibility === true) {
      this.$list.off("keydown.slick", this.keyHandler);
    }

    if (this.options.focusOnSelect === true) {
      $(this.$slideTrack).children().off("click.slick", this.selectHandler);
    }

    $(window).off("orientationchange.slick.slick-" + this.instanceUid, this.orientationChange);

    $(window).off("resize.slick.slick-" + this.instanceUid, this.resize);

    $("[draggable!=true]", this.$slideTrack).off("dragstart", this.preventDefault);

    $(window).off("load.slick.slick-" + this.instanceUid, this.setPosition);
    $(document).off("ready.slick.slick-" + this.instanceUid, this.setPosition);
  },
  focusHandler() {
    this.$slider.on("focus.slick blur.slick", "*", (event) => {
      event.stopImmediatePropagation();
      const sf = $(this);
      setTimeout(() => {
        if (this.isPlay) {
          if (sf.is(":focus")) {
            this.autoPlayClear();
            this.paused = true;
          } else {
            this.paused = false;
            this.autoPlay();
          }
        }
      }, 0);
    });
  },
  initArrowEvents() {
    if (this.options.arrows === true && this.slideCount > this.options.slidesToShow) {
      this.$prevArrow.on("click.slick", {
        message: "previous"
      }, this.changeSlide);
      this.$nextArrow.on("click.slick", {
        message: "next"
      }, this.changeSlide);
    }
  },
  initDotEvents() {
    if (this.options.dots === true && this.slideCount > this.options.slidesToShow) {
      $("li", this.$dots).on("click.slick", {
        message: "index"
      }, this.changeSlide);
    }

    if (this.options.dots === true && this.options.pauseOnDotsHover === true &&
      this.options.autoplay === true) {
      $("li", this.$dots)
        .on("mouseenter.slick", $.proxy(this.setPaused, this, true))
        .on("mouseleave.slick", $.proxy(this.setPaused, this, false));
    }
  },
  initializeEvents() {
    this.initArrowEvents();

    this.initDotEvents();

    this.$list.on("touchstart.slick mousedown.slick", {
      action: "start"
    }, this.swipeHandler);
    this.$list.on("touchmove.slick mousemove.slick", {
      action: "move"
    }, this.swipeHandler);
    this.$list.on("touchend.slick mouseup.slick", {
      action: "end"
    }, this.swipeHandler);
    this.$list.on("touchcancel.slick mouseleave.slick", {
      action: "end"
    }, this.swipeHandler);

    this.$list.on("click.slick", this.clickHandler);

    $(document).on(this.visibilityChange, $.proxy(this.visibility, this));

    this.$list.on("mouseenter.slick", $.proxy(this.setPaused, this, true));
    this.$list.on("mouseleave.slick", $.proxy(this.setPaused, this, false));

    if (this.options.accessibility === true) {
      this.$list.on("keydown.slick", this.keyHandler);
    }

    if (this.options.focusOnSelect === true) {
      $(this.$slideTrack).children().on("click.slick", this.selectHandler);
    }

    $(window).on("orientationchange.slick.slick-" + this.instanceUid,
      $.proxy(this.orientationChange, this));

    $(window).on("resize.slick.slick-" + this.instanceUid, $.proxy(this.resize, this));

    $("[draggable!=true]", this.$slideTrack).on("dragstart", this.preventDefault);

    $(window).on("load.slick.slick-" + this.instanceUid, this.setPosition);
    $(this.setPosition);
  },
  keyHandler(event: Object) {
    //Dont slide if the cursor is inside the form fields and arrow keys are pressed
    if (!event.target.tagName.match("TEXTAREA|INPUT|SELECT")) {
      if (event.keyCode === 37 && this.options.accessibility === true) {
        this.changeSlide({
          data: {
            message: "previous"
          }
        });
      } else if (event.keyCode === 39 && this.options.accessibility === true) {
        this.changeSlide({
          data: {
            message: "next"
          }
        });
      }
    }
  },
  orientationChange() {
    this.checkResponsive();
    this.setPosition();
  },
  preventDefault(event: Object) {
    event.preventDefault();
  },
  resize() {
    if ($(window).width() !== this.windowWidth) {
      clearTimeout(this.windowDelay);
      this.windowDelay = window.setTimeout(() => {
        this.windowWidth = $(window).width();
        this.checkResponsive();
        if (!this.unslicked) {
          this.setPosition();
        }
      }, 50);
    }
  }
};
