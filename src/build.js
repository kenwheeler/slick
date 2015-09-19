/* @flow */
'use strict';

const $ = window.$ || window.jQuery;

import assign from 'object-assign';

export default {
  buildOut() {
    var _ = this;

    _.$slides =
      _.$slider
      .children(_.options.slide + ':not(.slick-cloned)')
      .addClass('slick-slide');

    _.slideCount = _.$slides.length;

    _.$slides.each(function(index, element) {
      $(element)
        .attr('data-slick-index', index)
        .data('originalStyling', $(element).attr('style') || '');
    });

    _.$slidesCache = _.$slides;

    _.$slider.addClass('slick-slider');

    _.$slideTrack = (_.slideCount === 0) ?
      $('<div class="slick-track"/>').appendTo(_.$slider) :
      _.$slides.wrapAll('<div class="slick-track"/>').parent();

    _.$list = _.$slideTrack.wrap(
      '<div aria-live="polite" class="slick-list"/>').parent();
    _.$slideTrack.css('opacity', 0);

    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
      _.options.slidesToScroll = 1;
    }

    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

    _.setupInfinite();

    _.buildArrows();

    _.buildDots();

    _.updateDots();


    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

    if (_.options.draggable === true) {
      _.$list.addClass('draggable');
    }
  },
  destroy(refresh: boolean) {
    var _ = this;

    _.autoPlayClear();

    _.touchObject = {};

    _.cleanUpEvents();

    $('.slick-cloned', _.$slider).detach();

    if (_.$dots) {
      _.$dots.remove();
    }


    if (_.$prevArrow && _.$prevArrow.length) {

      _.$prevArrow
        .removeClass('slick-disabled slick-arrow slick-hidden')
        .removeAttr('aria-hidden aria-disabled tabindex')
        .css("display", "");

      if (_.htmlExpr.test(_.options.prevArrow)) {
        _.$prevArrow.remove();
      }
    }

    if (_.$nextArrow && _.$nextArrow.length) {

      _.$nextArrow
        .removeClass('slick-disabled slick-arrow slick-hidden')
        .removeAttr('aria-hidden aria-disabled tabindex')
        .css("display", "");

      if (_.htmlExpr.test(_.options.nextArrow)) {
        _.$nextArrow.remove();
      }

    }


    if (_.$slides) {

      _.$slides
        .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
        .removeAttr('aria-hidden')
        .removeAttr('data-slick-index')
        .each(function() {
          $(this).attr('style', $(this).data('originalStyling'));
        });

      _.$slideTrack.children(this.options.slide).detach();

      _.$slideTrack.detach();

      _.$list.detach();

      _.$slider.append(_.$slides);
    }

    _.cleanUpRows();

    _.$slider.removeClass('slick-slider');
    _.$slider.removeClass('slick-initialized');

    _.unslicked = true;

    if (!refresh) {
      _.$slider.trigger('destroy', [_]);
    }
  },
  init(creation: boolean) {
    var _ = this;

    if (!$(_.$slider).hasClass('slick-initialized')) {

      $(_.$slider).addClass('slick-initialized');

      _.buildRows();
      _.buildOut();
      _.setProps();
      _.startLoad();
      _.loadSlider();
      _.initializeEvents();
      _.updateArrows();
      _.updateDots();
      _.callback && _.callback();

    }

    if (creation) {
      _.$slider.trigger('init', [_]);
    }

    if (_.options.accessibility === true) {
      _.initADA();
    }
  },
  initUI() {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

      _.$prevArrow.show();
      _.$nextArrow.show();

    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

      _.$dots.show();

    }

    if (_.options.autoplay === true) {

      _.autoPlay();

    }
  },
  loadSlider() {
    var _ = this;

    _.setPosition();

    _.$slideTrack.css({
      opacity: 1
    });

    _.$slider.removeClass('slick-loading');

    _.initUI();

    if (_.options.lazyLoad === 'progressive') {
      _.progressiveLazyLoad();
    }
  },
  refresh(initializing: boolean) {
    var _ = this,
      currentSlide, firstVisible;

    firstVisible = _.slideCount - _.options.slidesToShow;

    // check that the new breakpoint can actually accept the
    // "current slide" as the current slide, otherwise we need
    // to set it to the closest possible value.
    if (!_.options.infinite) {
      if (_.slideCount <= _.options.slidesToShow) {
        _.currentSlide = 0;
      } else if (_.currentSlide > firstVisible) {
        _.currentSlide = firstVisible;
      }
    }

    currentSlide = _.currentSlide;

    _.destroy(true);

    assign(_, _.initials, {
      currentSlide: currentSlide
    });

    _.init();

    if (!initializing) {

      _.changeSlide({
        data: {
          message: 'index',
          index: currentSlide
        }
      }, false);

    }
  },
  reinit() {
    var _ = this;

    _.$slides =
      _.$slideTrack
      .children(_.options.slide)
      .addClass('slick-slide');

    _.slideCount = _.$slides.length;

    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
    }

    if (_.slideCount <= _.options.slidesToShow) {
      _.currentSlide = 0;
    }

    _.registerBreakpoints();

    _.setProps();
    _.setupInfinite();
    _.buildArrows();
    _.updateArrows();
    _.initArrowEvents();
    _.buildDots();
    _.updateDots();
    _.initDotEvents();

    _.checkResponsive(false, true);

    if (_.options.focusOnSelect === true) {
      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
    }

    _.setSlideClasses(0);

    _.setPosition();

    _.$slider.trigger('reInit', [_]);

    if (_.options.autoplay === true) {
      _.focusHandler();
    }
  },
  setupInfinite() {
    var _ = this,
      i, slideIndex, infiniteCount;

    if (_.options.fade === true) {
      _.options.centerMode = false;
    }

    if (_.options.infinite === true && _.options.fade === false) {

      slideIndex = null;

      if (_.slideCount > _.options.slidesToShow) {

        if (_.options.centerMode === true) {
          infiniteCount = _.options.slidesToShow + 1;
        } else {
          infiniteCount = _.options.slidesToShow;
        }

        for (i = _.slideCount; i > (_.slideCount -
            infiniteCount); i -= 1) {
          slideIndex = i - 1;
          $(_.$slides[slideIndex]).clone(true).attr('id', '')
            .attr('data-slick-index', slideIndex - _.slideCount)
            .prependTo(_.$slideTrack).addClass('slick-cloned');
        }
        for (i = 0; i < infiniteCount; i += 1) {
          slideIndex = i;
          $(_.$slides[slideIndex]).clone(true).attr('id', '')
            .attr('data-slick-index', slideIndex + _.slideCount)
            .appendTo(_.$slideTrack).addClass('slick-cloned');
        }
        _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
          $(this).attr('id', '');
        });

      }

    }
  },
  startLoad() {
    var _ = this;

    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

      _.$prevArrow.hide();
      _.$nextArrow.hide();

    }

    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

      _.$dots.hide();

    }

    _.$slider.addClass('slick-loading');
  },
  unload() {
    var _ = this;

    $('.slick-cloned', _.$slider).remove();

    if (_.$dots) {
      _.$dots.remove();
    }

    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
      _.$prevArrow.remove();
    }

    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
      _.$nextArrow.remove();
    }

    _.$slides
      .removeClass('slick-slide slick-active slick-visible slick-current')
      .attr('aria-hidden', 'true')
      .css('width', '');
  },
  unslick(fromBreakpoint: string) {
    var _ = this;
    _.$slider.trigger('unslick', [_, fromBreakpoint]);
    _.destroy();
  }
}