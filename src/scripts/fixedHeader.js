$(function() {

  const header = $("#header")
  const introHeight = $("#intro").innerHeight()
  let scrollOffset = $(window).scrollTop

  checkScroll(scrollOffset)

  $(window).on("scroll", () => {
    scrollOffset = $(this).scrollTop()
    
    checkScroll(scrollOffset)
  })

  function checkScroll(scrollOffset) {
    if (scrollOffset >= introHeight) {
      header.addClass("fixed")
    } else {
      header.removeClass("fixed")
    }
  }
})