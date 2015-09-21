/* @flow */
/*eslint-disable max-statements, complexity */

export default {
  filter(filter: Function) {
    if (filter !== null) {

      this.unload();

      this.$slideTrack.children(this.options.slide).detach();

      this.$slidesCache.filter(filter).appendTo(this.$slideTrack);

      this.reinit();

    }
  },
  unfilter() {
    if (this.$slidesCache !== null) {

      this.unload();

      this.$slideTrack.children(this.options.slide).detach();

      this.$slidesCache.appendTo(this.$slideTrack);

      this.reinit();

    }
  }
};
