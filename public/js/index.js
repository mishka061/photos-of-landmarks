document.addEventListener("DOMContentLoaded", function () {
  
  function navbarHidden() {
    let imgNavbar = document.querySelector(".imgNavbar");
    let navbarMenu = document.querySelector(".navbarMenu");
    imgNavbar.addEventListener("click", function () {
      if (
        navbarMenu.style.display === "block" ||
        navbarMenu.style.display === ""
      ) {
        navbarMenu.style.display = "none";
      } else {
        navbarMenu.style.display = "block";
      }
    });
  }
  navbarHidden();
});
