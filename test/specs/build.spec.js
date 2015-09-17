'use strict';

import '../helpers/setup';

import build from "../../src/build";

describe('Build', () => {

  let mockSlick = {};

  describe('buildOut', () => {

    beforeEach(() => {
      mockSlick.$slider = $('<div/>');
      mockSlick.$slider.append($('<div style="height: 200px"/>'));
      mockSlick.setupInfinite = sinon.stub();
      mockSlick.buildArrows = sinon.stub();
      mockSlick.buildDots = sinon.stub();
      mockSlick.updateDots = sinon.stub();
      mockSlick.setSlideClasses = sinon.stub();
      mockSlick.options = {
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: false,
        swipeToSlide: false,
        draggable: false,
        slide: ''
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should add the slick-slide class to slider children', () => {
      build.buildOut.call(mockSlick);
      expect(mockSlick.$slides.eq(0).hasClass('slick-slide')).to.be.true;
    });

    it('should set the correct slideCount', () => {
      build.buildOut.call(mockSlick);
      expect(mockSlick.slideCount).to.equal(1);
    });

    it('should add a data-slick-index attr to children', () => {
      build.buildOut.call(mockSlick);
      expect(mockSlick.$slides.eq(0).attr('data-slick-index')).to.equal('0');
    });

    it('should save original styling to a data attr', () => {
      build.buildOut.call(mockSlick);
      expect(mockSlick.$slides.eq(0).data('originalStyling')).to.equal('height: 200px');
    });

    it('should set slidesToScroll to 1 if centerMode is true', () => {
      mockSlick.options.centerMode = true;
      build.buildOut.call(mockSlick);
      expect(mockSlick.options.slidesToScroll).to.equal(1);
    });

    it('should set slidesToScroll to 1 if swipeToSlide is true', () => {
      mockSlick.options.swipeToSlide = true;
      build.buildOut.call(mockSlick);
      expect(mockSlick.options.slidesToScroll).to.equal(1);
    });

    it('should add a loading class to lazy load images', () => {
      mockSlick.$slider = $('<div/>');
      mockSlick.$slider.append($('<img data-lazy=""/>'));
      build.buildOut.call(mockSlick);
      expect(mockSlick.$slides.eq(0).hasClass('slick-loading')).to.be.true;
    });

    it('should call the proper setup methods', () => {
      build.buildOut.call(mockSlick);
      expect(mockSlick.setupInfinite).to.have.been.called;
      expect(mockSlick.buildArrows).to.have.been.called;
      expect(mockSlick.buildDots).to.have.been.called;
      expect(mockSlick.updateDots).to.have.been.called;
    });

    it('call setSlidesClasses with 0 if currentSlide is invalid', () => {
      build.buildOut.call(mockSlick);
      expect(mockSlick.setSlideClasses).to.have.been.calledWith(0);
    });

    it('call setSlideClasses with currentSlide if currentSlide is valid', () => {
      mockSlick.currentSlide = 3;
      build.buildOut.call(mockSlick);
      expect(mockSlick.setSlideClasses).to.have.been.calledWith(3);
    });

  });

  describe('destroy', () => {

    beforeEach(() => {
      mockSlick.$slider = $('<div class="slick-slider slick-initialized"/>');
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.$list = $('<div/>');
      mockSlick.$slideTrack.append(
        $('<div aria-hidden="false" data-slick-index="0" class="slick-slide slick-active slick-center slick-visible slick-current" style="height: 200px"/>')
          .data('originalStyling', 'height: 200px;')
      );
      mockSlick.$slides = mockSlick.$slideTrack.children();
      mockSlick.$slideTrack.append($('<div class="slick-cloned"/>'));
      mockSlick.$list.append(mockSlick.$slideTrack);
      mockSlick.$slider.append(mockSlick.$list);
      mockSlick.autoPlayClear = sinon.stub();
      mockSlick.cleanUpEvents = sinon.stub();
      mockSlick.cleanUpRows = sinon.stub();
      mockSlick.unslicked = false;
      mockSlick.options = {
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: false,
        swipeToSlide: false,
        draggable: false,
        slide: ''
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should call autoPlayClear', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.autoPlayClear).to.have.been.called;
    });

    it('should reset touchObject', () => {
      build.destroy.call(mockSlick);
      expect($.isEmptyObject(mockSlick.touchObject)).to.be.true;
    });

    it('should call cleanUpEvents', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.cleanUpEvents).to.have.been.called;
    });

    it('should remove clones', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.$slider.children().length).to.equal(1);
    });

    it('should remove dots if present', () => {
      mockSlick.$dots = {
        remove: sinon.stub()
      };
      build.destroy.call(mockSlick);
      expect(mockSlick.$dots.remove).to.have.been.called;
    });

  });

});
