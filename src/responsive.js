/* @flow */
/*eslint-disable max-statements, complexity, max-depth */

const $ = window.$ || window.jQuery;

import assign from "object-assign";

export default {
  checkResponsive(initial: boolean, forceUpdate: boolean) {
    const sliderWidth = this.$slider.width();
    const windowWidth = window.innerWidth || $(window).width();

    let respondToWidth = null;
    let triggerBreakpoint = false;

    if (this.respondTo === "window") {
      respondToWidth = windowWidth;
    } else if (this.respondTo === "slider") {
      respondToWidth = sliderWidth;
    } else if (this.respondTo === "min") {
      respondToWidth = Math.min(windowWidth, sliderWidth);
    }

    if (this.options.responsive &&
      this.options.responsive.length &&
      this.options.responsive !== null) {

      let targetBreakpoint = null;
      let breakpoint = null;

      for (breakpoint in this.breakpoints) {
        if (this.breakpoints.hasOwnProperty(breakpoint)) {
          if (this.originalSettings.mobileFirst === false) {
            if (respondToWidth < this.breakpoints[breakpoint]) {
              targetBreakpoint = this.breakpoints[breakpoint];
            }
          } else if (respondToWidth > this.breakpoints[breakpoint]) {
            targetBreakpoint = this.breakpoints[breakpoint];
          }
        }
      }

      if (targetBreakpoint !== null) {
        if (this.activeBreakpoint !== null) {
          if (targetBreakpoint !== this.activeBreakpoint || forceUpdate) {
            this.activeBreakpoint =
              targetBreakpoint;
            if (this.breakpointSettings[targetBreakpoint] === "unslick") {
              this.unslick(targetBreakpoint);
            } else {
              this.options = assign({}, this.originalSettings,
                this.breakpointSettings[
                  targetBreakpoint]);
              if (initial === true) {
                this.currentSlide = this.options.initialSlide;
              }
              this.refresh(initial);
            }
            triggerBreakpoint = targetBreakpoint;
          }
        } else {
          this.activeBreakpoint = targetBreakpoint;
          if (this.breakpointSettings[targetBreakpoint] === "unslick") {
            this.unslick(targetBreakpoint);
          } else {
            this.options = assign({}, this.originalSettings,
              this.breakpointSettings[
                targetBreakpoint]);
            if (initial === true) {
              this.currentSlide = this.options.initialSlide;
            }
            this.refresh(initial);
          }
          triggerBreakpoint = targetBreakpoint;
        }
      } else if (this.activeBreakpoint !== null) {
        this.activeBreakpoint = null;
        this.options = this.originalSettings;
        if (initial === true) {
          this.currentSlide = this.options.initialSlide;
        }
        this.refresh(initial);
        triggerBreakpoint = targetBreakpoint;
      }

      // only trigger breakpoints during an actual break. not on initialize.
      if (!initial && triggerBreakpoint !== false) {
        this.$slider.trigger("breakpoint", [this, triggerBreakpoint]);
      }
    }
  },
  registerBreakpoints() {
    const responsiveSettings = this.options.responsive || null;

    if ($.type(responsiveSettings) === "array" && responsiveSettings.length) {

      this.respondTo = this.options.respondTo || "window";

      let breakpoint = null;

      for (breakpoint in responsiveSettings) {

        const currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {

          let l = this.breakpoints.length - 1;
          // loop through the breakpoints and cut out any existing
          // ones with the same breakpoint number, we don"t want dupes.
          while (l >= 0) {
            if (this.breakpoints[l] && this.breakpoints[l] === currentBreakpoint) {
              this.breakpoints.splice(l, 1);
            }
            l--;
          }

          this.breakpoints.push(currentBreakpoint);
          this.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

        }

      }

      this.breakpoints.sort((a, b) => {
        return this.options.mobileFirst ? a - b : b - a;
      });

    }
  }
};
