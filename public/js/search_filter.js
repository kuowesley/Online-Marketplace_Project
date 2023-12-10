(function ($) {
  // Let's start writing AJAX calls!
  let searchForm = $("#searchItems"),
    formInput = $("#item_search_term"),
    allItems = $("#all-items"),
    searchResults = $("#search-result"),
    backToAll = $("#back-to-all");

  searchForm.submit(async function (event) {
    event.preventDefault();
    let inputString = formInput.val();
    if (!inputString || inputString.trim().length == 0) {
      alert("Please enter a valid search term.");
      return;
    }
    inputString = inputString.trim();
    let requestConfig = {
      method: "GET",
      url: "http://localhost:3000/items/search/" + inputString,
    };
    $.ajax(requestConfig).then(function (responseMessage) {
      debugger;
      let data = responseMessage;
      if (!(Array.isArray(data) && data.length > 0)) {
        return;
      }
      searchResults.empty();
      for (let i = 0; i < data.length; i++) {
        let currentItem = data[i];
        // Open a new row for every second item
        if (i % 2 === 0) {
          searchResults.append('<div class="item-row">');
        }

        // Item HTML
        let itemHTML = `
          <div class="item">
            <p>Item: <a href="/items/${currentItem._id}">${currentItem.item}</a></p>
            <p>Price: $${currentItem.price}</p>
            <p>
              <img alt="Item Picture ${currentItem.item}" src="${currentItem.picture}">
            </p>
            <p>Location: ${currentItem.location}</p>
            <p>Condition: ${currentItem.condition}</p>
          </div>
        `;

        // Append the item HTML to the container
        searchResults.append(itemHTML);

        // Close the row for every second item or the last item
        if (i % 2 === 1 || i === data.length - 1) {
          searchResults.append("</div>");
        }
      }
    });
    allItems.hide();
    searchResults.show();
    searchForm[0].reset();
    backToAll.show();
  });
})(window.jQuery);
