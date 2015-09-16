'use strict';

import actions from "../../src/actions";
import generateSlides from '../helpers/generate-slides';

describe('Actions', () => {

  let mockSlick = {};

  describe('goTo', () => {

    before(() => {
      mockSlick.changeSlide = sinon.spy();
      actions.goTo.call(mockSlick, 1, true);
    });

    after(() => {
      mockSlick = {};
    });

    it('should call changeSlide with the right data', () => {
      expect(mockSlick.changeSlide).to.have.been.calledWith({
        data: {
          message: 'index',
          index: 1
        }
      });
    }, true);

  });

  describe('next', () => {

    before(() => {
      mockSlick.changeSlide = sinon.spy();
      actions.next.call(mockSlick);
    });

    after(() => {
      mockSlick = {};
    });

    it('should call changeSlide with the right data', () => {
      expect(mockSlick.changeSlide).to.have.been.calledWith({
        data: {
          message: 'next'
        }
      });
    });

  });

  describe('pause', () => {

    before(() => {
      mockSlick.autoPlayClear = sinon.spy();
      actions.pause.call(mockSlick);
    });

    after(() => {
      mockSlick = {};
    });

    it('should call autoPlayClear', () => {
      expect(mockSlick.autoPlayClear).to.have.been.called;
    });

    it('should set paused to true', () => {
      expect(mockSlick.paused).to.equal(true);
    });

  });

  describe('play', () => {

    before(() => {
      mockSlick.autoPlay = sinon.spy();
      actions.play.call(mockSlick);
    });

    after(() => {
      mockSlick = {};
    });

    it('should call autoPlay', () => {
      expect(mockSlick.autoPlay).to.have.been.called;
    });

    it('should set paused to falase', () => {
      expect(mockSlick.paused).to.equal(false);
    });

  });

  describe('prev', () => {

    before(() => {
      mockSlick.changeSlide = sinon.spy();
      actions.prev.call(mockSlick);
    });

    after(() => {
      mockSlick = {};
    });

    it('should call changeSlide with the right data', () => {
      expect(mockSlick.changeSlide).to.have.been.calledWith({
        data: {
          message: 'previous'
        }
      });
    });

  });

});