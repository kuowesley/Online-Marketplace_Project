(function ($) {
  let commentForm = $("#rateCommentModal");
  let rateCommentButton = $(".rate");
  let closeForm = $("#closeModal");
  let submitComment = $("#submitComment");
  let ratingSelect = $("#ratingSelect");
  let commentTextArea = $("#commentTextArea");

  rateCommentButton.on("click", function (event) {
    ratingSelect.val("5 stars"); // Set it to the default value or any initial value
    commentTextArea.val(""); // Clear the text area
    commentForm.show();
    let itemId = $(this).val();
    // Unbind previous click event to prevent multiple bindings
    submitComment.off("click");
    submitComment.on("click", function (event) {
      debugger;
      // commentForm.hide();
      const selectedRating = $("#ratingSelect").val();
      const commentText = $("#commentTextArea").val();
      let requestConfig = {
        method: "POST",
        url: "/users/submitComment",
        contentType: "application/json",
        data: JSON.stringify({
          itemId: itemId,
          rating: selectedRating,
          comment: commentText,
        }),
        success: function (data) {
          if (!data.message) {
            alert("Comment Submission Fail");
          } else {
            alert("Comment submitted");
            //   window.location.href = "/users/historicalSoldItems";
            commentForm.hide();
          }
        },
        error: function (xhr, status, error) {
          if (xhr.responseJSON && xhr.responseJSON.message) {
            alert(xhr.responseJSON.message);
          } else {
            alert(status);
          }
        },
      };
      $.ajax(requestConfig);
    });
  });

  closeForm.on("click", function (event) {
    commentForm.hide();
  });
})(window.jQuery);
