document.addEventListener("DOMContentLoaded", function () {
  let textCommentBtn = document.querySelectorAll(".textCommentBtn");
  let formAddComment = document.querySelectorAll("#formAddComment");
  function textCommit() {
    for (let i = 0; i < textCommentBtn.length; i++) {
      textCommentBtn[i].addEventListener("click", function () {
        formAddComment[i].style.display = "block";
        textCommentBtn[i].style.display = "none";
      });
    }
  }
  textCommit();
});
