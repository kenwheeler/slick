'use strict';

import '../helpers/setup';

import actions from "../../src/actions";

describe('Actions', () => {

  let mockSlick = {};

  describe('goTo', () => {

    before(() => {
      mockSlick.changeSlide = sinon.stub();
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
      mockSlick.changeSlide = sinon.stub();
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
      mockSlick.autoPlayClear = sinon.stub();
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
      mockSlick.autoPlay = sinon.stub();
      actions.play.call(mockSlick);
    });

    after(() => {
      mockSlick = {};
    });

    it('should call autoPlay', () => {
      expect(mockSlick.autoPlay).to.have.been.called;
    });

    it('should set paused to false', () => {
      expect(mockSlick.paused).to.equal(false);
    });

  });

  describe('prev', () => {

    before(() => {
      mockSlick.changeSlide = sinon.stub();
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
