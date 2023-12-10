(function ($) {
  // Let's start writing AJAX calls!
  let searchForm = $("#searchItems"),
    formInput = $("#item_search_term"),
    allItems = $("#all-items"),
    searchResults = $("#search-result"),
    backToAll = $("#back-to-all"),
    filterSearch = $("#filterSearch"),
    filterInput = $("#sort_order"),
    priceLowToHigh = $("#price-low-to-high"),
    priceHighToLow = $("#price-high-to-low"),
    dateNewToOld = $("#newest-arrival");

  function generateItemHTML(item) {
    return `
        <div class="item">
          <p>Item: <a href="/items/${item._id}">${item.item}</a></p>
          <p>Price: $${item.price}</p>
          <p><img alt="Item Picture ${item.item}" src="${item.picture}"></p>
          <p>Location: ${item.location}</p>
          <p>Condition: ${item.condition}</p>
        </div>
      `;
  }

  function renderItems(container, items) {
    container.empty();
    for (let i = 0; i < items.length; i++) {
      let currentItem = items[i];
      // Open a new row for every second item
      if (i % 2 === 0) {
        container.append('<div class="item-row">');
      }

      // Item HTML
      let itemHTML = generateItemHTML(currentItem);

      // Append the item HTML to the container
      container.append(itemHTML);

      // Close the row for every second item or the last item
      if (i % 2 === 1 || i === items.length - 1) {
        container.append("</div>");
      }
    }
  }

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
      if (Array.isArray(data) && data.length > 0) {
        debugger;
        let priceLow = data.slice().sort((a, b) => a.price - b.price);
        let priceHigh = data.slice().sort((a, b) => b.price - a.price);
        let newestDate = data
          .slice()
          .sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
        searchResults.empty();
        priceLowToHigh.empty();
        priceHighToLow.empty();
        dateNewToOld.empty();

        renderItems(searchResults, data);
        renderItems(priceLowToHigh, priceLow);
        renderItems(priceHighToLow, priceHigh);
        renderItems(dateNewToOld, newestDate);
      } else {
        searchResults.empty();
        searchResults.append($(`<p>Sorry, no results were found.</p>`));
        filterSearch.hide();
      }
    });
    allItems.hide();
    searchResults.show();
    searchForm[0].reset();
    backToAll.show();
    filterSearch.show();
    priceLowToHigh.hide();
    priceHighToLow.hide();
    dateNewToOld.hide();
  });

  filterSearch.submit(async function (event) {
    event.preventDefault();
    let inputString = filterInput.val();
    if (inputString === "lowToHigh") {
      priceLowToHigh.show();
      priceHighToLow.hide();
      searchResults.hide();
      dateNewToOld.hide();
      filterSearch.show();
    } else if (inputString === "highToLow") {
      priceHighToLow.show();
      priceLowToHigh.hide();
      searchResults.hide();
      dateNewToOld.hide();
      filterSearch.show();
    } else if (inputString === "default") {
      priceHighToLow.hide();
      priceLowToHigh.hide();
      searchResults.show();
      dateNewToOld.hide();
      filterSearch.show();
    } else if (inputString === "newest") {
      priceHighToLow.hide();
      priceLowToHigh.hide();
      searchResults.hide();
      dateNewToOld.show();
      filterSearch.show();
    }
  });
})(window.jQuery);
