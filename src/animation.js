/* @flow */
/*eslint-disable max-statements, complexity */

const $ = window.$ || window.jQuery;

export default {
  animateHeight() {
    if (this.options.slidesToShow === 1 &&
        this.options.adaptiveHeight === true &&
        this.options.vertical === false) {
      const targetHeight = this.$slides.eq(this.currentSlide).outerHeight(true);
      this.$list.animate({
        height: targetHeight
      }, this.options.speed);
    }
  },
  animateSlide(targetLeft: number, callback: Function) {
    const animProps = {};

    this.animateHeight();

    if (this.options.rtl === true && this.options.vertical === false) {
      targetLeft = -targetLeft;
    }
    if (this.transformsEnabled === false) {
      if (this.options.vertical === false) {
        this.$slideTrack.animate({
          left: targetLeft
        }, this.options.speed, this.options.easing, callback);
      } else {
        this.$slideTrack.animate({
          top: targetLeft
        }, this.options.speed, this.options.easing, callback);
      }

    } else if (this.cssTransitions === false) {
      if (this.options.rtl === true) {
        this.currentLeft = -this.currentLeft;
      }
      $({
        animStart: this.currentLeft
      }).animate({
        animStart: targetLeft
      }, {
        duration: this.options.speed,
        easing: this.options.easing,
        step: (now) => {
          now = Math.ceil(now);
          if (this.options.vertical === false) {
            animProps[this.animType] = "translate(" +
              now + "px, 0px)";
            this.$slideTrack.css(animProps);
          } else {
            animProps[this.animType] = "translate(0px," +
              now + "px)";
            this.$slideTrack.css(animProps);
          }
        },
        complete: () => {
          if (callback) {
            callback.call();
          }
        }
      });

    } else {

      this.applyTransition();
      targetLeft = Math.ceil(targetLeft);

      if (this.options.vertical === false) {
        animProps[this.animType] = "translate3d(" + targetLeft + "px, 0px, 0px)";
      } else {
        animProps[this.animType] = "translate3d(0px," + targetLeft + "px, 0px)";
      }
      this.$slideTrack.css(animProps);

      setTimeout(() => {

        this.disableTransition();

        if (callback) {
          callback.call();
        }
      }, this.options.speed);
    }
  },
  applyTransition(slide: number) {
    const transition = {};

    if (this.options.fade === false) {
      transition[this.transitionType] = this.transformType +
        " " + this.options.speed + "ms " + this.options.cssEase;
    } else {
      transition[this.transitionType] = "opacity " +
        this.options.speed + "ms " + this.options.cssEase;
    }

    if (this.options.fade === false) {
      this.$slideTrack.css(transition);
    } else {
      this.$slides.eq(slide).css(transition);
    }
  },
  disableTransition(slide: number) {
    const transition = {};

    transition[this.transitionType] = "";

    if (this.options.fade === false) {
      this.$slideTrack.css(transition);
    } else {
      this.$slides.eq(slide).css(transition);
    }
  }
};
