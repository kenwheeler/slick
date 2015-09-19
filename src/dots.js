/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

export default {
  buildDots() {
    var _ = this,
      i, dotString;

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

      dotString = '<ul class="' + _.options.dotsClass + '">';

      for (i = 0; i <= _.getDotCount(); i += 1) {
        dotString += '<li>' + _.options.customPaging.call(this, _, i) + '</li>';
      }

      dotString += '</ul>';

      _.$dots = $(dotString).appendTo(
        _.options.appendDots);

      _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');

    }
  },
  getDotCount(): number {
    var _ = this;

    var breakPoint = 0;
    var counter = 0;
    var pagerQty = 0;

    if (_.options.infinite === true) {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToShow;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }
    } else if (_.options.centerMode === true) {
      pagerQty = _.slideCount;
    } else {
      while (breakPoint < _.slideCount) {
        ++pagerQty;
        breakPoint = counter + _.options.slidesToShow;
        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
      }
    }

    return pagerQty - 1;
  },
  updateDots() {
    var _ = this;

    if (_.$dots !== null) {

      _.$dots
        .find('li')
        .removeClass('slick-active')
        .attr('aria-hidden', 'true');

      _.$dots
        .find('li')
        .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
        .addClass('slick-active')
        .attr('aria-hidden', 'false');

    }
  }
}