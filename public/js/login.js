(function ($) {
  // Let's start writing AJAX calls!

  let loginForm = $("#loginForm");
  let usernameInput = $("#usernameInput");
  let passwordInput = $("#passwordInput");
  let error = $("#error");

  loginForm.submit((event) => {
    error.empty();
    if (!usernameInput.val() || !passwordInput.val()) {
      error.text("Either the email address or password is invalid");
      return false;
    }
  });
})(window.jQuery);
