(function ($) {
  // Let's start writing AJAX calls!

  let submit = $(".submit");

  submit.on("click", function (event) {
    event.preventDefault();
    let transactionId = $(this).val();
    let time = $("#" + transactionId);
    if (!time.val() || !time.val().trim()) {
      alert("you must choose a time");
      return;
    }
    if (!checkTime(time.val().trim())) {
      return;
    }
    let requestConfig = {
      method: "POST",
      url: "/users/determineMeetUpTime",
      contentType: "application/json",
      data: JSON.stringify({
        transactionId: $(this).val().trim(),
        time: time.val().trim(),
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

  function checkTime(timeVal) {
    let dateObj = new Date(timeVal);
    let now = new Date();
    let oneDaysLater = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    if (dateObj.toString() === "Invalid Date") {
      alert("invalid time");
      return false;
    }
    if (dateObj < oneDaysLater) {
      alert("Time should be at least 1 day later than now");
      return false;
    }
    return true;
  }
})(window.jQuery);
