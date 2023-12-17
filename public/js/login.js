(function ($) {
  // Let's start writing AJAX calls!

  let loginForm = $("#loginForm");
  let usernameInput = $("#usernameInput");
  let passwordInput = $("#passwordInput");
  let error = $("#error");

  loginForm.submit((event) => {
    event.preventDefault();
    error.empty();
    if (!usernameInput.val().trim() || !passwordInput.val().trim()) {
      error.text("Either the email address or password is invalid");
      return false;
    }

    let requestConfig = {
      method: "POST",
      url: "/users/login",
      contentType: "application/json",
      data: JSON.stringify({
        usernameInput: usernameInput.val().trim(),
        passwordInput: passwordInput.val().trim(),
      }),
      success: function (data) {
        if (!data.user) {
          alert("login fail");
          window.location.href = "/users/login";
        } else {
          alert("login success");
          window.location.href = "/";
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
