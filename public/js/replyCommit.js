document.addEventListener("DOMContentLoaded", function () {
    console.log('replyCommit')
  let commentReplyForm = document.querySelectorAll(".commentReplyForm");
  let replyCommit = document.querySelectorAll("#ReplyCommit");

  function repCommit() {
    for (let i = 0; i < replyCommit.length; i++) {
      replyCommit[i].addEventListener("click", function () {
        commentReplyForm[i].style.display = "block";
        replyCommit[i].style.display = "none";
      });
    }
  }
  repCommit();
});
