/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

export default {
  goTo(slide: number, dontAnimate: boolean) {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'index',
        index: slide
      }
    }, dontAnimate);
  },
  next() {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'next'
      }
    });
  },
  pause() {
    var _ = this;

    _.autoPlayClear();
    _.paused = true;
  },
  play() {
    var _ = this;

    _.paused = false;
    _.autoPlay();
  },
  prev() {
    var _ = this;

    _.changeSlide({
      data: {
        message: 'previous'
      }
    });
  },

}