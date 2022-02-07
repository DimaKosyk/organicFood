@@include('./testwebp.js')
@@include('./slick.js')
@@include('./rateyo.js')

$(function () {
  $('.header__menu-btn').on('click', function (){
    $('.header__menu-list').toggleClass('header__menu-list--active');
  });
});