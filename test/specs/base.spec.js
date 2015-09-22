'use strict';

import '../helpers/setup';

import Slick from "../../src/index";
import generateSlides from '../helpers/generate-slides';

describe('Slick', () => {

  let slider = null;

  describe('Base', () => {

    describe('Initialization', () => {

      beforeEach(() => {
        slider = $('div');
        slider.addClass('slider').appendTo(document.body);
      });

      afterEach(() => {
        $(document.body).empty();
      });

      it('should initialize when called with no options', () => {
        slider.append(generateSlides(3));
        $(slider).slick({}, () => {
          expect($('.slick-slider').length).to.equal(1);
        });
      });

      it('should initialize when called with options', () => {
        slider.append(generateSlides(3));
        $(slider).slick({
          slidesToShow: 3
        }, () => {
          expect($('.slick-slider').length).to.equal(1);
        });
      });

      it('should add a slick-initialized class', () => {
        slider.append(generateSlides(3));
        $(slider).slick({}, () => {
          expect($('.slick-initialized').length).to.equal(1);
        });
      });

    });

    describe('Build', () => {

      beforeEach(() => {
        slider = $('div');
        slider.addClass('slider').appendTo(document.body);
      });

      afterEach(() => {
        $(document.body).empty();
      });

      it('should build arrows by default', () => {
        slider.append(generateSlides(3));
        $(slider).slick({}, () => {
          expect($('.slick-arrow').length).to.equal(2);
        });
      });

      it('should not build arrows if the number of slides <= slidesToShow', () => {
        slider.append(generateSlides(3));
        $(slider).slick({
          slidesToShow: 3
        }, () => {
          expect($('.slick-arrow').length).to.equal(0);
        });
      });

    });

  });

});