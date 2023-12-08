// config different form
// https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
const fileUploadForm = document.getElementById("fileUploadForm");

if (fileUploadForm) {
  let itemName = document.getElementById("itemName");
  let description = document.getElementById("description");
  let price = document.getElementById("price");
  let quantity = document.getElementById("quantity");
  let transaction_date = document.getElementById("transaction_date");
  let location = document.getElementById("location");
  let deliveryMethod = document.getElementById("deliveryMethod");
  let condition = document.getElementById("condition");

  // File relate
  let fileInput = document.getElementById("fileInput");
  let fileSelect = document.getElementById("fileSelect");
  let fileList = document.getElementById("fileList");

  // multiple form
  fileSelect.addEventListener(
    "click",
    (e) => {
      if (fileInput) {
        fileInput.click();
      }
      e.preventDefault(); // prevent navigation to "#"
    },
    false,
  );

  // form element
  fileInput.addEventListener("change", handleFiles, false);

  // form submit
  fileUploadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // get value here
    let itemNameValue = itemName.value;
    let descriptionValue = description.value;
    let priceValue = price.value;
    let quantityValue = quantity.value;
    let transaction_dateValue = transaction_date.value;
    let locationValue = location.value;
    let deliveryMethodValue = deliveryMethod.value;
    let conditionValue = condition.value;

    // let errorFlag = errorsMessage.getAttribute('hidden')
    let hasErrors = false;
    let errors = [];

    try {
      // TODO input validation
    } catch (e) {
      errors.push(e);
      hasErrors = true;
    }

    // validation pass
    // file need to be handle
    if (!hasErrors) {
      const formData = new FormData();
      formData.append("itemName", itemNameValue);
      formData.append("description", descriptionValue);
      formData.append("price", priceValue);
      formData.append("quantity", quantityValue);
      formData.append("transaction_date", transaction_dateValue);
      formData.append("location", locationValue);
      formData.append("deliveryMethod", deliveryMethodValue);
      formData.append("condition", conditionValue);

      // File
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("fileInput", fileInput.files[i]);
      }
      fetch("/upload", {
        method: "POST",
        body: formData,
      });
    }

    // TODO update error status
    if (hasErrors) {
    } else {
    }
  });
}

// TODO this is temp error show, need to be change
function handleFiles() {
  if (!this.files.length) {
    fileList.innerHTML = "<p>No files selected!</p>";
  } else {
    fileList.innerHTML = "";
    const list = document.createElement("ul");
    fileList.appendChild(list);
    for (let i = 0; i < this.files.length; i++) {
      const li = document.createElement("li");
      list.appendChild(li);
      const img = document.createElement("img");
      img.src = URL.createObjectURL(this.files[i]);
      img.height = 60;
      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };
      li.appendChild(img);
      const info = document.createElement("span");
      info.innerHTML = `${this.files[i].name}: ${this.files[i].size} bytes`;
      li.appendChild(info);
    }
  }
}
