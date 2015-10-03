'use strict';

import '../helpers/setup';

import core from "../../src/core";

describe('Core', () => {

  let mockSlick = {};

  describe('asNavFor', () => {

    beforeEach(() => {
      mockSlick.options = {
        asNavFor: $("<div/>")
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should call slideHandler if asNavFor exists', () => {
      let myStub = sinon.stub();
      let oldSlick = $.fn.slick;
      $.fn.slick = () => {
        return {
          unslicked: false,
          slideHandler: myStub
        };
      };
      core.asNavFor.call(mockSlick, 1);
      expect(myStub).to.have.been.calledWith(1, true);
      $.fn.slick = oldSlick;
    });

    it('should not call slideHandler if asNavFor is unslicked', () => {
      let myStub = sinon.stub();
      let oldSlick = $.fn.slick;
      $.fn.slick = () => {
        return {
          unslicked: true,
          slideHandler: myStub
        };
      };
      core.asNavFor.call(mockSlick, 1);
      expect(myStub).to.not.have.been.called;
    });

    it('should do anything if asNavFor is not present', () => {
      let myStub = sinon.stub();
      let oldSlick = $.fn.slick;
      $.fn.slick = () => {
        return {
          unslicked: true,
          slideHandler: myStub
        };
      };
      mockSlick.options.asNavFor = null;
      core.asNavFor.call(mockSlick, 1);
      expect(myStub).to.not.have.been.called;
    });

  });

  describe('checkNavigable', () => {

    afterEach(() => {
      mockSlick = {};
    });

    it('return the supplied index if it is navigable', () => {
      mockSlick.getNavigableIndexes = () => {
        return [0,1,2,3];
      }
      let retVal = core.checkNavigable.call(mockSlick, 1);
      expect(retVal).to.equal(1);
    });

    it('return the last index if supplied index exceeds length', () => {
      mockSlick.getNavigableIndexes = () => {
        return [0,1,2,3];
      }
      let retVal = core.checkNavigable.call(mockSlick, 4);
      expect(retVal).to.equal(3);
    });

    it('return the previous index if supplied index isnt navigable', () => {
      mockSlick.getNavigableIndexes = () => {
        return [0,3,6,9];
      }
      let retVal = core.checkNavigable.call(mockSlick, 4);
      expect(retVal).to.equal(3);
    });

  });

  describe('postSlide', () => {

    beforeEach(() => {
      mockSlick.$slider = $('<div/>');
      mockSlick.setPosition = sinon.stub();
      mockSlick.autoPlay = sinon.stub();
      mockSlick.initADA = sinon.stub();
      mockSlick.paused = false;
      mockSlick.options = {
        accessibility: false,
        autoplay: false
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should call setPosition', () => {
      core.postSlide.call(mockSlick, 1);
      expect(mockSlick.setPosition).to.have.been.called;
    });

    it('should start autoPlay if autoplay=true and paused=false', () => {
      mockSlick.options = {
        accessibility: false,
        autoplay: true
      };
      core.postSlide.call(mockSlick, 1);
      expect(mockSlick.autoPlay).to.have.been.called;
    });

    it('should call initADA if accessibility=true', () => {
      mockSlick.options = {
        accessibility: true,
        autoplay: false
      };
      core.postSlide.call(mockSlick, 1);
      expect(mockSlick.initADA).to.have.been.called;
    });

  });

  describe('selectHandler', () => {

    let event = {};

    beforeEach(() => {
      event.target = $('<div class="slick-slide" data-slick-index="1"/>');
      mockSlick.$slider = $('<div/>');
      mockSlick.setSlideClasses = sinon.stub();
      mockSlick.asNavFor = sinon.stub();
      mockSlick.slideHandler = sinon.stub();
      mockSlick.slideCount = 6;
      mockSlick.paused = false;
      mockSlick.options = {
        slidesToShow: 3
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should call slideHandler with the data-slick-index of the slide', () => {
      core.selectHandler.call(mockSlick, event);
      expect(mockSlick.slideHandler).to.have.been.calledWith(1);
    });

    it('should default the index to 0', () => {
      event.target = $('<div class="slick-slide"/>');
      core.selectHandler.call(mockSlick, event);
      expect(mockSlick.slideHandler).to.have.been.calledWith(0);
    });

    it('should not call slideHandler if the slide isnt navigable', () => {
      mockSlick.slideCount = 3;
      core.selectHandler.call(mockSlick, event);
      expect(mockSlick.asNavFor).to.have.been.calledWith(1);
      expect(mockSlick.setSlideClasses).to.have.been.calledWith(1);
      expect(mockSlick.slideHandler).to.not.have.been.called;
    });

  });

  describe('slideHandler', () => {

    var clearIntervalStub;

    beforeEach(() => {
      mockSlick.$slider = $('<div/>');
      mockSlick.animating = false;
      mockSlick.autoPlayClear = sinon.stub();
      mockSlick.asNavFor = sinon.stub();
      mockSlick.animateSlide = (left, callback) => {
        callback.call(mockSlick)
      };
      sinon.spy(mockSlick, 'animateSlide');
      mockSlick.animateHeight = sinon.stub();
      mockSlick.postSlide = sinon.stub();
      mockSlick.setSlideClasses = sinon.stub();
      mockSlick.updateDots = sinon.stub();
      mockSlick.updateArrows = sinon.stub();
      mockSlick.fadeSlide = (slide, callback) => {
        callback.call(mockSlick)
      };
      sinon.spy(mockSlick, 'fadeSlide');
      mockSlick.fadeSlideOut = sinon.stub();
      mockSlick.currentSlide = 1;
      mockSlick.currentLeft = 0;
      mockSlick.swipeLeft = null;
      mockSlick.getLeft = (index) => {
        return index * 200;
      };
      mockSlick.getDotCount = () => {
        return 2
      };
      mockSlick.slideCount = 6;
      mockSlick.options = {
        infinite: false,
        centerMode: false,
        fade: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        waitForAnimate: false
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('call return if animating is true and waitForAnimate is true', () => {
      mockSlick.animating = true;
      mockSlick.options.waitForAnimate = true;
      core.slideHandler.call(mockSlick, 3);
      expect(mockSlick.animateSlide).to.not.have.been.called;
    });

    it('call return if fade is true and you navigate to the current slide', () => {
      mockSlick.options.fade = true;
      core.slideHandler.call(mockSlick, 1);
      expect(mockSlick.animateSlide).to.not.have.been.called;
    });

    it('call return if slideCount <= slidesToShow', () => {
      mockSlick.slideCount = 3;
      core.slideHandler.call(mockSlick, 1);
      expect(mockSlick.animateSlide).to.not.have.been.called;
    });

    it('not call asNavFor if sync is true', () => {
      core.slideHandler.call(mockSlick, 1, true);
      expect(mockSlick.asNavFor).to.not.have.been.called;
    });

    it('call slideHandler by default', () => {
      core.slideHandler.call(mockSlick, 3);
      expect(mockSlick.animateSlide).to.have.been.calledWith(600);
    });

    it('infinite=false, centerMode=false, fade=true & out of range', () => {
      mockSlick.options.fade = true;
      core.slideHandler.call(mockSlick, -1);
      expect(mockSlick.animateSlide).to.not.have.been.called;
    });

    it('infinite=false, centerMode=false, fade=false, dontAnimate=true & out of range', () => {
      core.slideHandler.call(mockSlick, -1, true, true);
      expect(mockSlick.postSlide).to.have.been.calledWith(1);
    });

    it('infinite=false, centerMode=false, fade=false, dontAnimate=false & out of range', () => {
      core.slideHandler.call(mockSlick, -1);
      expect(mockSlick.animateSlide).to.have.been.calledWith(200);
    });

    it('infinite=false, centerMode=true, fade=true & out of range', () => {
      mockSlick.options.fade = true;
      core.slideHandler.call(mockSlick, -1);
      expect(mockSlick.animateSlide).to.not.have.been.called;
    });

    it('infinite=false, centerMode=true, fade=false, dontAnimate=false & out of range', () => {
      mockSlick.options.centerMode = true;
      core.slideHandler.call(mockSlick, -1);
      expect(mockSlick.animateSlide).to.have.been.calledWith(200);
    });

    it('infinite=false, centerMode=true, fade=false, dontAnimate=true & out of range', () => {
      mockSlick.options.centerMode = true;
      core.slideHandler.call(mockSlick, -1, true, true);
      expect(mockSlick.postSlide).to.have.been.calledWith(1);
    });

    it('should call clearInterval if autoplay=true', () => {
      clearIntervalStub = sinon.stub(window, 'clearInterval');
      mockSlick.options.autoplay = true;
      core.slideHandler.call(mockSlick, 1);
      expect(clearIntervalStub).to.have.been.called;
      clearIntervalStub.restore();
    });

    it('infinite=true,target < 0, slideCount % slidesToScroll !== 0', () => {
      mockSlick.options.infinite = true;
      core.slideHandler.call(mockSlick, -1, true, true);
      expect(mockSlick.postSlide).to.have.been.calledWith(5);
    });

    it('infinite=true,target < 0, slideCount % slidesToScroll === 0', () => {
      mockSlick.slideCount = 7;
      mockSlick.options.infinite = true;
      core.slideHandler.call(mockSlick, -1, true, true);
      expect(mockSlick.postSlide).to.have.been.calledWith(6);
    });

    it('infinite=true,target >= slideCount, slideCount % slidesToScroll !== 0', () => {
      mockSlick.options.infinite = true;
      core.slideHandler.call(mockSlick, 7, true, true);
      expect(mockSlick.postSlide).to.have.been.calledWith(1);
    });

    it('infinite=true,target >= slideCount, slideCount % slidesToScroll === 0', () => {
      mockSlick.slideCount = 7;
      mockSlick.options.infinite = true;
      core.slideHandler.call(mockSlick, 8, true, true);
      expect(mockSlick.postSlide).to.have.been.calledWith(0);
    });

    it('should call the necessary methods by default', () => {
      core.slideHandler.call(mockSlick, 1);
      expect(mockSlick.setSlideClasses).to.have.been.calledWith(1);
      expect(mockSlick.updateDots).to.have.been.called;
      expect(mockSlick.updateArrows).to.have.been.called;
    });

    it('should call animateHeight and postSlide if fade=true, infinite=true', () => {
      mockSlick.options.fade = true;
      mockSlick.options.infinite = true;
      core.slideHandler.call(mockSlick, 3);
      expect(mockSlick.animateHeight).to.have.been.called;
    });

    it('fade=true, dontAnimate=false, infinite=true', () => {
      mockSlick.options.fade = true;
      mockSlick.options.infinite = true;
      core.slideHandler.call(mockSlick, 3);
      expect(mockSlick.fadeSlideOut).to.have.been.calledWith(1);
      expect(mockSlick.fadeSlide).to.have.been.calledWith(3);
    });

    it('fade=true, dontAnimate=true, infinite=true', () => {
      mockSlick.options.fade = true;
      mockSlick.options.infinite = true;
      core.slideHandler.call(mockSlick, 3, true, true);
      expect(mockSlick.postSlide).to.have.been.calledWith(3);
    });

  });

  describe('visibility', () => {

    beforeEach(() => {
      mockSlick.autoPlay = sinon.stub();
      mockSlick.autoPlayClear = sinon.stub();
      mockSlick.paused = false;
      mockSlick.options = {
        autoplay: false
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('set paused to true if the document is hidden and clear autoPlay', () => {
      document.hidden = true;
      core.visibility.call(mockSlick);
      expect(mockSlick.paused).to.equal(true);
      expect(mockSlick.autoPlayClear).to.have.been.called;
    });

    it('set paused to false if the document is hidden and start autoPlay if valid', () => {
      document.hidden = false;
      mockSlick.options.autoplay = true;
      core.visibility.call(mockSlick);
      expect(mockSlick.paused).to.equal(false);
      expect(mockSlick.autoPlay).to.have.been.called;
    });

  });

});
