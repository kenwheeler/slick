'use strict';

import '../helpers/setup';

import autoplay from "../../src/autoplay";

describe('Autoplay', () => {

  let mockSlick = {}, clock, clearIntervalStub, setIntervalStub;

  describe('autoPlay', () => {

    before(() => {
      mockSlick.autoPlayIterator = sinon.stub();
    });

    after(() => {
      mockSlick = {};
    });

    it('should call clearInterval if a timer exists', () => {
      mockSlick.slideCount = 3;
      mockSlick.paused = true;
      mockSlick.autoPlayTimer = 1;
      mockSlick.options = {
        slidesToShow: 3
      };
      clearIntervalStub = sinon.stub(window, 'clearInterval');
      autoplay.autoPlay.call(mockSlick);
      expect(clearIntervalStub).to.have.been.calledWith(1);
      clearIntervalStub.restore();
    });

    it('should not call clearInterval if a timer doesnt exist', () => {
      mockSlick.slideCount = 3;
      mockSlick.paused = true;
      mockSlick.autoPlayTimer = null;
      mockSlick.options = {
        slidesToShow: 3
      };
      clearIntervalStub = sinon.stub(window, 'clearInterval');
      autoplay.autoPlay.call(mockSlick);
      expect(clearIntervalStub).to.not.have.been.called;
      clearIntervalStub.restore();
    });

    it('should call setInterval slideCount > slidesToShow and paused === false', () => {
      mockSlick.slideCount = 3;
      mockSlick.paused = false;
      mockSlick.autoPlayTimer = 1;
      mockSlick.autoPlayIterator = 1;
      mockSlick.options = {
        slidesToShow: 1,
        autoplaySpeed: 300
      };
      setIntervalStub = sinon.stub(window, 'setInterval');
      autoplay.autoPlay.call(mockSlick);
      expect(setIntervalStub).to.have.been.calledWith(1, 300);
      setIntervalStub.restore();
    });

    it('should not call setInterval if slideCount <= slidesToShow', () => {
      mockSlick.slideCount = 3;
      mockSlick.paused = false;
      mockSlick.autoPlayTimer = 1;
      mockSlick.autoPlayIterator = 1;
      mockSlick.options = {
        slidesToShow: 3,
        autoplaySpeed: 300
      };
      setIntervalStub = sinon.stub(window, 'setInterval');
      autoplay.autoPlay.call(mockSlick);
      expect(setIntervalStub).to.not.have.been.called;
      setIntervalStub.restore();
    });

    it('should not call setInterval if paused === true', () => {
      mockSlick.slideCount = 3;
      mockSlick.paused = true;
      mockSlick.autoPlayTimer = 1;
      mockSlick.autoPlayIterator = 1;
      mockSlick.options = {
        slidesToShow: 1,
        autoplaySpeed: 300
      };
      setIntervalStub = sinon.stub(window, 'setInterval');
      autoplay.autoPlay.call(mockSlick);
      expect(setIntervalStub).to.not.have.been.called;
      setIntervalStub.restore();
    });

  });

  describe('autoPlayClear', () => {

    before(() => {
      mockSlick.autoPlayIterator = sinon.stub();
    });

    after(() => {
      mockSlick = {};
    });

    it('should call clearInterval if a timer exists', () => {
      mockSlick.autoPlayTimer = 1;
      clearIntervalStub = sinon.stub(window, 'clearInterval');
      autoplay.autoPlayClear.call(mockSlick);
      expect(clearIntervalStub).to.have.been.calledWith(1);
      clearIntervalStub.restore();
    });

    it('should not call clearInterval if a timer doesnt exist', () => {
      mockSlick.autoPlayTimer = null;
      clearIntervalStub = sinon.stub(window, 'clearInterval');
      autoplay.autoPlayClear.call(mockSlick);
      expect(clearIntervalStub).to.not.have.been.called;
      clearIntervalStub.restore();
    });

  });

  describe('autoPlayIterator', () => {

    after(() => {
      mockSlick = {};
    });

    it('should call slideHandler with currentSlide + slidesToScroll if infinite is true', () => {
      mockSlick.direction = 1;
      mockSlick.currentSlide = 0;
      mockSlick.slideHandler = sinon.stub();
      mockSlick.options = {
        infinite: true,
        slidesToScroll: 3
      };
      autoplay.autoPlayIterator.call(mockSlick);
      expect(mockSlick.slideHandler).to.have.been.calledWith(3);
    });

    it('should call slideHandler with currentSlide + slidesToScroll if infinite is true and direction = 1', () => {
      mockSlick.direction = 1;
      mockSlick.currentSlide = 0;
      mockSlick.slideHandler = sinon.stub();
      mockSlick.options = {
        infinite: false,
        slidesToScroll: 3
      };
      autoplay.autoPlayIterator.call(mockSlick);
      expect(mockSlick.slideHandler).to.have.been.calledWith(3);
    });

    it('should call slideHandler with currentSlide - slidesToScroll if infinite is true and direction = 0', () => {
      mockSlick.direction = 0;
      mockSlick.currentSlide = 0;
      mockSlick.slideHandler = sinon.stub();
      mockSlick.options = {
        infinite: false,
        slidesToScroll: 3
      };
      autoplay.autoPlayIterator.call(mockSlick);
      expect(mockSlick.slideHandler).to.have.been.calledWith(-3);
    });

    it('should reverse the direction if currentSlide - 1 = 0 and direction = 0', () => {
      mockSlick.direction = 0;
      mockSlick.currentSlide = 1;
      mockSlick.slideHandler = sinon.stub();
      mockSlick.options = {
        infinite: false,
        slidesToScroll: 3
      };
      autoplay.autoPlayIterator.call(mockSlick);
      expect(mockSlick.direction).to.equal(1);
    });

    it('should reverse the direction if currentSlide + 1 = slideCount and direction = 1', () => {
      mockSlick.direction = 1;
      mockSlick.currentSlide = 1;
      mockSlick.slideCount = 3;
      mockSlick.slideHandler = sinon.stub();
      mockSlick.options = {
        infinite: false,
        slidesToScroll: 3
      };
      autoplay.autoPlayIterator.call(mockSlick);
      expect(mockSlick.direction).to.equal(0);
    });

  });

});
