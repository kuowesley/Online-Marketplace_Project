(function ($) {
  let commentForm = $("#rateCommentModal");
  let rateCommentButton = $(".rate");
  let closeForm = $("#closeModal");
  let submitComment = $("#submitComment");
  let ratingSelect = $("#ratingSelect");
  let commentTextArea = $("#commentTextArea");
  let h2_rate = $("#h2_rate");

  let commentFormEdit = $("#rateCommentModal-edit");
  let editCommentButton = $(".edit");
  let closeFormEdit = $("#closeModal-edit");
  let submitCommentEdit = $("#submitComment-edit");
  let ratingSelectEdit = $("#ratingSelect-edit");
  let commentTextAreaEdit = $("#commentTextArea-edit");
  let h2_edit = $("#h2_edit");

  let isCommentFormOpen = false; //
  let isEditFormOpen = false; //

  function userHasNotRated(itemId, myCallBack) {
    let res = true;
    let requestConfig = {
      method: "POST",
      url: "/users/checkDuplicateComment",
      contentType: "application/json",
      data: JSON.stringify({
        itemId: itemId,
      }),
      success: function (data) {
        res = !data.message;
        myCallBack(res);
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
  }

  rateCommentButton.on("click", function (event) {
    if (isCommentFormOpen || isEditFormOpen) {
      alert(
        "You must close the current comment form before opening a new form",
      );
      return;
    }
    h2_rate.text("Rating and Comment for " + $(this).data("itemname"));
    isCommentFormOpen = true;
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
      if (typeof selectedRating !== "string" || !selectedRating.trim()) {
        alert("Rating can not be empty");
        return;
      }
      if (typeof commentText !== "string" || !commentText.trim()) {
        alert("Comment can not be empty");
        return;
      }
      let requestConfig = {
        method: "POST",
        url: "/users/submitComment",
        contentType: "application/json",
        data: JSON.stringify({
          itemId: itemId,
          rating: selectedRating.trim(),
          comment: commentText.trim(),
        }),
        success: function (data) {
          if (!data.message) {
            alert("Comment Submission Fail");
          } else {
            alert("Comment submitted");
            window.location.href = "/users/historicalPurchase";
            commentForm.hide();
            // $(`#${itemId}`).hide();
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

  editCommentButton.on("click", function (event) {
    if (isCommentFormOpen || isEditFormOpen) {
      alert(
        "You must close the current comment form before opening a new form",
      );
      return;
    }
    isEditFormOpen = true;
    h2_edit.text("Change Rating and Comment for " + $(this).data("itemname"));
    commentFormEdit.show();
    let itemId = $(this).val();
    console.log(itemId);

    // ratingSelectEdit.val("5 stars"); // Set it to the default value or any initial value
    // commentTextAreaEdit.val(""); // Clear the text area
    let getCommentRequestConfig = {
      method: "POST",
      url: "/users/getComment",
      contentType: "application/json",
      data: JSON.stringify({
        itemId: itemId,
      }),
      success: function (data) {
        if (!data.message) {
          alert("get previous Comment Fail");
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

    $.ajax(getCommentRequestConfig).then(function (responseMessage) {
      console.log(responseMessage);
      ratingSelectEdit.val(responseMessage.comment.rating);
      commentTextAreaEdit.val(responseMessage.comment.comment);
    });

    // Unbind previous click event to prevent multiple bindings
    submitCommentEdit.off("click");
    submitCommentEdit.on("click", function (event) {
      debugger;
      // commentForm.hide();
      const selectedRating = $("#ratingSelect-edit").val();
      const commentText = $("#commentTextArea-edit").val();
      if (typeof selectedRating !== "string" || !selectedRating.trim()) {
        alert("Rating can not be empty");
        return;
      }
      if (typeof commentText !== "string" || !commentText.trim()) {
        alert("Comment can not be empty");
        return;
      }
      let requestConfig = {
        method: "POST",
        url: "/users/editComment",
        contentType: "application/json",
        data: JSON.stringify({
          itemId: itemId,
          rating: selectedRating.trim(),
          comment: commentText.trim(),
        }),
        success: function (data) {
          if (!data.message) {
            alert("Comment Modification Fail");
          } else {
            alert("Comment Modified");
            window.location.href = "/users/historicalPurchase";
            commentForm.hide();
            // $(`#${itemId}`).hide();
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
      $.ajax(requestConfig).then(function (responseMessage) {});
    });
  });

  closeForm.on("click", function (event) {
    commentForm.hide();
    isCommentFormOpen = false;
  });

  closeFormEdit.on("click", function (event) {
    commentFormEdit.hide();
    isEditFormOpen = false;
  });

  $(document).ready(function () {
    // Iterate through each item button and hide it if the user has already rated the item
    $(".rate").each(function () {
      debugger;
      let button = $(this);
      let itemId = button.attr("id");
      userHasNotRated($(this).val(), function (hasNotRated) {
        if (!hasNotRated) {
          // $(`#${itemId}`).hide();
          button.hide();
        }
      });
    });
    $(".edit").each(function () {
      debugger;
      let button = $(this);
      let itemId = button.attr("id");
      userHasNotRated($(this).val(), function (hasNotRated) {
        if (hasNotRated) {
          // $(`#${itemId}`).hide();
          button.hide();
        }
      });
    });
  });
})(window.jQuery);
