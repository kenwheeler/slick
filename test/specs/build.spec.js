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

    it('add the draggable class if draggable=true', () => {
      mockSlick.options.draggable = true;
      build.buildOut.call(mockSlick);
      expect(mockSlick.$list.hasClass('draggable')).to.be.true;
    });

  });

  describe('destroy', () => {

    beforeEach(() => {
      mockSlick.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
      mockSlick.$slider = $('<div class="slick-slider slick-initialized"/>');
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.$list = $('<div/>');
      mockSlick.$slideTrack.append(
        $('<div aria-hidden="false" data-slick-index="0" class="slick-slide slick-active slick-center slick-visible slick-current" style="height: 200px"/>')
          .data('originalStyling', 'height: 200px;')
      );
      mockSlick.$prevArrow = $('<div class="slick-disabled"/>');
      mockSlick.$nextArrow = $('<div class="slick-disabled"/>');
      mockSlick.$dots = $('<div class="slick-dots"/>');
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
      mockSlick.$slider.append(mockSlick.$dots);
      build.destroy.call(mockSlick);
      expect(mockSlick.$slider.find('.slick-dots').length).to.equal(0);
    });

    it('should remove arrow classes', () => {
      mockSlick.$slider.append(mockSlick.$prevArrow);
      mockSlick.$slider.append(mockSlick.$nextArrow);
      build.destroy.call(mockSlick);
      expect(mockSlick.$slider.find('.slick-arrow').length).to.equal(0);
    });

    it('should remove arrows if they are html strings', () => {
      mockSlick.$slider.append(mockSlick.$prevArrow);
      mockSlick.$slider.append(mockSlick.$nextArrow);
      mockSlick.options.nextArrow= "<div></div>";
      mockSlick.options.prevArrow= "<div></div>";
      build.destroy.call(mockSlick);
      expect($(mockSlick.$slider).find(mockSlick.$prevArrow).length).to.equal(0);
      expect($(mockSlick.$slider).find(mockSlick.$nextArrow).length).to.equal(0);
    });

    it('should not remove arrows if they arent html strings', () => {
      mockSlick.$slider.append(mockSlick.$prevArrow);
      mockSlick.$slider.append(mockSlick.$nextArrow);
      build.destroy.call(mockSlick);
      expect($(mockSlick.$slider).find(mockSlick.$prevArrow).length).to.equal(1);
      expect($(mockSlick.$slider).find(mockSlick.$nextArrow).length).to.equal(1);
    });

    it('should remove data from slides', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.$slides.eq(0).hasClass('.slick-slide')).to.be.false;
    });

    it('should put the original slides back', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.$slider.children().length).to.equal(1);
    });

    it('should restore original styling', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.$slides.eq(0).attr('style')).to.equal('height: 200px;');
    });

    it('should call cleanUpRows', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.cleanUpRows).to.have.been.called;
    });

    it('should remove slider classes', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.$slider.hasClass('.slick-slider')).to.be.false;
      expect(mockSlick.$slider.hasClass('.slick-initialized')).to.be.false;
    });

    it('should set unslicked to true', () => {
      build.destroy.call(mockSlick);
      expect(mockSlick.unslicked).to.be.true;
    });

    it('should not trigger an event if refresh is true', () => {
      mockSlick.$slider.trigger = sinon.stub();
      build.destroy.call(mockSlick, true);
      expect(mockSlick.$slider.trigger).to.not.have.been.called;
    });

    it('should trigger an event if refresh is false', () => {
      mockSlick.$slider.trigger = sinon.stub();
      build.destroy.call(mockSlick, false);
      expect(mockSlick.$slider.trigger).to.have.been.called;
    });

  });

  describe('init', () => {

    beforeEach(() => {
      mockSlick.$slider = $('<div class="slick-slider slick-initialized"/>');
      mockSlick.buildRows = sinon.stub();
      mockSlick.buildOut = sinon.stub();
      mockSlick.setProps = sinon.stub();
      mockSlick.startLoad = sinon.stub();
      mockSlick.loadSlider = sinon.stub();
      mockSlick.initializeEvents = sinon.stub();
      mockSlick.updateArrows = sinon.stub();
      mockSlick.updateDots = sinon.stub();
      mockSlick.callback = sinon.stub();
      mockSlick.initADA = sinon.stub();
      mockSlick.options = {
        accessibility: true
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should call the setup methods if the slider hasnt been initialized', () => {
      mockSlick.$slider.removeClass('slick-initialized');
      build.init.call(mockSlick);
      expect(mockSlick.buildRows).to.have.been.called;
      expect(mockSlick.buildOut).to.have.been.called;
      expect(mockSlick.setProps).to.have.been.called;
      expect(mockSlick.startLoad).to.have.been.called;
      expect(mockSlick.loadSlider).to.have.been.called;
      expect(mockSlick.initializeEvents).to.have.been.called;
      expect(mockSlick.updateArrows).to.have.been.called;
      expect(mockSlick.updateDots).to.have.been.called;
      expect(mockSlick.callback).to.have.been.called;
    });

    it('should not call the setup methods if the slider has been initialized', () => {
      build.init.call(mockSlick);
      expect(mockSlick.buildRows).to.not.have.been.called;
      expect(mockSlick.buildOut).to.not.have.been.called;
      expect(mockSlick.setProps).to.not.have.been.called;
      expect(mockSlick.startLoad).to.not.have.been.called;
      expect(mockSlick.loadSlider).to.not.have.been.called;
      expect(mockSlick.initializeEvents).to.not.have.been.called;
      expect(mockSlick.updateArrows).to.not.have.been.called;
      expect(mockSlick.updateDots).to.not.have.been.called;
      expect(mockSlick.callback).to.not.have.been.called;
    });

    it('should trigger an event if creation is true', () => {
      mockSlick.$slider.trigger = sinon.stub();
      build.init.call(mockSlick, true);
      expect(mockSlick.$slider.trigger).to.have.been.called;
    });

    it('should call initADA if accessibility is true', () => {
      build.init.call(mockSlick, true);
      expect(mockSlick.initADA).to.have.been.called;
    });

  });

  describe('initUI', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.$prevArrow = {
        show: sinon.stub()
      };
      mockSlick.$nextArrow = {
        show: sinon.stub()
      };
      mockSlick.$dots = {
        show: sinon.stub()
      };
      mockSlick.slideCount = 6;
      mockSlick.options = {
        dots: true,
        arrows: true,
        slidesToShow: 3,
        autoplay: false
      };
      mockSlick.autoPlay = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should show arrows if arrows===true and there are more slides than shown', () => {
      build.initUI.call(mockSlick);
      expect(mockSlick.$prevArrow.show).to.have.been.called;
      expect(mockSlick.$nextArrow.show).to.have.been.called;
    });

    it('should not show arrows if arrows===false and there are more slides than shown', () => {
      mockSlick.options.arrows = false;
      build.initUI.call(mockSlick);
      expect(mockSlick.$prevArrow.show).to.not.have.been.called;
      expect(mockSlick.$nextArrow.show).to.not.have.been.called;
    });

    it('should not show arrows if arrows===true and there arent more slides than shown', () => {
      mockSlick.slideCount = 3;
      build.initUI.call(mockSlick);
      expect(mockSlick.$prevArrow.show).to.not.have.been.called;
      expect(mockSlick.$nextArrow.show).to.not.have.been.called;
    });

    it('should show dots if dots===true and there are more slides than shown', () => {
      build.initUI.call(mockSlick);
      expect(mockSlick.$dots.show).to.have.been.called;
    });

    it('should not show dots if dots===false and there are more slides than shown', () => {
      mockSlick.options.dots = false;
      build.initUI.call(mockSlick);
      expect(mockSlick.$dots.show).to.not.have.been.called;
    });

    it('should not show dots if dots===true and there arent more slides than shown', () => {
      mockSlick.slideCount = 3;
      build.initUI.call(mockSlick);
      expect(mockSlick.$dots.show).to.not.have.been.called;
    });

    it('should call autoPlay if autoplay = true', () => {
      mockSlick.options.autoplay = true;
      build.initUI.call(mockSlick);
      expect(mockSlick.autoPlay).to.have.been.called;
    });

  });

  describe('loadSlider', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.options = {
        lazyLoad: false
      };
      mockSlick.$slider = $('<div class="slick-loading"/>');
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.setPosition = sinon.stub();
      mockSlick.initUI = sinon.stub();
      mockSlick.progressiveLazyLoad = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should call setPosition', () => {
      build.loadSlider.call(mockSlick);
      expect(mockSlick.setPosition).to.have.been.called;
    });

    it('should set opacity 1 on slideTrack', () => {
      build.loadSlider.call(mockSlick);
      expect(mockSlick.$slideTrack.css('opacity')).to.equal('1');
    });

    it('should remove the slick-loading class', () => {
      build.loadSlider.call(mockSlick);
      expect(mockSlick.$slider.hasClass('slick-loading')).to.be.false;
    });

    it('should call initUI', () => {
      build.loadSlider.call(mockSlick);
      expect(mockSlick.initUI).to.have.been.called;
    });

    it('should call progressiveLazyLoad if lazyLoad=progressive', () => {
      mockSlick.options.lazyLoad = "progressive";
      build.loadSlider.call(mockSlick);
      expect(mockSlick.progressiveLazyLoad).to.have.been.called;
    });

  });

  describe('refresh', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.currentSlide = 0;
      mockSlick.initials = {};
      mockSlick.slideCount = 6;
      mockSlick.options = {
        slidesToShow: 3,
        infinite: false
      };
      mockSlick.init = sinon.stub();
      mockSlick.destroy = sinon.stub();
      mockSlick.changeSlide = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should set current slide to 0 if infinite=false and currentSlide isnt out of bounds', () => {
      build.refresh.call(mockSlick);
      expect(mockSlick.currentSlide).to.equal(0);
    });

    it('should set current slide to the 0 if infinite=false and slidesToShow >= slideCount', () => {
      mockSlick.slideCount = 3;
      build.refresh.call(mockSlick);
      expect(mockSlick.currentSlide).to.equal(0);
    });

    it('should set current slide to the first visible if infinite=false and currentSlide is out of bounds', () => {
      mockSlick.currentSlide = 4;
      build.refresh.call(mockSlick);
      expect(mockSlick.currentSlide).to.equal(3);
    });

    it('should call destroy', () => {
      build.refresh.call(mockSlick);
      expect(mockSlick.destroy).to.have.been.called;
    });

    it('should call init', () => {
      build.refresh.call(mockSlick);
      expect(mockSlick.init).to.have.been.called;
    });

    it('should call changeSlide if initializing is false', () => {
      build.refresh.call(mockSlick, false);
      expect(mockSlick.changeSlide).to.have.been.calledWith({
        data: {
          message: 'index',
          index: 0
        }
      }, false);
    });

    it('should not call changeSlide if initializing is true', () => {
      build.refresh.call(mockSlick, true);
      expect(mockSlick.changeSlide).to.not.have.been.called;
    });

  });

  describe('reinit', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.$slider = {
        trigger: sinon.stub()
      };
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.$slideTrack.append(
        $('<div/>')
      );
      mockSlick.slideCount = 6;
      mockSlick.registerBreakpoints = sinon.stub();
      mockSlick.setProps = sinon.stub();
      mockSlick.setupInfinite = sinon.stub();
      mockSlick.buildArrows = sinon.stub();
      mockSlick.updateArrows = sinon.stub();
      mockSlick.initArrowEvents = sinon.stub();
      mockSlick.buildDots = sinon.stub();
      mockSlick.updateDots = sinon.stub();
      mockSlick.initDotEvents = sinon.stub();
      mockSlick.checkResponsive = sinon.stub();
      mockSlick.setSlideClasses = sinon.stub();
      mockSlick.setPosition = sinon.stub();
      mockSlick.focusHandler = sinon.stub();
      mockSlick.options = {
        autoplay: false,
        focusOnSelect: false,
        slide: '',
        slidesToShow: 3,
        slidesToScroll: 3
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should add the slick-slide class to slides', () => {
      build.reinit.call(mockSlick);
      expect(mockSlick.$slides.eq(0).hasClass('slick-slide')).to.be.true;
    });

    it('should call the right default methods', () => {
      build.reinit.call(mockSlick);
      expect(mockSlick.registerBreakpoints).to.have.been.called;
      expect(mockSlick.setProps).to.have.been.called;
      expect(mockSlick.setupInfinite).to.have.been.called;
      expect(mockSlick.buildArrows).to.have.been.called;
      expect(mockSlick.updateArrows).to.have.been.called;
      expect(mockSlick.initArrowEvents).to.have.been.called;
      expect(mockSlick.buildDots).to.have.been.called;
      expect(mockSlick.updateDots).to.have.been.called;
      expect(mockSlick.initDotEvents).to.have.been.called;
      expect(mockSlick.checkResponsive).to.have.been.called;
      expect(mockSlick.setSlideClasses).to.have.been.called;
      expect(mockSlick.setPosition).to.have.been.called;
      expect(mockSlick.$slider.trigger).to.have.been.calledWith('reInit', [mockSlick]);
    });

    it('should set currentSlide to the last index if it exceeds the slideCount', () => {
      mockSlick.currentSlide = 4;
      mockSlick.$slideTrack.append(
        $('<div/>'),
        $('<div/>'),
        $('<div/>')
      );
      build.reinit.call(mockSlick);
      expect(mockSlick.currentSlide).to.equal(1);
    });


    it('should set currentSlide 0 if there is only one navigable index', () => {
      mockSlick.options.slidesToShow = 6;
      build.reinit.call(mockSlick);
      expect(mockSlick.currentSlide).to.equal(0);
    });

    it('should add selectHandler if focusOnSelect=true', () => {
      mockSlick.options.focusOnSelect = true;
      mockSlick.selectHandler = sinon.stub();
      build.reinit.call(mockSlick);
      mockSlick.$slides.eq(0).trigger('click.slick');
      expect(mockSlick.selectHandler).to.have.been.called;
    });

    it('should call focusHandler if autoplay=true', () => {
      mockSlick.options.autoplay = true;
      build.reinit.call(mockSlick);
      expect(mockSlick.focusHandler).to.have.been.called;
    });

  });

  describe('setupInfinite', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.$slideTrack.append(
        $('<div/>'),
        $('<div/>'),
        $('<div/>'),
        $('<div/>'),
        $('<div/>'),
        $('<div/>')
      );
      mockSlick.$slides = mockSlick.$slideTrack.children();
      mockSlick.slideCount = 6;
      mockSlick.options = {
        fade: false,
        infinite: true,
        slidesToShow: 3,
        centerMode: false
      };
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('not do anything if infinite is false', () => {
      mockSlick.options.infinite = false;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.$slideTrack.find('.slick-cloned').length).to.equal(0);
    });

    it('not do anything if fade is true', () => {
      mockSlick.options.fade = true;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.$slideTrack.find('.slick-cloned').length).to.equal(0);
    });

    it('not do anything if there is only one slide index', () => {
      mockSlick.slideCount = 2;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.$slideTrack.find('.slick-cloned').length).to.equal(0);
    });

    it('generate clones if there are navigable indexes', () => {
      mockSlick.slideCount = 6;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.$slideTrack.find('.slick-cloned').length).to.equal(6);
    });

    it('should set centerMode to false if fade is true', () => {
      mockSlick.options.fade = true;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.options.centerMode).to.be.false;
    });

    it('should not mutate centerMode if fade is false', () => {
      mockSlick.options.fade = false;
      mockSlick.options.centerMode = true;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.options.centerMode).to.be.true;
    });

    it('should generate the right amount of clones with centerMode false', () => {
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.$slideTrack.children().length).to.equal(12);
    });

    it('should generate the right amount of clones with centerMode true', () => {
      mockSlick.options.centerMode = true;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.$slideTrack.children().length).to.equal(14);
    });

    it('should strip IDs from clones', () => {
      mockSlick.$slideTrack.children().eq(0).attr('id', 'test');
      mockSlick.options.infinite = true;
      build.setupInfinite.call(mockSlick);
      expect(mockSlick.$slideTrack.find('[id=test]').length).to.equal(1);
    });

  });

  describe('startLoad', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.$slider = $('<div/>');
      mockSlick.$prevArrow = {
        hide: sinon.stub()
      };
      mockSlick.$nextArrow = {
        hide: sinon.stub()
      };
      mockSlick.$dots = {
        hide: sinon.stub()
      };
      mockSlick.slideCount = 6;
      mockSlick.options = {
        dots: true,
        arrows: true,
        slidesToShow: 3,
        autoplay: false
      };
      mockSlick.autoPlay = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should hide arrows if arrows===true and there are more slides than shown', () => {
      build.startLoad.call(mockSlick);
      expect(mockSlick.$prevArrow.hide).to.have.been.called;
      expect(mockSlick.$nextArrow.hide).to.have.been.called;
    });

    it('should not hide arrows if arrows===false and there are more slides than shown', () => {
      mockSlick.options.arrows = false;
      build.startLoad.call(mockSlick);
      expect(mockSlick.$prevArrow.hide).to.not.have.been.called;
      expect(mockSlick.$nextArrow.hide).to.not.have.been.called;
    });

    it('should not hide arrows if arrows===true and there arent more slides than shown', () => {
      mockSlick.slideCount = 3;
      build.startLoad.call(mockSlick);
      expect(mockSlick.$prevArrow.hide).to.not.have.been.called;
      expect(mockSlick.$nextArrow.hide).to.not.have.been.called;
    });

    it('should hide dots if dots===true and there are more slides than shown', () => {
      build.startLoad.call(mockSlick);
      expect(mockSlick.$dots.hide).to.have.been.called;
    });

    it('should not hide dots if dots===false and there are more slides than shown', () => {
      mockSlick.options.dots = false;
      build.startLoad.call(mockSlick);
      expect(mockSlick.$dots.hide).to.not.have.been.called;
    });

    it('should not hide dots if dots===true and there arent more slides than shown', () => {
      mockSlick.slideCount = 3;
      build.startLoad.call(mockSlick);
      expect(mockSlick.$dots.hide).to.not.have.been.called;
    });

    it('should add the slick-loading class to the slider', () => {
      build.startLoad.call(mockSlick);
      expect(mockSlick.$slider.hasClass('slick-loading')).to.be.true;
    });

  });

  describe('startLoad', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
      mockSlick.$slider = $('<div/>');
      mockSlick.$slider.append(
        $('<div class="slick-cloned"/>'),
        $('<div/>')
      );
      mockSlick.$slides = mockSlick.$slider.children();
      mockSlick.$prevArrow = {
        remove: sinon.stub()
      };
      mockSlick.$nextArrow = {
        remove: sinon.stub()
      };
      mockSlick.$dots = {
        remove: sinon.stub()
      };
      mockSlick.slideCount = 6;
      mockSlick.options = {
        dots: true,
        arrows: true,
        slidesToShow: 3,
        autoplay: false
      };
      mockSlick.autoPlay = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should remove clones', () => {
      build.unload.call(mockSlick);
      expect(mockSlick.$slider.find('.slick-cloned').length).to.equal(0);
    });

    it('should remove dots if they exist', () => {
      build.unload.call(mockSlick);
      expect(mockSlick.$dots.remove).to.have.been.called;
    });

    it('should not remove dots if they dont exist', () => {
      let remove = mockSlick.$dots.remove;
      mockSlick.$dots = null;
      build.unload.call(mockSlick);
      expect(remove).to.not.have.been.called;
    });

    it('should remove prevArrow it exists and is an html string', () => {
      mockSlick.options.prevArrow = "<div></div>";
      build.unload.call(mockSlick);
      expect(mockSlick.$prevArrow.remove).to.have.been.called;
    });

    it('should not remove prevArrow if its not an html string', () => {
      mockSlick.options.prevArrow = null;
      build.unload.call(mockSlick);
      expect(mockSlick.$prevArrow.remove).to.not.have.been.called;
    });

    it('should remove nextArrow it exists and is an html string', () => {
      mockSlick.options.nextArrow = "<div></div>";
      build.unload.call(mockSlick);
      expect(mockSlick.$nextArrow.remove).to.have.been.called;
    });

    it('should not remove nextArrow if its not an html string', () => {
      mockSlick.options.nextArrow = null;
      build.unload.call(mockSlick);
      expect(mockSlick.$nextArrow.remove).to.not.have.been.called;
    });

    it('should remove classes from slides and aria-hidden them', () => {
      build.unload.call(mockSlick);
      expect(mockSlick.$slides.eq(0).attr('aria-hidden')).to.equal('true');
    });

  });

  describe('unslick', () => {

    let mockSlick = {};

    beforeEach(() => {
      mockSlick.$slider = {
        trigger: sinon.stub()
      };
      mockSlick.destroy = sinon.stub();
    });

    afterEach(() => {
      mockSlick = {};
    });

    it('should trigger the unslick event', () => {
      build.unslick.call(mockSlick, 1);
      expect(mockSlick.$slider.trigger).to.have.been.calledWith('unslick', [mockSlick, 1]);
    });

    it('should call destroy', () => {
      build.unslick.call(mockSlick, 1);
      expect(mockSlick.destroy).to.have.been.called;
    });

  });

});
