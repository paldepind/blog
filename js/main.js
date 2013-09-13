jQuery(function($) {
  var $sidebar = $('aside')
  $(window).scroll(function() {
    var offset = $(window).scrollTop()
    console.log(offset)
    if ($sidebar.css('border-left-width') == '1px') {
      $sidebar.css('marginTop', offset * 0.5 + 'px')
    } else {
      $sidebar.css('marginTop', '0px')
    }
  })
})
