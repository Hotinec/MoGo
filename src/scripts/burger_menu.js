$(function() {

  $("#nav-togle").on("click", function(e) {
    e.preventDefault()

    $(this).toggleClass("active")
    $("#nav").toggleClass("active")
  })
})