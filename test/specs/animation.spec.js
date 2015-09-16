'use strict';

import animation from "../../src/animation";
import generateSlides from '../helpers/generate-slides';

describe('Animation', () => {

  let mockSlick = {};

  describe('animateHeight', () => {

    beforeEach(() => {
      mockSlick.currentSlide = 0;
      mockSlick.$list = {
        animate: sinon.spy()
      };
      mockSlick.$slides = mockSlick.$slides = $($.map([
        $('<div style="height: 200px"/>')
      ], (el) => {
        return $.makeArray(el);
      }));
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should call animate under the right conditions', () => {
      mockSlick.options = {
        speed: 300,
        adaptiveHeight: true,
        vertical: false,
        slidesToShow: 1
      };
      animation.animateHeight.call(mockSlick);
      expect(mockSlick.$list.animate).to.have.been.called;
    });

    it('should obtain the right height from the currentSlide', () => {
      mockSlick.options = {
        speed: 300,
        adaptiveHeight: true,
        vertical: false,
        slidesToShow: 1
      };
      animation.animateHeight.call(mockSlick);
      expect(mockSlick.$list.animate).to.have.been.calledWith({
        height: 200
      }, 300);
    });

    it('should not do anything if adaptiveHeight=false', () => {
      mockSlick.options = {
        speed: 300,
        adaptiveHeight: false,
        vertical: false,
        slidesToShow: 1
      };
      animation.animateHeight.call(mockSlick);
      expect(mockSlick.$list.animate).to.not.have.been.called;
    });

    it('should not do anything if vertical=true', () => {
      mockSlick.options = {
        speed: 300,
        adaptiveHeight: true,
        vertical: true,
        slidesToShow: 1
      };
      animation.animateHeight.call(mockSlick);
      expect(mockSlick.$list.animate).to.not.have.been.called;
    });

    it('should not do anything if slidesToShow !== 1', () => {
      mockSlick.options = {
        speed: 300,
        adaptiveHeight: true,
        vertical: false,
        slidesToShow: 3
      };
      animation.animateHeight.call(mockSlick);
      expect(mockSlick.$list.animate).to.not.have.been.called;
    });

  });

  describe('animateSlide', () => {

    let callback = null;

    beforeEach(() => {
      mockSlick.currentSlide = 1;
      mockSlick.currentLeft = 200;
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.$slideTrack.animate = sinon.spy();
      mockSlick.animateHeight = sinon.spy();
      mockSlick.applyTransition = sinon.spy();
      mockSlick.disableTransition = sinon.spy();
      callback = sinon.spy();
    });

    afterEach(() => {
      mockSlick = {};
      callback = null;
    });

    it('should call animateHeight', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        transformsEnabled: true,
        speed: 300,
        easing: 'linear',
        cssTransitions: false
      }
      animation.animateSlide.call(mockSlick, 0, callback);
      expect(mockSlick.animateHeight).to.have.been.called;
    });

    // it('should return the inverse of targetLeft if rtl=true and vertical=false', () => {
    //   mockSlick.options = {
    //     rtl: true,
    //     vertical: false,
    //     transformsEnabled: false,
    //     speed: 300,
    //     easing: 'linear',
    //     cssTransitions: false
    //   }
    //   animation.animateSlide.call(mockSlick, 200, callback);
    //   expect(mockSlick.$slideTrack.animate).to.have.been.called;
    // });

  });

});