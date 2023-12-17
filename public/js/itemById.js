(function ($) {
  // Let's start writing AJAX calls!

  let addToCart = $("#addToCart");
  let buyItNow = $("#buyItNow");
  let itemId = $("#itemId");
  let quantitySelect = $("#quantitySelect");
  let location = $("#location");

  let forurl = location.text().split(":");
  let forurl2 = forurl[1].trim().split(" ").join("%20");
  let url =
    "https://www.google.com/maps/embed/v1/place?key=AIzaSyDmLGhMKw9fQFfNAX1MCu_jeuoCrBxe3XU&q=" +
    forurl2;
  console.log(url);
  $("#map")
    .append(`<iframe width="600" height="450" style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
  src=${url}></iframe>`);

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
            if (data.meetup) {
              window.location.href = "/users/determineMeetUpTime";
            } else {
              window.location.href = "/items";
            }
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
