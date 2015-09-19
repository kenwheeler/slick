/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

export default {
  autoPlay() {
    var _ = this;

    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }

    if (_.slideCount > _.options.slidesToShow && _.paused !== true) {
      _.autoPlayTimer = setInterval(_.autoPlayIterator,
        _.options.autoplaySpeed);
    }
  },
  autoPlayClear() {
    var _ = this;
    if (_.autoPlayTimer) {
      clearInterval(_.autoPlayTimer);
    }
  },
  autoPlayIterator() {
    var _ = this;

    if (_.options.infinite === false) {

      if (_.direction === 1) {

        if ((_.currentSlide + 1) === _.slideCount -
          1) {
          _.direction = 0;
        }

        _.slideHandler(_.currentSlide + _.options.slidesToScroll);

      } else {

        if ((_.currentSlide - 1 === 0)) {

          _.direction = 1;

        }

        _.slideHandler(_.currentSlide - _.options.slidesToScroll);

      }

    } else {

      _.slideHandler(_.currentSlide + _.options.slidesToScroll);

    }
  }
}