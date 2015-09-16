'use strict';

import '../helpers/setup';

import animation from "../../src/animation";

describe('Animation', () => {

  let mockSlick = {};

  describe('animateHeight', () => {

    beforeEach(() => {
      mockSlick.currentSlide = 0;
      mockSlick.$list = {
        animate: sinon.stub()
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

    let callback = sinon.stub();

    var clock;

    beforeEach(() => {
      mockSlick.currentSlide = 1;
      mockSlick.currentLeft = 200;
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.$slideTrack.animate = sinon.stub();
      mockSlick.animateHeight = sinon.stub();
      mockSlick.applyTransition = sinon.stub();
      mockSlick.disableTransition = sinon.stub();
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      mockSlick = {};
      clock.restore();
    });

    it('should call animateHeight', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 300,
        easing: 'linear',
        cssTransitions: false
      }
      animation.animateSlide.call(mockSlick, 0, callback);
      expect(mockSlick.animateHeight).to.have.been.called;
    });

    it('should return the inverse of targetLeft if rtl=true and vertical=false', () => {
      mockSlick.options = {
        rtl: true,
        vertical: false,
        speed: 300,
        easing: 'linear'
      }
      mockSlick.transformsEnabled = false;
      animation.animateSlide.call(mockSlick, 200, null);
      expect(mockSlick.$slideTrack.animate).to.have.been.calledWith({
        left: -200
      }, 300, 'linear', null);
    });

    it('should call animate with left if transformsEnabled=false and vertical=false', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 300,
        easing: 'linear'
      }
      mockSlick.transformsEnabled = false;
      animation.animateSlide.call(mockSlick, 200, null);
      expect(mockSlick.$slideTrack.animate).to.have.been.calledWith({
        left: 200
      }, 300, 'linear', null);
    });

    it('should call animate with top if transformsEnabled=false and vertical=true', () => {
      mockSlick.options = {
        rtl: false,
        vertical: true,
        speed: 300,
        easing: 'linear'
      }
      mockSlick.transformsEnabled = false;
      animation.animateSlide.call(mockSlick, 200, null);
      expect(mockSlick.$slideTrack.animate).to.have.been.calledWith({
        top: 200
      }, 300, 'linear', null);
    });

    it('should step animate if transformsEnabled=true and cssTransitions=false', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 0,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = false;
      animation.animateSlide.call(mockSlick, 200, null);
      expect(mockSlick.$slideTrack.css('transform')).to.equal('translate(200px, 0px)')
    });

    it('should step animate top if transformsEnabled=true, vertical=true and cssTransitions=false', () => {
      mockSlick.options = {
        rtl: false,
        vertical: true,
        speed: 0,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = false;
      animation.animateSlide.call(mockSlick, 200, null);
      expect(mockSlick.$slideTrack.css('transform')).to.equal('translate(0px, 200px)');
    });

     it('should step animate left negatively if transformsEnabled=true, vertical=true and cssTransitions=false', () => {
      mockSlick.options = {
        rtl: true,
        vertical: false,
        speed: 0,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = false;
      animation.animateSlide.call(mockSlick, 200, null);
      expect(mockSlick.$slideTrack.css('transform')).to.equal('translate(-200px, 0px)')
    });

    it('call the supplied callback', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 0,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = false;
      animation.animateSlide.call(mockSlick, 200, callback);
      expect(callback).to.have.been.called;
    });

    it('should css animate if transformsEnabled=true and cssTransitions=true', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 0,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = true;
      animation.animateSlide.call(mockSlick, 200, callback);
      expect(mockSlick.$slideTrack.css('transform')).to.equal('translate3d(200px, 0px, 0px)')
    });

    it('should css animate top if transformsEnabled=true, vertical=true and cssTransitions=true', () => {
      mockSlick.options = {
        rtl: false,
        vertical: true,
        speed: 0,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = true;
      animation.animateSlide.call(mockSlick, 200, callback);
      expect(mockSlick.$slideTrack.css('transform')).to.equal('translate3d(0px, 200px, 0px)')
    });

    it('should call applyTransition if transformsEnabled=true and cssTransitions=true', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 0,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = true;
      animation.animateSlide.call(mockSlick, 200, callback);
      expect(mockSlick.applyTransition).to.have.been.called;
    });

    it('should call disableTransition if transformsEnabled=true and cssTransitions=true', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 200,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = true;
      animation.animateSlide.call(mockSlick, 200, callback);
      clock.tick(200);
      expect(mockSlick.disableTransition).to.have.been.called;
    });

    it('should call the callback if transformsEnabled=true and cssTransitions=true', () => {
      mockSlick.options = {
        rtl: false,
        vertical: false,
        speed: 200,
        easing: 'linear'
      }
      mockSlick.animType = 'transform';
      mockSlick.transformsEnabled = true;
      mockSlick.cssTransitions = true;
      animation.animateSlide.call(mockSlick, 200, callback);
      clock.tick(200);
      expect(callback).to.have.been.called;
    });

  });

  describe('applyTransition', () => {

    var cssstub;

    beforeEach(() => {
      mockSlick.transitionType = "transition";
      mockSlick.transformType = "transform";
      mockSlick.options = {
        speed: 300,
        cssEase: 'swing'
      }
      mockSlick.$slideTrack = {
        css: sinon.stub()
      };
      cssstub = sinon.stub();
      mockSlick.$slides = {
        eq() {
          return {
            css: cssstub
          }
        }
      }
      mockSlick.$slides.eq(0).css = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should apply transition styles to slideTrack if fade=false', () => {
      mockSlick.options.fade = false;
      animation.applyTransition.call(mockSlick, 0);
      expect(mockSlick.$slideTrack.css).to.have.been.calledWith({transition: 'transform 300ms swing'});
    });

    it('should apply transition styles to the slide index if fade=true', () => {
      mockSlick.options.fade = true;
      animation.applyTransition.call(mockSlick, 0);
      expect(cssstub).to.have.been.calledWith({transition: 'opacity 300ms swing'});
    });

  });

  describe('disableTransition', () => {

    var cssstub;

    beforeEach(() => {
      mockSlick.transitionType = "transition";
      mockSlick.transformType = "transform";
      mockSlick.options = {
        speed: 300,
        cssEase: 'swing'
      }
      mockSlick.$slideTrack = {
        css: sinon.stub()
      };
      cssstub = sinon.stub();
      mockSlick.$slides = {
        eq() {
          return {
            css: cssstub
          }
        }
      }
      mockSlick.$slides.eq(0).css = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should disable transition styles to slideTrack if fade=false', () => {
      mockSlick.options.fade = false;
      animation.disableTransition.call(mockSlick, 0);
      expect(mockSlick.$slideTrack.css).to.have.been.calledWith({transition: ''});
    });

    it('should disable transition styles to the slide index if fade=true', () => {
      mockSlick.options.fade = true;
      animation.disableTransition.call(mockSlick, 0);
      expect(cssstub).to.have.been.calledWith({transition: ''});
    });

  });

});