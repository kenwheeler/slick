$(document).ready(function(){
  $('.single-item').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1
  });
	$('.multiple-items').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3
  });
  $('.one-time').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    touchMove: false,
    slidesToScroll: 1
  });
  $('.uneven').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4
  });
  $('.autoplay').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  });
});