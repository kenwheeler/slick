/* @flow */

const $ = window.$ || window.jQuery;

export default {
  activateADA() {
    this.$slideTrack.find(".slick-active").attr({
      "aria-hidden": "false"
    }).find("a, input, button, select").attr({
      "tabindex": "0"
    });
  },
  initADA() {
    this.$slides.add(this.$slideTrack.find(".slick-cloned")).attr({
      "aria-hidden": "true",
      "tabindex": "-1"
    }).find("a, input, button, select").attr({
      "tabindex": "-1"
    });

    this.$slideTrack.attr("role", "listbox");

    this.$slides.not(this.$slideTrack.find(".slick-cloned")).each((i, slide) => {
      $(slide).attr({
        "role": "option",
        "aria-describedby": "slick-slide" + this.instanceUid + i
      });
    });

    if (this.$dots !== null) {
      this.$dots.attr("role", "tablist").find("li").each((i, slide) => {
        $(slide).attr({
          "role": "presentation",
          "aria-selected": "false",
          "aria-controls": "navigation" + this.instanceUid + i,
          "id": "slick-slide" + this.instanceUid + i
        });
      })
      .first().attr("aria-selected", "true").end()
      .find("button").attr("role", "button").end();
    }
    this.activateADA();
  }
};
