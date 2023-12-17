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

  // loginForm.submit((event) => {
  //     event.preventDefault();
  //     error.empty();
  //     if (!usernameInput.val().trim() || !passwordInput.val().trim()) {
  //         error.text("Either the email address or password is invalid");
  //         return false;
  //     }

  //     let requestConfig = {
  //         method: "POST",
  //         url: "/users/login",
  //         contentType: "application/json",
  //         data: JSON.stringify({
  //             usernameInput: usernameInput.val().trim(),
  //             passwordInput: passwordInput.val().trim(),
  //         }),
  //         success: function (data) {
  //             if (!data.user) {
  //                 alert("login fail");
  //                 window.location.href = "/users/login";
  //             } else {
  //                 alert("login success");
  //                 window.location.href = "/";
  //             }
  //         },
  //         error: function (xhr, status, error) {
  //             if (xhr.responseJSON && xhr.responseJSON.message) {
  //                 alert(xhr.responseJSON.message);
  //             } else {
  //                 alert(status);
  //             }
  //         },
  //     };

  //     $.ajax(requestConfig);
  // });
})(window.jQuery);
