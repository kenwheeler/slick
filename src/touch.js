/* @flow */
/*eslint-disable max-statements, complexity, consistent-return */

export default {
  clickHandler(event: Object) {

    if (this.shouldClick === false) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  },
  swipeDirection(): string {
    const xDist = this.touchObject.startX - this.touchObject.curX;
    const yDist = this.touchObject.startY - this.touchObject.curY;
    const r = Math.atan2(yDist, xDist);

    let swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return this.options.rtl === false ? "left" : "right";
    }
    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return this.options.rtl === false ? "left" : "right";
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return this.options.rtl === false ? "right" : "left";
    }
    if (this.options.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return "left";
      } else {
        return "right";
      }
    }

    return "vertical";
  },
  swipeEnd() {
    this.dragging = false;

    this.shouldClick = this.touchObject.swipeLength > 10 ? false : true;

    if (this.touchObject.curX === undefined) {
      return false;
    }

    if (this.touchObject.edgeHit === true) {
      this.$slider.trigger("edge", [this, this.swipeDirection()]);
    }

    if (this.touchObject.swipeLength >= this.touchObject.minSwipe) {
      let slideCount = 0;

      switch (this.swipeDirection()) {
      case "left":
        slideCount = this.options.swipeToSlide ?
          this.checkNavigable(this.currentSlide + this.getSlideCount()) :
          this.currentSlide + this.getSlideCount();
        this.slideHandler(slideCount);
        this.currentDirection = 0;
        this.touchObject = {};
        this.$slider.trigger("swipe", [this, "left"]);
        break;

      case "right":
        slideCount = this.options.swipeToSlide ?
          this.checkNavigable(this.currentSlide - this.getSlideCount()) :
          this.currentSlide - this.getSlideCount();
        this.slideHandler(slideCount);
        this.currentDirection = 1;
        this.touchObject = {};
        this.$slider.trigger("swipe", [this, "right"]);
        break;
      }
    } else if (this.touchObject.startX !== this.touchObject.curX) {
      this.slideHandler(this.currentSlide);
      this.touchObject = {};
    }
  },
  swipeHandler(event: Object) {
    if (this.options.swipe === false || "ontouchend" in document &&
        this.options.swipe === false) {
      return;
    } else if (this.options.draggable === false && event.type.indexOf("mouse") !== -1) {
      return;
    }

    this.touchObject.fingerCount = event.originalEvent &&
      event.originalEvent.touches !== undefined ?
      event.originalEvent.touches.length : 1;

    this.touchObject.minSwipe = this.listWidth / this.options
      .touchThreshold;

    if (this.options.verticalSwiping === true) {
      this.touchObject.minSwipe = this.listHeight / this.options
        .touchThreshold;
    }

    switch (event.data.action) {
    case "start":
      this.swipeStart(event);
      break;

    case "move":
      this.swipeMove(event);
      break;

    case "end":
      this.swipeEnd(event);
      break;
    }
  },
  swipeMove(event: Object) {
    const touches = "touches" in event.originalEvent ? event.originalEvent.touches : null;

    if (!this.dragging || touches && touches.length !== 1) {
      return false;
    }

    const curLeft = this.getLeft(this.currentSlide);

    this.touchObject.curX = touches !== null ? touches[0].pageX : event.clientX;
    this.touchObject.curY = touches !== null ? touches[0].pageY : event.clientY;

    this.touchObject.swipeLength = Math.round(Math.sqrt(
      Math.pow(this.touchObject.curX - this.touchObject.startX, 2)));

    if (this.options.verticalSwiping === true) {
      this.touchObject.swipeLength = Math.round(Math.sqrt(
        Math.pow(this.touchObject.curY - this.touchObject.startY, 2)));
    }

    const swipeDirection = this.swipeDirection();

    if (swipeDirection === "vertical") {
      return;
    }

    if (typeof event.originalEvent !== undefined && this.touchObject.swipeLength > 4) {
      event.preventDefault();
    }

    let positionOffset = (this.options.rtl === false ? 1 : -1) *
      (this.touchObject.curX > this.touchObject.startX ? 1 : -1);
    if (this.options.verticalSwiping === true) {
      positionOffset = this.touchObject.curY > this.touchObject.startY ? 1 : -1;
    }

    let swipeLength = this.touchObject.swipeLength;

    this.touchObject.edgeHit = false;

    if (this.options.infinite === false) {
      if (this.currentSlide === 0 && swipeDirection === "right" ||
        this.currentSlide >= this.getDotCount() && swipeDirection === "left") {
        swipeLength = this.touchObject.swipeLength * this.options.edgeFriction;
        this.touchObject.edgeHit = true;
      }
    }

    if (this.options.vertical === false) {
      this.swipeLeft = curLeft + swipeLength * positionOffset;
    } else {
      this.swipeLeft = curLeft +
        swipeLength * (this.$list.height() / this.listWidth) * positionOffset;
    }
    if (this.options.verticalSwiping === true) {
      this.swipeLeft = curLeft + swipeLength * positionOffset;
    }

    if (this.options.fade === true || this.options.touchMove === false) {
      return false;
    }

    if (this.animating === true) {
      this.swipeLeft = null;
      return false;
    }

    this.setCSS(this.swipeLeft);
  },
  swipeStart(event: Object) {
    const touches = "touches" in event.originalEvent ? event.originalEvent.touches : null;

    if (this.touchObject.fingerCount !== 1 || this.slideCount <= this.options.slidesToShow) {
      this.touchObject = {};
      return false;
    }

    this.touchObject.startX = this.touchObject.curX =
      touches !== null ? touches.pageX : event.clientX;
    this.touchObject.startY = this.touchObject.curY =
      touches !== null ? touches.pageY : event.clientY;

    this.dragging = true;
  }
};
