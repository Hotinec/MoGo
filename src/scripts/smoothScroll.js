$(function() {

  $("[data-scroll]").on("click", (e) => {
    e.preventDefault()

    const element = e.target
    const blockId = element.dataset.scroll
    const blockOffset = $(blockId).offset().top

    $("#nav a").removeClass("active")
    element.classList.add("active")

    $("html, body").animate({
      scrollTop: blockOffset
    }, 500)
  })
})