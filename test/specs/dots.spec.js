'use strict';

import '../helpers/setup';

import dots from "../../src/dots";

describe('Dots', () => {

  let mockSlick = {}, dotContainer;

  describe('buildDots', () => {

    beforeEach(() => {
      dotContainer = $('<div/>');
      mockSlick.slideCount = 6;
      mockSlick.options = {
        dots: false,
        slidesToShow: 3,
        appendDots: dotContainer
      }
    });

    afterEach(() => {
      mockSlick = {};
      dotContainer = null;
    });

    it('should not do anything if dots=false', () => {
      dots.buildDots.call(mockSlick);
      expect(dotContainer.children().length).to.equal(0);
    });

    it('should not do anything if slideCount <= slidesToShow', () => {
      mockSlick.options.dots = true;
      mockSlick.slideCount = 3;
      dots.buildDots.call(mockSlick);
      expect(dotContainer.children().length).to.equal(0);
    });

    it('should build dots', () => {
      mockSlick.options.dots = true;
      mockSlick.options.dotsClass = 'dots';
      mockSlick.getDotCount = () => {
        return 1;
      };
      mockSlick.options.customPaging = (slider, i) => {
        return "<button type=\"button\" data-role=\"none\" role=\"button\" aria-required=\"false\" tabindex=\"0\">" + (i + 1) + "</button>";
      };
      dots.buildDots.call(mockSlick);
      expect(dotContainer.children().length).to.equal(1);
      expect(dotContainer.children().children().length).to.equal(2);
    });

  });

  describe('getDotCount', () => {

    beforeEach(() => {
      mockSlick.slideCount = 6;
      mockSlick.options = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: false
      }
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('return two indexes with the default settings', () => {
      let ret = dots.getDotCount.call(mockSlick);
      expect(ret).to.equal(1);
    });

    it('return two indexes when infinite=false', () => {
      mockSlick.options.infinite = false;
      let ret = dots.getDotCount.call(mockSlick);
      expect(ret).to.equal(1);
    });

    it('return six indexes when centerMode=true', () => {
      mockSlick.options.infinite = false;
      mockSlick.options.centerMode = true;
      let ret = dots.getDotCount.call(mockSlick);
      expect(ret).to.equal(5);
    });

  });

  describe('updateDots', () => {

    beforeEach(() => {
      mockSlick.currentSlide = 1;
      mockSlick.options = {
        slidesToScroll: 1
      };
      mockSlick.$dots = $('<ul/>');
      mockSlick.$dots.append(
        $('<li/>'),
        $('<li/>')
      )
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('add attributes to the dots', () => {
      dots.updateDots.call(mockSlick);
      expect(mockSlick.$dots.children().eq(0).attr('aria-hidden')).to.equal('true');
    });

    it('set the currently active dot', () => {
      dots.updateDots.call(mockSlick);
      expect(mockSlick.$dots.children().eq(1).hasClass('slick-active')).to.be.true;
    });

  });

});
