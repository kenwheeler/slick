/* @flow */

export default {
  goTo(slide: number, dontAnimate: boolean) {
    this.changeSlide({
      data: {
        message: "index",
        index: slide
      }
    }, dontAnimate);
  },
  next() {
    this.changeSlide({
      data: {
        message: "next"
      }
    });
  },
  pause() {
    this.autoPlayClear();
    this.paused = true;
  },
  play() {
    this.paused = false;
    this.autoPlay();
  },
  prev() {
    this.changeSlide({
      data: {
        message: "previous"
      }
    });
  }
};
