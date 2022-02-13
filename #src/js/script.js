@@include('./testwebp.js')
@@include('./slick.js')
@@include('./rateyo.js')

$(function () {
  $('.header__menu-btn, .header__menu a').on('click', function (){
    $('.header__menu-list').toggleClass('header__menu-list--active');
  });

  $(".header__inner a").on("click", function (e) {
    e.preventDefault();
    var id = $(this).attr('href'),
      top = $(id).offset().top;
    $('body,html').animate({ scrollTop: top }, 1500);
  });

  $(".footer a").on("click", function (e) {
    e.preventDefault();
    var id = $(this).attr('href'),
      top = $(id).offset().top;
    $('body,html').animate({ scrollTop: top }, 1500);
  });
});