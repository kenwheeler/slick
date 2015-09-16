'use strict';

const $ = window.$ || window.jQuery;

export default {
  activateADA() {
    var _ = this;
    _.$slideTrack.find('.slick-active').attr({
      'aria-hidden': 'false'
    }).find('a, input, button, select').attr({
      'tabindex': '0'
    });
  },
  initADA() {
    var _ = this;
    _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
      'aria-hidden': 'true',
      'tabindex': '-1'
    }).find('a, input, button, select').attr({
      'tabindex': '-1'
    });

    _.$slideTrack.attr('role', 'listbox');

    _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
      $(this).attr({
        'role': 'option',
        'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
      });
    });

    if (_.$dots !== null) {
      _.$dots.attr('role', 'tablist').find('li').each(function(i) {
          $(this).attr({
            'role': 'presentation',
            'aria-selected': 'false',
            'aria-controls': 'navigation' + _.instanceUid + i + '',
            'id': 'slick-slide' + _.instanceUid + i + ''
          });
        })
        .first().attr('aria-selected', 'true').end()
        .find('button').attr('role', 'button').end();
    }
    _.activateADA();
  }
}