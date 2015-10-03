/* @flow */
/*eslint-disable max-statements, complexity */

const $ = window.$ || window.jQuery;

export default {
  asNavFor(index: number) {
    let asNavFor = null;
    if (this.options.asNavFor && this.options.asNavFor !== null) {
      asNavFor = $(this.options.asNavFor).not(this.$slider);
    }

    if (asNavFor !== null && typeof asNavFor === "object") {
      asNavFor.each((i, el) => {
        const target = $(el).slick("getSlick");
        if (!target.unslicked) {
          target.slideHandler(index, true);
        }
      });
    }
  },
  checkNavigable(index: number): number {
    const navigables = this.getNavigableIndexes();
    let prevNavigable = 0;
    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      let n = 0;
      for (n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }
        prevNavigable = navigables[n];
      }
    }

    return index;
  },
  postSlide(index: number) {
    this.$slider.trigger("afterChange", [this, index]);

    this.animating = false;

    this.setPosition();

    this.swipeLeft = null;

    if (this.options.autoplay === true && this.paused === false) {
      this.autoPlay();
    }
    if (this.options.accessibility === true) {
      this.initADA();
    }
  },
  selectHandler(event: Object) {
    const targetElement =
      $(event.target).is(".slick-slide") ?
      $(event.target) :
      $(event.target).parents(".slick-slide");

    let index = parseInt(targetElement.attr("data-slick-index"));

    if (!index) { index = 0; }

    if (this.slideCount <= this.options.slidesToShow) {

      this.setSlideClasses(index);
      this.asNavFor(index);
      return;

    }

    this.slideHandler(index);
  },
  slideHandler(index: number, sync: boolean, dontAnimate: boolean) {
    sync = sync || false;
    dontAnimate = dontAnimate || false;

    if (this.animating === true && this.options.waitForAnimate === true) {
      return;
    }

    if (this.options.fade === true && this.currentSlide === index) {
      return;
    }

    if (this.slideCount <= this.options.slidesToShow) {
      return;
    }

    if (sync === false) {
      this.asNavFor(index);
    }

    let targetSlide = index;
    const targetLeft = this.getLeft(targetSlide);
    const slideLeft = this.getLeft(this.currentSlide);

    this.currentLeft = this.swipeLeft === null ? slideLeft : this.swipeLeft;

    if (this.options.infinite === false && this.options.centerMode === false &&
        (index < 0 || index > this.getDotCount() * this.options.slidesToScroll)) {
      if (this.options.fade === false) {
        targetSlide = this.currentSlide;
        if (dontAnimate === false) {
          this.animateSlide(slideLeft, () => {
            this.postSlide(targetSlide);
          });
        } else {
          this.postSlide(targetSlide);
        }
      }
      return;
    } else if (this.options.infinite === false && this.options.centerMode === true &&
        (index < 0 || index > this.slideCount - this.options.slidesToScroll)) {
      if (this.options.fade === false) {
        targetSlide = this.currentSlide;
        if (dontAnimate === false) {
          this.animateSlide(slideLeft, () => {
            this.postSlide(targetSlide);
          });
        } else {
          this.postSlide(targetSlide);
        }
      }
      return;
    }

    if (this.options.autoplay === true) {
      clearInterval(this.autoPlayTimer);
    }

    let animSlide = targetSlide;

    if (targetSlide < 0) {
      if (this.slideCount % this.options.slidesToScroll !== 0) {
        animSlide = this.slideCount - this.slideCount % this.options.slidesToScroll;
      } else {
        animSlide = this.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.slideCount) {
      if (this.slideCount % this.options.slidesToScroll !== 0) {
        animSlide = 0;
      } else {
        animSlide = targetSlide - this.slideCount;
      }
    }

    this.animating = true;

    this.$slider.trigger("beforeChange", [this, this.currentSlide, animSlide]);

    const oldSlide = this.currentSlide;
    this.currentSlide = animSlide;

    this.setSlideClasses(this.currentSlide);

    this.updateDots();
    this.updateArrows();

    if (this.options.fade === true) {
      if (dontAnimate === false) {

        this.fadeSlideOut(oldSlide);

        this.fadeSlide(animSlide, () => {
          this.postSlide(animSlide);
        });

      } else {
        this.postSlide(animSlide);
      }
      this.animateHeight();
      return;
    }

    if (dontAnimate === false) {
      this.animateSlide(targetLeft, () => {
        this.postSlide(animSlide);
      });
    } else {
      this.postSlide(animSlide);
    }
  },
  visibility() {
    if (document.hidden) {
      this.paused = true;
      this.autoPlayClear();
    } else if (this.options.autoplay === true) {
      this.paused = false;
      this.autoPlay();
    }
  }
};
