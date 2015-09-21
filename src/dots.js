/* @flow */

const $ = window.$ || window.jQuery;

export default {
  buildDots() {
    let dotString = "";

    if (this.options.dots === true && this.slideCount > this.options.slidesToShow) {

      dotString = "<ul class=\"" + this.options.dotsClass + "\">";

      for (let i = 0; i <= this.getDotCount(); i += 1) {
        dotString += "<li>" + this.options.customPaging.call(this, this, i) + "</li>";
      }

      dotString += "</ul>";

      this.$dots = $(dotString).appendTo(
        this.options.appendDots);

      this.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false");

    }
  },
  getDotCount(): number {
    let breakPoint = 0;
    let counter = 0;
    let pagerQty = 0;

    if (this.options.infinite === true) {
      while (breakPoint < this.slideCount) {
        ++pagerQty;
        breakPoint = counter + this.options.slidesToShow;
        counter += this.options.slidesToScroll <= this.options.slidesToShow ?
          this.options.slidesToScroll : this.options.slidesToShow;
      }
    } else if (this.options.centerMode === true) {
      pagerQty = this.slideCount;
    } else {
      while (breakPoint < this.slideCount) {
        ++pagerQty;
        breakPoint = counter + this.options.slidesToShow;
        counter += this.options.slidesToScroll <= this.options.slidesToShow ?
          this.options.slidesToScroll : this.options.slidesToShow;
      }
    }
    return pagerQty - 1;
  },
  updateDots() {
    if (this.$dots !== null) {

      this.$dots
        .find("li")
        .removeClass("slick-active")
        .attr("aria-hidden", "true");

      this.$dots
        .find("li")
        .eq(Math.floor(this.currentSlide / this.options.slidesToScroll))
        .addClass("slick-active")
        .attr("aria-hidden", "false");

    }
  }
};
