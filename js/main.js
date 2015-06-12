// Prevent splash page image mis-sizing
$("#splash").css("min-height", $(window).height() );

//If on mobile disable parallaxing due to background-attachment: fixed bug in mobile browsers
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
{
 $("#splash").css("background-attachment", 'scroll');
}
//Enable parallax effect
else
{
  var xx = -($(window).scrollTop() / $('div.bgParallax').data('speed')); 
  $("#splash").css("background-position", '50% '+ xx + 'px');
  $('div.bgParallax').each(function()
  {
    var $obj = $(this);
    $(window).scroll(function()
    {
      var yPos = -($(window).scrollTop() / $obj.data('speed')); 
      var bgpos = '50% '+ yPos + 'px';
      $obj.css('background-position', bgpos );
    }); 
  });
}

//Collapse mobile navbar after click
$(document).on('click','.navbar-collapse.in',function(e)
{
  if( $(e.target).is('a') )
  {
    $(this).collapse('hide');
  }
});

//Check if navbar should be hid on page refresh
var $starter = $(window).height()-(50);
if ($('#fullScreen').length)
{
  if ($(window).scrollTop()>= $starter)
  {
    $('#mainHeader').slideDown();
  } 
  else if ($(window).scrollTop()==0)
  {
    $('#mainHeader').slideUp(1000);
  }
}

$(document).ready(function() 
{

  //Fade pace, then fade out cover which obscures loading
  $(window).load(function() 
  {
    $(".pace").fadeOut(500, function()
    {
      $("#cover").fadeOut(2000);
  })
  })

  //Auto hide navbar on splash page
  var $starter = $(window).height()-(50);
  $(window).scroll(function()
  {
    if ($('#fullScreen').length)
    {
      if ($(window).scrollTop()>= $starter)
      {
        $('#mainHeader').slideDown();
      } 
      else if ($(window).scrollTop()==0)
      {
        $('#mainHeader').slideUp(1000);
      }
    }
  }) 

  //Splash page arrow fade on hover
  $("#arrow").hover(function() 
  {
    $(this).stop();
    $(this).animate({color: "#C0C0C0"}, 'fast');
  }, 
  function() 
  {
    $(this).stop();
    $(this).animate({color: "white"}, 'fast');
  });

  //Make arrow active on click
  $('#arrow').click(function() 
  {
    $('#about-li').addClass('active');
  })

	// scroll handler
  var scrollToDiv = function( id )
  {
    // grab the element to scroll to based on the name
    var elem = $("div[id='"+ id +"']");
    // if that didn't work, look for an element with our ID
    if ( typeof( elem.offset() ) === "undefined" )
    {
      elem = $("#"+id);
    }
    // if the destination element exists
    if ( typeof( elem.offset() ) !== "undefined" )
    {
      // do the scroll
      $('html,body').stop();
      $('html, body').animate(
      {
        scrollTop: elem.offset().top-70
      }, 1000 );
    }
  };

  // bind to click event
  $("a").click(function( event )
  {
    // only do this if it's an anchor link
    if ( $(this).attr("href").match("#") )
    {
      // cancel default event propagation
      event.preventDefault();
      // scroll to the location
      var href = $(this).attr('href').replace('#', '')
      scrollToDiv( href );
    }
  });

  //Fade thumbnails on hover
  $('.thumbnail').hover(function()
  {    
    $(this).parent().fadeTo(200, 0.6);
  }, 
  function()
  {
    $(this).parent().fadeTo(200, 1);
  });

})
