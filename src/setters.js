/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

export default {
  setCSS(position: number) {
    var _ = this,
      positionProps = {},
      x, y;

    if (_.options.rtl === true) {
      position = -position;
    }
    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

    positionProps[_.positionProp] = position;

    if (_.transformsEnabled === false) {
      _.$slideTrack.css(positionProps);
    } else {
      positionProps = {};
      if (_.cssTransitions === false) {
        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
        _.$slideTrack.css(positionProps);
      } else {
        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
        _.$slideTrack.css(positionProps);
      }
    }
  },
  setDimensions() {
    var _ = this;

    if (_.options.vertical === false) {
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: ('0px ' + _.options.centerPadding)
        });
      }
    } else {
      _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
      if (_.options.centerMode === true) {
        _.$list.css({
          padding: (_.options.centerPadding + ' 0px')
        });
      }
    }

    _.listWidth = _.$list.width();
    _.listHeight = _.$list.height();


    if (_.options.vertical === false && _.options.variableWidth === false) {
      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
      _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

    } else if (_.options.variableWidth === true) {
      _.$slideTrack.width(5000 * _.slideCount);
    } else {
      _.slideWidth = Math.ceil(_.listWidth);
      _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
    }

    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
    if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
  },
  setFade() {
    var _ = this,
      targetLeft;

    _.$slides.each(function(index, element) {
      targetLeft = (_.slideWidth * index) * -1;
      if (_.options.rtl === true) {
        $(element).css({
          position: 'relative',
          right: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      } else {
        $(element).css({
          position: 'relative',
          left: targetLeft,
          top: 0,
          zIndex: _.options.zIndex - 2,
          opacity: 0
        });
      }
    });

    _.$slides.eq(_.currentSlide).css({
      zIndex: _.options.zIndex - 1,
      opacity: 1
    });
  },
  setHeight() {
    var _ = this;

    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
      _.$list.css('height', targetHeight);
    }
  },
  setOption(option: string, value: any, refresh: boolean) {
    var _ = this,
      l, item;

    if (option === "responsive" && $.type(value) === "array") {
      for (item in value) {
        if ($.type(_.options.responsive) !== "array") {
          _.options.responsive = [value[item]];
        } else {
          l = _.options.responsive.length - 1;
          // loop through the responsive object and splice out duplicates.
          while (l >= 0) {
            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
              _.options.responsive.splice(l, 1);
            }
            l--;
          }
          _.options.responsive.push(value[item]);
        }
      }
    } else {
      _.options[option] = value;
    }

    if (refresh === true) {
      _.unload();
      _.reinit();
    }
  },
  setPosition() {
    var _ = this;

    _.setDimensions();

    _.setHeight();

    if (_.options.fade === false) {
      _.setCSS(_.getLeft(_.currentSlide));
    } else {
      _.setFade();
    }

    _.$slider.trigger('setPosition', [_]);
  },
  setProps() {
    var _ = this,
      bodyStyle = document.body.style;

    _.positionProp = _.options.vertical === true ? 'top' : 'left';

    if (_.positionProp === 'top') {
      _.$slider.addClass('slick-vertical');
    } else {
      _.$slider.removeClass('slick-vertical');
    }

    if (bodyStyle.WebkitTransition !== undefined ||
      bodyStyle.MozTransition !== undefined ||
      bodyStyle.msTransition !== undefined) {
      if (_.options.useCSS === true) {
        _.cssTransitions = true;
      }
    }

    if (_.options.fade) {
      if (typeof _.options.zIndex === 'number') {
        if (_.options.zIndex < 3) {
          _.options.zIndex = 3;
        }
      } else {
        _.options.zIndex = _.defaults.zIndex;
      }
    }

    if (bodyStyle.OTransform !== undefined) {
      _.animType = 'OTransform';
      _.transformType = '-o-transform';
      _.transitionType = 'OTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }
    if (bodyStyle.MozTransform !== undefined) {
      _.animType = 'MozTransform';
      _.transformType = '-moz-transform';
      _.transitionType = 'MozTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
    }
    if (bodyStyle.webkitTransform !== undefined) {
      _.animType = 'webkitTransform';
      _.transformType = '-webkit-transform';
      _.transitionType = 'webkitTransition';
      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
    }
    if (bodyStyle.msTransform !== undefined) {
      _.animType = 'msTransform';
      _.transformType = '-ms-transform';
      _.transitionType = 'msTransition';
      if (bodyStyle.msTransform === undefined) _.animType = false;
    }
    if (bodyStyle.transform !== undefined && _.animType !== false) {
      _.animType = 'transform';
      _.transformType = 'transform';
      _.transitionType = 'transition';
    }
    _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
  },
  setSlideClasses(index: number) {
    var _ = this,
      centerOffset, allSlides, indexOffset, remainder;

    allSlides = _.$slider
      .find('.slick-slide')
      .removeClass('slick-active slick-center slick-current')
      .attr('aria-hidden', 'true');

    _.$slides
      .eq(index)
      .addClass('slick-current');

    if (_.options.centerMode === true) {

      centerOffset = Math.floor(_.options.slidesToShow / 2);

      if (_.options.infinite === true) {

        if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

          _.$slides
            .slice(index - centerOffset, index + centerOffset + 1)
            .addClass('slick-active')
            .attr('aria-hidden', 'false');

        } else {

          indexOffset = _.options.slidesToShow + index;
          allSlides
            .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
            .addClass('slick-active')
            .attr('aria-hidden', 'false');

        }

        if (index === 0) {

          allSlides
            .eq(allSlides.length - 1 - _.options.slidesToShow)
            .addClass('slick-center');

        } else if (index === _.slideCount - 1) {

          allSlides
            .eq(_.options.slidesToShow)
            .addClass('slick-center');

        }

      }

      _.$slides
        .eq(index)
        .addClass('slick-center');

    } else {

      if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

        _.$slides
          .slice(index, index + _.options.slidesToShow)
          .addClass('slick-active')
          .attr('aria-hidden', 'false');

      } else if (allSlides.length <= _.options.slidesToShow) {

        allSlides
          .addClass('slick-active')
          .attr('aria-hidden', 'false');

      } else {

        remainder = _.slideCount % _.options.slidesToShow;
        indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

        if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

          allSlides
            .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
            .addClass('slick-active')
            .attr('aria-hidden', 'false');

        } else {

          allSlides
            .slice(indexOffset, indexOffset + _.options.slidesToShow)
            .addClass('slick-active')
            .attr('aria-hidden', 'false');

        }

      }

    }

    if (_.options.lazyLoad === 'ondemand') {
      _.lazyLoad();
    }
  },
  setPaused(paused: boolean) {
    var _ = this;

    if (_.options.autoplay === true && _.options.pauseOnHover === true) {
      _.paused = paused;
      if (!paused) {
        _.autoPlay();
      } else {
        _.autoPlayClear();
      }
    }
  }
}