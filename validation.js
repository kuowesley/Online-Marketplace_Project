export function stringCheck(input) {
  if (input == null) {
    throw "empty input";
  }
  if (typeof input === "object") {
    throw "it is a object not a string";
  }
  if (typeof input == "number") {
    throw "it is a number not a string";
  }
  input = input.trim();
  if (input.length === 0) {
    throw "string empty input";
  }
  return input;
}

export function numberCheck(input) {
  if (input == null) {
    throw "empty input";
  }
  if (typeof input === "object") {
    throw "it is a object not a number";
  }
  if (typeof input === "string") {
    throw "it is a string not a number";
  }
  return input;
}
export function arrayCheck(input) {
  if (input == null) {
    throw "empty input";
  }
  if (typeof input === "string") {
    throw "it is a string not an array";
  }
  if (typeof input == "number") {
    throw "it is a number not an array";
  }
  if (Array.isArray(input)) {
    if (input.length === 0) {
      throw "it is an empty array";
    }
    return input;
  }
  throw "it is not an array";
}

export function objectCheck(input) {
  if (input == null) {
    throw "empty input";
  }
  if (typeof input === "string") {
    throw "it is a string not an object";
  }
  if (typeof input == "number") {
    throw "it is a number not an object";
  }
  if (Array.isArray(input)) {
    throw "it is an array not an object";
  }
  if (Object.keys(input).length === 0) {
    throw "it is an empty object";
  }
  return input;
}
