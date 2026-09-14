// Type definitions for stick 1.4.1
// Project: http://kenwheeler.github.io/slick/
// Definitions by: Emmanuel Sammut <http://www.orchestra.eu/>

/// <reference path="../jquery/jquery.d.ts"/>


interface JQuerySlickOptions {

    /**
     * Enables tabbing and arrow key navigation
     * Default: true
     */
    accessibility?: boolean;

    /**
     * Enables adaptive height for single slide horizontal carousels.
     * Default: false
     */
    adaptiveHeight?: boolean;

    /**
     * Enables Autoplay
     * Default: false
     */
    autoplay?: boolean;

    /**
     * Autoplay Speed in milliseconds
     * Default: 3000
     */
    autoplaySpeed?: number;

    /**
     * Prev/Next Arrows
     * Default: true
     */
    arrows?: boolean;

    /**
     * Set the slider to be the navigation of other slider (Class or ID Name)
     * Default: null
     */
    asNavFor?: string;

    /**
     * Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object)
     * Default: $(element)
     */
    appendArrows?: string;

    /**
     * Allows you to select a node or customize the HTML for the "Previous" arrow.
     * Default: <button type="button" class="slick-prev">Previous</button>
     */
    prevArrow?: string;

    /**
     * Allows you to select a node or customize the HTML for the "Next" arrow.
     * Default: <button type="button" class="slick-next">Next</button>
     */
    nextArrow?: string;

    /**
     * Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts.
     * Default: false
     */
    centerMode?: boolean;

    /**
     * Side padding when in center mode (px or %)
     * Default: '50px'
     */
    centerPadding?: string;

    /**
     * CSS3 Animation Easing
     * Default: 'ease'
     */
    cssEase?: string;

    /**
     * Custom paging templates. See source for use example.
     * Default: n/a
     */
    customPaging?: (slider, i: number) => string;

    /**
     * Enable mouse dragging
     * Default: false
     */
    dots?: boolean;

    /**
     * Enable mouse dragging
     * Default: true
     */
    draggable?: boolean;

    /**
     * Enable fade
     * Default: false
     */
    fade?: boolean;

    /**
     * Enable focus on selected element (click)
     * Default: false
     */
    focusOnSelect?: boolean;

    /**
     * Add easing for jQuery animate. Use with easing libraries or default easing methods
     * Default: 'linear'
     */
    easing?: string;

    /**
     * Resistance when swiping edges of non-infinite carousels
     * Default: 'linear'
     */
    edgeFriction?: number;

    /**
     * Infinite loop sliding
     * Default: true
     */
    infinite?: boolean;

    /**
     * Slide to start on
     * Default: 0
     */
    initialSlide?: number;

    /**
     * Set lazy loading technique. Accepts 'ondemand' or 'progressive'.
     * Default: 'ondemand'
     */
    lazyLoad?: string;

    /**
     * Responsive settings use mobile first calculation
     * Default: false
     */
    mobileFirst?: boolean;

    /**
     * Pause Autoplay On Hover
     * Default: true
     */
    pauseOnHover?: boolean;

    /**
     * Pause Autoplay when a dot is hovered
     * Default: false
     */
    pauseOnDotsHover?: boolean;

    /**
     * Width that responsive object responds to. Can be 'window', 'slider' or 'min' (the smaller of the two)
     * Default: 'window'
     */
    respondTo?: string;

    /**
     * Object containing breakpoints and settings objects (see demo). Enables settings sets at given screen width.
     * Default: none
     */
    responsive?: Object;

    /**
     * Element query to use as slide
     * Default: 'div'
     */
    slide?: string;

    /**
     * # of slides to show
     * Default: 1
     */
    slidesToShow?: number;

    /**
     * # of slides to scroll
     * Default: 1
     */
    slidesToScroll?: number;

    /**
     * Slide/Fade animation speed (ms)
     * Default: 300
     */
    speed?: number;

    /**
     * Enable swiping
     * Default: true
     */
    swipe?: boolean;

    /**
     * Allow users to drag or swipe directly to a slide irrespective of slidesToScroll.
     * Default: false
     */
    swipeToSlide?: boolean;

    /**
     * Enable slide motion with touch
     * Default: true
     */
    touchMove?: boolean;

    /**
     * To advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider.
     * Default: 5
     */
    touchThreshold?: number;

    /**
     * Enable/Disable CSS Transitions
     * Default: true
     */
    useCSS?: boolean;

    /**
     * Variable width slides.
     * Default: false
     */
    variableWidth?: boolean;

    /**
     * Vertical slide mode
     * Default: false
     */
    vertical?: boolean;

    /**
     * Change the slider's direction to become right-to-left
     * Default: false
     */
    rtl?: boolean;

}

interface JQuery {

    /**
     * Create slick component
     */
    slick(): JQuery;
    slick(options: JQuerySlickOptions): JQuery;

    /**
     * Returns the current slide index
     */
    slickCurrentSlide(): number;

    /**
     * Navigates to a slide by index
     */
    slickGoTo(int: number): JQuery;

    /**
     * Navigates to the next slide
     */
    slickNext(): JQuery;

    /**
     * Navigates to the previous slide
     */
    slickPrev(): JQuery;

    /**
     * Pauses autoplay
     */
    slickPause(): JQuery;

    /**
     * Starts autoplay
     */
    slickPlay(): JQuery;

    /**
     * Add a slide. If an index is provided, will add at that index, or before if addBefore is set. If no index is provided,
     * add to the end or to the beginning if addBefore is set. Accepts HTML String || Object
     */
    slickAdd(html: string): JQuery;
    slickAdd(html: string, index: number): JQuery;
    slickAdd(html: string, index: number, addBefore: number): JQuery;

    /**
     * Remove slide by index. If removeBefore is set true, remove slide preceding index, or the first slide if no index is specified.
     * If removeBefore is set to false, remove the slide following index, or the last slide if no index is set.
     */
    slickRemove(index: number): JQuery;
    slickRemove(index: number, removeBefore: number): JQuery;

    /**
     * Filters slides using jQuery .filter()
     */
    slickFilter(selector: string): JQuery;
    slickFilter(func: (index: number, element: Element) => any): JQuery;
    slickFilter(element: Element): JQuery;
    slickFilter(obj: JQuery): JQuery;

    /**
     * Removes applied filtering
     */
    slickUnfilter(): JQuery;
    slickUnfilter(index: number): JQuery;

    /**
     * Gets an individual option value.
     */
    slickGetOption(option: string): JQuerySlickOptions;

    /**
     * Sets an individual value live. Set refresh to true if it's a UI update.
     */
    slickSetOption(option: string): JQuery;
    slickSetOption(option: string, value: JQuerySlickOptions): JQuery;
    slickSetOption(option: string, value: JQuerySlickOptions, refresh: boolean): JQuery;

    /**
     * Deconstructs slick
     */
    unslick(): JQuery;

    /**
     * Get Slick Object
     */
    getSlick(): Object;

}
