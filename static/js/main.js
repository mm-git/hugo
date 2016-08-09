$(document).ready(function() {

  $('body').removeClass('no-js');

  $('a.blog-button').click(function() {
    $('.panel-cover').addClass('panel-cover--collapsed');
  });

  $('.btn-mobile-menu').click(function() {
    $('.navigation-wrapper').toggleClass('visible');
    $('.btn-mobile-menu__icon').toggleClass('hidden');
    $('.btn-mobile-close__icon').toggleClass('hidden');
  });

  $('.navigation-wrapper .blog-button').click(function() {
    $('.navigation-wrapper').toggleClass('visible');
    $('.btn-mobile-menu__icon').toggleClass('hidden');
    $('.btn-mobile-close__icon').toggleClass('hidden');
  });
});


