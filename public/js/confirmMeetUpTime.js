(function ($) {
  // Let's start writing AJAX calls!

  let confirm = $(".confirm");
  let deny = $(".deny");

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
          alert("confirmMeetUpTime fail");
        } else {
          alert("confirm time success!");
          window.location.href = "/users/confirmMeetUpTime";
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

  deny.on("click", function (event) {
    event.preventDefault();
    let requestConfig = {
      method: "POST",
      url: "/users/confirmMeetUpTime/deny",
      contentType: "application/json",
      data: JSON.stringify({
        transactionId: $(this).val().trim(),
        buyerId: $(this).data("buyer"),
      }),
      success: function (data) {
        if (!data.status) {
          alert("denyMeetUpTime fail");
        } else {
          alert("deny time success!");
          window.location.href = "/users/confirmMeetUpTime";
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
