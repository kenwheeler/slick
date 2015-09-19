/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

export default {
  animateHeight() {
    let _ = this;
    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
      _.$list.animate({
        height: targetHeight
      }, _.options.speed);
    }
  },
  animateSlide(targetLeft: number, callback: Function) {
    let animProps = {},
      _ = this;

    _.animateHeight();

    if (_.options.rtl === true && _.options.vertical === false) {
      targetLeft = -targetLeft;
    }
    if (_.transformsEnabled === false) {
      if (_.options.vertical === false) {
        _.$slideTrack.animate({
          left: targetLeft
        }, _.options.speed, _.options.easing, callback);
      } else {
        _.$slideTrack.animate({
          top: targetLeft
        }, _.options.speed, _.options.easing, callback);
      }

    } else {

      if (_.cssTransitions === false) {
        if (_.options.rtl === true) {
          _.currentLeft = -(_.currentLeft);
        }
        $({
          animStart: _.currentLeft
        }).animate({
          animStart: targetLeft
        }, {
          duration: _.options.speed,
          easing: _.options.easing,
          step: function(now) {
            now = Math.ceil(now);
            if (_.options.vertical === false) {
              animProps[_.animType] = 'translate(' +
                now + 'px, 0px)';
              _.$slideTrack.css(animProps);
            } else {
              animProps[_.animType] = 'translate(0px,' +
                now + 'px)';
              _.$slideTrack.css(animProps);
            }
          },
          complete: function() {
            if (callback) {
              callback.call();
            }
          }
        });

      } else {

        _.applyTransition();
        targetLeft = Math.ceil(targetLeft);

        if (_.options.vertical === false) {
          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
        } else {
          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
        }
        _.$slideTrack.css(animProps);

        setTimeout(function() {

          _.disableTransition();

          if (callback) {
            callback.call();
          }
        }, _.options.speed);

      }

    }
  },
  applyTransition(slide: number) {
    var _ = this,
      transition = {};

    if (_.options.fade === false) {
      transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
    } else {
      transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
    }

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  },
  disableTransition(slide: number) {
    var _ = this,
      transition = {};

    transition[_.transitionType] = '';

    if (_.options.fade === false) {
      _.$slideTrack.css(transition);
    } else {
      _.$slides.eq(slide).css(transition);
    }
  }
}