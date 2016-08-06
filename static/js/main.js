$(document).ready(function() {

  $('body').removeClass('no-js');

  $('a.blog-button').click(function() {
    $('.panel-cover').addClass('panel-cover--collapsed');
  });

  if (window.location.hash && window.location.hash == "#blog") {
    $('.panel-cover').addClass('panel-cover--collapsed');
  }

  collapsPath = ["tag", "page"];
  collapsPath.forEach(function(path){
    var len = path.length;
    if (window.location.pathname.substring(0, len + 2) == "/" + path + "/") {
      $('.panel-cover').addClass('panel-cover--collapsed');
    }
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


