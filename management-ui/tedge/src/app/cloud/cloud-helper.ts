export  function lowerCase(str) {
    return str.toLowerCase();
  }
  
  /**
   * "Safer" String.toUpperCase()
   */
  export  function upperCase(str) {
    return str.toUpperCase();
  }
  
  /**
   * Convert string to camelCase text.
   */
  export  function camelCase(str) {
    str = replaceAccents(str);
    str = removeNonWord(str)
      .replace(/\-/g, " ") //convert all hyphens to spaces
      .replace(/\s[a-z]/g, upperCase) //convert first char of each word to UPPERCASE
      .replace(/\s+/g, "") //remove spaces
      .replace(/^[A-Z]/g, lowerCase); //convert first char to lowercase
    return str;
  }
  
/**
 * Remove non-word chars.
 */
 export function removeNonWord(str) {
    return str.replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, "");
  }

  /**
   * Add space between camelCase text.
   */
  export  function unCamelCase(str) {
    str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, "$1 $2");
    str = str.toLowerCase(); //add space between camelCase text
    return str;
  }
  
  /**
   * UPPERCASE first char of each word.
   */
  export  function properCase(str) {
    return lowerCase(str).replace(/^\w|\s\w/g, upperCase);
  }
  
  
  /**
   * UPPERCASE first char of each sentence and lowercase other chars.
   */
  export  function sentenceCase(str) {
    // Replace first char of each sentence (new line or after '.\s+') to
    // UPPERCASE
    return lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, upperCase);
  }


  /**
 * Replaces all accented chars with regular ones
 */
export function replaceAccents(str) {
    // verifies if the String has accents and replace them
    if (str.search(/[\xC0-\xFF]/g) > -1) {
      str = str
        .replace(/[\xC0-\xC5]/g, "A")
        .replace(/[\xC6]/g, "AE")
        .replace(/[\xC7]/g, "C")
        .replace(/[\xC8-\xCB]/g, "E")
        .replace(/[\xCC-\xCF]/g, "I")
        .replace(/[\xD0]/g, "D")
        .replace(/[\xD1]/g, "N")
        .replace(/[\xD2-\xD6\xD8]/g, "O")
        .replace(/[\xD9-\xDC]/g, "U")
        .replace(/[\xDD]/g, "Y")
        .replace(/[\xDE]/g, "P")
        .replace(/[\xE0-\xE5]/g, "a")
        .replace(/[\xE6]/g, "ae")
        .replace(/[\xE7]/g, "c")
        .replace(/[\xE8-\xEB]/g, "e")
        .replace(/[\xEC-\xEF]/g, "i")
        .replace(/[\xF1]/g, "n")
        .replace(/[\xF2-\xF6\xF8]/g, "o")
        .replace(/[\xF9-\xFC]/g, "u")
        .replace(/[\xFE]/g, "p")
        .replace(/[\xFD\xFF]/g, "y");
    }
  
    return str;
  }
  