(function ($) {
  let firstName = $("#firstNameInput");
  let lastName = $("#lastNameInput");
  let userName = $("#userNameInput");
  (email = $("#emailAddressInput")),
    (street = $("#streetInput")),
    (city = $("#cityInput")),
    (state = $("#stateInput")),
    (zipcode = $("#zipcodeInput")),
    (age = $("#ageInput")),
    (password = $("#passwordInput")),
    (confirnPassword = $("#confirmPasswordInput"));

  $("#signup-form").submit(function (event) {
    // event.preventDefault();
    try {
      $("#error1").hide();
      nameCheck(firstName.val());
    } catch (e) {
      $("#error1").show();
      firstName.val("");
    }

    try {
      $("#error2").hide();
      nameCheck(lastName.val());
    } catch (e) {
      $("#error2").show();
      lastName.val("");
    }

    try {
      $("#error3").hide();
      userCheck(userName.val());
    } catch (e) {
      $("#error3").show();
      userName.val("");
    }

    try {
      $("#error4").hide();
      emailCheck(email.val());
    } catch (e) {
      $("#error4").show();
      email.val("");
    }

    try {
      $("#error5").hide();
      streetCheck(street.val());
    } catch (e) {
      $("#error5").show();
      street.val("");
    }

    try {
      $("#error6").hide();
      nameCheck(city.val());
    } catch (e) {
      $("#error6").show();
      city.val("");
    }

    try {
      $("#error7").hide();
      stateCheck(state.val());
    } catch (e) {
      $("#error7").show();
      state.val("");
    }

    try {
      $("#error8").hide();
      zipcodeCheck(zipcode.val());
    } catch (e) {
      $("#error8").show();
      zipcode.val("");
    }

    try {
      $("#error9").hide();
      ageCheck(age.val());
    } catch (e) {
      $("#error9").show();
      age.val("");
    }

    try {
      $("#error10").hide();
      passwordCheck(password.val());
    } catch (e) {
      $("#error10").show();
      password.val("");
    }

    try {
      $("#error11").hide();
      passwordCheck(confirnPassword.val());
    } catch (e) {
      $("#error11").show();
      confirnPassword.val("");
    }
  });
})(window.jQuery);

function streetCheck(str) {
  if (typeof str !== "string") {
    throw "please enter a string";
  }
  if (str.trim() == "") {
    throw "empty input";
  }
  str = str.trim();
  if (str.length < 2 || str.length > 25) {
    throw "exceed maximum length";
  }
  if (!/^[0-9a-zA-Z-,. ]+$/.test(str)) {
    throw "contain not characters";
  }
}

function nameCheck(str) {
  if (typeof str !== "string") {
    throw "please enter a string";
  }
  if (str.trim() == "") {
    throw "empty input";
  }
  str = str.trim();
  if (str.length < 2 || str.length > 25) {
    throw "exceed maximum length";
  }
  if (!/^[a-zA-Z-. ]+$/.test(str)) {
    throw "contain not characters";
  }
}

function userCheck(str) {
  if (typeof str !== "string") {
    throw "please enter a string";
  }
  if (str.trim() == "") {
    throw "empty input";
  }
  str = str.trim();
  if (str.length < 2 || str.length > 25) {
    throw "exceed maximum length";
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(str)) {
    throw "contain not characters";
  }
}

function emailCheck(email) {
  if (!email) {
    throw "empty input";
  }
  if (typeof email !== "string") {
    throw "not a string";
  }
  if (email.trim().length === 0) {
    throw "string with empty input";
  }
  email = email.trim();
  let check = email.split("@");
  if (check.length != 2 || check[0].length === 0 || check[1].length === 0) {
    throw "email not correct";
  }
  if (
    !check[0][0].match(/[0-9A-Za-z]/) ||
    !check[0][check[0].length - 1].match(/[0-9A-Za-z]/)
  ) {
    throw "wrong format";
  }
  if (
    !check[0][0].match(/[0-9A-Za-z]/) ||
    !check[0][check[0].length - 1].match(/[0-9A-Za-z]/)
  ) {
    throw "wrong format";
  }
  for (let i = 0; i < check[0].length; i++) {
    if (!check[0][i].match(/[0-9A-Za-z_.-]/)) {
      throw "wrong format";
    }
    if (
      i > 0 &&
      check[0][i].match(/[.-_]/) &&
      !check[0][i - 1].match(/[0-9A-Za-z]/)
    ) {
      throw "wrong format";
    }
  }

  if (!check[1][0].match(/[0-9A-Za-z]/)) {
    throw "wrong format";
  }
  for (let j = 0; j < check[1].length; j++) {
    if (!check[1][j].match(/[0-9A-Za-z-.]/)) {
      throw "wrong format";
    }
    if (
      j > 0 &&
      check[1][j].includes(".") &&
      !check[1][j - 1].match(/[0-9A-Za-z]/)
    ) {
      throw "wrong format";
    }
  }
  let domain = check[1].split(".");
  if (domain.length < 2 || domain[domain.length - 1].length < 2) {
    throw "wrong format";
  }
  return check[0].toLowerCase() + "@" + check[1].toLowerCase();
}

function stateCheck(state) {
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "AS",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "GU",
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
    "MP",
    "OH",
    "OK",
    "OR",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "TT",
    "UT",
    "VT",
    "VA",
    "VI",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  if (typeof state !== "string") {
    throw "not a string";
  }
  state = state.trim();
  if (state.length !== 2 || !states.includes(state.toUpperCase())) {
    throw "wrong state format";
  }
}

function zipcodeCheck(zipcode) {
  if (typeof zipcode !== "string") {
    throw "not a string";
  }
  zipcode = zipcode.trim();
  if (zipcode.length !== 5 || !zipcode.match(/^\d{5}$/)) {
    throw "zipcode wrong format";
  }
}

function ageCheck(age) {
  if (typeof age !== "string") {
    throw "not a string";
  }
  age = age.trim();
  if (!age.match(/[0-9]/)) {
    throw "age should be a number";
  }
  if (Number(age) < 0 || Number(age) > 150) {
    throw "age invalid";
  }
}

function passwordCheck(password) {
  if (!password) {
    throw "empty input";
  }
  if (typeof password !== "string") {
    throw "not a string";
  }
  if (password.trim().length === 0) {
    throw "string with empty input";
  }
  password = password.trim();
  if (password.split(" ").length > 1) {
    throw "wrong format";
  }
  if (password.length < 8) {
    throw "password too short";
  }
  if (!/[A-Z]/.test(password)) {
    throw "no uppercase";
  }
  if (!/[0-9]/.test(password)) {
    throw "no number";
  }
  if (/^[a-zA-Z0-9]+$/.test(password)) {
    throw "no special character";
  }
}
