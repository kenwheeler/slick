'use strict';

const $ = window.$ || window.jQuery;

export default {
  buildArrows() {
    var _ = this;

    if (_.options.arrows === true) {

      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

      if (_.slideCount > _.options.slidesToShow) {

        _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
        _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

        if (_.htmlExpr.test(_.options.prevArrow)) {
          _.$prevArrow.prependTo(_.options.appendArrows);
        }

        if (_.htmlExpr.test(_.options.nextArrow)) {
          _.$nextArrow.appendTo(_.options.appendArrows);
        }

        if (_.options.infinite !== true) {
          _.$prevArrow
            .addClass('slick-disabled')
            .attr('aria-disabled', 'true');
        }

      } else {

        _.$prevArrow.add(_.$nextArrow)

        .addClass('slick-hidden')
          .attr({
            'aria-disabled': 'true',
            'tabindex': '-1'
          });

      }

    }
  },
  updateArrows() {
    var _ = this,
      centerOffset;

    centerOffset = Math.floor(_.options.slidesToShow / 2);

    if (_.options.arrows === true &&
      _.slideCount > _.options.slidesToShow &&
      !_.options.infinite) {

      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      if (_.currentSlide === 0) {

        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

      }

    }
  }
}