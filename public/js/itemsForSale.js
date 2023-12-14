(function ($) {
  let removeItem = $(".removeItem");

  removeItem.on("click", function (event) {
    let itemId = $(this).val();
    let requestConfig = {
      method: "POST",
      url: "/users/removeListItem",
      contentType: "application/json",
      data: JSON.stringify({ itemId: itemId }),
      success: function (data) {
        if (!data.message) {
          alert("Remove Fail");
        } else {
          alert(data.message);
          window.location.href = "/users/itemsForSale";
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
