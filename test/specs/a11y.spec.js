'use strict';

import a11y from "../../src/a11y";
import generateSlides from '../helpers/generate-slides';

describe('Accessibility', () => {

  let mockSlick = {};

  describe('activateADA', () => {

    var activeSlide, input;

    before(() => {
      mockSlick.$slideTrack = $('<div/>');
      activeSlide = $('<div class="slick-active"/>');
      input = $('<input type="text"/>');
      activeSlide.append(input);
      mockSlick.$slideTrack.append(activeSlide);
      a11y.activateADA.call(mockSlick);
    });

    after(() => {
      mockSlick = {};
    });

    it('should remove aria-hidden=false from the active slide', () => {
      expect(activeSlide.attr('aria-hidden')).to.equal('false');
    });

    it('should add tabindex=0 to any a,input,button or select', () => {
      expect(input.attr('tabindex')).to.equal('0');
    });

  });

  describe('initADA', () => {

    var input, dot, button;

    before(() => {
      mockSlick = {};
      input = $('<input/>');
      dot = $('<li/>');
      button = $('<button/>');
      dot.append(button);
      mockSlick.$slides = $($.map([
        $('<div class="slick-cloned"/>'),
        $('<div/>'),
        $('<div/>'),
        $('<div class="slick-cloned"/>')
      ], (el) => {
        return $.makeArray(el);
      }));
      mockSlick.$slides.eq(1).append(input);
      mockSlick.$slideTrack = $('<div/>');
      mockSlick.$slideTrack.append(mockSlick.$slides);
      mockSlick.instanceUid = 1;
      mockSlick.$dots = $('<ul/>');
      mockSlick.$dots.append(dot);
      mockSlick.activateADA = sinon.spy();
      a11y.initADA.call(mockSlick);
    });

    after(() => {
      mockSlick = {};
    });

    it('should add aria-hidden=true to all slides', () => {
      expect(mockSlick.$slides.eq(0).attr('aria-hidden')).to.equal('true');
      expect(mockSlick.$slides.eq(1).attr('aria-hidden')).to.equal('true');
    });

    it('should add tabindex=-1 to all slides', () => {
      expect(mockSlick.$slides.eq(0).attr('tabindex')).to.equal('-1');
    });

    it('should add tabindex=-1 to any input or anchor children of cloned slides', () => {
      expect(input.attr('tabindex')).to.equal('-1');
    });

    it('should add role=listbox to $slideTrack', () => {
      expect(mockSlick.$slideTrack.attr('role')).to.equal('listbox');
    });

    it('should add role=option to slides that arent clones', () => {
      expect(mockSlick.$slides.eq(0).attr('role')).to.not.equal('option');
      expect(mockSlick.$slides.eq(1).attr('role')).to.equal('option');
    });

    it('should add aria-describedby= slick-slide + instanceUID and index to slides that arent clones' , () => {
      expect(mockSlick.$slides.eq(1).attr('aria-describedby')).to.equal('slick-slide10');
      expect(mockSlick.$slides.eq(0).attr('aria-describedby')).to.be.undefined;
    });

    it('should add role=tablist to dots if they are present', () => {
      expect(mockSlick.$dots.attr('role')).to.equal('tablist');
    });

    it('should add aria information to dots', () => {
      expect(dot.attr('role')).to.equal('presentation');
    });

    it('should add aria-selected to the first dot', () => {
      expect(dot.attr('aria-selected')).to.equal('true');
    });

    it('should add role=button to dot buttons', () => {
      expect(button.attr('role')).to.equal('button');
    });

    it('should call activateADA', () => {
      expect(mockSlick.activateADA).to.be.calledOnce;
    });

  });

});