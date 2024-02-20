document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname;
  const headerButtons = {
    headerIndexTokken: "/",
    headerBtnIndex: "/index",
    profileHederBtn: `/profile/`,
    moderatorHederBtn: "/moderator",
    addPhotoHederBtn: "/addPhoto",
  };

  for (const buttonId in headerButtons) {
    const button = document.getElementById(buttonId);
    if (button) {
      const buttonPath = headerButtons[buttonId];
      button.classList.toggle(
        "active",
        currentPage === buttonPath || currentPage.indexOf(buttonPath) !== -1
      );
    }
  }
});
