(function ($) {
  // Let's start writing AJAX calls!

  let confirm = $(".confirm");

  confirm.on("click", function (event) {
    event.preventDefault();
    let requestConfig = {
      method: "POST",
      url: "/users/confirmMeetUpTime/confirm",
      contentType: "application/json",
      data: JSON.stringify({
        transactionId: $(this).val().trim(),
        buyerId: $(this).data("buyer"),
      }),
      success: function (data) {
        if (!data.status) {
          alert("submitMeetUpTimeToSeller fail");
        } else {
          alert("submit time success");
          window.location.href = "/users/determineMeetUpTime";
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
})(window.jQuery);
