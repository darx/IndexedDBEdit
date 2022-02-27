export default function isJSON(json) {
  let valid = true;

  try {
    JSON.parse(json);
  } catch (e) { valid = false; }

  if (!valid) {
    const countCharacter = (string, character) => {
      let count = 0;
      for (let i = 0, len = string.length; i < len; i++) {
        if (string.charAt(i) == character) count++;
      }
      return count;
    };

    json = json.trim(); // remove whitespace, start and end spaces

    if (json.charAt(0) != "{" || json.charAt(json.length - 1) != "}") {
      console.log("Brackets {} are not balanced");
    } else if (!(countCharacter(json, ":") - 1 == countCharacter(json, ","))) {
      console.log("comma or colon are not balanced");
    } else {
      json = json.substring(1, json.length - 1); //remove first and last brackets
      json = json.split(",");

      for (let i = 0, len = json.length; i < len; i++) {
        let pairs = json[i];
        if (pairs.indexOf(":") == -1) console.log("No colon b/w key and value");
      }
    }
  }

  return valid;
}
