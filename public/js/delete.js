document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteEntry")) {
      event.target.parentElement.remove();
    }
  });
});

