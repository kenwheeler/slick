'use strict';

module.exports = function generateSlides(number) {
  let slide = `
    <div style="width: 200px; height: 200px;">
      <h1>${number}</h1>
    </div>
  `;
  let slides = [];
  for (var i = 0; i < number; i++) {
    slides.push(slide)
  }
  return slides;
};