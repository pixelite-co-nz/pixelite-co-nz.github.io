(function ($) {

  // Navigation Scripts to Show Header on Scroll-Up.
  $(document).ready(function () {
    var MQL = 1170;

    // Primary navigation slide-in effect.
    if ($(window).width() > MQL) {
      var headerHeight = $('.navbar-pixelite').height();
      $(window).on('scroll', {
          previousTop: 0
        },
        function () {
          var currentTop = $(window).scrollTop();
          //check if user is scrolling up
          if (currentTop < this.previousTop) {
            //if scrolling up...
            if (currentTop > 0 && $('.navbar-pixelite').hasClass('is-fixed')) {
              $('.navbar-pixelite').addClass('is-visible');
            } else {
              $('.navbar-pixelite').removeClass('is-visible is-fixed');
            }
          } else {
            //if scrolling down...
            $('.navbar-pixelite').removeClass('is-visible');
            if (currentTop > headerHeight && !$('.navbar-pixelite').hasClass('is-fixed')) {
              $('.navbar-pixelite').addClass('is-fixed');
            }
          }
          this.previousTop = currentTop;
        });
    }
  });

})(jQuery);
