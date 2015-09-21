/* @flow */
/*eslint-disable max-statements, complexity */

const $ = window.$ || window.jQuery;

export default {
  getCurrent(): number {
    return this.currentSlide;
  },
  getLeft(slideIndex: number): number {
    this.slideOffset = 0;

    const verticalHeight = this.$slides.first().outerHeight(true);
    let targetLeft = 0;
    let targetSlide = 0;
    let verticalOffset = 0;

    if (this.options.infinite === true) {
      if (this.slideCount > this.options.slidesToShow) {
        this.slideOffset = this.slideWidth * this.options.slidesToShow * -1;
        verticalOffset = verticalHeight * this.options.slidesToShow * -1;
      }
      if (this.slideCount % this.options.slidesToScroll !== 0) {
        if (slideIndex + this.options.slidesToScroll > this.slideCount &&
          this.slideCount > this.options.slidesToShow) {

          if (slideIndex > this.slideCount) {
            this.slideOffset = (this.options.slidesToShow -
              (slideIndex - this.slideCount) * this.slideWidth) * -1;
            verticalOffset = (this.options.slidesToShow -
              (slideIndex - this.slideCount) * verticalHeight) * -1;
          } else {
            this.slideOffset = this.slideCount % this.options.slidesToScroll *
              this.slideWidth * -1;
            verticalOffset = this.slideCount % this.options.slidesToScroll *
              verticalHeight * -1;
          }

        }
      }
    } else if (slideIndex + this.options.slidesToShow > this.slideCount) {
      this.slideOffset = slideIndex + this.options.slidesToShow - this.slideCount *
        this.slideWidth;
      verticalOffset = slideIndex + this.options.slidesToShow - this.slideCount *
        verticalHeight;
    }

    if (this.slideCount <= this.options.slidesToShow) {
      this.slideOffset = 0;
      verticalOffset = 0;
    }

    if (this.options.centerMode === true && this.options.infinite === true) {
      this.slideOffset += this.slideWidth * Math.floor(this.options.slidesToShow / 2) -
        this.slideWidth;
    } else if (this.options.centerMode === true) {
      this.slideOffset = 0;
      this.slideOffset += this.slideWidth * Math.floor(this.options.slidesToShow / 2);
    }

    if (this.options.vertical === false) {
      targetLeft = slideIndex * this.slideWidth * -1 + this.slideOffset;
    } else {
      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
    }

    if (this.options.variableWidth === true) {

      if (this.slideCount <= this.options.slidesToShow ||
          this.options.infinite === false) {
        targetSlide = this.$slideTrack.children(".slick-slide")
          .eq(slideIndex);
      } else {
        targetSlide = this.$slideTrack.children(".slick-slide")
          .eq(slideIndex + this.options.slidesToShow);
      }

      targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;

      if (this.options.centerMode === true) {
        if (this.slideCount <= this.options.slidesToShow ||
            this.options.infinite === false) {
          targetSlide = this.$slideTrack.children(".slick-slide")
            .eq(slideIndex);
        } else {
          targetSlide = this.$slideTrack.children(".slick-slide")
            .eq(slideIndex + this.options.slidesToShow + 1);
        }
        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
        targetLeft += (this.$list.width() - targetSlide.outerWidth()) / 2;
      }
    }

    return targetLeft;
  },
  getOption(option: string): any {
    return this.options[option];
  },
  getNavigableIndexes(): Array<number> {
    const indexes = [];

    let breakPoint = 0;
    let counter = 0;
    let max = 0;

    if (this.options.infinite === false) {
      max = this.slideCount;
    } else {
      breakPoint = this.options.slidesToScroll * -1;
      counter = this.options.slidesToScroll * -1;
      max = this.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + this.options.slidesToScroll;
      counter += this.options.slidesToScroll <= this.options.slidesToShow ?
        this.options.slidesToScroll : this.options.slidesToShow;
    }

    return indexes;
  },
  getSlick(): Object {
    return this;
  },
  getSlideCount(): number {
    let swipedSlide = 0;

    const centerOffset = this.options.centerMode === true ? this.slideWidth *
      Math.floor(this.options.slidesToShow / 2) : 0;

    if (this.options.swipeToSlide === true) {
      this.$slideTrack.find(".slick-slide").each((index, slide) => {
        if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 >
            this.swipeLeft * -1) {
          swipedSlide = slide;
          return 0;
        }
      });

      return Math.abs($(swipedSlide).attr("data-slick-index") -
        this.currentSlide) || 1;

    } else {
      return this.options.slidesToScroll;
    }
  }
};
