const isDarkMode = Boolean(window.localStorage.getItem("darkMode", false))
console.log(isDarkMode)
if(isDarkMode == true) {
  $('.color-mode-icon').toggleClass('active')
  document.body.classList.add("dark-mode");
}

(function ($) {

  "use strict";

    // COLOR MODE
    $('.color-mode').click(function(){
        $('.color-mode-icon').toggleClass('active')
        $('body').toggleClass('dark-mode')

        const isDarkMode = document.body.classList.contains("dark-mode");
        window.localStorage.setItem('darkMode',isDarkMode)
    })

    // HEADER
    $(".navbar").headroom();

    // PROJECT CAROUSEL
    $('.owl-carousel').owlCarousel({
    	items: 1,
	    loop:true,
	    margin:10,
	    nav:true
	});

    // SMOOTHSCROLL
    $(function() {
      $('.nav-link, .custom-btn-link').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 49
        }, 1000);
        event.preventDefault();
      });
    });  

    // TOOLTIP
    $('.social-links a').tooltip();

})(jQuery);
