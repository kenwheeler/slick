/* @flow */
/*eslint-disable max-statements, complexity, no-lonely-if */

const $ = window.$ || window.jQuery;

export default {
  addSlide(markup: any, index: any, addBefore: number) {
    if (typeof index === "boolean") {
      addBefore = index;
      index = null;
    } else if (index < 0 || index >= this.slideCount) {
      return false;
    }

    this.unload();

    if (typeof index === "number") {
      if (index === 0 && this.$slides.length === 0) {
        $(markup).appendTo(this.$slideTrack);
      } else if (addBefore) {
        $(markup).insertBefore(this.$slides.eq(index));
      } else {
        $(markup).insertAfter(this.$slides.eq(index));
      }
    } else {
      if (addBefore === true) {
        $(markup).prependTo(this.$slideTrack);
      } else {
        $(markup).appendTo(this.$slideTrack);
      }
    }

    this.$slides = this.$slideTrack.children(this.options.slide);

    this.$slideTrack.children(this.options.slide).detach();

    this.$slideTrack.append(this.$slides);

    this.$slides.each((i, element) => {
      $(element).attr("data-slick-index", i);
    });

    this.$slidesCache = this.$slides;

    this.reinit();
  },
  changeSlide(event: Object, dontAnimate: boolean) {
    let $target = $(event.target);

    // If target is a link, prevent default action.
    if ($target.is("a")) {
      event.preventDefault();
    }

    // If target is not the <li> element (ie: a child), find the <li>.
    if (!$target.is("li")) {
      $target = $target.closest("li");
    }

    const unevenOffset = this.slideCount % this.options.slidesToScroll !== 0;
    const indexOffset = unevenOffset ? 0 :
      (this.slideCount - this.currentSlide) % this.options.slidesToScroll;
    let slideOffset = null;

    switch (event.data.message) {
    case "previous":
      slideOffset = indexOffset === 0 ?
        this.options.slidesToScroll : this.options.slidesToShow - indexOffset;
      if (this.slideCount > this.options.slidesToShow) {
        this.slideHandler(this.currentSlide - slideOffset, false, dontAnimate);
      }
      break;

    case "next":
      slideOffset = indexOffset === 0 ? this.options.slidesToScroll : indexOffset;
      if (this.slideCount > this.options.slidesToShow) {
        this.slideHandler(this.currentSlide + slideOffset, false, dontAnimate);
      }
      break;

    case "index":
      const index = event.data.index === 0 ? 0 :
        event.data.index || $target.index() * this.options.slidesToScroll;

      this.slideHandler(this.checkNavigable(index), false, dontAnimate);
      $target.children().trigger("focus");
      break;

    default:
      return;
    }
  },
  removeSlide(index: number, removeBefore: number, removeAll: boolean) {
    if (typeof index === "boolean") {
      removeBefore = index;
      index = removeBefore === true ? 0 : this.slideCount - 1;
    } else {
      index = removeBefore === true ? --index : index;
    }

    if (this.slideCount < 1 || index < 0 || index > this.slideCount - 1) {
      return false;
    }

    this.unload();

    if (removeAll === true) {
      this.$slideTrack.children().remove();
    } else {
      this.$slideTrack.children(this.options.slide).eq(index).remove();
    }

    this.$slides = this.$slideTrack.children(this.options.slide);

    this.$slideTrack.children(this.options.slide).detach();

    this.$slideTrack.append(this.$slides);

    this.$slidesCache = this.$slides;

    this.reinit();
  }
};
