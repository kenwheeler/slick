/* @flow */

export default {
  fadeSlide(slideIndex: number, callback: Function) {
    if (this.cssTransitions === false) {

      this.$slides.eq(slideIndex).css({
        zIndex: this.options.zIndex
      });

      this.$slides.eq(slideIndex).animate({
        opacity: 1
      }, this.options.speed, this.options.easing, callback);

    } else {

      this.applyTransition(slideIndex);

      this.$slides.eq(slideIndex).css({
        opacity: 1,
        zIndex: this.options.zIndex
      });

      if (callback) {
        setTimeout(() => {

          this.disableTransition(slideIndex);

          callback.call();
        }, this.options.speed);
      }

    }
  },
  fadeSlideOut(slideIndex: number) {
    if (this.cssTransitions === false) {

      this.$slides.eq(slideIndex).animate({
        opacity: 0,
        zIndex: this.options.zIndex - 2
      }, this.options.speed, this.options.easing);

    } else {

      this.applyTransition(slideIndex);

      this.$slides.eq(slideIndex).css({
        opacity: 0,
        zIndex: this.options.zIndex - 2
      });

    }
  }
};
