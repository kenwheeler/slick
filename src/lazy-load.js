/* @flow */
/*eslint-disable max-statements, complexity */

const $ = window.$ || window.jQuery;

export default {
  loadImages(imagesScope: any) {
    $("img[data-lazy]", imagesScope).each((i, img) => {

      const image = $(img);
      const imageSource = $(img).attr("data-lazy");
      const imageToLoad = document.createElement("img");

      imageToLoad.onload = () => {
        image
          .animate({
            opacity: 0
          }, 100, () => {
            image
              .attr("src", imageSource)
              .animate({
                opacity: 1
              }, 200, () => {
                image
                  .removeAttr("data-lazy")
                  .removeClass("slick-loading");
              });
          });
      };

      imageToLoad.src = imageSource;

    });
  },
  lazyLoad() {
    let rangeStart = null;
    let rangeEnd = null;

    if (this.options.centerMode === true) {
      if (this.options.infinite === true) {
        rangeStart = this.currentSlide + (this.options.slidesToShow / 2 + 1);
        rangeEnd = rangeStart + this.options.slidesToShow + 2;
      } else {
        rangeStart = Math.max(0, this.currentSlide - (this.options.slidesToShow / 2 + 1));
        rangeEnd = 2 + (this.options.slidesToShow / 2 + 1) + this.currentSlide;
      }
    } else {
      rangeStart = this.options.infinite ?
        this.options.slidesToShow + this.currentSlide : this.currentSlide;
      rangeEnd = rangeStart + this.options.slidesToShow;
      if (this.options.fade === true) {
        if (rangeStart > 0) { rangeStart--; }
        if (rangeEnd <= this.slideCount) { rangeEnd++; }
      }
    }

    let cloneRange = null;
    const loadRange = this.$slider.find(".slick-slide").slice(rangeStart, rangeEnd);

    this.loadImages(loadRange);

    if (this.slideCount <= this.options.slidesToShow) {
      cloneRange = this.$slider.find(".slick-slide");
      this.loadImages(cloneRange);
    } else
    if (this.currentSlide >= this.slideCount - this.options.slidesToShow) {
      cloneRange = this.$slider.find(".slick-cloned").slice(0, this.options.slidesToShow);
      this.loadImages(cloneRange);
    } else if (this.currentSlide === 0) {
      cloneRange = this.$slider.find(".slick-cloned").slice(this.options.slidesToShow * -1);
      this.loadImages(cloneRange);
    }
  },
  progressiveLazyLoad() {
    const imgCount = $("img[data-lazy]", this.$slider).length;

    if (imgCount > 0) {
      const targetImage = $("img[data-lazy]", this.$slider).first();
      targetImage.attr("src", null);
      targetImage.attr("src", targetImage.attr("data-lazy")).removeClass("slick-loading")
        .load(() => {
          targetImage.removeAttr("data-lazy");
          this.progressiveLazyLoad();

          if (this.options.adaptiveHeight === true) {
            this.setPosition();
          }
        })
        .error(() => {
          targetImage.removeAttr("data-lazy");
          this.progressiveLazyLoad();
        });
    }
  }
};
