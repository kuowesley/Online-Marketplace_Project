(function ($) {
  // Let's start writing AJAX calls!
  let searchForm = $("#searchItems"),
    formInput = $("#item_search_term"),
    allItems = $("#all-items"),
    searchResults = $("#search-result");

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
        let template = `
            {{#if (eq (mod @index 2) 0)}}
              <div class="item-row">
            {{/if}}
            
            <div class="item">
              <p>Item: <a href="/items/${currentItem._id}">${currentItem.item}</a></p>
              <p>Price: $${currentItem.price}</p>
              <p>
                <img alt="Item Picture ${currentItem.item}" src="${currentItem.picture}">
              </p>
              <p>Location: ${currentItem.location}</p>
              <p>Condition: ${currentItem.condition}</p>
            </div>
            
            {{#if (or (eq (mod @index 2) 1) (eq @index (subtract (length data) 1)))}}
              </div>
            {{/if}}
          `;

        // Append the template to the container
        searchResults.append(template);
      }
    });
    allItems.hide();
    searchResults.show();
    searchForm[0].reset();
  });
})(window.jQuery);
