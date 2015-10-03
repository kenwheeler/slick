'use strict';

import '../helpers/setup';

import events from "../../src/events";

describe('Events', () => {

  let mockSlick = {};

  describe('cleanUpEvents', () => {

    beforeEach(() => {
      mockSlick.slideCount = 6;
      mockSlick.swipeHandler = null;
      mockSlick.changeSlide = null;
      mockSlick.setPaused = null;
      mockSlick.keyHandler = null;
      mockSlick.selectHandler = null;
      mockSlick.resize = null;
      mockSlick.setPosition = null;
      mockSlick.preventDefault = null;
      mockSlick.orientationChange = null;
      mockSlick.visibility = null;
      mockSlick.visibilityChange = 'hidden';
      mockSlick.instanceUid = 1;
      mockSlick.$dots = null;
      mockSlick.$prevArrow = null;
      mockSlick.$nextArrow = null;
      mockSlick.$list = null;
      mockSlick.$slideTrack = null;
      mockSlick.options = {
        dots: false,
        pauseOnDotsHover: false,
        autoplay: false,
        arrows: false,
        slidesToShow: 3
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('', () => {
      events.cleanUpEvents.call(mockSlick);
      expect().to.equal(0);
    });

  });

});
