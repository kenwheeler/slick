/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

export default {
  filterSlide(filter: Function) {
    var _ = this;

    if (filter !== null) {

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

      _.reinit();

    }
  },
  unfilterSlides() {
    var _ = this;

    if (_.$slidesCache !== null) {

      _.unload();

      _.$slideTrack.children(this.options.slide).detach();

      _.$slidesCache.appendTo(_.$slideTrack);

      _.reinit();

    }
  }
}