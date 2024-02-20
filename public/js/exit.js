document.addEventListener("DOMContentLoaded", function () {
  let exitLink = document.querySelector("#headerExit");
  exitLink.addEventListener(
    "click",
    function (event) {
      event.preventDefault();
      console.log("click");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/auth/registration";
    },
    { passive: true }
  );
});
