import { ObjectId } from "mongodb";

const validation = {
  checkId(id, varName) {
    id = this.checkString(id, varName);
    if (!ObjectId.isValid(id)) {
      throw `Error : ${varName} is an invalid ObjectId`;
    }
    return id;
  },

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
    str = str.toUpperCase();
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

  checkRating(num, varName) {
    let ratingOption = ["5 stars", "4 stars", "3 stars", "2 stars", "1 stars"];
    num = this.checkString(num, varName);
    if (!ratingOption.includes(num)) {
      throw `Invalid ${varName}`;
    }
    return num;
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

    if (num > 100) {
      throw `${varName} could not over 100`;
    }

    return num;
  },

  checkTransactionDate(date, varName) {
    // check str
    date = this.checkString(date, varName);

    // config regex
    const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;

    // mm/dd/yyyy
    // https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
    // https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/
    // check if the date matches the mm/dd/yyyy format
    if (!dateFormat.test(date)) {
      throw `${varName} should be in the format mm/dd/yyyy`;
    }

    // check if the date is valid
    const [month, day, year] = date.split("/").map(Number);
    const isValidDate = !isNaN(year) && !isNaN(month) && !isNaN(day);
    const dateObj = new Date(year, month - 1, day);

    if (!isValidDate)
      throw `${varName} could only contain number and '/' (mm/dd/yyyy)`;
    if (dateObj.getMonth() + 1 !== month) throw `${varName} month is not vaild`;
    if (dateObj.getDate() !== day) throw `${varName} day is not vaild`;
    if (dateObj.getFullYear() !== year) throw `${varName} year is not vaild`;

    // if (!isValidDate || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day || dateObj.getFullYear() !== year) {
    //   throw `${varName} is not a valid date`;
    // }

    // check if the date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj <= today) {
      throw `${varName} must be a date in the future`;
    }

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
    str = str.toLowerCase();

    // validate input value
    if (str !== "meetup" && str !== "shipping")
      throw `${varName} is not Valid Value: ${str}, only accept "meetup","shipping"`;

    return str;

    return str;
  },

  checkCondition(str, varName) {
    // check string
    str = this.checkString(str, varName);
    str = str.toLowerCase();

    // validate input value
    const validConditions = [
      "new",
      "usedlikenew",
      "usedverygood",
      "usedgood",
      "usedacceptable",
    ];
    if (!validConditions.includes(str))
      throw `${varName} is not Valid Value: ${str}, only accept "new","usedlikenew", "usedverygood","usedgood","usedacceptable"`;

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
    if (
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpeg"
    ) {
      throw `File type should be either JPG or PNG`;
    }
    if (file.destination !== "upload/")
      throw `file.destination should be upload/`;
    if (!file.path.startsWith(`upload\\`))
      throw `file.path should start with upload\\`;
    if (file.size >= 12000000) throw `file.size could not over 12MB`;

    return file;
  },

  checkTime(time, varName) {
    time = this.checkString(time, varName);
    let dateObject = new Date(time);
    let now = new Date();
    let oneDaysLater = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    if (dateObject.toString() === "Invalid Date") {
      throw `${varName} is not a valid time`;
    }
    if (dateObject < oneDaysLater) {
      throw `Time should be at least 1 day later than now`;
    }
    return time;
  },
};

export default validation;
