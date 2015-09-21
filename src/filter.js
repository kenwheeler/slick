/* @flow */
/*eslint-disable max-statements, complexity */

export default {
  filterSlide(filter: Function) {
    if (filter !== null) {

      this.unload();

      this.$slideTrack.children(this.options.slide).detach();

      this.$slidesCache.filter(filter).appendTo(this.$slideTrack);

      this.reinit();

    }
  },
  unfilterSlides() {
    if (this.$slidesCache !== null) {

      this.unload();

      this.$slideTrack.children(this.options.slide).detach();

      this.$slidesCache.appendTo(this.$slideTrack);

      this.reinit();

    }
  }
};
