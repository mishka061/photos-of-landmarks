document.addEventListener("DOMContentLoaded", function () {
  let editEntryButtons = document.querySelectorAll(".editEntry");
  let containerEditEntry = document.querySelectorAll(".containerEditEntry");
  let editPhoto = document.querySelectorAll("#editPhoto");

  function editEntry() {
    for (let i = 0; i < editEntryButtons.length; i++) {
      editEntryButtons[i].addEventListener("click", function () {
        editPhoto[i].style.display = "block";
        containerEditEntry[i].style.display = "none";
      });
    }
  }
  editEntry();
});



