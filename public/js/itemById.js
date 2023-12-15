(function ($) {
  // Let's start writing AJAX calls!

  let addToCart = $("#addToCart");
  let buyItNow = $("#buyItNow");
  let itemId = $("#itemId");
  let quantitySelect = $("#quantitySelect");

  addToCart.on("click", function (event) {
    if (itemId.text()) {
      console.log(quantitySelect);
      let requestConfig = {
        method: "POST",
        url: "/users/addToCart",
        contentType: "application/json",
        data: JSON.stringify({
          itemId: itemId.text(),
          quantity: quantitySelect.val(),
        }),
        success: function (data) {
          if (!data.message) {
            window.location.href = "/users/login";
          } else {
            alert(data.message);
            window.location.href = "/items";
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
    }
  });

  buyItNow.on("click", function (event) {
    event.preventDefault();
    if (itemId.text()) {
      let requestConfig = {
        method: "POST",
        url: "/items/purchase",
        contentType: "application/json",
        data: JSON.stringify({
          itemId: itemId.text(),
          quantity: quantitySelect.val(),
        }),
        success: function (data) {
          if (!data.message) {
            window.location.href = "/users/login";
          } else {
            alert(data.message);
            window.location.href = "/items";
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
    }
  });
})(window.jQuery);
