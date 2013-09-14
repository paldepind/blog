jQuery(function($) {
  var $sidebar = $('aside')
  $(window).scroll(function() {
    var offset = $(window).scrollTop()
    if ($(window).width() > 780) {
      $sidebar.css('marginTop', offset * 0.5 + 'px')
    } else {
      $sidebar.css('marginTop', '0px')
    }
  })
})
