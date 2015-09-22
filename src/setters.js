/* @flow */
/*eslint-disable max-statements, complexity, max-depth */

const $ = window.$ || window.jQuery;

export default {
  setCSS(position: number) {
    let positionProps = {};

    if (this.options.rtl === true) {
      position = -position;
    }
    const x = this.positionProp === "left" ? Math.ceil(position) + "px" : "0px";
    const y = this.positionProp === "top" ? Math.ceil(position) + "px" : "0px";

    positionProps[this.positionProp] = position;

    if (this.transformsEnabled === false) {
      this.$slideTrack.css(positionProps);
    } else {
      positionProps = {};
      if (this.cssTransitions === false) {
        positionProps[this.animType] = "translate(" + x + ", " + y + ")";
        this.$slideTrack.css(positionProps);
      } else {
        positionProps[this.animType] = "translate3d(" + x + ", " + y + ", 0px)";
        this.$slideTrack.css(positionProps);
      }
    }
  },
  setDimensions() {
    if (this.options.vertical === false) {
      if (this.options.centerMode === true) {
        this.$list.css({
          padding: "0px " + this.options.centerPadding
        });
      }
    } else {
      this.$list.height(this.$slides.first().outerHeight(true) * this.options.slidesToShow);
      if (this.options.centerMode === true) {
        this.$list.css({
          padding: this.options.centerPadding + " 0px"
        });
      }
    }

    this.listWidth = this.$list.width();
    this.listHeight = this.$list.height();


    if (this.options.vertical === false && this.options.variableWidth === false) {
      this.slideWidth = Math.ceil(this.listWidth / this.options.slidesToShow);
      this.$slideTrack.width(Math.ceil(this.slideWidth *
          this.$slideTrack.children(".slick-slide").length));

    } else if (this.options.variableWidth === true) {
      this.$slideTrack.width(5000 * this.slideCount);
    } else {
      this.slideWidth = Math.ceil(this.listWidth);
      this.$slideTrack.height(Math.ceil(
        this.$slides.first().outerHeight(true) *
        this.$slideTrack.children(".slick-slide").length));
    }

    const offset = this.$slides.first().outerWidth(true) - this.$slides.first().width();
    if (this.options.variableWidth === false) {
      this.$slideTrack.children(".slick-slide").width(this.slideWidth - offset);
    }
  },
  setFade() {
    this.$slides.each((index, element) => {
      const targetLeft = this.slideWidth * index * -1;
      if (this.options.rtl === true) {
        $(element).css({
          position: "relative",
          right: targetLeft,
          top: 0,
          zIndex: this.options.zIndex - 2,
          opacity: 0
        });
      } else {
        $(element).css({
          position: "relative",
          left: targetLeft,
          top: 0,
          zIndex: this.options.zIndex - 2,
          opacity: 0
        });
      }
    });

    this.$slides.eq(this.currentSlide).css({
      zIndex: this.options.zIndex - 1,
      opacity: 1
    });
  },
  setHeight() {
    if (this.options.slidesToShow === 1 &&
      this.options.adaptiveHeight === true && this.options.vertical === false) {
      const targetHeight = this.$slides.eq(this.currentSlide).outerHeight(true);
      this.$list.css("height", targetHeight);
    }
  },
  setOption(option: string, value: any, refresh: boolean) {
    if (option === "responsive" && $.type(value) === "array") {
      let item = null;
      for (item in value) {
        if ($.type(this.options.responsive) !== "array") {
          this.options.responsive = [value[item]];
        } else {
          let l = this.options.responsive.length - 1;
          // loop through the responsive object and splice out duplicates.
          while (l >= 0) {
            if (this.options.responsive[l].breakpoint === value[item].breakpoint) {
              this.options.responsive.splice(l, 1);
            }
            l--;
          }
          this.options.responsive.push(value[item]);
        }
      }
    } else {
      this.options[option] = value;
    }

    if (refresh === true) {
      this.unload();
      this.reinit();
    }
  },
  setPosition() {
    this.setDimensions();

    this.setHeight();

    if (this.options.fade === false) {
      this.setCSS(this.getLeft(this.currentSlide));
    } else {
      this.setFade();
    }

    this.$slider.trigger("setPosition", [this]);
  },
  setProps() {
    const bodyStyle = document.body.style;

    this.positionProp = this.options.vertical === true ? "top" : "left";

    if (this.positionProp === "top") {
      this.$slider.addClass("slick-vertical");
    } else {
      this.$slider.removeClass("slick-vertical");
    }

    if (bodyStyle.WebkitTransition !== undefined ||
      bodyStyle.MozTransition !== undefined ||
      bodyStyle.msTransition !== undefined) {
      if (this.options.useCSS === true) {
        this.cssTransitions = true;
      }
    }

    if (this.options.fade) {
      if (typeof this.options.zIndex === "number") {
        if (this.options.zIndex < 3) {
          this.options.zIndex = 3;
        }
      } else {
        this.options.zIndex = this.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      this.animType = "OTransform";
      this.transformType = "-o-transform";
      this.transitionType = "OTransition";
      if (bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.webkitPerspective === undefined) { this.animType = false; }
    }
    if (bodyStyle.MozTransform !== undefined) {
      this.animType = "MozTransform";
      this.transformType = "-moz-transform";
      this.transitionType = "MozTransition";
      if (bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.MozPerspective === undefined) { this.animType = false; }
    }
    if (bodyStyle.webkitTransform !== undefined) {
      this.animType = "webkitTransform";
      this.transformType = "-webkit-transform";
      this.transitionType = "webkitTransition";
      if (bodyStyle.perspectiveProperty === undefined &&
        bodyStyle.webkitPerspective === undefined) { this.animType = false; }
    }
    if (bodyStyle.msTransform !== undefined) {
      this.animType = "msTransform";
      this.transformType = "-ms-transform";
      this.transitionType = "msTransition";
      if (bodyStyle.msTransform === undefined) { this.animType = false; }
    }
    if (bodyStyle.transform !== undefined && this.animType !== false) {
      this.animType = "transform";
      this.transformType = "transform";
      this.transitionType = "transition";
    }
    this.transformsEnabled = this.options.useTransform &&
      (this.animType !== null && this.animType !== false);
  },
  setSlideClasses(index: number) {
    const allSlides = this.$slider
      .find(".slick-slide")
      .removeClass("slick-active slick-center slick-current")
      .attr("aria-hidden", "true");

    this.$slides
      .eq(index)
      .addClass("slick-current");

    if (this.options.centerMode === true) {

      const centerOffset = Math.floor(this.options.slidesToShow / 2);

      if (this.options.infinite === true) {

        if (index >= centerOffset && index <= this.slideCount - 1 - centerOffset) {

          this.$slides
            .slice(index - centerOffset, index + centerOffset + 1)
            .addClass("slick-active")
            .attr("aria-hidden", "false");

        } else {

          const indexOffset = this.options.slidesToShow + index;
          allSlides
            .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
            .addClass("slick-active")
            .attr("aria-hidden", "false");

        }

        if (index === 0) {

          allSlides
            .eq(allSlides.length - 1 - this.options.slidesToShow)
            .addClass("slick-center");

        } else if (index === this.slideCount - 1) {

          allSlides
            .eq(this.options.slidesToShow)
            .addClass("slick-center");

        }

      }

      this.$slides
        .eq(index)
        .addClass("slick-center");

      return;

    }

    if (index >= 0 && index <= this.slideCount - this.options.slidesToShow) {

      this.$slides
        .slice(index, index + this.options.slidesToShow)
        .addClass("slick-active")
        .attr("aria-hidden", "false");

    } else if (allSlides.length <= this.options.slidesToShow) {

      allSlides
        .addClass("slick-active")
        .attr("aria-hidden", "false");

    } else {

      const remainder = this.slideCount % this.options.slidesToShow;
      const indexOffset = this.options.infinite === true ?
        this.options.slidesToShow + index : index;

      if (this.options.slidesToShow === this.options.slidesToScroll &&
        this.slideCount - index < this.options.slidesToShow) {

        allSlides
          .slice(indexOffset - (this.options.slidesToShow - remainder), indexOffset + remainder)
          .addClass("slick-active")
          .attr("aria-hidden", "false");

      } else {

        allSlides
          .slice(indexOffset, indexOffset + this.options.slidesToShow)
          .addClass("slick-active")
          .attr("aria-hidden", "false");

      }

    }

    if (this.options.lazyLoad === "ondemand") {
      this.lazyLoad();
    }
  },
  setPaused(paused: boolean) {
    if (this.options.autoplay === true && this.options.pauseOnHover === true) {
      this.paused = paused;
      if (!paused) {
        this.autoPlay();
      } else {
        this.autoPlayClear();
      }
    }
  }
};
