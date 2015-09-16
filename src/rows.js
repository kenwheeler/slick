'use strict';

const $ = window.$ || window.jQuery;

export default {
  buildRows() {
    var _ = this,
      a, b, c, newSlides, numOfSlides, originalSlides, slidesPerSection;

    newSlides = document.createDocumentFragment();
    originalSlides = _.$slider.children();

    if (_.options.rows > 1) {

      slidesPerSection = _.options.slidesPerRow * _.options.rows;
      numOfSlides = Math.ceil(
        originalSlides.length / slidesPerSection
      );

      for (a = 0; a < numOfSlides; a++) {
        var slide = document.createElement('div');
        for (b = 0; b < _.options.rows; b++) {
          var row = document.createElement('div');
          for (c = 0; c < _.options.slidesPerRow; c++) {
            var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
            if (originalSlides.get(target)) {
              row.appendChild(originalSlides.get(target));
            }
          }
          slide.appendChild(row);
        }
        newSlides.appendChild(slide);
      }

      _.$slider.html(newSlides);
      _.$slider.children().children().children()
        .css({
          'width': (100 / _.options.slidesPerRow) + '%',
          'display': 'inline-block'
        });

    }
  },
  cleanUpRows() {
    var _ = this,
      originalSlides;

    if (_.options.rows > 1) {
      originalSlides = _.$slides.children().children();
      originalSlides.removeAttr('style');
      _.$slider.html(originalSlides);
    }
  }
}