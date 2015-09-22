/* @flow */

const $ = window.$ || window.jQuery;

export default {
  buildArrows() {
    if (this.options.arrows === true) {

      this.$prevArrow = $(this.options.prevArrow).addClass("slick-arrow");
      this.$nextArrow = $(this.options.nextArrow).addClass("slick-arrow");

      if (this.slideCount > this.options.slidesToShow) {

        this.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");
        this.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");

        if (this.htmlExpr.test(this.options.prevArrow)) {
          this.$prevArrow.prependTo(this.options.appendArrows);
        }

        if (this.htmlExpr.test(this.options.nextArrow)) {
          this.$nextArrow.appendTo(this.options.appendArrows);
        }

        if (this.options.infinite !== true) {
          this.$prevArrow
            .addClass("slick-disabled")
            .attr("aria-disabled", "true");
        }

      } else {

        this.$prevArrow.add(this.$nextArrow)

        .addClass("slick-hidden")
          .attr({
            "aria-disabled": "true",
            "tabindex": "-1"
          });

      }

    }
  },
  updateArrows() {
    if (this.options.arrows === true &&
      this.slideCount > this.options.slidesToShow &&
      this.options.infinite === false) {

      this.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");
      this.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false");

      if (this.currentSlide === 0) {
        this.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        this.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false");

      } else if (this.currentSlide >= this.slideCount - this.options.slidesToShow &&
          this.options.centerMode === false) {

        this.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        this.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");

      } else if (this.currentSlide >= this.slideCount - 1 && this.options.centerMode === true) {

        this.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true");
        this.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false");

      }

    }
  }
};
