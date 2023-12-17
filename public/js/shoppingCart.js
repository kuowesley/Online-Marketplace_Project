(function ($) {
  // Let's start writing AJAX calls!

  let checkOut = $("#checkOut");
  let removeItem = $(".removeItem");

  checkOut.on("click", function (event) {
    let requestConfig = {
      method: "POST",
      url: "/users/checkOutShoppingCart",
      contentType: "application/json",
      data: JSON.stringify({}),
      success: function (data) {
        if (!data.message) {
          alert("Fail to check out");
        } else {
          alert(data.message);
          if (data.redirect) {
            window.location.href = "/users/determineMeetUpTime";
          } else {
            window.location.href = "/users/historicalPurchase";
          }

          //window.location.href = "/users/historicalPurchase";
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

  removeItem.on("click", function (event) {
    let itemId = $(this).val();
    console.log(itemId);
    let requestConfig = {
      method: "POST",
      url: "/users/removeCartItem",
      contentType: "application/json",
      data: JSON.stringify({ itemId: itemId }),
      success: function (data) {
        if (!data.message) {
          alert("Remove Fail");
        } else {
          alert(data.message);
          window.location.href = "/users/shoppingCart";
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
