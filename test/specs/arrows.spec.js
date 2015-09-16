'use strict';

import '../helpers/setup';

import arrows from "../../src/arrows";

describe('Arrows', () => {

  let mockSlick = {};

  describe('buildArrows', () => {

    var container;

    beforeEach(() => {
      container = $('<div/>');
      mockSlick.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
    });

    afterEach(() => {
      mockSlick = {};
      container.empty();
    });

    it('should not build arrows if arrows=false', () => {
      mockSlick.slideCount = 3;
      mockSlick.options = {
        arrows: false,
        slidesToShow: 1,
        prevArrow: '<div/>',
        nextArrow: '<div/>',
        appendArrows: container,
        infinite: true
      };
      arrows.buildArrows.call(mockSlick);
      expect(container.children().length).to.equal(0);
    });

    it('should build arrows if arrows=true', () => {
      mockSlick.slideCount = 3;
      mockSlick.options = {
        arrows: true,
        slidesToShow: 1,
        prevArrow: '<div/>',
        nextArrow: '<div/>',
        appendArrows: container,
        infinite: true
      };
      arrows.buildArrows.call(mockSlick);
      expect(container.children().length).to.equal(2);
    });

    it('should add the slick-arrow class', () => {
      mockSlick.slideCount = 3;
      mockSlick.options = {
        arrows: true,
        slidesToShow: 1,
        prevArrow: '<div/>',
        nextArrow: '<div/>',
        appendArrows: container,
        infinite: true
      };
      arrows.buildArrows.call(mockSlick);
      expect(container.find('.slick-arrow').length).to.equal(2);
    });

    it('should hide arrows if slideCount <= slidesToShow', () => {
      mockSlick.slideCount = 3;
      mockSlick.options = {
        arrows: true,
        slidesToShow: 3,
        prevArrow: $('<div/>'),
        nextArrow: $('<div/>'),
        appendArrows: container,
        infinite: true
      };
      arrows.buildArrows.call(mockSlick);
      expect(mockSlick.options.prevArrow.hasClass('slick-hidden')).to.be.true;
      expect(mockSlick.options.nextArrow.hasClass('slick-hidden')).to.be.true;
      expect(mockSlick.options.prevArrow.attr('aria-disabled')).to.equal('true');
      expect(mockSlick.options.nextArrow.attr('aria-disabled')).to.equal('true');
      expect(mockSlick.options.prevArrow.attr('tabindex')).to.equal('-1');
      expect(mockSlick.options.nextArrow.attr('tabindex')).to.equal('-1');
    });

    it('should disable the prevArrow if infinite is false', () => {
      mockSlick.slideCount = 3;
      mockSlick.options = {
        arrows: true,
        slidesToShow: 1,
        prevArrow: $('<div/>'),
        nextArrow: $('<div/>'),
        appendArrows: container,
        infinite: false
      };
      arrows.buildArrows.call(mockSlick);
      expect(mockSlick.options.prevArrow.hasClass('slick-disabled')).to.be.true;
      expect(mockSlick.options.prevArrow.attr('aria-disabled')).to.equal('true');
    });

  });

  describe('updateArrows', () => {

    var container;

      beforeEach(() => {
        container = $('<div/>');
      });

      afterEach(() => {
        mockSlick = {};
        container.empty();
      });

      it('should not do anything if arrows=false', () => {
        mockSlick.slideCount = 3;
        mockSlick.$prevArrow = $('<div/>');
        mockSlick.$nextArrow = $('<div/>');
        mockSlick.options = {
          arrows: false,
          slidesToShow: 1,
          appendArrows: container,
          infinite: true
        };
        arrows.updateArrows.call(mockSlick);
        expect(mockSlick.$prevArrow.attr('aria-disabled')).to.be.undefined;
        expect(mockSlick.$nextArrow.attr('aria-disabled')).to.be.undefined;
        expect(mockSlick.$prevArrow.hasClass('slick-disabled')).to.be.false;
        expect(mockSlick.$nextArrow.hasClass('slick-disabled')).to.be.false;
      });

      it('should not do anything if slideCount <= slidesToShow', () => {
        mockSlick.slideCount = 3;
        mockSlick.$prevArrow = $('<div/>');
        mockSlick.$nextArrow = $('<div/>');
        mockSlick.options = {
          arrows: true,
          slidesToShow: 1,
          appendArrows: container,
          infinite: true
        };
        arrows.updateArrows.call(mockSlick);
        expect(mockSlick.$prevArrow.attr('aria-disabled')).to.be.undefined;
        expect(mockSlick.$nextArrow.attr('aria-disabled')).to.be.undefined;
        expect(mockSlick.$prevArrow.hasClass('slick-disabled')).to.be.false;
        expect(mockSlick.$nextArrow.hasClass('slick-disabled')).to.be.false;
      });

      it('should not do anything if infinite is true', () => {
        mockSlick.slideCount = 3;
        mockSlick.$prevArrow = $('<div/>');
        mockSlick.$nextArrow = $('<div/>');
        mockSlick.options = {
          arrows: true,
          slidesToShow: 1,
          appendArrows: container,
          infinite: true
        };
        arrows.updateArrows.call(mockSlick);
        expect(mockSlick.$prevArrow.attr('aria-disabled')).to.be.undefined;
        expect(mockSlick.$nextArrow.attr('aria-disabled')).to.be.undefined;
        expect(mockSlick.$prevArrow.hasClass('slick-disabled')).to.be.false;
        expect(mockSlick.$nextArrow.hasClass('slick-disabled')).to.be.false;
      });

      it('should enable next and disable prev if we are at the beginning', () => {
        mockSlick.slideCount = 3;
        mockSlick.currentSlide = 0;
        mockSlick.$prevArrow = $('<div/>');
        mockSlick.$nextArrow = $('<div/>');
        mockSlick.options = {
          arrows: true,
          slidesToShow: 1,
          appendArrows: container,
          infinite: false
        };
        arrows.updateArrows.call(mockSlick);
        expect(mockSlick.$prevArrow.attr('aria-disabled')).to.equal('true');
        expect(mockSlick.$nextArrow.attr('aria-disabled')).to.equal('false');
        expect(mockSlick.$prevArrow.hasClass('slick-disabled')).to.be.true;
        expect(mockSlick.$nextArrow.hasClass('slick-disabled')).to.be.false;
      });

      it('should enable prev and disable next if we are at the end', () => {
        mockSlick.slideCount = 3;
        mockSlick.currentSlide = 3;
        mockSlick.$prevArrow = $('<div/>');
        mockSlick.$nextArrow = $('<div/>');
        mockSlick.options = {
          arrows: true,
          slidesToShow: 1,
          appendArrows: container,
          infinite: false,
          centerMode: false
        };
        arrows.updateArrows.call(mockSlick);
        expect(mockSlick.$prevArrow.attr('aria-disabled')).to.equal('false');
        expect(mockSlick.$nextArrow.attr('aria-disabled')).to.equal('true');
        expect(mockSlick.$prevArrow.hasClass('slick-disabled')).to.be.false;
        expect(mockSlick.$nextArrow.hasClass('slick-disabled')).to.be.true;
      });

      it('should enable prev and disable next if we are at the end in centerMode', () => {
        mockSlick.slideCount = 3;
        mockSlick.currentSlide = 3;
        mockSlick.$prevArrow = $('<div/>');
        mockSlick.$nextArrow = $('<div/>');
        mockSlick.options = {
          arrows: true,
          slidesToShow: 1,
          appendArrows: container,
          infinite: false,
          centerMode: true
        };
        arrows.updateArrows.call(mockSlick);
        expect(mockSlick.$prevArrow.attr('aria-disabled')).to.equal('false');
        expect(mockSlick.$nextArrow.attr('aria-disabled')).to.equal('true');
        expect(mockSlick.$prevArrow.hasClass('slick-disabled')).to.be.false;
        expect(mockSlick.$nextArrow.hasClass('slick-disabled')).to.be.true;
      });

  });

});