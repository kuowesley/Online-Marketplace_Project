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

  checkTransactionDate(num, varName) {
    // check number
    num = this.checkNumber(num, varName);

    if (num <= 0) {
      throw `${varName} could not be 0 or negative`;
    }

    return num;
  },
};

export default validation;
