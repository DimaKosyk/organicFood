$(function () {
  $('.comments__items').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    infinite: true,
    speed: 500,
    prevArrow: '<button class="slider-btn slider-btn__prev" aria-label="previous button"><svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.83683 8.57619L10.4368 15.1762L8.5515 17.0615L0.0661604 8.57619L8.55149 0.0908567L10.4368 1.97619L3.83683 8.57619Z" fill="#CCCCCC" /></svg></button>',
    nextArrow: '<button class="slider-btn slider-btn__next" aria-label="next button"><svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.35848 8.57615L0.758484 1.97615L2.64382 0.0908203L11.1292 8.57615L2.64382 17.0615L0.758484 15.1762L7.35848 8.57615Z" fill="#CCCCCC" /><svg></button>',
  });
})