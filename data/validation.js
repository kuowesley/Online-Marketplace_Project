import { ObjectId } from "mongodb";

const validation = {
  checkId(id) {
    id = this.checkString(id, "id");
    if (!ObjectId.isValid(id)) {
      throw `Error : Invalid ObjectId`;
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
      throw `Error: You must supply a ${varName}!`;
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
};

export default validation;
