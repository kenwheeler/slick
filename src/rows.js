/* @flow */
/*eslint-disable max-statements, complexity, max-depth */

export default {
  buildRows() {
    const newSlides = document.createDocumentFragment();
    const originalSlides = this.$slider.children();

    if (this.options.rows > 1) {

      const slidesPerSection = this.options.slidesPerRow * this.options.rows;
      const numOfSlides = Math.ceil(
        originalSlides.length / slidesPerSection
      );

      for (let a = 0; a < numOfSlides; a++) {
        const slide = document.createElement("div");
        for (let b = 0; b < this.options.rows; b++) {
          const row = document.createElement("div");
          for (let c = 0; c < this.options.slidesPerRow; c++) {
            const target = a * slidesPerSection + b * this.options.slidesPerRow + c;
            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }
          slide.appendChild(row);
        }
        newSlides.appendChild(slide);
      }

      this.$slider.html(newSlides);
      this.$slider.children().children().children()
        .css({
          "width": 100 / this.options.slidesPerRow + "%",
          "display": "inline-block"
        });

    }
  },
  cleanUpRows() {
    if (this.options.rows > 1) {
      const originalSlides = this.$slides.children().children();
      originalSlides.removeAttr("style");
      this.$slider.html(originalSlides);
    }
  }
};
