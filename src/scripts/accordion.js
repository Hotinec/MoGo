$(function() {

  $("[data-collapse]").on("click", function(e) {
    e.preventDefault()

    const $this = $(this)
    const blockId = $this.data('collapse')

    $this.toggleClass("active")
  })
})