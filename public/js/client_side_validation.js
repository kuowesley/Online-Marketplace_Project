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
  fileUploadForm.addEventListener("submit", async (event) => {
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
    let files = fileInput.files;

    // let errorFlag = errorsMessage.getAttribute('hidden')
    let hasErrors = false;
    let errors = [];

    try {
      // TODO input validation
      itemNameValue = validation.checkItemName(itemNameValue, `itemName`);
      descriptionValue = validation.checkDescription(
        descriptionValue,
        `description`,
      );

      // str to num first
      priceValue = validation.checkRoutePriceQuantity(priceValue, `price`);
      quantityValue = validation.checkRoutePriceQuantity(
        quantityValue,
        `quantity`,
      );
      priceValue = validation.checkPrice(priceValue, `price`);
      quantityValue = validation.checkQuantity(quantityValue, `quantity`);

      // check input
      transaction_dateValue = validation.checkTransactionDate(
        transaction_dateValue,
        `transaction_date`,
      );
      locationValue = validation.checkLocation(locationValue, `location`);
      deliveryMethodValue = validation.checkDeliveryMethod(
        deliveryMethodValue,
        `DeliveryMethod`,
      );
      conditionValue = validation.checkCondition(conditionValue, `condition`);

      // check File
      for (let i = 0; i < files.length; i++) {
        console.log(files[i].size);
        console.log(files[i].type);
        console.log(typeof files[i].type);
        if (files[i].size > 12000000) {
          throw `File size:${files[i].size} over 12 MB!`;
        }
        if (!files[i].type.startsWith("image/")) {
          throw `File type: ${files[i].type} is not accept`;
        }
      }
    } catch (e) {
      errors.push(e);
      hasErrors = true;
    }

    // validation pass
    // file need to be handle
    if (!hasErrors) {
      // const formData = new FormData();
      // formData.append("itemName", itemNameValue);
      // formData.append("description", descriptionValue);
      // formData.append("price", priceValue);
      // formData.append("quantity", quantityValue);
      // formData.append("transaction_date", transaction_dateValue);
      // formData.append("location", locationValue);
      // formData.append("deliveryMethod", deliveryMethodValue);
      // formData.append("condition", conditionValue);

      // File
      for (let i = 0; i < fileInput.files.length; i++) {
        // formData.append("fileInput", fileInput.files[i]);
        fileUploadForm.append("fileInput", fileInput.files[i]);
      }

      fileUploadForm.submit();
      // let response = await fetch("/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // console.log(response)
      // let responseData = await response.json()
      // console.log(responseData)
    }

    // update error status
    if (hasErrors) {
      errorsMessage.innerHTML = ``;
      for (let error of errors) {
        errorsMessage.innerHTML += `<li> ${error} </li>`;
      }
      // errorsMessage.removeAttribute('hidden')
    } else {
      errorsMessage.innerHTML = ``;
      // errorsMessage.setAttribute('hidden', true);
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

const validation = {
  // checkId(id, varName) {
  //   id = this.checkString(id, varName);
  //   if (!ObjectId.isValid(id)) {
  //     throw `Error : ${varName} is an invalid ObjectId`;
  //   }
  //   return id;
  // },

  checkString(strVal, varName) {
    if (!strVal) {
      throw `Error: You must supply a ${varName}!`;
    }
    if (typeof strVal !== "string") {
      throw `Error: ${varName} must be a string!`;
    }

    strVal = strVal.trim();

    if (strVal.length === 0) {
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    }
    return strVal;
  },

  checkNumber(num, varName) {
    if (typeof num !== "number") {
      throw `Error: You must supply a ${varName} or the type is wrong!`;
    }
    if (isNaN(num)) {
      throw `Error : ${varName} must be a valid number!`;
    }
    if (num === Infinity || num === -Infinity) {
      throw `Error : ${varName} must be a valid number!`;
    }
    return num;
  },

  checkObject(obj, varName) {
    if (!obj) {
      throw `Error: You must supply a ${varName}!`;
    }
    if (typeof obj !== "object") {
      throw `Error : ${varName} must be an object!`;
    }
    if (Array.isArray(obj)) {
      throw `Error : ${varName} must be an object not an array`;
    }
    return obj;
  },

  checkEmail(email) {
    email = this.checkString(email, "email");
    let emailMatch = email.match(
      /[A-Za-z0-9]+((\.|-|_)[A-Za-z0-9]+)*[A-Za-z0-9]@[A-Za-z0-9-]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9-]+/g,
    );
    if (!emailMatch || emailMatch.pop() !== email) {
      throw `email is not valid`;
    }
    let emailTemp = email.split("@");
    if (emailTemp[0].length > 64) {
      throw `email is not valid`;
    }
    if (emailTemp[1].length > 253) {
      throw `email is not valid`;
    }
    emailTemp = email.split(".");
    let lastDomain = emailTemp[emailTemp.length - 1];
    if (lastDomain.length < 2) {
      throw `The last portion of the email domain must be at least two characters`;
    }
    return email;
  },

  checkPassword(pwd, varName) {
    pwd = this.checkString(pwd, varName);
    for (let str of pwd) {
      if (str === " ") {
        throw `Error : ${varName} can not contain space`;
      }
    }
    if (pwd.length < 8) {
      throw `Error : ${varName} should be more than 8 character`;
    }

    let valid = [];
    for (let str of pwd) {
      if (str.match(/[A-Z]/)) {
        valid.push(true);
        break;
      }
    }
    for (let str of pwd) {
      if (!isNaN(parseInt(str))) {
        valid.push(true);
        break;
      }
    }
    for (let str of pwd) {
      if (str.match(/[^a-zA-Z0-9]/)) {
        valid.push(true);
        break;
      }
    }

    if (valid.length !== 3) {
      throw `Error : ${varName} is not valid`;
    }
    return pwd;
  },

  checkStreet(str, varName) {
    str = this.checkString(str, varName);
    if (str.length < 3) {
      throw `${varName} is less than 3 characters`;
    }
    return str;
  },

  checkCity(str, varName) {
    str = this.checkString(str, varName);
    if (str.length < 3) {
      throw `${varName} is less than 3 characters`;
    }
    return str;
  },

  checkState(str, varName) {
    let state = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ];
    str = this.checkString(str, varName);
    if (str.length !== 2 || !state.includes(str)) {
      throw `Invalid ${varName}`;
    }
    return str;
  },

  checkZipcode(str, varName) {
    str = this.checkString(str, varName);
    if (str.length !== 5) {
      throw `Invalid ${varName}`;
    }
    return str;
  },

  checkItemName(str, varName) {
    // check string
    str = this.checkString(str, varName);
    if (str.length < 5) {
      throw `Should ${varName} contain over 5 characters`;
    }

    // check for special characters
    const specialChars = /[!@#$%^&*(),.?"{}|<>]/;
    if (specialChars.test(str)) {
      throw `${varName} should not contain special characters`;
    }
    return str;
  },

  checkDescription(str, varName) {
    // check string
    str = this.checkString(str, varName);
    if (str.length < 5) {
      throw `Should ${varName} contain over 5 characters`;
    }

    return str;
  },

  checkRoutePriceQuantity(str, varName) {
    // check NaN
    if (isNaN(str)) throw `${varName} is not number`;
    let num = Number(str);
    return num;
  },

  checkPrice(num, varName) {
    // check number
    num = this.checkNumber(num, varName);
    if (num <= 0) {
      throw `${varName} could not be 0 or negative`;
    }

    return num;
  },

  checkQuantity(num, varName) {
    // check number
    num = this.checkNumber(num, varName);

    if (num <= 0) {
      throw `${varName} could not be 0 or negative`;
    }

    return num;
  },

  checkTransactionDate(date, varName) {
    // check str
    date = this.checkString(date, varName);

    // mm/dd/yyyy
    let eventDate_check = date.split("/");
    if (!eventDate_check[0] || !eventDate_check[1] || !eventDate_check[2]) {
      throw `${varName} should not empty, it should be mm/dd/yyyy`;
    } else {
      if (
        eventDate_check[0].length !== 2 ||
        eventDate_check[1].length !== 2 ||
        eventDate_check[2].length !== 4
      )
        throw `${varName} not in correct format which length shoudl be mm/dd/yyyy`;
    }

    // check date valid nor not
    let dateobj = new Date(date);
    if (dateobj == "Invalid Date")
      throw `${varName} could transfer to Date Obj.`;

    // The eventDate must be greater than the current date (so only future events can be created).
    let today = new Date().setHours(0, 0, 0, 0);
    if (today > dateobj)
      throw `${varName} must be greater than the current date`;

    return date;
  },

  checkLocation(str, varName) {
    // check string
    str = this.checkString(str, varName);
    if (str.length < 5) {
      throw `Should ${varName} contain over 5 characters`;
    }

    return str;
  },

  checkDeliveryMethod(str, varName) {
    // check string
    str = this.checkString(str, varName);

    if (str.length < 5) {
      throw `Should ${varName} contain over 5 characters`;
    }

    return str;
  },

  checkCondition(str, varName) {
    // check string
    str = this.checkString(str, varName);

    if (str.length < 3) {
      throw `Should ${varName} contain over 3 characters`;
    }

    return str;
  },

  checkFileInput(file, varName) {
    // in route
    // check string
    file = this.checkObject(file, varName);
    file.fieldname = this.checkString(file.fieldname, "file.fieldname");
    file.originalname = this.checkString(
      file.originalname,
      "file.originalname",
    );
    file.encoding = this.checkString(file.encoding, "file.encoding");
    file.mimetype = this.checkString(file.mimetype, "file.mimetype");
    file.destination = this.checkString(file.destination, "file.destination");
    file.filename = this.checkString(file.filename, "file.filename");
    file.path = this.checkString(file.path, "file.path");

    // check number
    file.size = this.checkNumber(file.size, "file.size");

    // 12MB 12000000
    if (file.fieldname !== "fileInput")
      throw `file.fieldname should be fileInput`;
    if (!file.mimetype.startsWith("image/"))
      throw `file.mimetype should start with image/`;
    if (file.destination !== "upload/")
      throw `file.destination should be upload/`;
    if (!file.path.startsWith(`upload\\`))
      throw `file.path should start with upload\\`;
    if (file.size >= 12000000) throw `file.size could not over 12MB`;

    return file;
  },
};
