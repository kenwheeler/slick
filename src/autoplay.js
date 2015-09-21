/* @flow */

export default {
  autoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    if (this.slideCount > this.options.slidesToShow && this.paused !== true) {
      this.autoPlayTimer = setInterval(this.autoPlayIterator,
        this.options.autoplaySpeed);
    }
  },
  autoPlayClear() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  },
  autoPlayIterator() {
    if (this.options.infinite === false) {

      if (this.direction === 1) {

        if (this.currentSlide + 1 === this.slideCount - 1) {
          this.direction = 0;
        }

        this.slideHandler(this.currentSlide + this.options.slidesToScroll);

      } else {

        if (this.currentSlide - 1 === 0) {
          this.direction = 1;
        }

        this.slideHandler(this.currentSlide - this.options.slidesToScroll);

      }

    } else {
      this.slideHandler(this.currentSlide + this.options.slidesToScroll);
    }
  }
};
